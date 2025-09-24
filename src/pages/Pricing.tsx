import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/forever",
      description: "Perfect for individual users and small practices",
      features: [
        "Up to 50 record verifications/month",
        "Basic upload functionality", 
        "Standard verification speed",
        "Email support",
        "Basic dashboard",
        "Mobile app access"
      ],
      limitations: [
        "Limited to 5MB file uploads",
        "Standard support response time"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "primary" as const
    },
    {
      name: "Pro", 
      price: "$29",
      period: "/per month",
      description: "For growing practices and healthcare organizations",
      features: [
        "Unlimited record verifications",
        "Advanced upload features",
        "Priority verification speed", 
        "Priority email & chat support",
        "Advanced dashboard & analytics",
        "API access",
        "Bulk upload capabilities",
        "Custom branding",
        "Webhook integrations"
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "primary" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "/pricing", 
      description: "For large healthcare networks and institutions",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom integrations",
        "On-premise deployment options",
        "Advanced security features",
        "SLA guarantees",
        "24/7 phone support",
        "Custom training",
        "White-label solutions",
        "Advanced compliance tools"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "primary" as const
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">
          Simple <span className="bg-gradient-primary bg-clip-text text-transparent">Pricing</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose the plan that's right for your organization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <GlassCard 
            key={index} 
            className={`relative space-y-6 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:glow-border group cursor-pointer ${
              plan.popular 
                ? 'glow-border bg-gradient-to-br from-primary/5 to-cyan/5 border-primary/30 hover:from-primary/10 hover:to-cyan/10' 
                : 'bg-card/50 hover:bg-card/70 hover:border-primary/20'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
            )}
            
            <div className="text-center space-y-4 pt-4">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-foreground">
                  {plan.price}
                  <span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <ul className="space-y-3 text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <Check className="w-4 h-4 text-success mr-3 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {plan.limitations && (
                <ul className="space-y-2 text-left border-t border-border/30 pt-4">
                  {plan.limitations.map((limitation, idx) => (
                    <li key={idx} className="flex items-start text-sm text-muted-foreground">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <GradientButton 
              className="w-full group-hover:scale-105 transition-transform duration-300" 
              variant={plan.buttonVariant}
            >
              {plan.buttonText}
            </GradientButton>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Pricing;