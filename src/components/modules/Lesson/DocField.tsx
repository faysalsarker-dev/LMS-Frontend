import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface DocFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DocField({ value, onChange, error }: DocFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="docContent" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Document Content
      </Label>
      <p className="text-xs text-muted-foreground">
        Enter the lesson content. Minimum 50 characters required.
      </p>
      <Textarea
        id="docContent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter lesson document content here..."
        className="min-h-[200px] resize-y focus-ring font-mono text-sm"
        aria-describedby={error ? "doc-error" : undefined}
      />
      <div className="flex items-center justify-between text-xs">
        <span
          className={
            value.length < 50 ? "text-destructive" : "text-muted-foreground"
          }
        >
          {value.length} / 50 characters minimum
        </span>
      </div>
      {error && (
        <p id="doc-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
