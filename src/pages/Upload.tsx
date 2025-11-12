import React, { useState, useRef } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  Upload as UploadIcon, 
  FileText, 
  X, 
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { storeHashOnChain, connectWallet } from '@/services/blockchainService';
import { sha256 } from 'js-sha256';
import { useAuth } from '@/hooks/useAuth';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useNavigate } from 'react-router-dom';

interface FormData {
  patientName: string;
  patientContact: string;
  aadhaarNumber: string;
  recordId: string;
  hospitalName: string;
  note: string;
}

interface UploadedFile {
  file: File;
  preview?: string;
}

const Upload = () => {
  const [formData, setFormData] = useState<FormData>({
    patientName: "",
    patientContact: "",
    aadhaarNumber: "",
    recordId: "",
    hospitalName: "",
    note: ""
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to upload records");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    toast.success(validFiles.length === 1 ? 'File uploaded successfully' : `${validFiles.length} files uploaded successfully`);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const file = prev[index];
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.patientName.trim()) errors.push("Patient name is required");
    if (!formData.patientContact.trim()) errors.push("Patient contact is required");
    if (!formData.aadhaarNumber.trim()) errors.push("Aadhaar number is required");
    if (!/^\d{12}$/.test(formData.aadhaarNumber.replace(/\s/g, ''))) {
      errors.push("Aadhaar number must be 12 digits");
    }
    if (!formData.recordId.trim()) errors.push("Record ID is required");
    if (!formData.hospitalName.trim()) errors.push("Hospital name is required");
    if (uploadedFiles.length === 0) errors.push("At least one file must be uploaded");

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.uid) {
      toast.error("Please login to upload records");
      navigate('/login');
      return;
    }
    
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Compute combined client-side hash (sha256)
      const combined = await (async () => {
        const buffers = await Promise.all(uploadedFiles.map(f => f.file.arrayBuffer()));
        const concat = buffers.reduce((acc, cur) => {
          const tmp = new Uint8Array(acc.byteLength + cur.byteLength);
          tmp.set(new Uint8Array(acc), 0);
          tmp.set(new Uint8Array(cur), acc.byteLength);
          return tmp.buffer as ArrayBuffer;
        }, new ArrayBuffer(0));
        return '0x' + sha256(new Uint8Array(concat));
      })();

      // Push to chain via MetaMask if available and configured
      let clientTxHash: string | undefined = undefined;
      let blockchainError: string | null = null;
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast.error("MetaMask not detected! Please install MetaMask browser extension.");
        blockchainError = "MetaMask not installed";
      } else {
        try {
          toast.info("Connecting to MetaMask...");
          const addr = await connectWallet();
          
          if (addr) {
            toast.success(`Wallet connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`);
            toast.info("Storing hash on blockchain... Please confirm the transaction in MetaMask.");
            
            try {
              const tx = await storeHashOnChain(combined, undefined, undefined);
              clientTxHash = tx;
              toast.success("✅ Hash stored on blockchain successfully!");
            } catch (err: any) {
              console.error('Blockchain storage error:', err);
              blockchainError = err.message || 'Blockchain transaction failed';
              
              if (err.message?.includes('user rejected')) {
                toast.error("Transaction rejected by user");
              } else if (err.message?.includes('insufficient funds')) {
                toast.error("Insufficient funds for gas fees");
              } else {
                toast.warning("⚠️ Blockchain storage failed, saving to database only");
              }
            }
          } else {
            toast.error("Failed to connect wallet");
            blockchainError = "Wallet connection failed";
          }
        } catch (e: any) {
          console.error('Wallet connect error:', e);
          blockchainError = e.message || 'Wallet connection error';
          toast.error("Failed to connect to MetaMask");
        }
      }

      // Prepare record data for Firestore
      const recordData = {
        recordId: formData.recordId,
        patientName: formData.patientName,
        patientContact: formData.patientContact,
        aadhaarNumber: formData.aadhaarNumber,
        hospitalName: user.hospitalName || formData.hospitalName,
        hospitalUid: user.uid,
        note: formData.note,
        fileHash: combined,
        txHash: clientTxHash || '',
        status: clientTxHash ? 'verified' : 'pending',
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.email,
        blockchainError: blockchainError,
        files: uploadedFiles.map(f => ({
          name: f.file.name,
          type: f.file.type,
          size: f.file.size
        }))
      };

      // Store in Firestore
      await setDoc(doc(db, 'medicalRecords', formData.recordId), recordData);

      setTxHash(clientTxHash || '');
      setIsSuccess(true);
      
      if (clientTxHash) {
        toast.success("🎉 Medical record uploaded and verified on blockchain!");
      } else {
        toast.success("Medical record uploaded to database (blockchain pending)");
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || "Failed to upload record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      patientContact: "",
      aadhaarNumber: "",
      recordId: "",
      hospitalName: "",
      note: ""
    });
    setUploadedFiles([]);
    setIsSuccess(false);
    setTxHash("");
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <GlassCard className="text-center space-y-6 glow-border">
            <div className="w-20 h-20 mx-auto bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success animate-pulse-glow" />
            </div>
            
            <h1 className="text-3xl font-bold text-success">Upload Successful!</h1>
            <p className="text-muted-foreground">
              {txHash 
                ? "Your medical record has been successfully uploaded to the blockchain and is now immutably stored."
                : "Your medical record has been saved to the database. Blockchain verification pending."}
            </p>
            
            {txHash && (
              <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Transaction Hash:</div>
                <div className="font-mono text-sm break-all text-success">{txHash}</div>
                <button 
                  onClick={() => navigator.clipboard.writeText(txHash)}
                  className="text-xs text-primary-neon hover:underline mt-2"
                >
                  Copy to clipboard
                </button>
              </div>
            )}
            
            {!txHash && (
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                <div className="text-sm text-warning mb-2">⚠️ Blockchain Upload Pending</div>
                <div className="text-xs text-muted-foreground">
                  The record was saved to the database but not yet on blockchain. 
                  Make sure MetaMask is installed and connected to the correct network.
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton onClick={resetForm}>
                Upload Another Record
              </GradientButton>
              <GradientButton variant="outline" onClick={() => window.location.href = `/verify?id=${formData.recordId}`}>
                Verify This Record
              </GradientButton>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            Upload <span className="bg-gradient-primary bg-clip-text text-transparent">Medical Records</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Securely upload and store medical records on the blockchain for immutable verification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Patient Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="input-glass w-full"
                    placeholder="Enter patient's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Patient Contact *</label>
                  <input
                    type="tel"
                    name="patientContact"
                    value={formData.patientContact}
                    onChange={handleInputChange}
                    className="input-glass w-full"
                    placeholder="Enter patient's phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Aadhaar Number *</label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleInputChange}
                    className="input-glass w-full"
                    placeholder="XXXX XXXX XXXX"
                    maxLength={14}
                  />
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h2 className="text-xl font-semibold mb-4">Record Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Record ID *</label>
                  <input
                    type="text"
                    name="recordId"
                    value={formData.recordId}
                    onChange={handleInputChange}
                    className="input-glass w-full"
                    placeholder="MR-2024-XXXXX"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Hospital Name *</label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                    className="input-glass w-full"
                    placeholder="Enter hospital name"
                  />
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="input-glass w-full h-24 resize-none"
              placeholder="Add any additional notes or context (optional)"
            />
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-semibold mb-4">Upload Files *</h2>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragging 
                  ? 'border-primary glow-border bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drag and drop files here</p>
              <p className="text-muted-foreground mb-4">or</p>
              <GradientButton 
                type="button" 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </GradientButton>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-4">
                Supported formats: PDF, PNG, JPG • Max size: 10MB per file
              </p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-medium">Uploaded Files ({uploadedFiles.length})</h3>
                {uploadedFiles.map((fileObj, index) => (
                  <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-primary-neon" />
                      <div>
                        <div className="font-medium">{fileObj.file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 rounded-full hover:bg-danger/20 text-danger transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uploading to Blockchain...
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Upload to Blockchain
                </>
              )}
            </GradientButton>
            
            <GradientButton 
              type="button" 
              variant="outline" 
              size="lg"
              onClick={resetForm}
              className="w-full sm:w-auto"
            >
              Clear Form
            </GradientButton>
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-warning mb-1">Important Notice</div>
              <div className="text-muted-foreground">
                By uploading medical records, you confirm that you have obtained proper consent from the patient 
                and are authorized to store this information on the blockchain. All uploads are permanent and cannot be deleted.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;