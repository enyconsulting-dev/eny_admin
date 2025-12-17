# Dashboard

## 📊 Overview

The Dashboard serves as the central hub of the Eny Consulting Admin platform, providing administrators with a comprehensive overview of platform activity, key metrics, and quick access to various management features.

## 🎯 Purpose

- **Quick insights** into platform performance
- **Visual representation** of activity trends
- **Fast navigation** to specific management areas
- **Real-time statistics** on events and assessments

## 🔑 Key Features

### 1. **Statistics Overview**

- Real-time platform metrics
- Visual data representation
- Trend analysis with charts

### 2. **Activity Tracking**

The dashboard displays assessment activity over time:

- Monthly created vs completed assessments
- Interactive area charts with two data series:
  - Created assessments (primary color)
  - Completed assessments (secondary color)
- Historical data from January to June

### 3. **Event Cards** (When Events Are Active)

Quick view of active events with:

- Event title and description
- Featured image
- Status badges (Active, Draft, Completed)
- Attendee count
- Number of locations
- Event date
- Quick navigation to event details

### 4. **Quick Actions**

- Navigate to event management
- View detailed analytics
- Access assessment tools

## 🎨 UI Components

### Summary Cards

Display key metrics in grid layout:

- Responsive design (1 column mobile, 2+ on larger screens)
- Color-coded status indicators
- Icon representations

### Charts

- **Area Chart**: Shows assessment creation vs completion trends
- **Gradient fills**: Visual distinction between data series
- **Responsive**: Adapts to screen size
- **Legend**: Clear labeling of data series

### Event Cards

- **Card Layout**: Clean, modern design
- **Image Display**: Event hero images
- **Status Badges**:
  - 🟢 Active (Green)
  - 🟡 Draft (Yellow)
  - 🔵 Completed (Blue)
- **Metadata Display**: Attendees, locations, dates
- **Click-to-navigate**: Direct access to event details

## 📊 Data Visualization

### Assessment Activity Chart

```
Metrics Displayed:
- X-axis: Months (Jan - Jun)
- Y-axis: Number of assessments
- Series 1: Created assessments
- Series 2: Completed assessments
```

**Sample Data Structure:**

```typescript
{
  month: "Jan",
  created: 20,
  completed: 18
}
```

## 🎯 Status Indicators

### Color System

| Status    | Color  | Badge               |
| --------- | ------ | ------------------- |
| Active    | Green  | Success variant     |
| Draft     | Yellow | Secondary variant   |
| Completed | Blue   | Default variant     |
| Cancelled | Red    | Destructive variant |

### Icons

- ✅ CheckCircle2 - Active/Completed
- 📝 FileText - Draft
- ⏸️ PauseCircle - On hold
- ❌ XCircle - Cancelled

## 🔄 User Interactions

### Navigation

1. **Event Cards**: Click to view event details
   - Route: `/event/:eventId`
2. **Create Event Button**: Navigate to event creation
   - Route: `/events/create`

### Refresh

- Manual refresh capability for real-time updates
- Automatic data fetching on mount

## 📱 Responsive Design

### Mobile (< 640px)

- Single column layout
- Stacked cards
- Collapsible charts
- Touch-optimized interactions

### Tablet (640px - 1024px)

- 2-column grid for cards
- Full-width charts
- Optimized spacing

### Desktop (> 1024px)

- 3-column grid for events
- Side-by-side statistics
- Expanded chart views

## 🛠️ Technical Details

### Route

```
Path: /dashboard
Protected: Yes (requires authentication)
Component: Dashboard.tsx
```

### Dependencies

- `@tanstack/react-query` - Data fetching
- `recharts` - Chart visualization
- `lucide-react` - Icons
- `date-fns` - Date formatting

### State Management

- Local state for UI controls
- Redux for authentication
- React Query for server state

### Error Handling

- Loading states with skeletons
- Error boundaries
- Fallback UI for data fetch failures

## 🔐 Access Control

**Required Permission:** Authenticated admin user

**Available to:**

- All authenticated users
- No role-specific restrictions

## 🚀 Future Enhancements

1. **Customizable Dashboards**

   - User-specific widget arrangement
   - Saved dashboard layouts
   - Role-based default views

2. **Advanced Analytics**

   - Export capabilities
   - Date range selectors
   - Custom metric tracking

3. **Real-time Updates**

   - WebSocket integration
   - Live activity feed
   - Push notifications

4. **Performance Metrics**
   - System health indicators
   - API response times
   - User activity heatmaps

## 📝 Notes

- The dashboard uses mock data for events when the Events feature is enabled
- Chart data is currently static but designed for dynamic data integration
- All navigation routes are fully functional and protected
