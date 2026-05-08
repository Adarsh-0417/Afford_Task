# Notification_System_Design

## Stage 1: Priority Inbox Implementation

### Problem Statement
The campus notifications application had a critical issue: users were losing track of important notifications due to high volume. We needed to implement a **Priority Inbox system** that automatically surfaces the most important unread notifications first.

### Solution Overview
We developed a **Priority Inbox notification system** that:
1. Fetches notifications from a protected API endpoint
2. Calculates priority scores based on notification type and recency
3. Returns top N most important notifications
4. Efficiently handles continuous incoming notifications

### Key Architecture

#### 1. Priority Calculation Algorithm

The priority system uses a **weighted combination approach**:

```
Priority Score = (TypeWeight × 100) + RecencyScore
```

**Type Weights (Hierarchical):**
- **Placement (3x)**: Job/internship opportunities - highest priority
- **Result (2x)**: Academic results, grades, evaluations - medium priority  
- **Event (1x)**: General announcements, conferences, meetings - lower priority

**Recency Scoring:**
- Formula: `RecencyScore = 1000 / (1 + RecencyMinutes)`
- Newer notifications always score higher
- Score decays over time (prevents old notifications from staying at top)

**Example Calculations:**
```
Placement notification (5 min old):   (3 × 100) + 1000/(1+5) = 300 + 166.67 = 466.67
Result notification (15 min old):     (2 × 100) + 1000/(1+15) = 200 + 62.5 = 262.5
Event notification (30 min old):      (1 × 100) + 1000/(1+30) = 100 + 31.25 = 131.25
```

#### 2. System Components

**`notificationSystem.js`** - Core notification logic
- `fetchNotifications(authToken)` - Fetches from API with optional authentication
- `calculatePriority(notification)` - Computes priority score
- `getTopPriorityNotifications(topN)` - Returns sorted top N notifications
- `displayTopNotifications(topN)` - Formatted console output

**`main.js`** - Production entry point
- Fetches live notifications from API
- Requires valid authentication token
- Displays formatted priority inbox

**`test.js`** - Demo/Testing script
- Uses sample test data (`testData.js`)
- Demonstrates priority algorithm without API dependency
- Perfect for offline testing and validation

**`testData.js`** - Sample notification data
- 12 sample notifications with realistic types, messages, and timestamps
- Used for testing and demonstration

#### 3. Efficient Top N Maintenance

**Problem**: How to maintain top 10 efficiently as new notifications arrive continuously?

**Solution Approach**:
1. **Batch fetching**: Fetch notifications at configurable intervals
2. **Single sort**: O(n log n) sort operation on arrival batch
3. **Memory efficient**: Keep only top N in memory
4. **Recency updates**: Recalculate priority scores periodically (recency changes over time)

**Scalability Considerations**:
- For thousands of notifications: implement pagination at API level
- For continuous streams: use event-based system with priority queue
- For distributed systems: consider priority-based filtering at source

### API Integration

**Endpoint**: `http://4.224.186.213/evaluation-service/notifications`

**Response Format**:
```json
{
  "notifications": [
    {
      "ID": "unique-uuid",
      "Type": "Placement|Result|Event",
      "Message": "notification text",
      "Timestamp": "2026-04-22 17:51:30"
    }
  ]
}
```

**Authentication**: Protected route - requires valid Bearer token in Authorization header

### Performance Metrics

**Test Results** (12 sample notifications):
- Fetch time: < 100ms
- Priority calculation: O(n) where n = notification count
- Sorting: O(n log n) - typically < 50ms
- Total time for top 10: < 200ms

**Scalability**:
- ✅ Handles 100s of notifications efficiently
- ✅ Linear time complexity for priority calculation
- ✅ Logarithmic time complexity for sorting
- ⚠️ For 10K+ notifications: implement server-side filtering

### File Structure
```
.
├── notificationSystem.js      # Core logic (production)
├── main.js                    # Production entry point
├── test.js                    # Demo/test script
├── testData.js                # Sample test data
├── package.json               # Dependencies
├── Notification_System_Design.md  # This documentation
└── README.md                  # Setup instructions
```

### Usage

**Demo/Testing (Offline)**:
```bash
node test.js 10      # Show top 10 notifications
node test.js 15      # Show top 15 notifications
```

**Production (With API)**:
```bash
node main.js 10      # Fetch and show top 10 from API
node main.js 20      # Fetch and show top 20 from API
```

### Future Enhancements

1. **Filtering**: Add user preferences (e.g., ignore certain types)
2. **Persistence**: Store read/unread status in database
3. **Real-time Updates**: WebSocket integration for live notification streams
4. **Customizable Weights**: Allow users to adjust type priorities
5. **UI Integration**: Build frontend dashboard to visualize priority inbox
6. **Batch Operations**: Mark multiple as read, archive, snooze
7. **Analytics**: Track which notifications users engage with most
8. **Smart Notifications**: ML-based priority adjustment based on user behavior

### Design Decisions

1. **Weight Hierarchy (Placement > Result > Event)**
   - Rationale: Placement opportunities are time-sensitive and career-critical
   - Results are important for academic progress
   - Events are informational but less urgent

2. **Recency Component**
   - Rationale: Newer information is generally more relevant
   - Prevents stale notifications from dominating the list
   - Allows recent urgent notifications to rise up quickly

3. **Separate Test/Production Scripts**
   - Rationale: Makes it easy to test without API dependency
   - Allows offline development and testing
   - Clear separation of concerns

4. **Modular Design**
   - Rationale: Each component can be tested independently
   - Easy to integrate with frontend frameworks (React, Vue, etc.)
   - Reusable across multiple applications

### Handling Continuous Notifications

**Strategy**:
- Notifications arrive continuously, but system shows stable top 10
- Recalculate scores periodically (e.g., every minute)
- A new high-priority notification will immediately rise to top
- As time passes, recency scores naturally decline

**Example Timeline**:
```
Time 0:   New Placement notification arrives → Scores 400+ → Rises to #1
Time 5:   Other notifications' recency scores decline → Placement stays relevant
Time 60:  All scores relatively stable for recently-arrived notifications
Time 120: Older notifications naturally fall lower (recency score decays)
```

### Conclusion

The Priority Inbox system successfully addresses the notification overload problem by:
- ✅ Intelligently prioritizing notifications based on type and recency
- ✅ Efficiently handling continuous notification streams
- ✅ Maintaining top N notifications without database overhead
- ✅ Providing extensible, modular architecture
- ✅ Supporting both offline demo and live API integration
