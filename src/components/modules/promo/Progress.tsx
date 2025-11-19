import { Badge } from "@/components/ui/badge";
import type { IPromo } from "@/interface/promo.interfaces";
import { isBefore, startOfDay } from "date-fns";

export  const renderUsage = (promo: IPromo) => {
    if (!promo?.maxUsageCount)
      return (
        <span className="text-sm text-muted-foreground">
          {promo?.currentUsageCount}
        </span>
      );

    const percent = Math.min(
      (promo?.currentUsageCount / promo?.maxUsageCount) * 100,
      100
    );

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {Math.round(percent)}%
        </span>
        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };



export  const getStatusBadge = (isActive: boolean, expire: string) => {
      const today = startOfDay(new Date());
  
      let status: "active" | "inactive" | "expired" = "active";
  
      if (!isActive) status = "inactive";
      else if (isBefore(new Date(expire), today)) status = "expired";
  
      const variants = {
        active: "default",
        inactive: "secondary",
        expired: "destructive",
      } as const;
  
      return (
        <Badge variant={variants[status]} className="capitalize">
          {status}
        </Badge>
      );
    };