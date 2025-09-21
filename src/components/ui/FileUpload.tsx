import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Image, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      onChange(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  }, [onChange]);

  const removeFile = () => {
    setUploadedFile(null);
    setPreview(null);
    onChange(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize,
    multiple: false,
  });

  if (uploadedFile) {
    return (
      <Card className="p-6 bg-gradient-card border border-border">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {preview ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded-lg border border-border"
                />
              ) : (
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-medium text-foreground text-sm">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="h-8 w-8 p-0 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("relative overflow-hidden hover:border-primary/50 hover:bg-primary/2", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "p-8 border-2 border-dashed transition-all duration-200 cursor-pointer",
          "bg-gradient-to-br from-surface to-muted/20",
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-muted/30 "
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center">
            {isDragActive ? (
              <Upload className="h-8 w-8 text-primary-foreground animate-bounce" />
            ) : (
              <Image className="h-8 w-8 text-primary-foreground" />
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {isDragActive ? "Drop your file here" : "Upload course thumbnail"}
            </p>
            <p className="text-xs text-muted-foreground">
              Drag & drop or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FileUpload;