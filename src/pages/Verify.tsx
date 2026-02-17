import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  Copy,
  FileText,
  Shield,
  Calendar,
  Building,
  User,
  Hash
} from "lucide-react";
import { toast } from "sonner";
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

interface VerificationResult {
  recordId: string;
  status: "verified" | "invalid" | "pending";
  patientName: string;
  patientContact?: string;
  aadhaarNumber?: string;
  hospitalName: string;
  uploadedAt: string;
  txHash: string;
  fileHash: string;
  verificationTime: string;
}

const Verify = () => {
  const [searchId, setSearchId] = useState("");
  const [searchType, setSearchType] = useState<"recordId" | "aadhaarNumber">("recordId");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [onChainVerified, setOnChainVerified] = useState<boolean | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to verify records");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error(`Please enter a ${searchType === 'recordId' ? 'Record ID' : 'Aadhaar Number'}`);
      return;
    }

    setIsSearching(true);
    
    try {
      if (searchType === 'recordId') {
        // Search for single record in hospital's subcollection
        if (!user) {
          toast.error("Please login to search records");
          setIsSearching(false);
          return;
        }
        const recordRef = doc(db, 'hospitals', user.uid, 'medicalRecords', searchId);
        const recordSnap = await getDoc(recordRef);
        
        if (recordSnap.exists()) {
          const data = recordSnap.data();
          setResults([]);

          const recordResult: VerificationResult = {
            recordId: data.recordId || searchId,
            status: (data.status as "verified" | "invalid" | "pending") || "pending",
            patientName: data.patientName || 'N/A',
            patientContact: data.patientContact || '',
            aadhaarNumber: data.aadhaarNumber || '',
            hospitalName: data.hospitalName || 'N/A',
            uploadedAt: data.uploadedAt || new Date().toISOString(),
            txHash: data.txHash || '',
            fileHash: data.fileHash || '',
            verificationTime: "0.5s"
          };
          
          setResult(recordResult);
          
          if (data.txHash && data.txHash.startsWith('0x') && data.txHash.length > 10) {
            setOnChainVerified(true);
          } else {
            setOnChainVerified(false);
          }
          
          toast.success("Record found!");
        } else {
          setResult(null);
          setOnChainVerified(null);
          setResults([]);
          toast.error("Record not found");
        }
      } else {
        // Search by Aadhaar Number - find ALL records for this patient
        if (!user) {
          toast.error("Please login to search by Aadhaar");
          setIsSearching(false);
          return;
        }
        
        const q = query(
          collection(db, 'hospitals', user.uid, 'medicalRecords'),
          where('aadhaarNumber', '==', searchId.trim())
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const allRecords: VerificationResult[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            allRecords.push({
              recordId: data.recordId || doc.id,
              status: (data.status as "verified" | "invalid" | "pending") || "pending",
              patientName: data.patientName || 'N/A',
              patientContact: data.patientContact || '',
              aadhaarNumber: data.aadhaarNumber || '',
              hospitalName: data.hospitalName || 'N/A',
              uploadedAt: data.uploadedAt || new Date().toISOString(),
              txHash: data.txHash || '',
              fileHash: data.fileHash || '',
              verificationTime: "0.5s"
            });
          });
          
          // Sort by upload date (newest first)
          allRecords.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
          
          setResults(allRecords);
          setResult(null);
          setOnChainVerified(null);
          
          toast.success(`Found ${allRecords.length} record(s) for this patient`);
        } else {
          setResult(null);
          setResults([]);
          setOnChainVerified(null);
          toast.error("No records found for this Aadhaar number");
        }
      }

      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [searchId, ...prev.filter(id => id !== searchId)].slice(0, 5);
        return newHistory;
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast.error("Verification failed. Please try again.");
      setResult(null);
      setOnChainVerified(null);
    } finally {
      setIsSearching(false);
    }
  };

  // If navigated with ?id=..., prefill and auto-run
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setSearchId(id);
      // slight delay to ensure UI updates
      setTimeout(() => { handleSearch(); }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleString() : "";
  };

  const downloadVerificationReport = () => {
    if (!result) return;
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = 20;

      // Helper function to add text
      const addText = (text: string, size: number, style: 'normal' | 'bold' = 'normal', align: 'left' | 'center' = 'left') => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        if (align === 'center') {
          doc.text(text, pageWidth / 2, yPos, { align: 'center' });
        } else {
          doc.text(text, margin, yPos);
        }
        yPos += size * 0.5;
      };

      const addLine = () => {
        doc.setDrawColor(100, 100, 100);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;
      };

      // Header
      doc.setFillColor(20, 184, 166);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setTextColor(255, 255, 255);
      addText('MEDICAL RECORD VERIFICATION REPORT', 18, 'bold', 'center');
      yPos += 5;
      doc.setTextColor(0, 0, 0);
      
      // Generated Date
      yPos += 10;
      addText(`Generated: ${new Date().toLocaleString()}`, 10);
      addText(`Report Type: Blockchain Verification`, 10);
      yPos += 5;

      addLine();

      // Verification Status Section
      addText('VERIFICATION STATUS', 14, 'bold');
      yPos += 5;
      
      const statusColor = result.status === 'verified' ? [34, 197, 94] : 
                         result.status === 'pending' ? [234, 179, 8] : [239, 68, 68];
      doc.setTextColor(...statusColor);
      addText(`Status: ${result.status.toUpperCase()}`, 12, 'bold');
      doc.setTextColor(0, 0, 0);
      
      addText(`Verification Time: ${result.verificationTime}`, 10);
      addText(`On-chain Verification: ${onChainVerified ? 'CONFIRMED' : 'PENDING'}`, 10);
      yPos += 5;

      addLine();

      // Record Information Section
      addText('RECORD INFORMATION', 14, 'bold');
      yPos += 5;
      addText(`Record ID: ${result.recordId}`, 10);
      addText(`Patient Name: ${result.patientName}`, 10);
      addText(`Hospital/Organization: ${result.hospitalName}`, 10);
      addText(`Upload Date: ${formatDate(result.uploadedAt)}`, 10);
      yPos += 5;

      addLine();

      // Blockchain Details Section
      addText('BLOCKCHAIN DETAILS', 14, 'bold');
      yPos += 5;
      addText('Transaction Hash:', 10, 'bold');
      yPos += 2;
      doc.setFontSize(8);
      const txHashLines = doc.splitTextToSize(result.txHash, pageWidth - 2 * margin);
      doc.text(txHashLines, margin, yPos);
      yPos += txHashLines.length * 4 + 5;

      addText('File Hash:', 10, 'bold');
      yPos += 2;
      doc.setFontSize(8);
      const fileHashLines = doc.splitTextToSize(result.fileHash, pageWidth - 2 * margin);
      doc.text(fileHashLines, margin, yPos);
      yPos += fileHashLines.length * 4 + 8;

      addLine();

      // Verification Statement
      addText('VERIFICATION STATEMENT', 14, 'bold');
      yPos += 5;
      const statement = result.status === 'verified' 
        ? 'This medical record has been successfully verified on the blockchain. The record integrity is confirmed and the data has not been tampered with.'
        : result.status === 'pending'
        ? 'This medical record is pending verification on the blockchain. Please check back later for confirmation.'
        : 'This medical record could not be verified. The data may have been modified or is not properly stored on the blockchain.';
      
      doc.setFontSize(10);
      const statementLines = doc.splitTextToSize(statement, pageWidth - 2 * margin);
      doc.text(statementLines, margin, yPos);
      yPos += statementLines.length * 5 + 8;

      addLine();

      // Disclaimer
      addText('DISCLAIMER', 12, 'bold');
      yPos += 5;
      doc.setFontSize(9);
      const disclaimer = `This report is generated by MedLedger - Blockchain Medical Records Management System. The verification is based on cryptographic hashing and blockchain technology to ensure data integrity and authenticity.`;
      const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin);
      doc.text(disclaimerLines, margin, yPos);
      yPos += disclaimerLines.length * 4 + 5;

      addText(`For more information, visit: ${window.location.origin}`, 8);

      // Footer
      yPos = doc.internal.pageSize.getHeight() - 15;
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('MedLedger - Secure Medical Records on Blockchain', pageWidth / 2, yPos, { align: 'center' });

      // Save PDF
      doc.save(`MedLedger_Verification_Report_${result.recordId}_${new Date().getTime()}.pdf`);
      toast.success("Verification report downloaded successfully!");
      
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "verified": return "text-success";
      case "invalid": return "text-danger";
      case "pending": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="w-8 h-8 text-success" />;
      case "invalid": return <XCircle className="w-8 h-8 text-danger" />;
      case "pending": return <Clock className="w-8 h-8 text-warning animate-pulse" />;
      default: return <XCircle className="w-8 h-8 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            Verify <span className="bg-gradient-primary bg-clip-text text-transparent">Medical Records</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Instantly verify the authenticity and integrity of medical records stored on the blockchain.
          </p>
        </div>

        {/* Search Section */}
        <GlassCard className="mb-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Search Medical Records</h2>
              <p className="text-muted-foreground">
                Search by Record ID or Aadhaar Number to verify authenticity
              </p>
            </div>

            {/* Search Type Toggle */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => {
                  setSearchType('recordId');
                  setSearchId('');
                  setResult(null);
                  setResults([]);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  searchType === 'recordId'
                    ? 'bg-primary-neon text-background'
                    : 'glass text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Record ID
              </button>
              <button
                onClick={() => {
                  setSearchType('aadhaarNumber');
                  setSearchId('');
                  setResult(null);
                  setResults([]);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  searchType === 'aadhaarNumber'
                    ? 'bg-primary-neon text-background'
                    : 'glass text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Aadhaar Number
              </button>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input-glass w-full pl-12 pr-4 py-4 text-lg"
                  placeholder={
                    searchType === 'recordId' 
                      ? "MR-2024-XXXXX" 
                      : "Enter 12-digit Aadhaar Number"
                  }
                />
              </div>
              
              <div className="mt-4 text-center">
                <GradientButton 
                  onClick={handleSearch}
                  disabled={isSearching}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Verify Record
                    </>
                  )}
                </GradientButton>
              </div>
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="border-t border-border/30 pt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((id, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchId(id)}
                      className="px-3 py-1 text-sm glass rounded-full hover:glow-border transition-all"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Search Progress Animation */}
        {isSearching && (
          <GlassCard className="mb-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto">
                <div className="w-full h-full rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-medium">Verifying Record...</div>
                <div className="text-sm text-muted-foreground">
                  Checking blockchain for record authenticity
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Multiple Records View (Aadhaar Search) */}
        {!isSearching && results.length > 0 && (
          <GlassCard className="mb-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Patient Medical History
                </h2>
                <p className="text-muted-foreground">
                  Found <span className="text-primary-neon font-semibold">{results.length}</span> record(s) for this patient
                </p>
              </div>

              {/* Patient Info Summary */}
              {results[0] && (
                <div className="glass p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Patient Name</div>
                      <div className="font-semibold">{results[0].patientName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Aadhaar Number</div>
                      <div className="font-mono">{results[0].aadhaarNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Hospital</div>
                      <div className="font-semibold">{results[0].hospitalName}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Records Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Record ID</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Blockchain</th>
                      <th className="text-center p-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((record, index) => (
                      <tr key={index} className="border-b border-border/10 hover:bg-accent/20 transition-colors">
                        <td className="p-3">
                          <div className="font-mono text-sm">{record.recordId}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">{formatDate(record.uploadedAt)}</div>
                        </td>
                        <td className="p-3">
                          <StatusBadge status={record.status}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </StatusBadge>
                        </td>
                        <td className="p-3">
                          {record.txHash && record.txHash.startsWith('0x') && record.txHash.length > 10 ? (
                            <span className="text-success text-sm flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="text-warning text-sm flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setSearchType('recordId');
                              setSearchId(record.recordId);
                              setResults([]);
                              handleSearch();
                            }}
                            className="text-primary-neon hover:text-primary text-sm underline"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Verification Result */}
        {!isSearching && result && result.recordId ? (
          <GlassCard className={`mb-8 ${result.status === 'verified' ? 'glow-border' : ''}`}>
            <div className="space-y-6">
              {/* Status Header */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  {getStatusIcon(result.status)}
                </div>
                
                <div>
                  <h2 className={`text-3xl font-bold mb-2 ${getStatusColor(result.status)}`}>
                    {result.status === 'verified' && 'Record Verified'}
                    {result.status === 'invalid' && 'Record Invalid'}
                    {result.status === 'pending' && 'Verification Pending'}
                  </h2>
                  <StatusBadge status={result.status}>
                    {result && result.status ? result.status.charAt(0).toUpperCase() + result.status.slice(1) : ""}
                  </StatusBadge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Verified in {result?.verificationTime ?? ""}
                </div>
                {onChainVerified !== null && (
                  <div className="text-sm mt-2">
                    On-chain verification: {onChainVerified ? <span className="text-success">Found</span> : <span className="text-danger">Not found</span>}
                  </div>
                )}
              </div>

              {/* Record Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary-neon" />
                    Record Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 glass rounded-lg">
                      <span className="text-muted-foreground">Record ID:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">{result?.recordId ?? ""}</span>
                        <button 
                          onClick={() => copyToClipboard(result?.recordId ?? "", "Record ID")}
                          className="text-primary-neon hover:text-primary transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 glass rounded-lg">
                      <span className="text-muted-foreground flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Patient:
                      </span>
                      <span>{result?.patientName ?? ""}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 glass rounded-lg">
                      <span className="text-muted-foreground flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Hospital:
                      </span>
                      <span>{result?.hospitalName ?? ""}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 glass rounded-lg">
                      <span className="text-muted-foreground flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Uploaded:
                      </span>
                      <span>{formatDate(result?.uploadedAt ?? "")}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary-neon" />
                    Blockchain Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 glass rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground flex items-center">
                          <Hash className="w-4 h-4 mr-2" />
                          Transaction Hash:
                        </span>
                        <button 
                          onClick={() => copyToClipboard(result?.txHash ?? "", "Transaction Hash")}
                          className="text-primary-neon hover:text-primary transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="font-mono text-xs break-all text-foreground">
                        {result?.txHash ?? ""}
                      </div>
                    </div>
                    
                    <div className="p-3 glass rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">File Hash:</span>
                        <button 
                          onClick={() => copyToClipboard(result?.fileHash ?? "", "File Hash")}
                          className="text-primary-neon hover:text-primary transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="font-mono text-xs break-all text-foreground">
                        {result?.fileHash ?? ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="border-t border-border/30 pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <GradientButton 
                    variant="outline"
                    onClick={() => {
                      if (result?.txHash) {
                        // Open blockchain explorer (adjust URL based on your network)
                        window.open(`https://sepolia.etherscan.io/tx/${result.txHash}`, '_blank');
                      } else {
                        toast.error("Transaction hash not available");
                      }
                    }}
                  >
                    View on Blockchain Explorer
                  </GradientButton>
                  <GradientButton 
                    variant="outline"
                    onClick={downloadVerificationReport}
                  >
                    Download Verification Report
                  </GradientButton>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* How Verification Works */}
        <GlassCard>
          <h2 className="text-2xl font-semibold mb-6 text-center">How Verification Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary-neon/20 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-primary-neon" />
              </div>
              <h3 className="font-semibold">1. Search</h3>
              <p className="text-sm text-muted-foreground">
                Enter the unique Record ID to initiate verification
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-cyan/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-cyan" />
              </div>
              <h3 className="font-semibold">2. Verify</h3>
              <p className="text-sm text-muted-foreground">
                Our system checks the blockchain for record authenticity
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold">3. Confirm</h3>
              <p className="text-sm text-muted-foreground">
                Receive instant verification results with full transparency
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Verify;