/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseFieldArrayReturn,  FieldValues, Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldArrayProps<T extends FieldValues> {
  label: string;
  placeholder: string;
  fieldArray: UseFieldArrayReturn<T, any, "id">;
  register: any;
  fieldName: Path<T>;
  className?: string;
}

export function FieldArray<T extends FieldValues>({
  label,
  placeholder,
  fieldArray,
  register,
  fieldName,
  className,
}: FieldArrayProps<T>) {
  const { fields, append, remove } = fieldArray;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: "" } as any)}
          className="h-8 px-3 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add {label.slice(0, -1)}
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <Card key={field.id} className="p-3 bg-gradient-card border border-border">
            <div className="flex gap-3 items-center">
              <Input
                {...register(`${fieldName}.${index}.value` as Path<T>)}
                placeholder={placeholder}
                className="flex-1 bg-transparent"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        {fields.length === 0 && (
          <Card className="p-6 border-2 border-dashed border-muted-foreground/25">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">No {label.toLowerCase()} added yet</p>
              <Button
                type="button"
                variant="ghost"
                onClick={() => append({ value: "" } as any)}
                className="mt-2 text-primary hover:text-primary"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add your first {label.slice(0, -1).toLowerCase()}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}