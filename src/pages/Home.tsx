import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  Shield, 
  Zap, 
  Lock, 
  CheckCircle, 
  ArrowRight,
  Upload,
  Search,
  BarChart,
  Users,
  Clock,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import heroDna from "@/assets/hero-dna.jpg";
import hospitalTech from "@/assets/hospital-tech.jpg";

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    recordsVerified: 0,
    hospitalsOnboarded: 0,
    uptime: 0
  });

  // Animate stats on load
  useEffect(() => {
    const targetStats = {
      recordsVerified: 125847,
      hospitalsOnboarded: 324,
      uptime: 99.9
    };

    const animateStats = () => {
      let start = Date.now();
      const duration = 2000;

      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);

        setStats({
          recordsVerified: Math.floor(targetStats.recordsVerified * progress),
          hospitalsOnboarded: Math.floor(targetStats.hospitalsOnboarded * progress),
          uptime: parseFloat((targetStats.uptime * progress).toFixed(1))
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    };

    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Tamper-proof",
      description: "Blockchain technology ensures your medical records can never be altered or corrupted.",
      color: "text-primary-neon"
    },
    {
      icon: Zap,
      title: "Fast Verification",
      description: "Verify medical records instantly with our advanced cryptographic verification system.",
      color: "text-warning"
    },
    {
      icon: Lock,
      title: "Privacy-first",
      description: "Your sensitive medical data is encrypted and only accessible by authorized parties.",
      color: "text-purple-bright"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Upload Records",
      description: "Securely upload medical records with patient consent and authorization.",
      icon: Upload
    },
    {
      step: "2", 
      title: "Blockchain Storage",
      description: "Records are encrypted and stored immutably on the blockchain network.",
      icon: Shield
    },
    {
      step: "3",
      title: "Instant Verification",
      description: "Anyone can verify the authenticity of records using our verification system.",
      icon: CheckCircle
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      hospital: "Metropolitan General Hospital",
      content: "MedLedger has revolutionized how we handle patient records. The security and verification capabilities are unmatched.",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of IT",
      hospital: "City Medical Center", 
      content: "The integration was seamless and our staff adapted quickly. Patient trust has increased significantly.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Director of Operations",
      hospital: "Regional Healthcare Network",
      content: "Finally, a solution that puts patient privacy first while maintaining complete transparency and trust.",
      rating: 5
    }
  ];

  // Remove unused testimonial navigation functions since we're showing all at once
  // const nextTestimonial = () => {
  //   setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  // };

  // const prevTestimonial = () => {
  //   setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  // };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroDna})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 fade-in">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Beyond the file.
              </span>
              <br />
              <span className="text-foreground">On the chain.</span>
              <br />
              <span className="text-2xl md:text-3xl font-medium text-muted-foreground">
                Medical records you can trust.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transparency. Trust. Innovation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link to="/upload">
                <GradientButton size="xl" className="w-full sm:w-auto">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Records
                </GradientButton>
              </Link>
              <Link to="/verify">
                <GradientButton variant="outline" size="xl" className="w-full sm:w-auto">
                  <Search className="w-5 h-5 mr-2" />
                  Verify Records
                </GradientButton>
              </Link>
            </div>

            {/* Mini Stats */}
            <div className="flex justify-center items-center space-x-8 pt-12">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-neon">
                  {stats.recordsVerified.toLocaleString()}+
                </div>
                <div className="text-sm text-muted-foreground">Records Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-cyan">
                  {stats.hospitalsOnboarded}+
                </div>
                <div className="text-sm text-muted-foreground">Hospitals Onboarded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-success">
                  {stats.uptime}%
                </div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated DNA Helix */}
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <div className="w-32 h-32 opacity-60 animate-dna-helix">
            <div className="w-full h-full bg-gradient-primary rounded-full blur-sm"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">MedLedger</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge blockchain technology to ensure the highest levels of security and trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <GlassCard key={index} className="text-center space-y-4 backdrop-blur-xl hover:glow-border transition-all duration-300 slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-transparent`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, secure, and efficient. Get started in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <GlassCard className="text-center space-y-4 h-full backdrop-blur-xl">
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary text-primary-foreground text-2xl font-bold mb-4">
                      {step.step}
                    </div>
                    <step.icon className="w-8 h-8 text-primary-neon mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </GlassCard>
                
                {/* Arrow connector */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-primary-neon" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by Healthcare Professionals */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Trusted by Healthcare Professionals</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what medical professionals are saying about MedLedger.
            </p>
          </div>

           <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
             {testimonials.map((testimonial, index) => (
               <div key={index} className="flex-blur p-6 text-center space-y-6 hover:glow-border transition-all duration-300 flex-1 max-w-sm">
                 <div className="flex justify-center space-x-1">
                   {[...Array(testimonial.rating)].map((_, i) => (
                     <Star key={i} className="w-5 h-5 text-warning fill-current" />
                   ))}
                 </div>
                 
                 <blockquote className="text-lg text-foreground italic">
                   "{testimonial.content}"
                 </blockquote>
                 
                 <div className="space-y-2">
                   <div className="font-semibold text-lg">{testimonial.name}</div>
                   <div className="text-muted-foreground">{testimonial.role}</div>
                   <div className="text-primary-neon">{testimonial.hospital}</div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Enterprise-Grade Security</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Certified and compliant with industry standards.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="glass rounded-lg p-6">
              <div className="text-center">
                <Shield className="w-12 h-12 text-primary-neon mx-auto mb-2" />
                <div className="font-semibold">HIPAA Compliant</div>
              </div>
            </div>
            <div className="glass rounded-lg p-6">
              <div className="text-center">
                <Lock className="w-12 h-12 text-success mx-auto mb-2" />
                <div className="font-semibold">SOC 2 Certified</div>
              </div>
            </div>
            <div className="glass rounded-lg p-6">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-cyan mx-auto mb-2" />
                <div className="font-semibold">ISO 27001</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <GlassCard className="text-center space-y-8 glow-border backdrop-blur-xl">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 rounded-xl"
              style={{ backgroundImage: `url(${hospitalTech})` }}
            />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Secure Your <span className="bg-gradient-primary bg-clip-text text-transparent">Medical Records</span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of healthcare professionals who trust MedLedger with their most important data.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/signup">
                  <GradientButton size="xl" className="w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GradientButton>
                </Link>
                <Link to="/contact">
                  <GradientButton variant="outline" size="xl" className="w-full sm:w-auto">
                    Contact Sales
                  </GradientButton>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Home;