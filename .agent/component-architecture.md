# Component Architecture

## Before Refactoring

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         JobUserDetailExpanded.tsx                       │
│              (2,070 lines)                              │
│                                                         │
│  - All UI rendering                                     │
│  - All business logic                                   │
│  - All data fetching                                    │
│  - All state management                                 │
│  - Job seeker profile rendering                         │
│  - Employer profile rendering                           │
│  - Subscription history                                 │
│  - Push notifications                                   │
│  - User actions (activate/deactivate/delete)            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## After Refactoring

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         JobUserDetailExpanded.tsx                       │
│              (467 lines)                                │
│                                                         │
│  - Data fetching & state management                     │
│  - Business logic & mutations                           │
│  - Component orchestration                              │
│                                                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Renders
                   ▼
    ┌──────────────────────────────────────────┐
    │                                          │
    │          Component Tree                  │
    │                                          │
    └──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐    ┌────────────────┐
│  UserHeader   │    │ QuickStatsCards│
│  (220 lines)  │    │   (60 lines)   │
└───────────────┘    └────────────────┘
        │
        │
        ▼
┌─────────────────────────────────────────────┐
│                                             │
│           Main Content Area                 │
│                                             │
└─────────────────────────────────────────────┘
        │
        ├─────────────────────┬──────────────────────┐
        │                     │                      │
        ▼                     ▼                      ▼
┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│ JobSeekerProfile │  │ EmployerProfile  │  │   Sidebar       │
│   Display        │  │    Display       │  │                 │
│  (700 lines)     │  │  (550 lines)     │  │                 │
└──────────────────┘  └──────────────────┘  └─────────────────┘
                                                     │
                                    ┌────────────────┼────────────────┐
                                    │                │                │
                                    ▼                ▼                ▼
                            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
                            │  Account     │ │Subscription  │ │  Platform    │
                            │  Snapshot    │ │   History    │ │  Guidelines  │
                            │ (70 lines)   │ │ (150 lines)  │ │  (50 lines)  │
                            └──────────────┘ └──────────────┘ └──────────────┘

┌─────────────────────────────────────────────┐
│                                             │
│         PushNotificationDialog              │
│              (100 lines)                    │
│                                             │
│  - Modal overlay                            │
│  - Message input                            │
│  - Send/Cancel actions                      │
│                                             │
└─────────────────────────────────────────────┘
```

## Component Responsibilities

### UserHeader
- Display user avatar and basic info
- Show account type and verification badges
- Provide action buttons (activate/deactivate/delete)
- Send notification button

### QuickStatsCards
- Display 3 stat cards in a grid
- Show created date, last updated, and role
- Animated hover effects

### JobSeekerProfileDisplay
- Personal information
- Professional information
- Work preferences
- Skills & languages
- Work experience
- Education
- Certifications
- Projects & portfolio
- Social media & resume
- Privacy consents

### EmployerProfileDisplay
- Company information
- Primary contact
- Company addresses
- Billing information
- Verification status
- Hiring preferences
- Social media
- Company logo
- Privacy consents

### AccountSnapshot
- Account ID
- Created timestamp
- Last updated timestamp

### UserSubscriptionHistory
- List of user subscriptions
- Subscription status badges
- Pricing information
- View all link

### PlatformGuidelines
- Static admin guidelines
- Best practices reminders

### PushNotificationDialog
- Message input field
- Character counter
- Send/Cancel buttons
- Loading state

## Data Flow

```
User Action
    │
    ▼
JobUserDetailExpanded (Main Component)
    │
    ├─► API Calls (React Query)
    │   └─► appService.getJobUserById()
    │   └─► appService.getUserSubscriptionsByUserId()
    │
    ├─► Mutations
    │   └─► sendPushNotificationMutation
    │   └─► deleteUserMutation
    │   └─► activateUserMutation
    │   └─► deactivateUserMutation
    │
    └─► Props to Child Components
        └─► User data
        └─► Subscription data
        └─► Event handlers
        └─► Loading states
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be used in other pages
3. **Testability**: Easy to test components in isolation
4. **Maintainability**: Smaller files are easier to understand and modify
5. **Performance**: Can optimize individual components without affecting others
6. **Scalability**: Easy to add new features or modify existing ones
