import { useState, useMemo } from 'react';
import { Container, Box, Typography, TextField, CircularProgress, Alert } from '@mui/material';
import NotificationList from '../components/NotificationList';
import { useNotifications, getTopPriorityNotifications } from '../hooks/useNotifications';
import '../styles/Pages.css';

export default function PriorityNotifications() {
  const [topN, setTopN] = useState(10);
  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem('viewedNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch all notifications to calculate priority
  const { notifications, loading, error } = useNotifications(100, 1, '');

  // Calculate top priority notifications
  const priorityNotifications = useMemo(() => {
    return getTopPriorityNotifications(notifications, topN);
  }, [notifications, topN]);

  const handleToggleViewed = (notificationId) => {
    const updated = viewedIds.includes(notificationId)
      ? viewedIds.filter(id => id !== notificationId)
      : [...viewedIds, notificationId];
    setViewedIds(updated);
    localStorage.setItem('viewedNotifications', JSON.stringify(updated));
  };

  const unreadCount = priorityNotifications.filter(n => !viewedIds.includes(n.ID)).length;

  return (
    <Container maxWidth="lg" className="page-container">
      <Box className="page-header">
        <Typography variant="h4" className="page-title">
          ⭐ Priority Notifications
        </Typography>
        <Typography variant="body2" className="subtitle">
          Top {topN} most important notifications based on type and recency
        </Typography>
        <Typography variant="body2" className="unread-count">
          {unreadCount} unread of {priorityNotifications.length} notifications
        </Typography>
      </Box>

      <Box className="priority-controls">
        <TextField
          label="Show Top N"
          type="number"
          value={topN}
          onChange={(e) => setTopN(Math.max(1, parseInt(e.target.value) || 10))}
          variant="outlined"
          size="small"
          inputProps={{ min: 1, max: 50 }}
          sx={{ width: '150px' }}
        />
        <Typography variant="caption" className="priority-info">
          💼 Placement (3x) • 📊 Result (2x) • 📅 Event (1x) + Recency
        </Typography>
      </Box>

      {loading && (
        <Box className="loading-container">
          <CircularProgress />
          <Typography>Calculating priorities...</Typography>
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <NotificationList
          notifications={priorityNotifications}
          loading={false}
          error={null}
          viewedIds={viewedIds}
          onToggleViewed={handleToggleViewed}
        />
      )}
    </Container>
  );
}
