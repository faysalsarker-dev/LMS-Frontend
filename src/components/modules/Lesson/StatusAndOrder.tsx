import { Hash, ToggleLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LessonStatus } from "@/interface";

interface StatusAndOrderProps {
  order: number;
  status: LessonStatus;
  onOrderChange: (order: number) => void;
  onStatusChange: (status: LessonStatus) => void;
  errors?: {
    order?: string;
    status?: string;
  };
}

export function StatusAndOrder({
  order,
  status,
  onOrderChange,
  onStatusChange,
  errors,
}: StatusAndOrderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Order */}
      <div className="space-y-2">
        <Label htmlFor="order" className="flex items-center gap-2">
          <Hash className="w-4 h-4" />
          Order
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="order"
          type="number"
          value={order}
          onChange={(e) => onOrderChange(parseInt(e.target.value) || 1)}
          min={1}
          className="focus-ring"
          aria-describedby={errors?.order ? "order-error" : undefined}
        />
        <p className="text-xs text-muted-foreground">
          Display order in the course (e.g., 1, 2, 3...)
        </p>
        {errors?.order && (
          <p id="order-error" className="text-sm text-destructive">
            {errors.order}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status" className="flex items-center gap-2">
          <ToggleLeft className="w-4 h-4" />
          Status
        </Label>
        <Select value={status} onValueChange={(v) => onStatusChange(v as LessonStatus)}>
          <SelectTrigger id="status" className="focus-ring">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Only active lessons are visible to students
        </p>
        {errors?.status && (
          <p className="text-sm text-destructive">{errors.status}</p>
        )}
      </div>
    </div>
  );
}
