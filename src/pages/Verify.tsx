import React, { useState } from "react";
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
import { isHashStoredOnChain } from '@/services/blockchainService';

interface VerificationResult {
  recordId: string;
  status: "verified" | "invalid" | "pending";
  patientName: string;
  hospitalName: string;
  uploadedAt: string;
  txHash: string;
  fileHash: string;
  verificationTime: string;
}

const Verify = () => {
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [onChainVerified, setOnChainVerified] = useState<boolean | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error("Please enter a Record ID");
      return;
    }

    setIsSearching(true);
    
    try {
      const res = await fetch(`/api/verify-record/${searchId}`);
      const data = await res.json();
      console.log("Verify response:", data);

      if (res.ok && data) {
        if (data.record) {
          setResult(data.record);
            // check on chain if fileHash present
            if (data.record.fileHash) {
              const stored = await isHashStoredOnChain(data.record.fileHash, (window as any).REACT_APP_CONTRACT_ADDRESS, (window as any).REACT_APP_CONTRACT_ABI ? JSON.parse((window as any).REACT_APP_CONTRACT_ABI) : undefined);
              setOnChainVerified(stored);
            } else {
              setOnChainVerified(false);
            }
        } else if (Object.keys(data).length > 0) {
          setResult(data as VerificationResult);
        } else {
          setResult(null);
          toast.error("Record not found or invalid.");
        }
      } else {
        setResult(null);
        toast.error("Record not found or invalid.");
      }

      setSearchHistory(prev => {
        const newHistory = [searchId, ...prev.filter(id => id !== searchId)].slice(0, 5);
        return newHistory;
      });
    } catch (error) {
      toast.error("Verification failed. Please try again.");
      setResult(null);
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
              <h2 className="text-2xl font-semibold mb-2">Enter Record ID</h2>
              <p className="text-muted-foreground">
                Enter the unique Record ID to verify its authenticity
              </p>
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
                  placeholder="MR-2024-XXXXX"
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
                  <GradientButton variant="outline">
                    View on Blockchain Explorer
                  </GradientButton>
                  <GradientButton variant="outline">
                    Download Verification Report
                  </GradientButton>
                </div>
              </div>
            </div>
          </GlassCard>
        ) : (
          !isSearching && (
            <GlassCard className="mb-8">
              <div className="text-center py-8">
                <XCircle className="w-8 h-8 text-danger mx-auto mb-2" />
                <h2 className="text-2xl font-bold mb-2 text-danger">No record found</h2>
                <p className="text-muted-foreground">Please check the Record ID and try again.</p>
              </div>
            </GlassCard>
          )
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