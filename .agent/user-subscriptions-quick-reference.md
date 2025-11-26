# User Subscriptions - Quick Reference

## Navigation Routes

### Subscription Plans (existing)
- `/jobs/subscriptions` - List all subscription plans (templates)
- `/jobs/subscriptions/create` - Create new subscription plan
- `/jobs/subscriptions/:id` - View/edit subscription plan

### User Subscriptions (NEW)
- `/jobs/user-subscriptions` - Manage all user subscriptions
- Can be accessed from:
  - Job Platform overview card
  - User profile "View all subscriptions" button
  - User profile subscription card eye icon

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/admin/jbs/subscriptions/statistics` | Get subscription stats |
| GET | `/admin/jbs/subscriptions` | List all subscriptions (paginated) |
| GET | `/admin/jbs/subscriptions/:id` | Get subscription details |
| PATCH | `/admin/jbs/subscriptions/:id` | Update subscription status |
| GET | `/admin/jbs/subscriptions/user/:userId` | Get user's subscriptions |

## Components Added

### UserSubscriptions.tsx
Main management page with:
- Statistics cards (4 metrics)
- Searchable subscription table
- Detailed view dialog
- Status management
- Pagination

### JobUserDetailExpanded.tsx (modified)
Added subscription history card showing:
- Recent subscriptions (max 5)
- Plan details and status
- Quick navigation to full list

## Key Features

### Search & Filter
- Search by user name, email, or plan name
- Real-time filtering

### Status Management
- Active (green badge)
- Canceled (red badge)
- Expired (gray badge)
- Pending Payment (amber badge)
- Change status via dropdown in detail view

### Pagination
- Default: 10 items per page
- Navigate with Previous/Next buttons
- Shows current page and total pages

### Statistics Dashboard
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Total     │   Active    │  Expired    │   Pending   │
│     150     │     120     │      15     │      15     │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

## Data Flow

```
User Profile → Subscription History Card → Recent Subscriptions
                        ↓
              View All Subscriptions Button
                        ↓
           User Subscriptions Management Page
                        ↓
              Search, View Details, Update Status
```

## Integration Points

1. **Job Platform Overview**
   - Added 5th card for user subscriptions
   - Links to `/jobs/user-subscriptions`

2. **User Profile Page**
   - New subscription history card
   - Shows up to 5 recent subscriptions
   - Link to view all user's subscriptions

3. **API Service**
   - 5 new service methods
   - All using `jbsApiClient`
   - Proper error handling

## Status Update Flow

1. Admin opens subscription detail dialog
2. Selects new status from dropdown
3. Mutation triggered automatically
4. Success toast notification
5. Cache invalidated and refetched
6. Dialog closes
7. Statistics updated

## Empty States

### No Subscriptions
- User Subscriptions page: "No subscriptions found"
- User profile card: "No subscription history found"

### Loading States
- Spinner displayed while fetching
- Prevents interaction during load

## Quick Commands

### View all user subscriptions
```
Navigate to: /jobs/user-subscriptions
```

### View specific user's subscriptions
```
Navigate to: /jobs/users/:userId
Scroll to: Subscription History card
```

### Update subscription status
```
1. Open user subscriptions page
2. Click "View" on subscription
3. Select new status from dropdown
```