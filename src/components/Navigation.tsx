import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { connectWallet } from "@/services/blockchainService";
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  X,
  Shield,
  Upload,
  Search as SearchIcon,
  LogOut,
  Settings,
  LayoutDashboard,
  Building2,
  Mail
} from "lucide-react";

const Navigation = () => {
  
  const { isAuthenticated, user, logout } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/verify?id=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/upload", label: "Upload" },
    { href: "/verify", label: "Verify" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="nav-glass fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src="/lovable-uploads/6f82c18b-8fad-448c-9f98-c223d3190609.png" alt="MedLedger" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MedLedger
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(link.href)
                      ? "text-primary-neon bg-primary-neon/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-glass pl-10 pr-4 py-2 w-64 text-sm"
                  />
                </form>
              </div>


              {/* Notifications - Disabled for production */}
              {/* <button className="p-2 rounded-lg glass hover:bg-accent/50 transition-colors relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
              </button> */}

              {/* Auth Buttons / User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 p-2 rounded-lg glass hover:bg-accent/50 transition-colors">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground hidden md:block">
                        Welcome, {user?.firstName || 'User'}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 glass border-border/50">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user?.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground flex items-center gap-1 mt-1">
                          <Building2 className="w-3 h-3" />
                          {user?.hospitalName || user?.organization}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/upload')} className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Records
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem 
                      onClick={() => {
                        logout();
                        navigate('/');
                      }} 
                      className="cursor-pointer text-danger focus:text-danger"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link to="/login">
                    <GradientButton variant="ghost" size="sm">
                      Login
                    </GradientButton>
                  </Link>
                  <Link to="/signup">
                    <GradientButton size="sm">
                      Sign Up
                    </GradientButton>
                  </Link>
                  <GradientButton variant="outline" size="sm" onClick={async () => {
                    const addr = await connectWallet();
                    if (addr) setWalletAddress(addr);
                  }}>
                    {walletAddress ? `${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
                  </GradientButton>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 rounded-lg glass hover:bg-accent/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/30">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActivePath(link.href)
                        ? "text-primary-neon bg-primary-neon/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-border/30 mt-4">
                    <div className="flex flex-col space-y-2">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <GradientButton variant="ghost" className="w-full">
                          Login
                        </GradientButton>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <GradientButton className="w-full">
                          Sign Up
                        </GradientButton>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <GlassCard className="rounded-t-xl rounded-b-none border-t border-border/30">
          <div className="flex justify-around items-center py-2">
            <Link
              to="/"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActivePath("/") ? "text-primary-neon" : "text-muted-foreground"
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              to="/upload"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActivePath("/upload") ? "text-primary-neon" : "text-muted-foreground"
              }`}
            >
              <Upload className="w-5 h-5" />
              <span className="text-xs mt-1">Upload</span>
            </Link>
            <Link
              to="/verify"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActivePath("/verify") ? "text-primary-neon" : "text-muted-foreground"
              }`}
            >
              <SearchIcon className="w-5 h-5" />
              <span className="text-xs mt-1">Verify</span>
            </Link>
            <Link
              to="/dashboard"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActivePath("/dashboard") ? "text-primary-neon" : "text-muted-foreground"
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActivePath("/login") ? "text-primary-neon" : "text-muted-foreground"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </GlassCard>
      </div>
    </>
  );
};

export default Navigation;