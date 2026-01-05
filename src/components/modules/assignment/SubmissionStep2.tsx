import { useState, useCallback, type ChangeEvent, type DragEvent } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileText, ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import type { IAssignmentSchema, ICreateSubmissionData } from '@/types/studentAssignment.types';

interface SubmissionStep2Props {
  assignment: IAssignmentSchema;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (data: Omit<ICreateSubmissionData, 'assignmentId'>) => void;
}

const MAX_TEXT_LENGTH = 5000;

const containerVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20 },
};

const SubmissionStep2 = ({
  assignment,
  isSubmitting,
  onBack,
  onSubmit,
}: SubmissionStep2Props) => {
  const [textResponse, setTextResponse] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { submissionType } = assignment;
  const showTextArea = submissionType === 'text' || submissionType === 'both';
  const showFileUpload = submissionType === 'file' || submissionType === 'both';

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_TEXT_LENGTH) {
      setTextResponse(e.target.value);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const removeFile = () => setFile(null);

  const handleSubmit = () => {
    const data: Omit<ICreateSubmissionData, 'assignmentId'> = {};
    if (showTextArea && textResponse.trim()) {
      data.textResponse = textResponse.trim();
    }
    if (showFileUpload && file) {
      data.file = file;
    }
    onSubmit(data);
  };

  const isValid = () => {
    if (submissionType === 'text') return textResponse.trim().length > 0;
    if (submissionType === 'file') return file !== null;
    return textResponse.trim().length > 0 || file !== null;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Submit Your Work</h2>
          <p className="text-sm text-muted-foreground">{assignment.title}</p>
        </div>
      </div>

      {/* Text Response */}
      {showTextArea && (
        <div className="space-y-2">
          <Label htmlFor="response" className="text-sm font-medium">
            Your Response
          </Label>
          <Textarea
            id="response"
            placeholder="Write your response here..."
            value={textResponse}
            onChange={handleTextChange}
            disabled={isSubmitting}
            className="min-h-[180px] resize-none"
          />
          <div className="flex justify-between items-center">
            <Progress 
              value={(textResponse.length / MAX_TEXT_LENGTH) * 100} 
              className="h-1 flex-1 mr-4"
            />
            <span className={`text-xs ${textResponse.length >= MAX_TEXT_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}>
              {textResponse.length}/{MAX_TEXT_LENGTH}
            </span>
          </div>
        </div>
      )}

      {/* File Upload */}
      {showFileUpload && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Attachment</Label>
          
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
                }
              `}
            >
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className={`h-10 w-10 mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOC, ZIP, or any file up to 10MB
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg"
            >
              <div className="p-2 rounded-md bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                disabled={isSubmitting}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isValid() || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Assignment'
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default SubmissionStep2;
