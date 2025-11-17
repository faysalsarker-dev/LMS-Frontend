import { Badge } from "@/components/ui/badge";
import type { SubmissionStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: SubmissionStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-status-pending text-status-pending-foreground hover:bg-status-pending/90",
    },
    reviewed: {
      label: "Reviewed",
      className: "bg-status-reviewed text-status-reviewed-foreground hover:bg-status-reviewed/90",
    },
    graded: {
      label: "Graded",
      className: "bg-status-graded text-status-graded-foreground hover:bg-status-graded/90",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;