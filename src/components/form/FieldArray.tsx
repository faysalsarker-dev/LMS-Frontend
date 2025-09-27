/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import type { UseFieldArrayReturn, FieldValues, Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldArrayProps<T extends FieldValues> {
  label: string;
  placeholder?: string;
  fieldArray: UseFieldArrayReturn<T, any, "id">;
  register: any;
  fieldName: Path<T>;
  className?: string;
  defaultValue?: Record<string, any>; // customizable append defaults
}

export function FieldArray<T extends FieldValues>({
  label,
  placeholder,
  fieldArray,
  register,
  fieldName,
  className,
  defaultValue = { value: "" },
}: FieldArrayProps<T>) {
  const { fields, append, remove } = fieldArray;
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-foreground">{label}</h4>
          <div className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-lg">
            {fields.length}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Add ${label}`}
          onClick={() => append(defaultValue as any)}
          className="h-9 px-4 text-xs font-medium bg-surface-elevated hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-200"
        >
          <Plus className="h-3.5 w-3.5 mr-2" />
          Add {label.slice(0, -1)}
        </Button>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="group p-4 bg-surface-elevated border border-border hover:border-primary/30 hover:shadow-base transition-all duration-200">
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <Input
                      {...register(`${fieldName}.${index}.value` as Path<T>)}
                      placeholder={placeholder}
                      className="bg-card border-0 p-1 focus-visible:ring-0 placeholder:text-muted-foreground/60 text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove ${label} ${index + 1}`}
                    onClick={() => remove(index)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {fields.length === 0 && (
          <Card className="p-8 border-2 border-dashed border-muted/30 bg-gradient-to-br from-surface to-muted/20">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                No {label.toLowerCase()} added yet
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => append(defaultValue as any)}
                className="bg-surface-elevated hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add your first {label.slice(0, -1).toLowerCase()}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
