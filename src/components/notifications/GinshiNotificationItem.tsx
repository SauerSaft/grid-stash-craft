import { useEffect, useState } from "react";
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import type { GinshiNotification, NotificationType } from "./GinshiNotificationContext";

const iconMap: Record<NotificationType, React.ElementType> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

const typeClass: Record<NotificationType, string> = {
  success: "ginshi_notif_success",
  info: "ginshi_notif_info",
  warning: "ginshi_notif_warning",
  error: "ginshi_notif_error",
};

interface Props {
  notification: GinshiNotification;
  onDismiss: (id: string) => void;
}

const GinshiNotificationItem = ({ notification, onDismiss }: Props) => {
  const [exiting, setExiting] = useState(false);
  const duration = notification.duration ?? 4000;
  const Icon = iconMap[notification.type];

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), duration - 300);
    return () => clearTimeout(exitTimer);
  }, [duration]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  return (
    <div
      className={`ginshi_notif ${typeClass[notification.type]} ${exiting ? "ginshi_notif_exit" : ""}`}
    >
      <div className="ginshi_notif_icon">
        <Icon />
      </div>

      <div className="ginshi_notif_content">
        <span className="ginshi_notif_title">{notification.title}</span>
        {notification.message && (
          <span className="ginshi_notif_message">{notification.message}</span>
        )}
      </div>

      <button className="ginshi_notif_close" onClick={handleDismiss}>
        <X />
      </button>

      <div className="ginshi_notif_progress">
        <div
          className="ginshi_notif_progress_bar"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

export default GinshiNotificationItem;
