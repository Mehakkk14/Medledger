import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  Mail, 
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/config/firebase';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success("Password reset email sent successfully!");
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error("No account found with this email address");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Invalid email address");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Too many requests. Please try again later");
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Back to Login */}
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm text-primary-neon hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>

          {/* Logo and Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 mb-6">
              <img src="/lovable-uploads/6f82c18b-8fad-448c-9f98-c223d3190609.png" alt="MedLedger" className="w-12 h-12" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MedLedger
              </span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
            <p className="text-muted-foreground">
              {emailSent 
                ? "Check your email for reset instructions"
                : "Enter your email to receive a password reset link"
              }
            </p>
          </div>

          <GlassCard glow>
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-glass pl-10 pr-4 py-3 w-full"
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <GradientButton 
                  type="submit" 
                  size="lg" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                    </>
                  )}
                </GradientButton>
              </form>
            ) : (
              <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                </div>

                {/* Success Message */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Email Sent!</h3>
                  <p className="text-muted-foreground text-sm">
                    We've sent a password reset link to <span className="text-foreground font-medium">{email}</span>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Please check your inbox and follow the instructions to reset your password.
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <GradientButton 
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Back to Login
                  </GradientButton>
                  
                  <button
                    onClick={() => setEmailSent(false)}
                    className="w-full text-sm text-primary-neon hover:text-primary transition-colors"
                  >
                    Didn't receive the email? Try again
                  </button>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Additional Help */}
          {!emailSent && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                Remember your password?{" "}
                <Link 
                  to="/login"
                  className="text-primary-neon hover:text-primary transition-colors font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* Tips */}
          {emailSent && (
            <div className="mt-6 p-4 glass rounded-lg">
              <h4 className="text-sm font-medium mb-2">Tips:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Check your spam folder if you don't see the email</li>
                <li>• The reset link expires in 1 hour</li>
                <li>• Contact support if you continue having issues</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
