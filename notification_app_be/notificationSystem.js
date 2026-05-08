/**
 * Notification Priority System
 * Fetches notifications from API and returns top N by priority
 * Priority = weight (placement > result > event) + recency
 */

const NOTIFICATION_API = 'http://4.224.186.213/evaluation-service/notifications';

/**
 * Calculate priority score for a notification
 * Higher score = higher priority
 * 
 * Weight hierarchy:
 * - Placement: 3x multiplier
 * - Result: 2x multiplier
 * - Event: 1x multiplier
 * 
 * Recency: Newer notifications get higher score (based on timestamp)
 */
function calculatePriority(notification) {
  const typeWeights = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
  };

  // Get type weight (default to 1 if type not found)
  const typeWeight = typeWeights[notification.Type] || 1;

  // Parse timestamp to get recency score
  // More recent = higher score
  const timestamp = new Date(notification.Timestamp).getTime();
  const now = Date.now();
  const recencyMinutes = (now - timestamp) / (1000 * 60);
  
  // Recency score: decay over time (newer notifications score higher)
  // Formula: 1000 / (1 + recency_minutes) ensures newer items score higher
  const recencyScore = 1000 / (1 + recencyMinutes);

  // Final priority = (type_weight * 100) + recency_score
  // Type weight is more important (100x multiplier), recency is tiebreaker
  const priority = (typeWeight * 100) + recencyScore;

  return priority;
}

/**
 * Fetch notifications from API
 * @param {string} authToken - Optional authentication token for protected API
 */
async function fetchNotifications(authToken = null) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    // Add auth token if provided
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(NOTIFICATION_API, { headers });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

/**
 * Get top N priority notifications
 * @param {number} topN - Number of notifications to return (default: 10)
 */
async function getTopPriorityNotifications(topN = 10) {
  try {
    const notifications = await fetchNotifications();

    if (notifications.length === 0) {
      console.log('No notifications found');
      return [];
    }

    // Calculate priority for each notification
    const prioritizedNotifications = notifications.map(notification => ({
      ...notification,
      priority: calculatePriority(notification)
    }));

    // Sort by priority (descending - highest first)
    const sortedNotifications = prioritizedNotifications.sort((a, b) => 
      b.priority - a.priority
    );

    // Return top N
    return sortedNotifications.slice(0, topN);
  } catch (error) {
    console.error('Error getting top priority notifications:', error);
    return [];
  }
}

/**
 * Format notification for display
 */
function formatNotification(notification, index) {
  return `
#${index + 1} [${notification.Type}] - Priority: ${notification.priority.toFixed(2)}
ID: ${notification.ID}
Message: ${notification.Message}
Time: ${notification.Timestamp}
---`;
}

/**
 * Display notifications in a readable format
 */
async function displayTopNotifications(topN = 10) {
  console.log(`\n📬 PRIORITY INBOX - Top ${topN} Notifications\n`);
  console.log('='.repeat(60));

  const topNotifications = await getTopPriorityNotifications(topN);

  if (topNotifications.length === 0) {
    console.log('No notifications to display');
    return topNotifications;
  }

  topNotifications.forEach((notification, index) => {
    console.log(formatNotification(notification, index));
  });

  console.log('='.repeat(60));
  console.log(`\nTotal displayed: ${topNotifications.length}`);
  
  return topNotifications;
}

export {
  fetchNotifications,
  getTopPriorityNotifications,
  displayTopNotifications,
  calculatePriority,
  NOTIFICATION_API
};
