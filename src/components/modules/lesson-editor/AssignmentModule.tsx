import { Editor } from '@tinymce/tinymce-react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface AssignmentModuleProps {
  instruction: string;
  maxMarks: number;
  deadline: Date | undefined;
  onInstructionChange: (instruction: string) => void;
  onMaxMarksChange: (marks: number) => void;
  onDeadlineChange: (date: Date | undefined) => void;
}

export function AssignmentModule({
  instruction,
  maxMarks,
  deadline,
  onInstructionChange,
  onMaxMarksChange,
  onDeadlineChange,
}: AssignmentModuleProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Instructions */}
      <div className="space-y-3">
        <Label>Assignment Instructions</Label>
        <p className="text-sm text-muted-foreground">
          Provide detailed instructions for students to complete this assignment.
        </p>
        
        {isLoading && (
          <Skeleton className="w-full h-[300px] rounded-lg" />
        )}
        
        <div className={isLoading ? 'hidden' : 'block'}>
          <Editor
            tinymceScriptSrc="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js"
            value={instruction}
            onInit={() => setIsLoading(false)}
            onEditorChange={(content) => onInstructionChange(content)}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'anchor', 'searchreplace', 'visualblocks', 'code',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic underline | alignleft aligncenter alignright | ' +
                'bullist numlist | table | removeformat',
              table_default_styles: {
                borderCollapse: 'collapse',
                width: '100%',
              },
              content_style: `
                body { 
                  font-family: Inter, system-ui, sans-serif; 
                  font-size: 14px; 
                  padding: 1rem;
                }
                table td, table th { 
                  border: 1px solid #e2e8f0; 
                  padding: 8px 12px; 
                }
              `,
              branding: false,
              promotion: false,
            }}
          />
        </div>
      </div>

      {/* Max Marks and Deadline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="maxMarks">Maximum Marks</Label>
          <Input
            id="maxMarks"
            type="number"
            min={0}
            max={1000}
            value={maxMarks || ''}
            onChange={(e) => onMaxMarksChange(parseInt(e.target.value) || 0)}
            placeholder="e.g., 100"
          />
          <p className="text-xs text-muted-foreground">
            Total points available for this assignment
          </p>
        </div>

        <div className="space-y-2">
          <Label>Submission Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !deadline && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadline ? format(deadline, 'PPP') : 'Pick a deadline'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={onDeadlineChange}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">
            Students must submit before this date
          </p>
        </div>
      </div>
    </div>
  );
}
