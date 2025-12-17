# Documentation Index

Welcome to the Eny Consulting Admin Dashboard documentation! This comprehensive guide covers all features, pages, components, and APIs.

## 📚 Documentation Structure

### Core Documentation

1. **[Main README](./README.md)** - Overview and quick start
2. **[This Index](./INDEX.md)** - Navigation guide

### Feature Documentation

3. **[Dashboard](./DASHBOARD.md)** - Analytics and overview
4. **[Assessments](./ASSESSMENTS.md)** - Assessment management system
5. **[Job Platform](./JOB_PLATFORM.md)** - Job board and hiring tools
6. **[API Keys](./API_KEYS.md)** - API access management
7. **[Admin Users](./ADMINS.md)** - Admin account management
8. **[Events](./EVENTS.md)** - Event management (optional feature)

### Technical Documentation

9. **[Components](./COMPONENTS.md)** - Reusable component reference
10. **[API Endpoints](./API_ENDPOINTS.md)** - Complete API reference

---

## 🎯 Quick Navigation by User Type

### For Administrators

**Getting Started:**

- [Dashboard Overview](./DASHBOARD.md)
- [Admin Management](./ADMINS.md#user-workflows)

**Common Tasks:**

- [Creating Assessments](./ASSESSMENTS.md#creating-an-assessment)
- [Managing Users](./JOB_PLATFORM.md#users-management)
- [Generating API Keys](./API_KEYS.md#create-api-key)
- [Creating Events](./EVENTS.md#creating-an-event)

**Troubleshooting:**

- [Assessment Issues](./ASSESSMENTS.md#troubleshooting)
- [API Key Problems](./API_KEYS.md#troubleshooting)
- [Event Management](./EVENTS.md#troubleshooting)

### For Developers

**Integration:**

- [API Endpoints Reference](./API_ENDPOINTS.md)
- [Authentication Guide](./API_ENDPOINTS.md#authentication)
- [API Keys Setup](./API_KEYS.md#creating-api-keys)

**Component Development:**

- [Component Library](./COMPONENTS.md)
- [Component Patterns](./COMPONENTS.md#component-patterns)
- [Best Practices](./COMPONENTS.md#best-practices)

**API Integration:**

- [Error Handling](./API_ENDPOINTS.md#error-codes)
- [Rate Limiting](./API_ENDPOINTS.md#rate-limiting)
- [Pagination](./API_ENDPOINTS.md#pagination)

### For Content Managers

**Content Creation:**

- [Creating Assessments](./ASSESSMENTS.md#21-create-edit-assessment)
- [Managing Questions](./ASSESSMENTS.md#question-types)
- [Creating Job Postings](./JOB_PLATFORM.md#31-job-postings-list)
- [Event Creation](./EVENTS.md#2-event-creation--editing)

**Content Management:**

- [Assessment Review](./ASSESSMENTS.md#reviewing-attempts)
- [Application Review](./JOB_PLATFORM.md#42-application-detail)
- [Attendee Management](./EVENTS.md#4-location-users-page)

---

## 🔍 Quick Find by Feature

### Assessments

| What              | Where                                                              |
| ----------------- | ------------------------------------------------------------------ |
| Create assessment | [Assessments > Create](./ASSESSMENTS.md#22-createedit-assessment)  |
| Add questions     | [Assessments > Questions](./ASSESSMENTS.md#question-types)         |
| Invite candidates | [Assessments > Candidates](./ASSESSMENTS.md#3-candidate-directory) |
| Review attempts   | [Assessments > Attempts](./ASSESSMENTS.md#42-attempt-detail-page)  |
| View analytics    | [Assessments > Analytics](./ASSESSMENTS.md#analytics--reporting)   |

### Job Platform

| What                 | Where                                                                      |
| -------------------- | -------------------------------------------------------------------------- |
| Manage users         | [Job Platform > Users](./JOB_PLATFORM.md#21-user-list)                     |
| Create job posting   | [Job Platform > Postings](./JOB_PLATFORM.md#31-job-postings-list)          |
| Review applications  | [Job Platform > Applications](./JOB_PLATFORM.md#41-applications-list)      |
| Manage subscriptions | [Job Platform > Subscriptions](./JOB_PLATFORM.md#51-subscription-plans)    |
| Send notifications   | [Job Platform > Push Notifications](./JOB_PLATFORM.md#-push-notifications) |

### API Keys

| What            | Where                                                   |
| --------------- | ------------------------------------------------------- |
| Create API key  | [API Keys > Create](./API_KEYS.md#2-create-api-key)     |
| Set permissions | [API Keys > Permissions](./API_KEYS.md#3-permissions)   |
| Monitor usage   | [API Keys > Statistics](./API_KEYS.md#usage-monitoring) |
| Manage origins  | [API Keys > Origins](./API_KEYS.md#4-allowed-origins)   |

### Events

| What               | Where                                                    |
| ------------------ | -------------------------------------------------------- |
| Create event       | [Events > Create](./EVENTS.md#2-event-creation--editing) |
| Manage locations   | [Events > Locations](./EVENTS.md#locations-section)      |
| Check in attendees | [Events > Check-in](./EVENTS.md#check-in-system)         |
| Send updates       | [Events > Communication](./EVENTS.md#communication-hub)  |

### Admin Management

| What               | Where                                                  |
| ------------------ | ------------------------------------------------------ |
| Add admin          | [Admins > Create](./ADMINS.md#create-admin)            |
| Manage permissions | [Admins > Permissions](./ADMINS.md#permissions--roles) |
| View activity      | [Admins > Activity Log](./ADMINS.md#activity-log)      |
| Reset password     | [Admins > Reset Password](./ADMINS.md#reset-password)  |

---

## 📱 Features by Page

### Dashboard (`/dashboard`)

- Platform overview
- Activity charts
- Quick navigation
- Event summaries

**Documentation:** [Dashboard Guide](./DASHBOARD.md)

### Assessments Hub (`/assessments`)

- Assessment workspace
- Candidate directory
- Performance insights

**Documentation:** [Assessments Guide](./ASSESSMENTS.md)

### Assessment Management

- **List** (`/assessments/list`) - All assessments
- **Create** (`/assessments/create`) - New assessment
- **Detail** (`/assessments/:id`) - View/edit assessment
- **Users** (`/assessments/users`) - Candidate management
- **Attempts** (`/assessments/attempts`) - Attempt tracking

### Job Platform (`/jobs`)

- Platform statistics
- Quick navigation

**Documentation:** [Job Platform Guide](./JOB_PLATFORM.md)

### Job Platform Features

- **Users** (`/jobs/users`) - User management
- **User Detail** (`/jobs/users/:id`) - User profile
- **Postings** (`/jobs/postings`) - Job listings
- **Applications** (`/jobs/applications`) - Application tracking
- **Subscriptions** (`/jobs/subscriptions`) - Plan management
- **User Subscriptions** (`/jobs/user-subscriptions`) - Active subscriptions

### API Keys (`/api-keys`)

- **List** - All API keys
- **Create** (`/api-keys/create`) - Generate key
- **Detail** (`/api-keys/:id`) - Manage key

**Documentation:** [API Keys Guide](./API_KEYS.md)

### Admin Management (`/admins`)

- **List** - All administrators
- **Detail** (`/admins/:id`) - Admin profile

**Documentation:** [Admins Guide](./ADMINS.md)

### Events (`/events`) _[Optional Feature]_

- **List** - All events
- **Create** (`/events/create`) - New event
- **Detail** (`/event/:eventId`) - Event management
- **Location Users** (`/event/:eventId/location/:locationId`) - Attendees

**Documentation:** [Events Guide](./EVENTS.md)

---

## 🛠️ Technical Reference

### Components

All reusable React components organized by feature:

- [UI Components](./COMPONENTS.md#base-ui-components)
- [API Key Components](./COMPONENTS.md#api-keys-components)
- [Assessment Components](./COMPONENTS.md#assessment-components)
- [Job User Components](./COMPONENTS.md#job-users-components)
- [Subscription Components](./COMPONENTS.md#subscription-components)

**Full Reference:** [Components Guide](./COMPONENTS.md)

### API Endpoints

Complete REST API documentation:

- [Authentication](./API_ENDPOINTS.md#authentication-endpoints)
- [Admins](./API_ENDPOINTS.md#admin-users-endpoints)
- [API Keys](./API_ENDPOINTS.md#api-keys-endpoints)
- [Assessments](./API_ENDPOINTS.md#assessment-endpoints)
- [Job Platform](./API_ENDPOINTS.md#job-platform-endpoints)
- [Events](./API_ENDPOINTS.md#events-endpoints)

**Full Reference:** [API Endpoints Guide](./API_ENDPOINTS.md)

---

## 📖 Common Workflows

### Assessment Workflow

1. [Create Assessment](./ASSESSMENTS.md#22-createedit-assessment)
2. [Add Questions](./ASSESSMENTS.md#questions-management)
3. [Invite Candidates](./ASSESSMENTS.md#invitation-management)
4. [Monitor Attempts](./ASSESSMENTS.md#41-assessment-attempts-list)
5. [Review Results](./ASSESSMENTS.md#42-attempt-detail-page)

### Job Posting Workflow

1. [Create Job Posting](./JOB_PLATFORM.md#31-job-postings-list)
2. [Publish Job](./JOB_PLATFORM.md#32-job-posting-detail)
3. [Review Applications](./JOB_PLATFORM.md#41-applications-list)
4. [Shortlist Candidates](./JOB_PLATFORM.md#42-application-detail)
5. [Schedule Interviews](./JOB_PLATFORM.md#actions)

### Event Management Workflow

1. [Create Event](./EVENTS.md#2-event-creation--editing)
2. [Add Locations](./EVENTS.md#3-location-configuration)
3. [Publish Event](./EVENTS.md#3-event-detail-page)
4. [Monitor Registrations](./EVENTS.md#attendees-overview)
5. [Check-in Attendees](./EVENTS.md#check-in-system)

### API Integration Workflow

1. [Create API Key](./API_KEYS.md#2-create-api-key)
2. [Set Permissions](./API_KEYS.md#3-permissions)
3. [Configure Origins](./API_KEYS.md#4-allowed-origins)
4. [Implement Integration](./API_ENDPOINTS.md)
5. [Monitor Usage](./API_KEYS.md#usage-monitoring)

---

## 🎓 Learning Path

### Beginner

1. Read [Dashboard Overview](./DASHBOARD.md)
2. Understand [Admin Management](./ADMINS.md)
3. Explore [Assessment Basics](./ASSESSMENTS.md#1-assessment-hub)
4. Try [Creating an Assessment](./ASSESSMENTS.md#creating-an-assessment)

### Intermediate

1. Study [Job Platform Features](./JOB_PLATFORM.md)
2. Learn [API Keys Management](./API_KEYS.md)
3. Explore [Event Management](./EVENTS.md)
4. Review [Component Library](./COMPONENTS.md)

### Advanced

1. Master [API Endpoints](./API_ENDPOINTS.md)
2. Build [Custom Integrations](./API_KEYS.md#use-cases)
3. Optimize [Performance](./COMPONENTS.md#best-practices)
4. Implement [Advanced Features](./ASSESSMENTS.md#future-enhancements)

---

## 🔧 Configuration & Setup

### Environment Setup

```env
VITE_API_URL=your_api_url_here
```

### Feature Toggles

Some features can be enabled/disabled:

- **Events**: Uncomment in `AppSidebar.tsx` ([Instructions](./EVENTS.md#enabling-events-feature))
- **Job Platform**: Uncomment in `AppSidebar.tsx`
- **API Keys**: Uncomment in `AppSidebar.tsx`

---

## 📊 Feature Comparison

| Feature      | Status    | Documentation                     |
| ------------ | --------- | --------------------------------- |
| Dashboard    | ✅ Active | [Dashboard](./DASHBOARD.md)       |
| Assessments  | ✅ Active | [Assessments](./ASSESSMENTS.md)   |
| Admin Users  | ✅ Active | [Admins](./ADMINS.md)             |
| Settings     | ✅ Active | Basic page                        |
| Job Platform | ⚠️ Hidden | [Job Platform](./JOB_PLATFORM.md) |
| API Keys     | ⚠️ Hidden | [API Keys](./API_KEYS.md)         |
| Events       | ⚠️ Hidden | [Events](./EVENTS.md)             |

**Legend:**

- ✅ Active - Visible in navigation
- ⚠️ Hidden - Code exists, navigation commented out
- 🚧 Coming Soon - Planned feature

---

## 🆘 Getting Help

### Documentation Sections

- **Overview**: Each doc starts with purpose and architecture
- **Features**: Detailed feature explanations
- **Workflows**: Step-by-step guides
- **Technical**: APIs and components
- **Troubleshooting**: Common issues and solutions

### Search Tips

1. Use Ctrl+F (Cmd+F) to search within docs
2. Check the relevant feature doc first
3. Review API endpoints for integration questions
4. Check components reference for UI questions

### Support Resources

- Technical issues: Check troubleshooting sections
- Feature requests: Documented in future enhancements
- Bug reports: Review related documentation first

---

## 📝 Documentation Updates

This documentation was created on **2024** and covers version **0.0.0** of the admin dashboard.

### Contributing to Docs

When adding new features:

1. Update relevant feature documentation
2. Add component documentation if applicable
3. Update API endpoints reference
4. Add to this index
5. Update main README if needed

### Version History

- **v1.0** - Initial comprehensive documentation
  - All core features documented
  - Complete API reference
  - Full component library
  - User workflows and guides

---

## 🎯 Next Steps

1. **New Users**: Start with [Dashboard Guide](./DASHBOARD.md)
2. **Administrators**: Read [Admin Management](./ADMINS.md)
3. **Developers**: Check [API Reference](./API_ENDPOINTS.md)
4. **Content Creators**: Review [Assessments](./ASSESSMENTS.md) and [Job Platform](./JOB_PLATFORM.md)

Happy documenting! 📚
