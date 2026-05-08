/**
 * Bridge between notificationSystem.js and React
 * Exports functions to use in React components
 */

import { sampleNotifications } from './testData.js';

export function calculatePriority(notification) {
  const typeWeights = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
  };

  const typeWeight = typeWeights[notification.Type] || 1;
  const timestamp = new Date(notification.Timestamp).getTime();
  const now = Date.now();
  const recencyMinutes = (now - timestamp) / (1000 * 60);
  const recencyScore = 1000 / (1 + recencyMinutes);
  const priority = (typeWeight * 100) + recencyScore;

  return priority;
}

export function getTopNotifications(topN = 10) {
  const prioritizedNotifications = sampleNotifications.map(notification => ({
    ...notification,
    priority: calculatePriority(notification)
  }));

  const sortedNotifications = prioritizedNotifications.sort((a, b) => 
    b.priority - a.priority
  );

  return sortedNotifications.slice(0, topN);
}

export function getTypeColor(type) {
  const colors = {
    'Placement': '#10b981',   // Green
    'Result': '#3b82f6',      // Blue
    'Event': '#f59e0b'        // Orange
  };
  return colors[type] || '#6b7280';
}

export function getTypeLabel(type) {
  const labels = {
    'Placement': '💼 Placement',
    'Result': '📊 Result',
    'Event': '📅 Event'
  };
  return labels[type] || '📌 ' + type;
}

export function formatTime(timestamp) {
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
}
