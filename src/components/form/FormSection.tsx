import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function FormSection({ title, description, children, className, icon }: FormSectionProps) {
  return (
    <Card className={cn("bg-card/40 border border-border shadow-card", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
          )}
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
}