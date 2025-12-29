import { Toaster, ToastBar, toast } from "react-hot-toast";

// Shared styling (applies to all toasts)
export const globalToastOptions = {
  style: {
    background: "#1f2937",
    color: "#fff",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "0.7rem",
  },
  position: "top-right" as const,
  duration: 3000,
};

// Custom helper functions for different toast types
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    style: {
      background: "#16a34a",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#16a34a",
    },
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    style: {
      background: "#dc2626",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#dc2626",
    },
  });
};

export const showLoadingToast = (message: string) => {
  toast.loading(message, {
    style: {
      background: "#2563eb",
      color: "#fff",
    },
  });
};
