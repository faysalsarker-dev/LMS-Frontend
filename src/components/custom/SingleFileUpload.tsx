import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CircleUserRoundIcon, XIcon, Edit2 } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import type { SingleFileUploadProps } from "@/interface";



export default function SingleFileUpload({ onChange, value }: SingleFileUploadProps) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
    multiple: false,
  });

  // Safely extract the actual File from FileMetadata
  const uploadedFile: File | null = files[0]?.file instanceof File ? files[0].file : null;

  // Determine preview URL (existing string URL or uploaded file)
  const previewUrl =
    files[0]?.preview ||
    (typeof value === "string" ? value : uploadedFile ? URL.createObjectURL(uploadedFile) : null);

  // Notify parent of selected file
  useEffect(() => {
    onChange(uploadedFile);
  }, [uploadedFile, onChange]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative md:w-32 md:h-32 w-24 h-24">
        <Button
          variant="outline"
          className="w-full h-full rounded-full overflow-hidden p-0 relative flex items-center justify-center shadow-md hover:shadow-lg transition"
          onClick={openFileDialog}
          aria-label={previewUrl ? "Change image" : "Upload image"}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <CircleUserRoundIcon className="w-12 h-12 text-muted-foreground" />
          )}

          {/* Pencil icon overlay if there is an existing image */}
          {previewUrl && (
            <div className="absolute bg-background bottom-3 right-3 w-7 h-7  rounded-full flex items-center justify-center shadow hover:bg-gray-100 cursor-pointer">
              <Edit2 className="w-4 h-4 text-black" />
            </div>
          )}
        </Button>

        {/* Remove button only for newly uploaded files */}
        {previewUrl && files.length > 0 && (
          <Button
            onClick={() => removeFile(files[0]?.id)}
            size="icon"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center  border shadow-sm bg-red-500 hover:text-white transition"
            aria-label="Remove image"
          >
            <XIcon className="w-3.5 h-3.5" />
          </Button>
        )}

        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
