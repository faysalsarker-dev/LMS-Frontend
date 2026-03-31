import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NoDataFoundProps {
  message: string;
  image?: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function NoDataFound({
  message,
  image,
  icon,
  className,
  children,
}: NoDataFoundProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center w-full min-h-[200px]",
        className
      )}
    >
      {image ? (
        <img
          src={image}
          alt={message}
          className="w-32 h-32 object-contain mb-4 opacity-80"
        />
      ) : icon ? (
        <div className="text-muted-foreground mb-4 flex items-center justify-center">
          {icon}
        </div>
      ) : null}
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default NoDataFound;
