/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from "react";

interface UseUploadFileOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  onSuccess?: (url: string, meta: any) => void;
  onError?: (error: string) => void;
}

export function useUploadFile(options: UseUploadFileOptions = {}) {
  const {
    maxSizeMB = 300,
    allowedTypes = ["video/*"],
    onSuccess,
    onError,
  } = options;

  const [uploadState, setUploadState] = useState<any>({
    progress: 0,
    status: "idle",
  });

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > maxSizeMB) {
        return `File size exceeds ${maxSizeMB}MB limit`;
      }

      // Check file type
      const isTypeAllowed = allowedTypes.some((type) => {
        if (type.endsWith("/*")) {
          const baseType = type.split("/")[0];
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });

      if (!isTypeAllowed) {
        return `File type not allowed. Accepted: ${allowedTypes.join(", ")}`;
      }

      return null;
    },
    [maxSizeMB, allowedTypes]
  );

  const uploadFile = useCallback(
    async (file: File): Promise<{ url: string; meta: any } | null> => {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setUploadState({ progress: 0, status: "error", error: validationError });
        onError?.(validationError);
        return null;
      }

      setUploadState({ progress: 0, status: "uploading" });

      try {
        // TODO: Implement presigned upload flow
        // 1. Request presigned URL from backend
        // const presignResponse = await fetch("/api/uploads/presign", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     filename: file.name,
        //     contentType: file.type,
        //     size: file.size,
        //   }),
        // });
        // const { uploadUrl, finalUrl } = await presignResponse.json();

        // 2. Upload to storage with progress tracking
        // const xhr = new XMLHttpRequest();
        // xhr.upload.addEventListener("progress", (e) => {
        //   if (e.lengthComputable) {
        //     const progress = Math.round((e.loaded / e.total) * 100);
        //     setUploadState({ progress, status: "uploading" });
        //   }
        // });

        // For now, simulate upload with FormData approach
        const formData = new FormData();
        formData.append("videoFile", file);

        // Simulate progress
        const uploadPromise = new Promise<string>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setUploadState({ progress, status: "uploading" });
            if (progress >= 100) {
              clearInterval(interval);
              resolve(URL.createObjectURL(file)); // Temporary preview URL
            }
          }, 200);
        });

        const url = await uploadPromise;

        const meta = {
          filename: file.name,
          size: file.size,
          mimeType: file.type,
          storage: "cdn" as const,
        };

        setUploadState({ progress: 100, status: "success" });
        onSuccess?.(url, meta);

        return { url, meta };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setUploadState({ progress: 0, status: "error", error: errorMessage });
        onError?.(errorMessage);
        return null;
      }
    },
    [validateFile, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setUploadState({ progress: 0, status: "idle" });
  }, []);

  return {
    uploadFile,
    uploadState,
    reset,
    validateFile,
  };
}
