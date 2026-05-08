import { useState } from 'react';
import { Card, CardContent, Chip, Box, Typography, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './NotificationCard.css';

export default function NotificationCard({ notification, isViewed, onToggleViewed }) {
  const getTypeColor = (type) => {
    const colors = {
      'Placement': '#10b981',
      'Result': '#3b82f6',
      'Event': '#f59e0b'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Placement': '💼',
      'Result': '📊',
      'Event': '📅'
    };
    return icons[type] || '📌';
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <Card className={`notification-card ${isViewed ? 'viewed' : 'new'}`}>
      <CardContent>
        <Box className="notification-header">
          <div className="notification-type-section">
            <Chip
              label={`${getTypeIcon(notification.Type)} ${notification.Type}`}
              sx={{
                backgroundColor: getTypeColor(notification.Type),
                color: 'white',
                fontWeight: 600
              }}
            />
            {!isViewed && <span className="new-badge">NEW</span>}
          </div>
          <IconButton
            size="small"
            onClick={() => onToggleViewed(notification.ID)}
            title={isViewed ? 'Mark as unread' : 'Mark as read'}
          >
            {isViewed ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </Box>

        <Typography variant="h6" className="notification-message">
          {notification.Message}
        </Typography>

        <Box className="notification-footer">
          <span className="notification-id">
            ID: {notification.ID.substring(0, 12)}...
          </span>
          <span className="notification-time">
            {formatTime(notification.Timestamp)}
          </span>
        </Box>
      </CardContent>
    </Card>
  );
}
