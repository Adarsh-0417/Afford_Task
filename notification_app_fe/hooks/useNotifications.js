import { useState, useEffect } from 'react';
import axios from 'axios';
import { sampleNotifications } from '../../src/testData.js';

const API_URL = 'http://4.224.186.213/evaluation-service/notifications';

export function useNotifications(limit = 10, page = 1, notificationType = '') {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit);
        if (page) params.append('page', page);
        if (notificationType) params.append('notification_type', notificationType);

        try {
          // Try live API first
          const response = await axios.get(`${API_URL}?${params}`, {
            timeout: 5000
          });
          
          if (response.data && response.data.notifications) {
            setNotifications(response.data.notifications);
          } else {
            throw new Error('Invalid API response');
          }
        } catch (apiError) {
          // Fallback to test data if API fails
          console.warn('API unavailable, using test data:', apiError.message);
          let filtered = [...sampleNotifications];
          
          if (notificationType) {
            filtered = filtered.filter(n => n.Type === notificationType);
          }
          
          const startIdx = (page - 1) * limit;
          filtered = filtered.slice(startIdx, startIdx + limit);
          
          setNotifications(filtered);
        }
      } catch (err) {
        setError('Failed to load notifications');
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [limit, page, notificationType]);

  return { notifications, loading, error };
}

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

export function getTopPriorityNotifications(notifications, topN = 10) {
  return notifications
    .map(notification => ({
      ...notification,
      priority: calculatePriority(notification)
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, topN)
    .map(({ priority, ...notification }) => notification); // Remove priority field for display
}
