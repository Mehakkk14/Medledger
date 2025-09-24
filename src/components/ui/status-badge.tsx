import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, AlertTriangle } from "lucide-react";

interface StatusBadgeProps {
  status?: "verified" | "pending" | "invalid" | "warning";
  children: React.ReactNode;
  className?: string;
}

const statusConfig = {
  verified: {
    className: "status-verified",
    icon: CheckCircle2,
  },
  pending: {
    className: "status-pending",
    icon: Clock,
  },
  invalid: {
    className: "status-invalid",
    icon: XCircle,
  },
  warning: {
    className: "status-warning",
    icon: AlertTriangle,
  },
};

// Always use a fallback if status is missing or unknown
const StatusBadge: React.FC<StatusBadgeProps> = ({ status = "invalid", children, className }) => {
  const config = statusConfig[status] || statusConfig["invalid"];
  const Icon = config.icon;
  return (
    <span className={cn(config.className, className)}>
      <Icon className="w-3 h-3 mr-1" />
      {children}
    </span>
  );
};

export { StatusBadge };