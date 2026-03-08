import { createContext, useContext, useState, useCallback, useRef } from "react";

export type NotificationType = "success" | "info" | "warning" | "error";

export interface GinshiNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextValue {
  notifications: GinshiNotification[];
  notify: (n: Omit<GinshiNotification, "id">) => void;
  dismiss: (id: string) => void;
}

const GinshiNotificationContext = createContext<NotificationContextValue | null>(null);

let idCounter = 0;

export const GinshiNotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<GinshiNotification[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback((n: Omit<GinshiNotification, "id">) => {
    const id = `ginshi_notif_${++idCounter}`;
    const duration = n.duration ?? 4000;
    const notification = { ...n, id, duration };

    setNotifications((prev) => [...prev, notification]);

    const timer = setTimeout(() => dismiss(id), duration);
    timersRef.current.set(id, timer);
  }, [dismiss]);

  return (
    <GinshiNotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
    </GinshiNotificationContext.Provider>
  );
};

export const useGinshiNotification = () => {
  const ctx = useContext(GinshiNotificationContext);
  if (!ctx) throw new Error("useGinshiNotification must be used within GinshiNotificationProvider");
  return ctx;
};
