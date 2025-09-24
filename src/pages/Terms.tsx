import React from "react";
import { GlassCard } from "@/components/ui/glass-card";

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            Terms of <span className="bg-gradient-primary bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-muted-foreground">Last updated: January 2024</p>
        </div>

        <GlassCard className="prose prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using MedLedger, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily use MedLedger for personal, non-commercial transitory viewing only.</p>

          <h2>3. Disclaimer</h2>
          <p>The materials on MedLedger are provided on an 'as is' basis. MedLedger makes no warranties, expressed or implied.</p>

          <h2>4. Limitations</h2>
          <p>In no event shall MedLedger or its suppliers be liable for any damages arising out of the use or inability to use the materials on MedLedger.</p>

          <h2>5. Contact Information</h2>
          <p>For questions about these Terms of Service, please contact us at legal@medledger.com.</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Terms;