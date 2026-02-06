import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  show: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();

    setToasts((t) => [...t, { id, message, type }]);

    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  const color = (type: ToastType) => {
    switch (type) {
      case "success":
        return "alert-success";
      case "error":
        return "alert-error";
      default:
        return "alert-info";
    }
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {/* container */}
      <div className="toast toast-top toast-end z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`alert ${color(t.type)} shadow-lg`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
