import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Building,
  User,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "",
    message: "",
    inquiryType: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you within 24 hours.");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      primary: "contact@medledger.com",
      secondary: "support@medledger.com",
      description: "Get in touch via email for any inquiries"
    },
    {
      icon: Phone,
      title: "Call Us", 
      primary: "+1 (555) 123-4567",
      secondary: "+1 (555) 765-4321",
      description: "Speak directly with our support team"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      primary: "123 Innovation Drive",
      secondary: "San Francisco, CA 94105",
      description: "Come visit our headquarters"
    },
    {
      icon: Clock,
      title: "Business Hours",
      primary: "Mon - Fri: 9AM - 6PM PST",
      secondary: "Emergency: 24/7 Support",
      description: "We're here when you need us"
    }
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "sales", label: "Sales & Pricing" },
    { value: "support", label: "Technical Support" },
    { value: "partnership", label: "Partnership Opportunities" },
    { value: "security", label: "Security & Compliance" },
    { value: "media", label: "Media & Press" }
  ];

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <GlassCard className="text-center space-y-6 glow-border">
            <div className="w-20 h-20 mx-auto bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success animate-pulse-glow" />
            </div>
            
            <h1 className="text-3xl font-bold text-success">Message Sent Successfully!</h1>
            <p className="text-muted-foreground">
              Thank you for reaching out to us. Our team will review your message and get back to you 
              within 24 hours. For urgent matters, please call our support line.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  organization: "",
                  subject: "",
                  message: "",
                  inquiryType: "general"
                });
              }}>
                Send Another Message
              </GradientButton>
              <GradientButton variant="outline" onClick={() => window.location.href = "/"}>
                Back to Home
              </GradientButton>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Get in <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about MedLedger? Need support? Want to partner with us? 
            We'd love to hear from you.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <GlassCard key={index} className="text-center space-y-4 hover:glow-border transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary/20 rounded-full flex items-center justify-center mx-auto">
                <info.icon className="w-6 h-6 text-primary-neon" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{info.title}</h3>
                <div className="text-sm space-y-1">
                  <div className="font-medium">{info.primary}</div>
                  <div className="text-muted-foreground">{info.secondary}</div>
                </div>
                <p className="text-xs text-muted-foreground">{info.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <GlassCard>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Send us a Message</h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="input-glass pl-10 pr-4 py-3 w-full"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input-glass pl-10 pr-4 py-3 w-full"
                          placeholder="john@hospital.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Organization & Inquiry Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Organization
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleInputChange}
                          className="input-glass pl-10 pr-4 py-3 w-full"
                          placeholder="Your Hospital/Organization"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Inquiry Type
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="input-glass px-4 py-3 w-full"
                      >
                        {inquiryTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="input-glass px-4 py-3 w-full"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-4 text-muted-foreground w-4 h-4" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="input-glass pl-10 pr-4 py-3 w-full resize-none"
                        placeholder="Please describe your inquiry in detail..."
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <GradientButton 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </GradientButton>
                </form>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Need Immediate Help?</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Emergency Support</div>
                    <div className="text-xs text-muted-foreground">24/7 Available</div>
                  </div>
                </div>
                <GradientButton variant="outline" size="sm" className="w-full">
                  Call Now
                </GradientButton>
              </div>
            </GlassCard>

            {/* FAQ Link */}
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check our FAQ section for quick answers to common questions.
              </p>
              <GradientButton variant="outline" size="sm" className="w-full">
                View FAQ
              </GradientButton>
            </GlassCard>

            {/* Response Time */}
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Response Times</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">General Inquiries:</span>
                  <span className="font-medium">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sales Questions:</span>
                  <span className="font-medium">4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Technical Support:</span>
                  <span className="font-medium">2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Emergencies:</span>
                  <span className="font-medium text-success">15 minutes</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Office Map Placeholder */}
        <GlassCard>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Visit Our Office</h2>
            <p className="text-muted-foreground">
              Located in the heart of San Francisco's tech district
            </p>
            <div className="bg-muted/20 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="w-12 h-12 text-primary-neon mx-auto" />
                <div className="text-lg font-medium">123 Innovation Drive</div>
                <div className="text-muted-foreground">San Francisco, CA 94105</div>
                <GradientButton variant="outline" size="sm">
                  Get Directions
                </GradientButton>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Contact;