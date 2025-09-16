import toast from "react-hot-toast";
import type { ApiError } from "@/types/apiError";


export const handleApiError = (
  err: unknown,
  fallbackMessage = "Something went wrong!"
) => {
  let message = fallbackMessage;

  const axiosError = err as ApiError;

  const rtkError = (err as { data?: { message?: string } });

  if (rtkError?.data?.message) {
    message = rtkError.data.message;
  }
  else if (axiosError?.response?.data?.message) {
    message = axiosError.response.data.message;
  }
  else if (axiosError?.message) {
    message = axiosError.message;
  }

  toast.error(message);
};
