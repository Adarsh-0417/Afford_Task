#!/usr/bin/env node

/**
 * Main script to run the Priority Inbox Notification System
 * Usage: node main.js [topN]
 * Example: node main.js 10
 */

import { displayTopNotifications } from './notification_app_be/notificationSystem.js';

// Get top N from command line argument, default to 10
const topN = parseInt(process.argv[2]) || 10;

// Validate input
if (isNaN(topN) || topN < 1) {
  console.error('Invalid input. Please provide a number >= 1');
  process.exit(1);
}

// Run the notification system
displayTopNotifications(topN).catch(error => {
  console.error('Failed to display notifications:', error);
  process.exit(1);
});
