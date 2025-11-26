# Job User Components - Quick Reference Guide

## Import Components

```typescript
// Import all components
import {
  UserHeader,
  QuickStatsCards,
  JobSeekerProfileDisplay,
  EmployerProfileDisplay,
  AccountSnapshot,
  UserSubscriptionHistory,
  PlatformGuidelines,
  PushNotificationDialog,
} from "@/components/job-users";

// Or import individually
import { UserHeader } from "@/components/job-users/UserHeader";
```

## Component Usage Examples

### UserHeader

```typescript
<UserHeader
  user={user}
  onBack={() => navigate("/jobs/users")}
  onActivate={handleActivate}
  onDeactivate={handleDeactivate}
  onDelete={handleDelete}
  onSendNotification={() => setIsPushDialogOpen(true)}
  isActivating={activateUserMutation.isPending}
  isDeactivating={deactivateUserMutation.isPending}
  isDeleting={deleteUserMutation.isPending}
/>
```

**Props:**
- `user`: JobUser object with profile data
- `onBack`: Function to navigate back to users list
- `onActivate`: Function to activate user account
- `onDeactivate`: Function to deactivate user account
- `onDelete`: Function to delete user account
- `onSendNotification`: Function to open notification dialog
- `isActivating`: Boolean for activate button loading state
- `isDeactivating`: Boolean for deactivate button loading state
- `isDeleting`: Boolean for delete button loading state

---

### QuickStatsCards

```typescript
const quickStats = [
  {
    key: "created",
    label: "Created",
    value: "Jan 15, 2024",
    hint: "2 months ago",
    icon: CalendarClock,
    accent: "bg-blue-500/10 text-blue-500",
  },
  // ... more stats
];

<QuickStatsCards stats={quickStats} />
```

**Props:**
- `stats`: Array of stat objects with:
  - `key`: Unique identifier
  - `label`: Display label
  - `value`: Main value to display
  - `hint`: Secondary hint text
  - `icon`: Lucide icon component
  - `accent`: Tailwind classes for icon background

---

### JobSeekerProfileDisplay

```typescript
{user.accountType === "job_seeker" && user.jobSeekerProfile && (
  <JobSeekerProfileDisplay profile={user.jobSeekerProfile} />
)}
```

**Props:**
- `profile`: JobSeekerProfile object containing:
  - Personal information (name, phone, address, bio)
  - Professional information (role, experience level)
  - Work preferences (employment types, salary expectations)
  - Skills and languages
  - Work experience
  - Education
  - Certifications
  - Projects and portfolio
  - Social media links
  - Resume
  - Privacy consents

---

### EmployerProfileDisplay

```typescript
{user.accountType === "employer" && user.employerProfile && (
  <EmployerProfileDisplay profile={user.employerProfile} />
)}
```

**Props:**
- `profile`: EmployerProfile object containing:
  - Company information (name, industry, size)
  - Primary contact details
  - Company addresses
  - Billing information
  - Verification status
  - Hiring preferences
  - Social media links
  - Company logo
  - Privacy consents

---

### AccountSnapshot

```typescript
<AccountSnapshot
  userId={user._id}
  createdAt="Jan 15, 2024"
  updatedAt="Mar 20, 2024"
  createdRelative="2 months ago"
  updatedRelative="5 days ago"
/>
```

**Props:**
- `userId`: User's unique ID
- `createdAt`: Formatted creation date
- `updatedAt`: Formatted last update date
- `createdRelative`: Relative time since creation
- `updatedRelative`: Relative time since last update

---

### UserSubscriptionHistory

```typescript
<UserSubscriptionHistory
  subscriptionsData={subscriptionsData}
  isLoading={subscriptionsLoading}
  onViewAll={() => navigate("/jobs/user-subscriptions")}
/>
```

**Props:**
- `subscriptionsData`: Object with subscription data:
  - `data.results`: Array of subscription objects
  - `data.pagination.total`: Total subscription count
- `isLoading`: Boolean for loading state
- `onViewAll`: Function to navigate to full subscriptions page

---

### PlatformGuidelines

```typescript
<PlatformGuidelines />
```

**Props:** None (static content)

---

### PushNotificationDialog

```typescript
<PushNotificationDialog
  isOpen={isPushDialogOpen}
  onClose={() => setIsPushDialogOpen(false)}
  onSend={handleSendPushNotification}
  displayName="John Doe"
  isPending={sendPushNotificationMutation.isPending}
/>
```

**Props:**
- `isOpen`: Boolean to control dialog visibility
- `onClose`: Function to close the dialog
- `onSend`: Function to send notification (receives message string)
- `displayName`: User's display name for dialog description
- `isPending`: Boolean for send button loading state

---

## Common Patterns

### Conditional Rendering Based on Account Type

```typescript
{user.accountType === "job_seeker" && user.jobSeekerProfile && (
  <JobSeekerProfileDisplay profile={user.jobSeekerProfile} />
)}

{user.accountType === "employer" && user.employerProfile && (
  <EmployerProfileDisplay profile={user.employerProfile} />
)}
```

### Handling Mutations

```typescript
const deleteUserMutation = useMutation({
  mutationFn: () => appService.deleteJobUser(id!),
  onSuccess: () => {
    toast({ title: "User deleted" });
    navigate("/jobs/users");
  },
  onError: (error: any) => {
    toast({
      title: "Unable to delete user",
      description: error?.message,
      variant: "destructive",
    });
  },
});
```

### Formatting Dates

```typescript
import { format, formatDistanceToNow } from "date-fns";

const createdAt = user.createdAt
  ? format(new Date(user.createdAt), "PPP")
  : "Unknown";

const createdRelative = user.createdAt
  ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
  : null;
```

---

## Styling Guidelines

All components use:
- **Tailwind CSS** for styling
- **shadcn/ui** components (Card, Badge, Button, etc.)
- **Consistent spacing**: `space-y-6` for vertical sections
- **Consistent borders**: `border-border/60` for subtle borders
- **Consistent backgrounds**: `bg-background/80` for cards
- **Consistent text**: `text-muted-foreground` for secondary text

### Color Scheme

- **Primary**: Used for icons and interactive elements
- **Muted**: Used for backgrounds and borders
- **Foreground**: Used for main text
- **Destructive**: Used for delete actions
- **Success (green-500)**: Used for positive indicators
- **Warning (amber-500)**: Used for warning indicators
- **Error (red-500)**: Used for negative indicators

---

## Testing Tips

### Unit Testing Components

```typescript
import { render, screen } from "@testing-library/react";
import { UserHeader } from "@/components/job-users/UserHeader";

describe("UserHeader", () => {
  it("renders user name", () => {
    const mockUser = {
      _id: "123",
      accountType: "job_seeker",
      isAccountVerified: true,
      email: "test@example.com",
      jobSeekerProfile: { fullName: "John Doe" },
      createdAt: "2024-01-15",
      updatedAt: "2024-03-20",
    };

    render(
      <UserHeader
        user={mockUser}
        onBack={jest.fn()}
        onActivate={jest.fn()}
        onDeactivate={jest.fn()}
        onDelete={jest.fn()}
        onSendNotification={jest.fn()}
        isActivating={false}
        isDeactivating={false}
        isDeleting={false}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
```

---

## Performance Optimization

### Memoization

```typescript
import { memo } from "react";

export const JobSeekerProfileDisplay = memo(({ profile }) => {
  // Component code
});
```

### Lazy Loading

```typescript
import { lazy, Suspense } from "react";

const JobSeekerProfileDisplay = lazy(
  () => import("@/components/job-users/JobSeekerProfileDisplay")
);

// In component
<Suspense fallback={<Skeleton />}>
  <JobSeekerProfileDisplay profile={profile} />
</Suspense>
```

---

## Troubleshooting

### Component Not Rendering

1. Check if data is being passed correctly
2. Verify conditional rendering logic
3. Check for TypeScript errors
4. Ensure all required props are provided

### Styling Issues

1. Verify Tailwind classes are correct
2. Check if parent container has proper layout
3. Ensure shadcn/ui components are properly imported
4. Check for conflicting CSS

### State Management Issues

1. Verify React Query setup is correct
2. Check mutation callbacks
3. Ensure proper error handling
4. Verify query keys are unique

---

## Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [date-fns Documentation](https://date-fns.org/)
