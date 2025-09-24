import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Code, Book, Download, ExternalLink } from "lucide-react";

const Docs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-primary bg-clip-text text-transparent">Documentation</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to integrate with MedLedger
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <GlassCard className="space-y-4">
          <Book className="w-8 h-8 text-primary-neon" />
          <h3 className="text-xl font-semibold">Getting Started</h3>
          <p className="text-muted-foreground">Quick start guide and basic concepts</p>
          <GradientButton variant="outline" size="sm">Learn More</GradientButton>
        </GlassCard>

        <GlassCard className="space-y-4">
          <Code className="w-8 h-8 text-cyan" />
          <h3 className="text-xl font-semibold">API Reference</h3>
          <p className="text-muted-foreground">Complete API documentation</p>
          <GradientButton variant="outline" size="sm">View API</GradientButton>
        </GlassCard>

        <GlassCard className="space-y-4">
          <Download className="w-8 h-8 text-success" />
          <h3 className="text-xl font-semibold">SDKs & Tools</h3>
          <p className="text-muted-foreground">Download our development tools</p>
          <GradientButton variant="outline" size="sm">Download</GradientButton>
        </GlassCard>
      </div>
    </div>
  );
};

export default Docs;