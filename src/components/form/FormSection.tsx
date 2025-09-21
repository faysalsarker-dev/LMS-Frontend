import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function FormSection({ 
  title, 
  description, 
  children, 
  className, 
  icon 
}: FormSectionProps) {
  return (
    <Card className={cn(
      "bg-gradient-card backdrop-blur-sm border border-glass-border shadow-base hover:shadow-lg transition-all duration-300",
      className
    )}>
      <CardHeader className="pb-6">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="flex-shrink-0 p-3 bg-gradient-primary rounded-xl shadow-base">
              <div className="text-primary-foreground">
                {icon}
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-foreground leading-tight">
              {title}
            </h3>
            {description && (
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}