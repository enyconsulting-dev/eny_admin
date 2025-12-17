# Events Management

## 📚 Overview

The Events Management system provides comprehensive tools for creating, managing, and tracking events with location-based registration and attendee management. This feature is currently **commented out** in the navigation but remains fully functional in the codebase.

> **Note**: To enable this feature, uncomment the Events navigation item in `src/components/AppSidebar.tsx`

## 🎯 Purpose

- **Event Creation**: Plan and configure events
- **Location Management**: Multi-location support for events
- **Attendee Tracking**: Monitor registrations and attendance
- **Communication**: Send notifications to attendees
- **Analytics**: Track event performance and engagement

## 🗺️ System Architecture

The Events system consists of four main sections:

1. **Events Overview** - Dashboard with all events
2. **Event Creation** - Create/Edit event details
3. **Event Detail** - Individual event management
4. **Location Users** - Manage attendees per location

---

## 📖 Feature Documentation

## 1. Events Overview

**Route:** `/events`  
**Component:** `Events.tsx`

### Purpose

Central hub for viewing and managing all events with quick access to creation and details.

### Features

#### Event Cards Display

Each event shown as a card with:

- Event title
- Description (truncated)
- Featured image
- Status badge (Upcoming, Ongoing, Completed, Cancelled)
- Date and time
- Total attendees count
- Number of locations
- Quick actions (View, Edit, Delete)

#### Statistics (Future Enhancement)

- Total events
- Active events
- Total attendees
- Upcoming events

#### Actions

- **Create Event**: Navigate to creation form
- **View Details**: Open event detail page
- **Edit Event**: Modify event configuration
- **Delete Event**: Remove event (with confirmation)
- **Filter by Status**: Upcoming, Ongoing, Completed, Cancelled
- **Search**: By event title or description

---

## 2. Event Creation & Editing

**Routes:**

- Create: `/events/create`
- Edit: `/events/edit/:id`

**Component:** `CreateEvent.tsx`

### Purpose

Comprehensive form for creating new events or modifying existing ones.

### Form Sections

#### 1️⃣ Basic Information

**Event Title** (Required)

- Validation: 3-200 characters
- Unique title recommended
- Example: "Tech Innovation Summit 2024"

**Description** (Optional)

- Rich text editor
- Max 5000 characters
- Supports formatting
- Include key details

**Event Type**

- Conference
- Workshop
- Seminar
- Networking
- Training
- Webinar
- Other

#### 2️⃣ Date & Time

**Start Date & Time** (Required)

- Date picker
- Time picker
- Timezone selector
- Must be in future (for new events)

**End Date & Time** (Required)

- Must be after start date
- Duration calculated automatically
- Multi-day event support

**Registration Deadline** (Optional)

- Cutoff for registrations
- Must be before start date
- Email reminders before deadline

#### 3️⃣ Location Configuration

**Event Format**

- ☑️ In-Person
- ☑️ Virtual
- ☑️ Hybrid

**Physical Locations** (if applicable)
Add multiple venues:

- **Location Name**: Venue identifier
- **Address**: Full street address
- **City**: City name
- **Country**: Country selector
- **Capacity**: Maximum attendees
- **Additional Info**: Parking, accessibility, etc.

**Virtual Details** (if applicable)

- **Platform**: Zoom, Teams, Meet, etc.
- **Meeting Link**: Generated or custom
- **Meeting ID**: Optional
- **Passcode**: Optional
- **Instructions**: How to join

#### 4️⃣ Registration Settings

**Registration Options**

- ☑️ Open Registration
- ☑️ Approval Required
- ☑️ Invitation Only
- ☑️ Paid Event

**Ticket Pricing** (if paid)

- Free
- Single price
- Tiered pricing (Early bird, Regular, VIP)
- Currency selector
- Payment methods

**Registration Fields**
Configure what attendees must provide:

- ✓ Name (required)
- ✓ Email (required)
- □ Phone number
- □ Company/Organization
- □ Job Title
- □ Dietary Restrictions
- □ Special Accommodations
- □ Custom Questions

**Capacity Management**

- Overall event capacity
- Per-location capacity
- Waitlist enabled/disabled
- Automatic confirmation

#### 5️⃣ Media & Assets

**Event Banner**

- Upload hero image
- Recommended: 1920x1080px
- Formats: JPG, PNG, WebP
- Max size: 5MB

**Additional Images**

- Gallery images
- Speaker photos
- Venue photos
- Sponsor logos

**Attachments**

- Event agenda (PDF)
- Speaker bios
- Venue maps
- Sponsor materials

#### 6️⃣ Communication

**Email Templates**

- Confirmation email
- Reminder emails (1 day, 1 week before)
- Follow-up email
- Cancellation email

**Notification Settings**

- Email notifications enabled/disabled
- SMS notifications (if integrated)
- Push notifications
- Automatic vs manual sends

#### 7️⃣ Advanced Settings

**SEO & Sharing**

- Meta title
- Meta description
- Social media preview
- Custom URL slug

**Privacy Settings**

- Public listing
- Private/Invite-only
- Searchable
- Show attendee list

**Integrations**

- Calendar export (iCal)
- Social media sharing
- Webhook URL
- Analytics tracking code

### Validation & Save

**Validation Rules**

```typescript
{
  title: min 3, max 200 chars, required
  startDate: future date, required
  endDate: after startDate, required
  locations: minimum 1 if in-person
  virtualLink: required if virtual
  capacity: positive number
  registrationDeadline: before startDate
}
```

**Save Options**

- **Save as Draft**: Store without publishing
- **Publish**: Make publicly available
- **Schedule Publish**: Auto-publish at specific time
- **Save & Preview**: Review before publishing

---

## 3. Event Detail Page

**Route:** `/event/:eventId`  
**Component:** `EventDetail.tsx`

### Purpose

Comprehensive event overview with management tools and real-time statistics.

### Header Section

#### Event Information

- Event title
- Status badge (with color coding)
- Event dates (formatted)
- Location(s) summary
- Total registrations
- Action buttons

#### Actions

- **Edit Event**: Modify event details
- **Publish/Unpublish**: Toggle visibility
- **Cancel Event**: Cancel with notifications
- **Delete Event**: Permanent removal
- **Export Data**: Download attendee list
- **Send Update**: Notify all attendees

### Statistics Dashboard

#### Key Metrics Cards

**Total Registrations**

- Count of all registered attendees
- Icon: Users
- Trend indicator (vs last event)

**Checked In**

- Attendees who checked in
- Icon: CheckCircle
- Percentage of total

**Capacity Utilization**

- Filled spots / Total capacity
- Icon: PieChart
- Progress bar visual

**Revenue** (if paid)

- Total ticket sales
- Icon: DollarSign
- Currency formatted

#### Registration Timeline

Chart showing registrations over time:

- Line chart
- Daily/weekly breakdown
- Early bird vs regular tickets
- Waitlist conversions

### Locations Section

#### Location Cards

Each location displays:

- **Location Name**: Venue identifier
- **Address**: Full address with map link
- **Capacity**: Current / Maximum
- **Status**: Open, Full, Closed
- **Check-In Count**: Live count
- **Actions**:
  - View Attendees
  - Edit Location
  - Close Registration
  - Delete Location

#### Location Management

- Add new locations
- Edit location details
- Set individual capacities
- Close location for registration
- Transfer attendees between locations

Click location card → Navigate to Location Users page

### Attendees Overview

#### Quick Stats

- Total registered
- Checked in
- Pending approval (if applicable)
- Cancelled registrations
- Waitlisted

#### Recent Registrations

Table showing latest attendees:

- Name
- Email
- Location selected
- Registration date
- Status (Confirmed, Pending, Cancelled)
- Check-in status

#### Actions

- View all attendees
- Export attendee list (CSV, Excel)
- Send bulk email
- Bulk check-in
- Filter by status/location

### Communication Hub

#### Message Center

- Send announcement to all attendees
- Location-specific messages
- Schedule reminder emails
- View message history

#### Email Templates

- Access configured templates
- Edit templates
- Preview before send
- Track open/click rates

### Event Timeline

#### Milestones

- Event created
- First registration
- Registration milestones (25%, 50%, 75%, 100%)
- Published date
- Event start
- Event end

#### Upcoming Tasks

- Registration deadline
- Send reminder emails
- Event day
- Follow-up email scheduled

---

## 4. Location Users Page

**Route:** `/event/:eventId/location/:locationId`  
**Component:** `LocationUsers.tsx`

### Purpose

Detailed attendee management for a specific event location with check-in capabilities.

### Location Header

#### Location Information

- Location name
- Full address
- Current capacity (x / y)
- Status badge
- Event name (breadcrumb)
- Back to event button

### Attendee Management

#### Statistics Cards

**Total Registered**

- Attendees for this location
- Icon: Users
- Percentage of total

**Checked In**

- Successfully checked in
- Icon: CheckCircle
- Real-time count

**Pending**

- Awaiting approval/confirmation
- Icon: Clock
- Action required indicator

**No-Shows**

- Registered but didn't attend
- Icon: UserX
- Calculated post-event

#### Attendee Table

**Display Columns:**
| Column | Actions |
|--------|---------|
| Name | Click to view details |
| Email | Copy email |
| Phone | Call/SMS links |
| Registration Date | Sort by date |
| Status | Filter by status |
| Check-In Time | Sort by check-in |
| Actions | Check-in, Edit, Delete |

**Status Values:**

- ✅ Confirmed - Registration confirmed
- ⏳ Pending - Awaiting approval
- ✔️ Checked In - Attended event
- ❌ Cancelled - Registration cancelled
- 👤 Waitlisted - On waitlist
- 🚫 No-Show - Didn't attend

#### Search & Filter

- **Search**: By name or email
- **Status Filter**: All statuses dropdown
- **Check-In Filter**: Checked in / Not checked in
- **Date Filter**: Registration date range
- **Export**: Filtered results to CSV

### Check-In System

#### Manual Check-In

- Search for attendee
- Click "Check In" button
- Confirm action
- Timestamp recorded
- Status updated
- Welcome message displayed (optional)

#### Bulk Check-In

- Select multiple attendees
- Bulk check-in action
- Confirmation dialog
- All updated simultaneously

#### Check-In Methods

- Manual (admin dashboard)
- QR code scanning (future)
- Self-check-in kiosk (future)
- Mobile app check-in (future)

### Attendee Actions

#### Individual Actions

- **View Details**: See full registration info
- **Edit Registration**: Modify attendee details
- **Change Location**: Transfer to another venue
- **Send Email**: Contact attendee
- **Mark as Checked In**: Manual check-in
- **Cancel Registration**: Remove from event
- **Add to Waitlist**: If location full

#### Bulk Actions

- Select multiple attendees
- Bulk check-in
- Bulk location transfer
- Bulk email
- Bulk status change
- Bulk delete

### Communication

#### Email Options

- Email individual attendee
- Email selected attendees
- Email all attendees at location
- Use templates or custom message

#### Message Templates

- Welcome/Confirmation
- Event reminder
- Location directions
- Last-minute changes
- Thank you/Follow-up

---

## 🎯 User Workflows

### Creating an Event

**Workflow:**

1. Navigate to `/events`
2. Click "Create Event"
3. Fill in basic information
4. Configure date and time
5. Add location(s)
6. Set up registration settings
7. Upload event banner
8. Configure email templates
9. Review and save as draft
10. Preview event page
11. Publish when ready

### Managing Registrations

**Workflow:**

1. Go to event detail page
2. Review registration statistics
3. Check attendee list
4. Approve pending registrations (if required)
5. Send confirmation emails
6. Monitor capacity
7. Close registration when full

### Event Day Operations

**Workflow:**

1. Open location users page
2. Set up check-in station
3. Search attendees as they arrive
4. Check them in individually or bulk
5. Handle walk-ins (if allowed)
6. Monitor attendance in real-time
7. Send any last-minute updates

### Post-Event Tasks

**Workflow:**

1. Mark event as completed
2. Review final attendance numbers
3. Export attendee data
4. Send thank you emails
5. Collect feedback (if integrated)
6. Generate event report
7. Archive event

---

## 🛠️ Technical Details

### API Endpoints

```typescript
// Events
GET    /events                  - List all events
POST   /events                  - Create event
GET    /events/:id              - Get event detail
PATCH  /events/:id              - Update event
DELETE /events/:id              - Delete event
POST   /events/:id/publish      - Publish event
POST   /events/:id/cancel       - Cancel event

// Locations
POST   /events/:eventId/locations              - Add location
GET    /events/:eventId/locations/:locationId  - Get location
PATCH  /events/:eventId/locations/:locationId  - Update location
DELETE /events/:eventId/locations/:locationId  - Delete location

// Attendees
GET    /events/:eventId/attendees               - List attendees
GET    /events/:eventId/locations/:locationId/users - Location attendees
POST   /events/:eventId/register                - Register attendee
PATCH  /attendees/:id                          - Update attendee
DELETE /attendees/:id                          - Cancel registration
POST   /attendees/:id/checkin                   - Check in attendee
POST   /attendees/bulk-checkin                  - Bulk check in

// Communication
POST   /events/:eventId/send-update             - Send announcement
POST   /events/:eventId/send-reminder           - Send reminders
```

### Data Models

```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  status: "draft" | "published" | "ongoing" | "completed" | "cancelled";
  format: "in-person" | "virtual" | "hybrid";
  locations: Location[];
  virtualDetails?: VirtualEventDetails;
  capacity: number;
  registrationDeadline?: Date;
  registrationSettings: RegistrationSettings;
  bannerImage?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  currentRegistrations: number;
  status: "open" | "full" | "closed";
}

interface Attendee {
  id: string;
  eventId: string;
  locationId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: AttendeeStatus;
  registrationDate: Date;
  checkInTime?: Date;
  additionalInfo: object;
}

type AttendeeStatus =
  | "confirmed"
  | "pending"
  | "checked-in"
  | "cancelled"
  | "waitlisted"
  | "no-show";
```

---

## 🚀 Future Enhancements

1. **QR Code Check-In**

   - Generate unique QR codes per attendee
   - Mobile scanner app
   - Instant check-in

2. **Advanced Analytics**

   - Attendance patterns
   - Registration sources
   - Revenue analytics
   - Engagement metrics

3. **Integration Features**

   - Calendar sync (Google, Outlook)
   - Payment gateways (Stripe, PayPal)
   - Video platforms (Zoom, Teams)
   - CRM systems

4. **Mobile App**

   - Attendee mobile app
   - Check-in app for organizers
   - Real-time notifications
   - Offline mode

5. **Engagement Tools**
   - Live polling
   - Q&A sessions
   - Networking features
   - Gamification

---

## 📝 Best Practices

### Event Planning

1. Create events well in advance
2. Set appropriate capacity limits
3. Configure email templates early
4. Test registration process
5. Have backup locations/plans

### Registration Management

1. Monitor registrations daily
2. Respond to inquiries promptly
3. Send reminders at key intervals
4. Keep waitlist moving
5. Communicate changes clearly

### Event Day Operations

1. Arrive early to set up
2. Test check-in process
3. Have printed attendee list backup
4. Staff adequate check-in points
5. Handle issues gracefully

### Post-Event

1. Send thank you emails within 24 hours
2. Collect feedback while fresh
3. Share event photos/recordings
4. Archive data properly
5. Document lessons learned

---

## 🔍 Troubleshooting

### Common Issues

**Registration Not Working**

- Check event status (must be published)
- Verify capacity not reached
- Check registration deadline not passed
- Ensure payment gateway configured (if paid)

**Email Not Sending**

- Verify email templates configured
- Check email service status
- Validate attendee email addresses
- Review spam settings

**Check-In Issues**

- Confirm attendee is registered
- Check for duplicate registrations
- Verify correct location
- Clear browser cache

**Capacity Issues**

- Review waitlist settings
- Check for cancelled registrations
- Verify location capacities
- Consider adding locations

---

## 📚 Related Documentation

- [Dashboard Overview](./DASHBOARD.md)
- [Email Templates](./EMAIL_TEMPLATES.md)
- [Analytics Guide](./ANALYTICS.md)
- [Mobile App Setup](./MOBILE_SETUP.md)

---

## 🔧 Enabling Events Feature

To enable the Events feature in navigation:

1. Open `/src/components/AppSidebar.tsx`
2. Uncomment line 21:
   ```typescript
   // { name: "Events", href: "/events", icon: Calendar },
   ```
   to:
   ```typescript
   { name: "Events", href: "/events", icon: Calendar },
   ```
3. Save the file
4. The Events menu item will appear in the sidebar
