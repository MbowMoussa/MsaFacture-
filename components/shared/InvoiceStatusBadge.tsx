import type { InvoiceStatus } from "@/types";
import { INVOICE_STATUS_LABELS } from "@/types";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  XCircle,
} from "lucide-react";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { className: string; icon: React.ElementType; dot: string }
> = {
  brouillon: {
    className: "bg-gray-100 text-gray-700 border border-gray-200 badge",
    icon: FileText,
    dot: "bg-gray-400",
  },
  envoyee: {
    className: "bg-amber-50 text-amber-700 border border-amber-200 badge font-medium",
    icon: Clock,
    dot: "bg-amber-500",
  },
  payee: {
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200 badge font-medium",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
  },
  en_retard: {
    className: "bg-rose-50 text-rose-700 border border-rose-200/60 badge font-medium",
    icon: AlertCircle,
    dot: "bg-rose-400",
  },
  annulee: {
    className: "bg-gray-50 text-gray-400 border border-gray-200 badge",
    icon: XCircle,
    dot: "bg-gray-300",
  },
};

export default function InvoiceStatusBadge({
  status,
  size = "md",
  showIcon = true,
}: InvoiceStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const label = INVOICE_STATUS_LABELS[status];

  return (
    <span
      className={cn(
        config.className,
        size === "sm" && "text-xs px-2 py-0.5"
      )}
    >
      {showIcon ? (
        <Icon className={cn("flex-shrink-0", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
      ) : (
        <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", config.dot)} />
      )}
      {label}
    </span>
  );
}
