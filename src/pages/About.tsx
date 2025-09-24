import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  Shield, 
  Target, 
  Heart, 
  Users,
  Linkedin,
  Github,
  Mail,
  ExternalLink
} from "lucide-react";
import hospitalTech from "@/assets/hospital-tech.jpg";

const About = () => {
  const mission = {
    title: "Our Mission",
    description: "To revolutionize healthcare data management through blockchain technology, ensuring complete transparency, security, and trust in medical records while putting patient privacy first.",
    icon: Target
  };

  const values = [
    {
      title: "Transparency",
      description: "Every transaction and record verification is fully auditable on the blockchain, creating unprecedented transparency in medical data management.",
      icon: Shield
    },
    {
      title: "Trust",
      description: "By leveraging immutable blockchain technology, we build unshakeable trust between patients, healthcare providers, and institutions.",
      icon: Heart
    },
    {
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible in healthcare technology, always staying ahead of the curve.",
      icon: Users
    }
  ];

  const team = [
    {
      name: "Divyanshu Singh",
      role: "Backend Developer",
      linkedin: "https://www.linkedin.com/in/divyanshu-singh-b3049229a",
      description: "Specializes in blockchain architecture and secure API development. Expert in building scalable backend systems for healthcare applications."
    },
    {
      name: "Mahak Rastogi", 
      role: "Frontend and Blockchain Developer",
      linkedin: "https://www.linkedin.com/in/mahak-rastogi14",
      description: "Full-stack developer with expertise in React and blockchain integration. Passionate about creating intuitive user experiences."
    },
    {
      name: "Rudra Pratap Singh",
      role: "Backend Developer", 
      linkedin: "https://www.linkedin.com/in/rudra-pratap-singh-52bab1288",
      description: "Backend specialist focused on database optimization and security protocols. Ensures robust and reliable system performance."
    },
    {
      name: "Harshit Singh",
      role: "Frontend and Blockchain Developer",
      linkedin: "https://www.linkedin.com/in/harshit-singh-618079294", 
      description: "Frontend developer and blockchain enthusiast. Creates seamless interfaces and implements smart contract solutions."
    }
  ];

  const stats = [
    { number: "125K+", label: "Records Secured" },
    { number: "324+", label: "Healthcare Partners" },
    { number: "99.9%", label: "Uptime Guaranteed" },
    { number: "24/7", label: "Security Monitoring" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">MedLedger</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're building the future of medical record management with cutting-edge blockchain technology, 
            ensuring every patient's data is secure, accessible, and trustworthy.
          </p>
        </section>

        {/* Mission Section */}
        <section>
          <GlassCard className="glow-border">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 rounded-xl"
              style={{ backgroundImage: `url(${hospitalTech})` }}
            />
            <div className="relative z-10 text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <mission.icon className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">{mission.title}</h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                {mission.description}
              </p>
            </div>
          </GlassCard>
        </section>

        {/* Values Section */}
        <section>
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at MedLedger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <GlassCard key={index} className="text-center space-y-4 hover:glow-border transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <value.icon className="w-8 h-8 text-primary-neon" />
                </div>
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section>
          <GlassCard>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-primary-neon">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals building the future of healthcare technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <GlassCard key={index} className="space-y-4 hover:glow-border transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-primary-neon font-medium">{member.role}</p>
                  </div>
                  <div className="flex space-x-2">
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg glass hover:glow-border transition-all text-muted-foreground hover:text-primary-neon"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <button className="p-2 rounded-lg glass hover:glow-border transition-all text-muted-foreground hover:text-primary-neon">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{member.description}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section>
          <GlassCard>
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Built with Cutting-Edge Technology</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our platform leverages the latest in blockchain, encryption, and web technologies 
                to deliver unparalleled security and performance.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                <div className="text-center space-y-2">
                  <div className="text-lg font-semibold text-primary-neon">Blockchain</div>
                  <div className="text-sm text-muted-foreground">Ethereum, Smart Contracts</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-lg font-semibold text-cyan">Security</div>
                  <div className="text-sm text-muted-foreground">AES-256, RSA Encryption</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-lg font-semibold text-purple-bright">Frontend</div>
                  <div className="text-sm text-muted-foreground">React, TypeScript</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-lg font-semibold text-success">Backend</div>
                  <div className="text-sm text-muted-foreground">Node.js, PostgreSQL</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>


        {/* Get in Touch Section */}
        <section>
          <GlassCard className="glow-border backdrop-blur-xl max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Get in <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ready to revolutionize your healthcare data management?
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-neon" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Email Us</div>
                    <div className="text-sm text-muted-foreground">hello@medledger.com</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-neon" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Join Community</div>
                    <div className="text-sm text-muted-foreground">Connect with professionals</div>
                  </div>
                </div>
              </div>
              
              <GradientButton className="mt-6">
                Contact Sales Team
              </GradientButton>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
};

export default About;