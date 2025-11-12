import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  BarChart3,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { 
  Area, 
  AreaChart, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface MedicalRecord {
  id: string;
  patientName: string;
  hospitalName: string;
  status: "verified" | "pending" | "invalid";
  fileType: string;
  size: string;
  uploadDate: string;
  verificationDate?: string;
}

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to view your dashboard",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  useEffect(() => {
    const fetchAllRecords = async () => {
      if (!user || !user.uid) return;
      
      try {
        // Query Firestore for records belonging to this user
        const q = query(
          collection(db, 'medicalRecords'),
          where('hospitalUid', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedRecords: MedicalRecord[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedRecords.push({
            id: data.recordId || doc.id,
            patientName: data.patientName || 'N/A',
            hospitalName: data.hospitalName || user.hospitalName,
            status: (data.status as "verified" | "pending" | "invalid") || "pending",
            fileType: data.files?.[0]?.type || "N/A",
            size: data.files?.[0]?.size ? `${Math.round(data.files[0].size / 1024)} KB` : "N/A",
            uploadDate: data.uploadedAt || "",
            verificationDate: data.verifiedAt || data.verificationDate || ""
          });
        });
        
        // Sort by upload date (newest first)
        fetchedRecords.sort((a, b) => {
          const dateA = new Date(a.uploadDate).getTime();
          const dateB = new Date(b.uploadDate).getTime();
          return dateB - dateA;
        });
        
        setRecords(fetchedRecords);
      } catch (error) {
        console.error('Failed to fetch records:', error);
        toast({
          title: "Error",
          description: "Failed to fetch records",
          variant: "destructive"
        });
      }
    };
    
    if (user) {
      fetchAllRecords();
    }
  }, [user, toast]);

  // Function to verify/reject pending records
  const handleAdminAction = async (recordId: string, action: 'verify' | 'reject') => {
    try {
      const recordRef = doc(db, 'medicalRecords', recordId);
      const newStatus = action === 'verify' ? 'verified' : 'invalid';
      
      await updateDoc(recordRef, {
        status: newStatus,
        verifiedAt: new Date().toISOString(),
        verifiedBy: user?.email || 'admin'
      });
      
      // Update the record in the local state
      setRecords(prev => prev.map(record => 
        record.id === recordId 
          ? { ...record, status: newStatus as 'verified' | 'invalid', verificationDate: new Date().toISOString() }
          : record
      ));
      
      toast({
        title: "Success",
        description: `Record ${action === 'verify' ? 'verified' : 'rejected'} successfully`,
      });
    } catch (error) {
      console.error('Failed to update record:', error);
      toast({
        title: "Error",
        description: `Failed to ${action} record`,
        variant: "destructive"
      });
    }
  };

  // Dashboard statistics
  const totalRecords = records.length;
  const verifiedRecords = records.filter(r => r.status === "verified").length;
  const verifiedRate = totalRecords > 0 ? ((verifiedRecords / totalRecords) * 100).toFixed(1) : "0.0";
  const avgVerifyTime = "1.8";
  const todayVerifications = verifiedRecords; // Use actual verified records count

  // Chart data for area chart (show actual verified records per day)
  // For demo, all records are counted as today's verifications
  const verificationActivityData = [
    { day: 'Today', verifications: verifiedRecords }
  ];

  // Chart data for pie chart
  const statusDistributionData = [
    { name: 'Verified', value: verifiedRecords, color: '#22C55E' },
    { name: 'Pending', value: records.filter(r => r.status === "pending").length, color: '#F59E0B' },
    { name: 'Invalid', value: records.filter(r => r.status === "invalid").length, color: '#EF4444' },
  ];

  // Filter records based on search and status
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const exportToCSV = () => {
    const headers = ["ID", "Patient Name", "Hospital", "Status", "File Type", "Size", "Upload Date", "Verification Date"];
    const csvContent = [
      headers.join(","),
      ...filteredRecords.map(record => [
        record.id,
        record.patientName,
        record.hospitalName,
        record.status,
        record.fileType,
        record.size,
        record.uploadDate,
        record.verificationDate || "N/A"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "medical_records.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="text-card-foreground font-medium">{`${label}: ${payload[0].value} verifications`}</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="text-card-foreground font-medium">{`${payload[0].name}: ${payload[0].value} records`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Medical Records <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your blockchain-verified medical records
            </p>
          </div>
          <Button onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Records</p>
                <p className="text-3xl font-bold text-foreground">{totalRecords.toLocaleString()}</p>
                <p className="text-sm text-emerald-500">+12.5% vs last period</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-full">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Verified Rate</p>
                <p className="text-3xl font-bold text-foreground">{verifiedRate}%</p>
                <p className="text-sm text-emerald-500">+2.1% vs last period</p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg. Verify Time</p>
                <p className="text-3xl font-bold text-foreground">{avgVerifyTime}s</p>
                <p className="text-sm text-emerald-500">-0.3s vs last period</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Today's Verifications</p>
                <p className="text-3xl font-bold text-foreground">{todayVerifications}</p>
                <p className="text-sm text-emerald-500">+23.4% vs last period</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-foreground">Verification Activity</h3>
              <p className="text-muted-foreground text-sm">Verified records count</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={verificationActivityData}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="verifications"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#areaGradient)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-foreground">Status Distribution</h3>
              <p className="text-muted-foreground text-sm">Record verification status breakdown</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center items-center mt-4 space-x-6">
                {statusDistributionData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="invalid">Invalid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        {/* Records Table */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-card/50 border-b border-border/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Record ID</th>
                  <th className="text-left p-4 font-semibold text-foreground">Patient</th>
                  <th className="text-left p-4 font-semibold text-foreground">Hospital</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground">File</th>
                  <th className="text-left p-4 font-semibold text-foreground">Upload Date</th>
                  <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((record) => (
                    <tr key={record.id} className="border-b border-border/30 hover:bg-card/30 transition-colors">
                      <td className="p-4">
                        <code className="text-primary bg-primary/10 px-2 py-1 rounded text-sm">
                          {record.id}
                        </code>
                      </td>
                      <td className="p-4 text-foreground">{record.patientName}</td>
                      <td className="p-4 text-muted-foreground">{record.hospitalName}</td>
                      <td className="p-4">
                        <StatusBadge status={record.status}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </StatusBadge>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {record.fileType} • {record.size}
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDate(record.uploadDate)}</td>
                      <td className="p-4">
                        {record.status === 'pending' ? (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleAdminAction(record.id, 'verify')}
                              className="h-8 px-3"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Verify
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleAdminAction(record.id, 'reject')}
                              className="h-8 px-3"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center text-muted-foreground text-sm">
                            {record.status === 'verified' ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                                Verified
                              </>
                            ) : record.status === 'invalid' ? (
                              <>
                                <XCircle className="w-4 h-4 mr-1 text-red-500" />
                                Rejected
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 mr-1 text-yellow-500" />
                                Unknown
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No records found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-border/50">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, filteredRecords.length)} of {filteredRecords.length} records
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;