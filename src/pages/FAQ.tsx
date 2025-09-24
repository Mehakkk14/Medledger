import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      question: "What is MedLedger?",
      answer: "MedLedger is a blockchain-based medical record verification system that ensures the authenticity and integrity of medical records through immutable storage and cryptographic verification."
    },
    {
      question: "How secure is my data?",
      answer: "All data is encrypted using AES-256 encryption and stored on the blockchain. Only authorized parties can access records, and all access is logged for complete transparency."
    },
    {
      question: "Is MedLedger HIPAA compliant?",
      answer: "Yes, MedLedger is fully HIPAA compliant and meets all healthcare data protection requirements. We undergo regular security audits to maintain compliance."
    },
    {
      question: "How much does it cost?",
      answer: "We offer flexible pricing starting from free for basic usage up to enterprise plans. Contact our sales team for custom pricing based on your needs."
    },
    {
      question: "Can I integrate with my existing systems?",
      answer: "Yes, MedLedger provides comprehensive APIs and SDKs for easy integration with existing healthcare management systems and electronic health records."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">
          Frequently Asked <span className="bg-gradient-primary bg-clip-text text-transparent">Questions</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about MedLedger
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <GlassCard key={index}>
            <button
              onClick={() => toggleItem(index)}
              className="w-full text-left flex items-center justify-between p-2"
            >
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              {openItems.includes(index) ? (
                <ChevronUp className="w-5 h-5 text-primary-neon" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary-neon" />
              )}
            </button>
            {openItems.includes(index) && (
              <div className="mt-4 p-2 text-muted-foreground">
                {faq.answer}
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default FAQ;