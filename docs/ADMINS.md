# Admin Users Management

## 📚 Overview

The Admin Users Management system provides comprehensive tools for managing administrative users who have access to the Eny Consulting admin dashboard. It includes user creation, role management, permission assignment, and activity monitoring.

## 🎯 Purpose

- **User Management**: Create and manage admin accounts
- **Access Control**: Assign roles and permissions
- **Security**: Monitor and control admin access
- **Accountability**: Track admin activity and changes
- **Team Collaboration**: Manage multiple administrators

## 🗺️ System Architecture

The Admin Management system consists of three main sections:

1. **Admins List** - Overview of all administrators
2. **Admin Detail** - Individual admin profile and management
3. **Admin Creation** - Add new administrators (inline in list)

---

## 📖 Feature Documentation

## 1. Admins List

**Route:** `/admins`  
**Component:** `Admins.tsx`

### Purpose

Central dashboard for viewing and managing all administrative users with statistics and quick actions.

### Statistics Cards

#### 📊 Overview Metrics

**Total Admins**

- Count of all admin accounts
- Icon: Users
- Quick overview of team size

**Active Admins**

- Currently active admin accounts
- Icon: UserCheck (Green)
- Shows operational admin count

**Pending Invites**

- Admins invited but not yet activated
- Icon: UserPlus (Yellow)
- Tracks onboarding status

**Recent Activity**

- Admins active in last 24 hours
- Icon: Activity (Blue)
- Engagement indicator

### Admins Table

#### Display Columns

| Column     | Description                   |
| ---------- | ----------------------------- |
| Name       | Full name with avatar         |
| Email      | Email address                 |
| Role       | Admin role/title              |
| Status     | Active/Inactive/Pending badge |
| Last Login | Last access timestamp         |
| Created    | Account creation date         |
| Created By | Admin who created the account |
| Actions    | View/Edit/Delete buttons      |

#### Avatar Display

- Profile picture (if available)
- Fallback to initials
- Color-coded based on name
- Status indicator (online/offline)

#### Status Badges

| Status    | Color  | Meaning                              |
| --------- | ------ | ------------------------------------ |
| Active    | Green  | Account active and accessible        |
| Inactive  | Gray   | Account disabled                     |
| Pending   | Yellow | Invitation sent, awaiting activation |
| Suspended | Red    | Temporarily suspended                |

### Features

#### 🔍 Search & Filter

- **Search**: By name or email
- **Role Filter**: Filter by admin role
- **Status Filter**: Active, Inactive, Pending
- **Date Range**: Filter by creation date
- Real-time filtering
- Clear filters button

#### ➕ Create Admin

- Inline creation form
- Quick add capability
- Required fields:
  - Full name
  - Email address
  - Role/Title
- Optional fields:
  - Phone number
  - Department
- Email invitation sent on creation

#### 📋 Bulk Actions

- Select multiple admins
- Bulk activate/deactivate
- Bulk role assignment
- Export admin list

#### 🔄 Refresh

- Manual data refresh
- Auto-refresh every 60 seconds (optional)
- Loading state indicators

---

## 2. Admin Detail Page

**Route:** `/admins/:id`  
**Component:** `AdminDetail.tsx`

### Purpose

Comprehensive view and management of individual administrator accounts.

### Profile Section

#### Header

- Profile picture (large)
- Full name
- Role/title
- Status badge
- Action buttons:
  - Edit Profile
  - Reset Password
  - Deactivate Account
  - Delete Account

#### Contact Information

- **Email**: Primary email address
  - Verification status
  - Change email option
- **Phone**: Phone number (optional)
  - Format validation
  - SMS verification option
- **Department**: Department/team
- **Employee ID**: Internal identifier (if applicable)

### Account Details

#### Basic Information

Display/Edit fields:

- **Full Name**: First and last name
- **Display Name**: How name appears in UI
- **Title/Role**: Administrative role
- **Department**: Team or department
- **Manager**: Reporting manager (if applicable)
- **Location**: Office location
- **Timezone**: User timezone

#### Account Status

- **Current Status**: Active/Inactive/Suspended
- **Account Created**: Creation timestamp
- **Created By**: Admin who created account
- **Last Updated**: Last modification timestamp
- **Last Login**: Most recent login
- **Last Active**: Last activity timestamp

#### Security Settings

- **Password Last Changed**: Date of last password update
- **Two-Factor Authentication**: Enabled/Disabled
  - Enable/Disable toggle
  - Backup codes
- **Failed Login Attempts**: Security tracking
- **Account Lockout**: If applicable
- **IP Whitelist**: Allowed IPs (if configured)

### Permissions & Roles

#### Role Assignment

Current implementation uses single role, future multi-role support:

**Available Roles:**

- **Super Admin**: Full system access
- **Admin**: Standard administrative access
- **Manager**: Team management capabilities
- **Moderator**: Content moderation
- **Viewer**: Read-only access

#### Granular Permissions

Future enhancement for fine-grained control:

**User Management:**

- Create users
- Edit users
- Delete users
- View user details

**Assessment Management:**

- Create assessments
- Edit assessments
- Delete assessments
- View attempts
- Grade attempts

**Job Platform:**

- Manage job postings
- Review applications
- Manage subscriptions

**API Keys:**

- Create API keys
- View API keys
- Revoke API keys

**System Settings:**

- Modify configurations
- View logs
- Manage integrations

### Activity Log

#### Recent Activity

Display of recent admin actions:

- **Action Type**: Login, Edit, Delete, etc.
- **Resource**: What was modified
- **Timestamp**: When action occurred
- **IP Address**: Origin of action
- **Device**: Browser/OS information
- **Result**: Success/Failure

#### Activity Types Tracked

- Login/Logout events
- User modifications
- Assessment changes
- Job posting updates
- API key operations
- Settings changes
- Bulk operations

#### Filters

- Date range picker
- Action type filter
- Resource type filter
- Export activity log

### Statistics

#### Admin Performance Metrics

- **Logins This Month**: Login frequency
- **Items Created**: Resources created
- **Last Active**: Recent activity
- **Actions Performed**: Total action count

#### Timeline View

Visual timeline showing:

- Account creation
- First login
- Major milestones
- Recent activities

---

## 3. Admin Management Actions

### Create Admin

#### Creation Flow

1. Click "Add Admin" button
2. Fill in required information:
   - Full name
   - Email address
   - Role
3. Optional information:
   - Phone number
   - Department
   - Custom message
4. Submit form
5. System sends invitation email
6. Admin receives email with setup link
7. Admin sets password
8. Account activated

#### Invitation Email

Contains:

- Welcome message
- Setup link (expires in 7 days)
- Instructions
- Support contact

### Edit Admin

#### Edit Mode

Toggle edit mode to modify:

- Personal information
- Contact details
- Role assignment
- Department
- Timezone
- Status

#### Validation

- Email format validation
- Unique email requirement
- Required field checks
- Role authorization check

#### Save Process

1. Validate changes
2. Confirm critical changes (role, status)
3. Update database
4. Send notification to admin (if applicable)
5. Log change in activity log
6. Update UI with success message

### Reset Password

#### Password Reset Flow

1. Admin clicks "Reset Password" for user
2. Confirmation dialog
3. System generates reset token
4. Email sent to admin user
5. User clicks link in email
6. User sets new password
7. Password requirements enforced:
   - Minimum 8 characters
   - Uppercase letter
   - Lowercase letter
   - Number
   - Special character (optional)

#### Force Password Change

Option to require password change on next login.

### Deactivate Account

#### Deactivation Process

1. Click "Deactivate" button
2. Confirmation dialog with impact explanation
3. Confirm action
4. Account marked as inactive
5. Active sessions terminated
6. Login disabled
7. Notification sent
8. Logged in activity log

#### Effects of Deactivation

- Cannot log in
- All active sessions ended
- API keys remain but inactive
- Data preserved
- Can be reactivated
- Audit trail maintained

### Reactivate Account

- Available for inactive accounts
- Restores access
- Sends reactivation email
- Requires password reset (optional)
- Logs reactivation event

### Delete Account

#### Deletion Process

1. Click "Delete" button
2. **WARNING DIALOG**:

   ```
   ⚠️ Delete Admin Account

   Are you sure you want to permanently delete this admin?

   This will:
   - Permanently remove the account
   - Revoke all access
   - Remove from all teams
   - Cannot be undone

   Type "DELETE" to confirm

   [Cancel] [Delete Permanently]
   ```

3. Type confirmation
4. Confirm deletion
5. Account deleted
6. Data anonymized/archived
7. Notification sent
8. Logged in audit trail

#### Data Handling

- Personal info removed
- Activity log preserved (anonymized)
- Created resources reassigned or archived
- Cannot be recovered

---

## 🔐 Security Features

### Authentication

**Login Requirements:**

- Email and password
- Two-factor authentication (optional/required)
- reCAPTCHA for protection
- Session management

**Password Policy:**

- Minimum 8 characters
- Complexity requirements
- Expiration policy (optional)
- History (no reuse of last 5 passwords)
- Lockout after failed attempts

### Authorization

**Role-Based Access Control (RBAC):**

- Predefined roles
- Permission inheritance
- Minimum privilege principle

**Session Management:**

- Secure session tokens
- Auto-logout on inactivity
- Single session enforcement (optional)
- Session hijacking protection

### Audit Trail

**All Actions Logged:**

- User identifier
- Action performed
- Timestamp
- IP address
- User agent
- Result (success/failure)
- Modified fields (before/after)

**Log Retention:**

- Stored securely
- Searchable
- Exportable
- Compliant with regulations

### Security Monitoring

**Alerts for:**

- Multiple failed login attempts
- Unusual access patterns
- Permission escalation attempts
- After-hours access (optional)
- Geographic anomalies

---

## 🎯 User Workflows

### Adding a New Admin

**Workflow:**

1. Navigate to `/admins`
2. Click "Add Admin"
3. Enter required details
4. Assign appropriate role
5. Submit form
6. Confirm invitation email sent
7. Wait for admin to activate account
8. Verify first login

**Best Practice:**

- Use work email
- Assign minimal necessary role
- Set up 2FA requirement
- Document purpose in notes

### Managing Admin Access

**Regular Review:**

1. Monthly access review
2. Check active admins
3. Verify roles still appropriate
4. Remove inactive accounts
5. Update permissions as needed

**Offboarding:**

1. Deactivate account immediately
2. Revoke all API keys
3. End active sessions
4. Transfer ownership of resources
5. Archive or delete account
6. Document in activity log

### Troubleshooting Access Issues

**Forgot Password:**

1. Admin requests reset
2. Verify identity
3. Send reset link
4. User sets new password

**Account Locked:**

1. Verify lockout reason
2. Check for security issues
3. Unlock account
4. Optionally require password reset

**Permission Issues:**

1. Verify current role
2. Check required permissions
3. Adjust role or add permissions
4. Test access

---

## 🛠️ Technical Details

### API Endpoints

```typescript
// List all admins
GET /admins
Query: {
  page?: number,
  limit?: number,
  search?: string,
  role?: string,
  status?: 'active' | 'inactive' | 'pending'
}
Response: {
  code: 200,
  data: {
    results: Admin[],
    page: number,
    limit: number,
    totalPages: number,
    totalResults: number
  }
}

// Get admin detail
GET /admins/:id
Response: {
  code: 200,
  data: Admin
}

// Create admin
POST /admins
Body: {
  name: string,
  email: string,
  role: string,
  phone?: string,
  department?: string
}
Response: {
  code: 201,
  data: Admin
}

// Update admin
PATCH /admins/:id
Body: Partial<AdminUpdate>
Response: {
  code: 200,
  data: Admin
}

// Delete admin
DELETE /admins/:id
Response: {
  code: 204
}

// Reset password
POST /admins/:id/reset-password
Response: {
  code: 200,
  message: "Password reset email sent"
}

// Deactivate admin
PATCH /admins/:id/deactivate
Response: {
  code: 200,
  data: Admin
}

// Activate admin
PATCH /admins/:id/activate
Response: {
  code: 200,
  data: Admin
}

// Get admin activity
GET /admins/:id/activity
Query: {
  startDate?: string,
  endDate?: string,
  actionType?: string
}
Response: {
  code: 200,
  data: ActivityLog[]
}
```

### Data Models

```typescript
interface Admin {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  role: AdminRole;
  department?: string;
  status: "active" | "inactive" | "pending" | "suspended";
  profilePicture?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  lastActiveAt?: Date;
  twoFactorEnabled: boolean;
  failedLoginAttempts: number;
  accountLockedUntil?: Date;
}

interface AdminRole {
  id: string;
  name: string;
  permissions: Permission[];
  description: string;
}

interface Permission {
  id: string;
  resource: string;
  actions: string[]; // create, read, update, delete
}

interface ActivityLog {
  id: string;
  adminId: string;
  actionType: string;
  resource: string;
  resourceId?: string;
  details: object;
  ipAddress: string;
  userAgent: string;
  result: "success" | "failure";
  timestamp: Date;
}
```

---

## 📊 Statistics & Analytics

### Admin Metrics

**Platform-Wide:**

- Total admin accounts
- Active admins
- Admin login frequency
- Most active admins
- Actions per admin

**Individual Admin:**

- Login history
- Actions performed
- Resources created
- Last active time
- Session duration

---

## 🚀 Future Enhancements

### 1. Advanced Role Management

- Custom role creation
- Permission templates
- Role hierarchies
- Temporary role elevation

### 2. Enhanced Security

- Biometric authentication
- Hardware token support
- IP-based restrictions
- Geo-fencing
- Behavioral analysis

### 3. Team Features

- Team/department grouping
- Delegation capabilities
- Approval workflows
- Collaboration tools

### 4. Audit & Compliance

- Detailed audit reports
- Compliance dashboards
- Automated compliance checks
- Export for auditors

### 5. Integration

- SSO/SAML support
- LDAP/Active Directory sync
- Slack/Teams notifications
- Webhook events

---

## 📝 Best Practices

### Admin Account Management

1. **Least Privilege**: Assign minimum necessary permissions
2. **Regular Reviews**: Quarterly access audits
3. **Unique Accounts**: No shared credentials
4. **Strong Authentication**: Enforce 2FA
5. **Prompt Offboarding**: Immediate deactivation on departure

### Security Guidelines

1. **Password Policy**: Enforce strong passwords
2. **Session Timeout**: Auto-logout after inactivity
3. **Activity Monitoring**: Review logs regularly
4. **Incident Response**: Clear procedures for breaches
5. **Documentation**: Maintain up-to-date access records

### Operational Best Practices

1. **Clear Naming**: Descriptive admin names/titles
2. **Contact Info**: Keep contact details current
3. **Documentation**: Document admin purposes/responsibilities
4. **Communication**: Notify team of access changes
5. **Training**: Ensure admins understand their permissions

---

## 🔍 Troubleshooting

### Common Issues

**Cannot Login**

- Verify account is active
- Check email is correct
- Try password reset
- Check for account lockout
- Verify 2FA is working

**Missing Permissions**

- Check assigned role
- Verify role permissions
- Contact super admin
- Review audit log for changes

**Account Locked**

- Check failed login attempts
- Verify lockout expiration
- Contact super admin to unlock
- Reset password after unlock

**Email Not Received**

- Check spam folder
- Verify email address is correct
- Resend invitation
- Check email service status
- Contact support

---

## 📚 Related Documentation

- [Authentication System](./AUTHENTICATION.md)
- [Security Policies](./SECURITY.md)
- [User Permissions](./PERMISSIONS.md)
- [Audit Logging](./AUDIT_LOG.md)
