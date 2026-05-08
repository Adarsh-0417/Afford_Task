import { getTypeColor, getTypeLabel, formatTime } from './notificationUtils';

export default function NotificationItem({ notification, index }) {
  const typeColor = getTypeColor(notification.Type);
  
  return (
    <div className="notification-item">
      <div className="notification-header">
        <div className="notification-rank">#{index + 1}</div>
        <div className="notification-type-badge" style={{ backgroundColor: typeColor }}>
          {getTypeLabel(notification.Type)}
        </div>
        <div className="notification-priority">
          {notification.priority.toFixed(1)}
        </div>
      </div>
      
      <div className="notification-content">
        <h3 className="notification-message">{notification.Message}</h3>
        <div className="notification-details">
          <span className="notification-id">ID: {notification.ID.substring(0, 8)}...</span>
          <span className="notification-time">{formatTime(notification.Timestamp)}</span>
        </div>
      </div>
    </div>
  );
}
