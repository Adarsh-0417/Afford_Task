# Priority Inbox Notification System

A campus notification management system that intelligently prioritizes and displays the most important unread notifications using a weighted priority algorithm.

## 🎯 Features

- **Smart Priority Algorithm**: Ranks notifications based on type (Placement > Result > Event) and recency
- **Top N Display**: Shows only the most important N notifications (configurable)
- **API Integration**: Fetches notifications from protected API endpoint
- **Continuous Updates**: Handles new notifications arriving continuously
- **Demo Mode**: Test offline with sample data
- **Production Ready**: Production-grade code with error handling

## 📋 Project Files

| File | Purpose |
|------|---------|
| `notificationSystem.js` | Core logic - priority calculation & API integration |
| `main.js` | Production entry point (requires API authentication) |
| `test.js` | Demo script using sample notifications |
| `testData.js` | 12 sample notifications for testing |
| `Notification_System_Design.md` | Detailed design documentation |
| `package.json` | Project dependencies & scripts |

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation
```bash
npm install
```

### Core Components

1. **Notification Fetcher**
   - Fetches from protected API endpoint
   - Handles authentication headers
   - Error handling for network issues

2. **Priority Calculator**
   - O(n) computation for all notifications
   - Calculates weighted priority score
   - Handles recency decay

3. **Sorter**
   - O(n log n) sorting by priority
   - Returns top N results
   - Memory efficient

## 💡 Handling Continuous Notifications

The system efficiently handles new notifications arriving:

1. **New notification arrives** → Scores 400+ with high type weight
2. **Immediately rises to top** due to high priority
3. **Other notifications' recency decays** naturally over time
4. **System remains stable** as older items fall lower


Built as a solution for the Afford Medical Technologies Private Limited evaluation project.

---

**Last Updated**: May 8, 2026
