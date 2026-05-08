import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import NotificationCard from './NotificationCard';
import './NotificationList.css';

export default function NotificationList({ 
  notifications, 
  loading, 
  error, 
  viewedIds,
  onToggleViewed 
}) {
  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography>Loading notifications...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Alert severity="info">
        No notifications found. Try adjusting your filters.
      </Alert>
    );
  }

  return (
    <Box className="notification-list">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.ID}
          notification={notification}
          isViewed={viewedIds.includes(notification.ID)}
          onToggleViewed={onToggleViewed}
        />
      ))}
    </Box>
  );
}
