import { useEffect, useCallback } from "react";

interface UseConfirmOnLeaveOptions {
  when: boolean;
  message?: string;
}

export function useConfirmOnLeave({
  when,
  message = "You have unsaved changes. Are you sure you want to leave?",
}: UseConfirmOnLeaveOptions) {
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (when) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    },
    [when, message]
  );

  useEffect(() => {
    if (when) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [when, handleBeforeUnload]);

  const confirmLeave = useCallback((): boolean => {
    if (when) {
      return window.confirm(message);
    }
    return true;
  }, [when, message]);

  return { confirmLeave };
}
