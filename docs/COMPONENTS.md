# Components Reference

## 📚 Overview

This document provides a comprehensive reference for all reusable components in the Eny Consulting Admin Dashboard. Components are organized by feature domain for easy navigation.

## 🗂️ Component Organization

```
src/components/
├── ui/                    # Base UI components (shadcn/ui)
├── api-keys/              # API Keys management components
├── assessment/            # Assessment-specific components
├── job-users/             # Job platform user components
├── subscriptions/         # Subscription management components
├── DashboardLayout.tsx    # Main layout wrapper
├── AppSidebar.tsx         # Navigation sidebar
├── ProtectedRoute.tsx     # Route authentication guard
├── ThemeProvider.tsx      # Theme management
├── ThemeToggle.tsx        # Dark/light mode toggle
└── QuestionCard.tsx       # Assessment question display
```

---

## 🎨 Base UI Components

Located in `/src/components/ui/` - Based on shadcn/ui and Radix UI

### Form Components

- `Button` - Clickable button with variants
- `Input` - Text input field
- `Textarea` - Multi-line text input
- `Label` - Form field label
- `Checkbox` - Checkbox input
- `RadioGroup` - Radio button group
- `Select` - Dropdown select
- `Switch` - Toggle switch
- `Slider` - Range slider

### Layout Components

- `Card` - Container with header, content, footer
- `Separator` - Horizontal/vertical divider
- `Tabs` - Tabbed interface
- `Accordion` - Collapsible sections
- `Collapsible` - Expandable content
- `ResizablePanels` - Resizable panel layout
- `ScrollArea` - Custom scrollbar area

### Feedback Components

- `Alert` - Alert messages
- `AlertDialog` - Confirmation dialogs
- `Dialog` - Modal dialogs
- `Toast` / `Sonner` - Toast notifications
- `Popover` - Floating content
- `Tooltip` - Hover tooltips
- `HoverCard` - Hover information card
- `Progress` - Progress bar
- `Skeleton` - Loading placeholder

### Navigation Components

- `NavigationMenu` - Complex navigation
- `Menubar` - Menu bar
- `DropdownMenu` - Dropdown menus
- `ContextMenu` - Right-click menu
- `Sidebar` - Sidebar navigation components

### Display Components

- `Badge` - Label badge
- `Avatar` - User avatar
- `AspectRatio` - Maintain aspect ratio
- `Calendar` - Date picker calendar
- `Table` - Data table components
- `Command` - Command palette

---

## 🔑 API Keys Components

Located in `/src/components/api-keys/`

### ApiKeyStats.tsx

**Purpose:** Display API key usage statistics

**Props:**

```typescript
interface ApiKeyStatsProps {
  stats: {
    totalRequests: number;
    lastUsedAt?: Date;
    rateLimit?: number;
    expiresAt?: Date;
  };
  isLoading?: boolean;
}
```

**Features:**

- Four metric cards (Requests, Last Used, Rate Limit, Expiration)
- Icon indicators
- Formatted numbers
- Relative time display
- Loading states

### ApiKeyDisplay.tsx

**Purpose:** Show API key with copy functionality

**Props:**

```typescript
interface ApiKeyDisplayProps {
  apiKey: string;
  onCopy?: () => void;
}
```

**Features:**

- Masked key display
- Copy to clipboard button
- Success feedback
- Security warning message

### ApiKeyBasicInfo.tsx

**Purpose:** Display/edit basic API key information

**Props:**

```typescript
interface ApiKeyBasicInfoProps {
  data: {
    name: string;
    description?: string;
    expiresAt?: Date;
    rateLimit?: number;
  };
  isEditing: boolean;
  onSave: (data: ApiKeyUpdate) => void;
  onCancel: () => void;
}
```

**Features:**

- View/edit mode toggle
- Form validation
- Date picker for expiration
- Save/cancel actions

### ApiKeyPermissions.tsx

**Purpose:** Manage API key permissions

**Props:**

```typescript
interface ApiKeyPermissionsProps {
  permissions: string[];
  availablePermissions: string[];
  isEditing: boolean;
  onChange: (permissions: string[]) => void;
}
```

**Features:**

- Checkbox group
- Permission categorization
- Select all/none
- Permission descriptions

### ApiKeyAllowedOrigins.tsx

**Purpose:** Manage allowed origins for CORS

**Props:**

```typescript
interface ApiKeyAllowedOriginsProps {
  origins: string[];
  isEditing: boolean;
  onChange: (origins: string[]) => void;
}
```

**Features:**

- Dynamic origin list
- Add/remove origins
- URL validation
- Badge display

### ApiKeyMetadata.tsx

**Purpose:** Display non-editable metadata

**Props:**

```typescript
interface ApiKeyMetadataProps {
  metadata: {
    id: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
```

**Features:**

- Read-only display
- Formatted dates
- Copy ID button
- Creator information

### DeleteApiKeyDialog.tsx

**Purpose:** Confirmation dialog for deletion

**Props:**

```typescript
interface DeleteApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  apiKeyName: string;
  isDeleting?: boolean;
}
```

**Features:**

- Warning message
- Impact explanation
- Confirm/cancel buttons
- Loading state during deletion

---

## 📝 Assessment Components

Located in `/src/components/assessment/`

### AssessmentHeader.tsx

**Purpose:** Display assessment title and actions

**Props:**

```typescript
interface AssessmentHeaderProps {
  assessment: {
    title: string;
    description?: string;
    status: AssessmentStatus;
  };
  onEdit: () => void;
  onDelete: () => void;
  onPublish?: () => void;
}
```

**Features:**

- Title and description
- Status badge
- Action buttons
- Responsive layout

### AssessmentMetricCards.tsx

**Purpose:** Show assessment statistics

**Props:**

```typescript
interface AssessmentMetricCardsProps {
  metrics: {
    totalQuestions: number;
    totalAttempts: number;
    passRate: number;
    averageScore: number;
  };
  isLoading?: boolean;
}
```

**Features:**

- Four metric cards
- Icon indicators
- Percentage formatting
- Loading skeletons

### AssessmentFilters.tsx

**Purpose:** Search and filter questions

**Props:**

```typescript
interface AssessmentFiltersProps {
  searchQuery: string;
  selectedType: QuestionType | "all";
  onSearchChange: (query: string) => void;
  onTypeChange: (type: QuestionType | "all") => void;
}
```

**Features:**

- Search input
- Type dropdown filter
- Clear filters
- Real-time filtering

### AssessmentQuestionsList.tsx

**Purpose:** Render list of questions

**Props:**

```typescript
interface AssessmentQuestionsListProps {
  questions: Question[];
  isLoading: boolean;
  error?: string;
}
```

**Features:**

- Question cards
- Type badges
- Points display
- Options rendering
- Loading/error states

### AssessmentError.tsx

**Purpose:** Display error state

**Props:**

```typescript
interface AssessmentErrorProps {
  error: string;
  onRetry?: () => void;
}
```

**Features:**

- Error message
- Retry button
- Icon indicator

### AssessmentNotFound.tsx

**Purpose:** 404 state for missing assessments

**Props:**

```typescript
interface AssessmentNotFoundProps {
  assessmentId: string;
  onBack: () => void;
}
```

**Features:**

- Not found message
- Back navigation
- Helpful suggestions

---

## 👥 Job Users Components

Located in `/src/components/job-users/`

### UserHeader.tsx

**Purpose:** User profile header with actions

**Props:**

```typescript
interface UserHeaderProps {
  user: JobUser;
  onActivate: () => void;
  onDeactivate: () => void;
  onSendNotification: () => void;
}
```

**Features:**

- Profile picture
- Name and contact info
- Account type badge
- Verification status
- Action buttons

### QuickStatsCards.tsx

**Purpose:** Display user statistics

**Props:**

```typescript
interface QuickStatsCardsProps {
  stats: UserStats;
  accountType: "jobseeker" | "employer";
}
```

**Features:**

- 4 stat cards
- Context-aware metrics
- Icon indicators
- Responsive grid

### AccountSnapshot.tsx

**Purpose:** Quick account information

**Props:**

```typescript
interface AccountSnapshotProps {
  account: {
    createdAt: Date;
    lastLoginAt?: Date;
    totalLogins: number;
    status: string;
    subscriptionPlan?: string;
  };
}
```

**Features:**

- Key account details
- Formatted dates
- Status display
- Subscription info

### PushNotificationDialog.tsx

**Purpose:** Send push notification to user

**Props:**

```typescript
interface PushNotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onSend: (title: string, message: string) => Promise<void>;
}
```

**Features:**

- Title and message inputs
- Character count
- Preview
- Send button
- Loading state

### UserSubscriptionHistory.tsx

**Purpose:** Display subscription history

**Props:**

```typescript
interface UserSubscriptionHistoryProps {
  userId: string;
}
```

**Features:**

- Timeline display
- Current subscription highlight
- Status badges
- Payment history
- Renewal dates

### JobSeekerProfileDisplay.tsx

**Purpose:** Render job seeker profile

**Props:**

```typescript
interface JobSeekerProfileDisplayProps {
  profile: JobSeekerProfile;
  isEditable?: boolean;
  onEdit?: (section: string) => void;
}
```

**Features:**

- Comprehensive profile sections
- Work experience timeline
- Education display
- Skills showcase
- Certifications
- Portfolio/projects
- Preferences

### EmployerProfileDisplay.tsx

**Purpose:** Render employer/company profile

**Props:**

```typescript
interface EmployerProfileDisplayProps {
  profile: EmployerProfile;
  isEditable?: boolean;
  onEdit?: (section: string) => void;
}
```

**Features:**

- Company details
- About section
- Contact information
- Social media links
- Benefits offered
- Team size

### PlatformGuidelines.tsx

**Purpose:** Show compliance and guideline status

**Props:**

```typescript
interface PlatformGuidelinesProps {
  guidelines: {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    warningCount: number;
    violationCount: number;
    restrictions: string[];
  };
}
```

**Features:**

- Acceptance status
- Warning/violation count
- Active restrictions
- Visual indicators

---

## 💳 Subscription Components

Located in `/src/components/subscriptions/`

### SubscriptionSummaryCards.tsx

**Purpose:** Display subscription plan summary

**Props:**

```typescript
interface SubscriptionSummaryCardsProps {
  metrics: {
    totalSubscribers: number;
    monthlyRevenue: number;
    churnRate: number;
    growthRate: number;
  };
}
```

**Features:**

- 4 metric cards
- Revenue formatting
- Percentage display
- Trend indicators

### SubscriptionBasicInfo.tsx

**Purpose:** Edit basic subscription details

**Props:**

```typescript
interface SubscriptionBasicInfoProps {
  data: SubscriptionFormData;
  isEditing: boolean;
  showAccountType?: boolean;
  showInterval?: boolean;
  onChange: (data: SubscriptionFormData) => void;
}
```

**Features:**

- Name and description fields
- Price input (with free/custom handling)
- Account type selector
- Billing interval
- Status toggles (Active, Custom, Free)
- Conditional field display

### SubscriptionFeaturesInput.tsx

**Purpose:** Select subscription features

**Props:**

```typescript
interface SubscriptionFeaturesInputProps {
  accountType: "jobseeker" | "employer";
  selectedFeatures: string[];
  onChange: (features: string[]) => void;
}
```

**Features:**

- Feature checkboxes
- Context-aware feature list
- Select all/none
- Feature categorization

### SubscriptionLimitsInput.tsx

**Purpose:** Configure feature limits

**Props:**

```typescript
interface SubscriptionLimitsInputProps {
  accountType: "jobseeker" | "employer";
  limits: FeatureLimits;
  onChange: (limits: FeatureLimits) => void;
}
```

**Features:**

- Numeric inputs for each limit
- Context-aware limits
- Validation
- Unlimited option
- Help text

### SubscriptionFeatures.tsx

**Purpose:** Display subscription features (view mode)

**Props:**

```typescript
interface SubscriptionFeaturesProps {
  features: string[];
  limits: FeatureLimits;
}
```

**Features:**

- Feature list with checkmarks
- Limit display
- Organized layout

### SubscriptionMetadata.tsx

**Purpose:** Show subscription metadata

**Props:**

```typescript
interface SubscriptionMetadataProps {
  metadata: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
  };
}
```

**Features:**

- Read-only display
- Formatted dates
- Creator info

### DeleteSubscriptionDialog.tsx

**Purpose:** Confirm subscription deletion

**Props:**

```typescript
interface DeleteSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subscriptionName: string;
  activeSubscribers: number;
}
```

**Features:**

- Warning about active subscribers
- Migration option
- Confirm/cancel

### SubscriptionStatisticsCards.tsx

**Purpose:** User subscriptions statistics

**Props:**

```typescript
interface SubscriptionStatisticsCardsProps {
  statistics: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiringSoon: number;
    cancelled: number;
  };
}
```

**Features:**

- 4 stat cards
- Status indicators
- Icon display

### SubscriptionTableRow.tsx

**Purpose:** Individual subscription row in table

**Props:**

```typescript
interface SubscriptionTableRowProps {
  subscription: UserSubscription;
  onViewDetails: () => void;
  onCancel?: () => void;
}
```

**Features:**

- User info display
- Plan and status
- Dates and amount
- Action buttons

### SubscriptionDetailDialog.tsx

**Purpose:** Detailed subscription information dialog

**Props:**

```typescript
interface SubscriptionDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onCancel?: () => void;
  onUpgrade?: () => void;
}
```

**Features:**

- Full subscription details
- Billing history
- Action buttons
- Upgrade/cancel options

---

## 🧭 Layout & Navigation Components

### DashboardLayout.tsx

**Purpose:** Main application layout wrapper

**Props:**

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
}
```

**Features:**

- Sidebar integration
- Header with breadcrumbs
- Main content area
- Responsive design
- Theme support

**Usage:**

```tsx
<DashboardLayout>
  <YourPageContent />
</DashboardLayout>
```

### AppSidebar.tsx

**Purpose:** Application navigation sidebar

**Features:**

- Logo and branding
- Navigation menu
- Active route highlighting
- Logout button
- Collapsible (future)

**Navigation Items:**

- Dashboard
- Events (commented out)
- Assessments
- Job Platform (commented out)
- Admins
- API Keys (commented out)
- Settings

### ProtectedRoute.tsx

**Purpose:** Authentication guard for routes

**Props:**

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
}
```

**Features:**

- Check authentication status
- Redirect to login if not authenticated
- Preserve intended destination
- Loading state

**Usage:**

```tsx
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  }
/>
```

---

## 🎨 Theme Components

### ThemeProvider.tsx

**Purpose:** Provide theme context to application

**Props:**

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark" | "system";
  storageKey?: string;
}
```

**Features:**

- Light/dark/system themes
- LocalStorage persistence
- Theme detection
- Context API

### ThemeToggle.tsx

**Purpose:** Toggle between themes

**Features:**

- Light mode button
- Dark mode button
- System mode button
- Icon display
- Dropdown menu

---

## 📋 Specialized Components

### QuestionCard.tsx

**Purpose:** Display and edit assessment questions

**Props:**

```typescript
interface QuestionCardProps {
  question: Question;
  index: number;
  isEditing?: boolean;
  onUpdate?: (question: Question) => void;
  onDelete?: () => void;
}
```

**Features:**

- Question display
- Type-specific rendering
- Options for multiple choice
- Edit mode
- Delete confirmation
- Drag handle (for reordering)

---

## 🎯 Component Patterns

### Common Patterns Used

#### 1. View/Edit Mode Toggle

Many components support both view and edit modes:

```tsx
{
  isEditing ? (
    <EditForm data={data} onChange={handleChange} />
  ) : (
    <DisplayView data={data} />
  );
}
```

#### 2. Loading States

Handle async data gracefully:

```tsx
{
  isLoading ? (
    <Skeleton />
  ) : error ? (
    <ErrorDisplay error={error} />
  ) : (
    <Content data={data} />
  );
}
```

#### 3. Confirmation Dialogs

Critical actions require confirmation:

```tsx
<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
    <AlertDialogDescription>
      This action cannot be undone.
    </AlertDialogDescription>
    <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
```

#### 4. Form Validation

Use React Hook Form + Zod:

```tsx
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues,
});
```

---

## 📚 Best Practices

### Component Development

1. **Single Responsibility**: Each component should do one thing well
2. **Prop Types**: Always define TypeScript interfaces
3. **Error Handling**: Handle loading and error states
4. **Accessibility**: Use semantic HTML and ARIA labels
5. **Responsive**: Design mobile-first
6. **Reusability**: Extract common patterns
7. **Testing**: Write unit tests for complex logic
8. **Documentation**: Add JSDoc comments

### Naming Conventions

- **Components**: PascalCase (e.g., `UserHeader`)
- **Props Interfaces**: `{ComponentName}Props`
- **Handlers**: `handle{Action}` (e.g., `handleSubmit`)
- **Boolean props**: `is{State}` or `has{Feature}`
- **Event handlers**: `on{Event}` (e.g., `onClick`)

### File Organization

```
ComponentName/
├── ComponentName.tsx       # Main component
├── ComponentName.test.tsx  # Tests
├── types.ts               # Type definitions
└── index.ts               # Exports
```

Or for simple components:

```
ComponentName.tsx          # All in one file
```

---

## 🔧 Component Development Tools

### Storybook Integration (Future)

Document and test components in isolation

### Testing

- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright

### Linting

- ESLint for code quality
- TypeScript for type safety
- Prettier for formatting

---

## 📖 Related Documentation

- [UI Components Library (shadcn/ui)](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
