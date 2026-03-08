import { useNotification } from "./GinshiNotificationContext";
import GinshiNotificationItem from "./GinshiNotificationItem";

const GinshiNotificationContainer = () => {
  const { notifications, dismiss } = useNotification();

  return (
    <div className="ginshi_notif_container">
      {notifications.map((n) => (
        <GinshiNotificationItem key={n.id} notification={n} onDismiss={dismiss} />
      ))}
    </div>
  );
};

export default GinshiNotificationContainer;
