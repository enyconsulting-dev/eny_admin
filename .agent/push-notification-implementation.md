# Push Notification Feature - Implementation Summary

## Overview
Added the ability for admins to send push notifications to users directly from the user profile page.

## Changes Made

### 1. API Service (`src/lib/api/service.ts`)
Added new endpoint:
```typescript
sendPushNotificationToUser: (data: { userId: string; message: string }) => {
  return jbsApiClient.post("/admin/jbs/push-notifications/send-to-user", data);
}
```

**Endpoint**: `POST /admin/jbs/push-notifications/send-to-user`

**Payload**:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "message": "Your job application has been viewed"
}
```

### 2. JobUserDetailExpanded.tsx

#### Imports Added
- `MessageSquare` - Icon for the notification button
- `Send` - Icon for the send button in dialog
- `Dialog`, `DialogContent`, `DialogDescription`, `DialogHeader`, `DialogTitle`, `DialogFooter` - Dialog components
- `Textarea` - For message input
- `Label` - For form labels

#### State Management
```typescript
const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
const [pushMessage, setPushMessage] = useState("");
```

#### Mutation
- `sendPushNotificationMutation` - Handles sending push notifications
- Success: Shows toast, closes dialog, clears message
- Error: Shows error toast with error message

#### Handler Function
- `handleSendPushNotification()` - Validates message and triggers mutation

#### UI Components

**1. Send Notification Button**
- Location: Next to "Joined [date]" badge in user header
- Style: Rounded pill button with primary accent colors
- Icon: MessageSquare icon
- Action: Opens push notification dialog

**2. Push Notification Dialog**
- **Title**: "Send push notification"
- **Description**: "Send a push notification message to [User Name]"
- **Content**:
  - Textarea for message input (4 rows, non-resizable)
  - Character counter showing message length
  - Placeholder: "Type your message here..."
- **Actions**:
  - **Cancel button**: Closes dialog and clears message
  - **Send button**: 
    - Disabled if message is empty or sending
    - Shows loading spinner when sending
    - Icon changes from Send to Loader2 during sending

## User Flow

1. Admin navigates to user profile page
2. Admin clicks "Send notification" button next to "Joined" date
3. Dialog opens with message textarea
4. Admin types notification message
5. Character count updates in real-time
6. Admin clicks "Send notification"
7. Button shows loading state
8. On success:
   - Toast notification: "Notification sent"
   - Dialog closes automatically
   - Message field is cleared
9. On error:
   - Toast notification with error message
   - Dialog stays open for retry

## Validation

- Message cannot be empty (whitespace-only messages are rejected)
- Send button is disabled when:
  - Message is empty
  - Request is in progress
- Toast warning shown if trying to send empty message

## UI/UX Features

- **Loading States**: 
  - Send button shows spinner during request
  - Button text changes to "Sending..."
  - All dialog buttons disabled during send

- **Feedback**:
  - Character counter for message length
  - Toast notifications for success/error
  - Clear visual feedback during all states

- **Accessibility**:
  - Proper labels for form fields
  - Keyboard navigation support
  - Screen reader friendly

## Styling

- **Send Notification Button**:
  - Rounded full border
  - Primary color accent (border-primary/30, bg-primary/10)
  - Hover effect (hover:bg-primary/20)
  - Small size with custom height
  - Flex layout with icon and text

- **Dialog**:
  - Max width: sm (28rem/448px)
  - Responsive design
  - Proper spacing and padding

## Error Handling

- Network errors caught and displayed in toast
- API error messages shown to user
- Validation errors shown in toast
- Mutation prevents multiple simultaneous requests

## Integration Points

- Uses existing toast notification system
- Uses existing dialog component
- Follows established design patterns
- Consistent with other mutations in the codebase

## Backend Expectations

The endpoint should:
- Accept POST requests with userId and message
- Return success/error response
- Handle push notification delivery
- Validate inputs server-side

## Future Enhancements

Potential improvements:
1. Message templates for common notifications
2. Schedule notifications for later
3. Message history/log
4. Character limit enforcement
5. Rich text formatting support
6. Notification delivery status tracking
7. Batch notifications to multiple users
8. Notification preferences check before sending