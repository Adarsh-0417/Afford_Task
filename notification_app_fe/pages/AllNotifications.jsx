import { useState } from 'react';
import { Container, Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import FilterBar from '../components/FilterBar';
import NotificationList from '../components/NotificationList';
import { useNotifications } from '../hooks/useNotifications';
import '../styles/Pages.css';

export default function AllNotifications() {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [notificationType, setNotificationType] = useState('');
  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem('viewedNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  const { notifications, loading, error } = useNotifications(limit, page, notificationType);

  const handleToggleViewed = (notificationId) => {
    const updated = viewedIds.includes(notificationId)
      ? viewedIds.filter(id => id !== notificationId)
      : [...viewedIds, notificationId];
    setViewedIds(updated);
    localStorage.setItem('viewedNotifications', JSON.stringify(updated));
  };

  const handleRefresh = () => {
    // Re-fetch by resetting to page 1
    setPage(1);
  };

  const unreadCount = notifications.filter(n => !viewedIds.includes(n.ID)).length;

  return (
    <Container maxWidth="lg" className="page-container">
      <Box className="page-header">
        <Typography variant="h4" className="page-title">
          📬 All Notifications
        </Typography>
        <Typography variant="body2" className="unread-count">
          {unreadCount} unread of {notifications.length} notifications
        </Typography>
      </Box>

      <FilterBar
        limit={limit}
        setLimit={setLimit}
        notificationType={notificationType}
        setNotificationType={setNotificationType}
        page={page}
        setPage={setPage}
        onRefresh={handleRefresh}
      />

      <NotificationList
        notifications={notifications}
        loading={loading}
        error={error}
        viewedIds={viewedIds}
        onToggleViewed={handleToggleViewed}
      />
    </Container>
  );
}
