#!/usr/bin/env node

/**
 * Test script to demonstrate Priority Inbox System
 * Uses sample data to show the notification prioritization working
 */

import { sampleNotifications } from './testData.js';
import { calculatePriority } from './notificationSystem.js';

function formatNotification(notification, index) {
  return `
#${index + 1} [${notification.Type}] - Priority: ${notification.priority.toFixed(2)}
ID: ${notification.ID}
Message: ${notification.Message}
Time: ${notification.Timestamp}
---`;
}

function displayTestNotifications(topN = 10) {
  console.log(`\n📬 PRIORITY INBOX - Top ${topN} Notifications (Demo)\n`);
  console.log('='.repeat(70));

  // Calculate priority for each notification
  const prioritizedNotifications = sampleNotifications.map(notification => ({
    ...notification,
    priority: calculatePriority(notification)
  }));

  // Sort by priority (descending)
  const sortedNotifications = prioritizedNotifications.sort((a, b) => 
    b.priority - a.priority
  );

  // Display top N
  const topNotifications = sortedNotifications.slice(0, topN);
  
  topNotifications.forEach((notification, index) => {
    console.log(formatNotification(notification, index));
  });

  console.log('='.repeat(70));
  console.log(`\n✅ Total displayed: ${topNotifications.length} / ${sampleNotifications.length} notifications`);
  console.log('\n📊 Priority Calculation Details:');
  console.log('   • Type Weight: Placement(3x) > Result(2x) > Event(1x)');
  console.log('   • Recency: Newer notifications score higher');
  console.log('   • Formula: (TypeWeight × 100) + RecencyScore');
  
  return topNotifications;
}

// Get top N from command line argument, default to 10
const topN = parseInt(process.argv[2]) || 10;

// Validate input
if (isNaN(topN) || topN < 1) {
  console.error('Invalid input. Please provide a number >= 1');
  process.exit(1);
}

displayTestNotifications(topN);
