import { Camera, User } from "lucide-react";
import { useRef } from "react";

interface AvatarUploadProps {
  imageUrl?: string | null;
  onImageChange: (file: File) => void;
}

const AvatarUpload = ({ imageUrl, onImageChange }: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleClick}>
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-elegant transition-all duration-300 group-hover:border-secondary">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <User className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
        <Camera className="h-8 w-8 text-white" />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarUpload;
