import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

const ToastContext = createContext<(msg: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const toast = useCallback((message: string) => {
    clearTimeout(timeoutRef.current);
    clearTimeout(hideTimeoutRef.current);
    setMsg(message);
    setVisible(true);
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      hideTimeoutRef.current = setTimeout(() => setMsg(null), 300);
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {msg && (
        <div className="toast" style={{ opacity: visible ? 1 : 0 }}>
          {msg}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
