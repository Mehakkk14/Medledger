import React from "react";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  Shield,
  Twitter, 
  Github, 
  Linkedin, 
  Mail,
  MapPin,
  Phone
} from "lucide-react";
import medLedgerLogo from "@/assets/medledger-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { href: "/upload", label: "Upload Records" },
    { href: "/verify", label: "Verify Records" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/pricing", label: "Pricing" },
  ];

  const companyLinks = [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/docs", label: "Documentation" },
    { href: "/faq", label: "FAQ" },
  ];

  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ];

  return (
    <footer className="border-t border-border/30">
      <GlassCard className="rounded-none border-0">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <img src={medLedgerLogo} alt="MedLedger" className="w-8 h-8" />
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  MedLedger
                </span>
              </Link>
              <p className="text-muted-foreground text-sm">
                Beyond the file. On the chain. Medical records you can trust.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary-neon transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary-neon transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary-neon transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:contact@medledger.com"
                  className="text-muted-foreground hover:text-primary-neon transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Product</h3>
              <ul className="space-y-2">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-primary-neon transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Company</h3>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-primary-neon transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>contact@medledger.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Lucknow, UP, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border/30 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">
                © {currentYear} MedLedger. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                {legalLinks.map((link) => (
                  <Link 
                    key={link.href}
                    to={link.href}
                    className="text-muted-foreground hover:text-primary-neon transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </footer>
  );
};

export default Footer;