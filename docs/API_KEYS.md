# API Keys Management

## 📚 Overview

The API Keys Management system provides secure, granular access control for external applications and services to interact with the Eny Consulting platform. Administrators can create, manage, and monitor API keys with fine-grained permissions, rate limiting, and usage tracking.

## 🎯 Purpose

- **Secure Access**: Provide controlled API access to external systems
- **Permission Management**: Granular control over API endpoint access
- **Usage Monitoring**: Track API key usage and performance
- **Rate Limiting**: Prevent abuse with configurable rate limits
- **Origin Control**: Restrict API access by allowed origins

## 🗺️ System Architecture

The API Keys system consists of three main sections:

1. **API Keys List** - Overview and management
2. **Create API Key** - Generate new keys
3. **API Key Detail** - View and edit individual keys

---

## 📖 Feature Documentation

## 1. API Keys List

**Route:** `/api-keys`  
**Component:** `ApiKeys.tsx`

### Purpose

Central dashboard for viewing and managing all API keys with statistics and quick actions.

### Statistics Cards

#### 📊 Overview Metrics

**Total API Keys**

- Count of all API keys (active + inactive)
- Icon: Key
- Quick metric for total API coverage

**Active Keys**

- Currently active and usable keys
- Icon: CheckCircle (Green)
- Indicates operational API access

**Inactive Keys**

- Deactivated or expired keys
- Icon: XCircle (Red)
- Shows disabled access points

**Total Requests**

- Cumulative API requests across all keys
- Icon: Activity
- Usage volume indicator

### API Keys Table

#### Display Columns

| Column      | Description                         |
| ----------- | ----------------------------------- |
| Name        | API key name/identifier             |
| Key         | Masked key (first 20 chars visible) |
| Status      | Active/Inactive/Expired badge       |
| Permissions | Number of granted permissions       |
| Usage       | Total request count                 |
| Last Used   | Timestamp of last API call          |
| Rate Limit  | Requests per hour limit             |
| Expires     | Expiration date (if set)            |
| Actions     | View details button                 |

#### Key Display

```
Format: ency-[random-string]...
Display: ency-abc123def456... (masked)
Copy Feature: Click to copy full key
```

#### Status Badges

| Status   | Color | Condition                        |
| -------- | ----- | -------------------------------- |
| Active   | Green | `isActive: true` and not expired |
| Inactive | Gray  | `isActive: false`                |
| Expired  | Red   | Current date > expiresAt         |

### Features

#### 🔍 Search

- Search by key name or description
- Real-time filtering
- Case-insensitive
- Debounced input

#### 🔄 Refresh

- Manual data refresh
- Loading state indication
- Auto-refresh on mount

#### ➕ Create New

- Navigate to creation form
- Quick access button
- Prominent placement

#### 📋 Quick Actions

- Click row to view details
- Copy API key to clipboard
- Visual feedback on copy

---

## 2. Create API Key

**Route:** `/api-keys/create`  
**Component:** `CreateApiKey.tsx`

### Purpose

Generate new API keys with custom configuration, permissions, and security settings.

### Form Sections

#### 1️⃣ Basic Information

**Name** (Required)

- Purpose: Identify the API key
- Validation: 3-100 characters
- Example: "Mobile App Production", "Partner Integration"
- Unique: Should be descriptive

**Description** (Optional)

- Purpose: Additional context
- Validation: Max 500 characters
- Example: "API key for iOS app version 2.0"
- Use case: Documentation and tracking

#### 2️⃣ Security Settings

**Expiration Date** (Optional)

- Purpose: Automatic key deactivation
- Validation: Must be future date
- Format: ISO 8601 (YYYY-MM-DD)
- Default: None (never expires)
- Use case: Temporary access, security compliance

**Rate Limit** (Optional)

- Purpose: Prevent API abuse
- Validation: 1-10,000 requests/hour
- Default: None (unlimited)
- Unit: Requests per hour
- Recommended: Set based on expected usage

#### 3️⃣ Permissions

**Available Permissions:**

Assessment Management:

- ✓ `assessment:create` - Create new assessments
- ✓ `assessment:read` - View assessment details

Question Management:

- ✓ `question:create` - Add questions to assessments
- ✓ `question:read` - View question details

Attempt Management:

- ✓ `attempt:create` - Submit assessment attempts
- ✓ `attempt:read` - View attempt results
- ✓ `attempt:send` - Send attempts/results

**Selection:**

- Multi-select checkboxes
- Select all/none options
- Visual grouping by category
- At least one permission recommended

#### 4️⃣ Allowed Origins

**Purpose:** CORS/Origin-based access control

**Configuration:**

- Multiple origins supported
- Add/remove dynamically
- URL validation
- Wildcard support (\*.example.com)

**Format Examples:**

```
https://app.example.com
https://api.example.com
http://localhost:3000
https://*.example.com
```

**Validation:**

- Valid URL format
- Protocol required (http/https)
- Port optional
- Subdomain wildcards allowed

### Form Behavior

#### Validation

- Real-time validation on blur
- Error messages below fields
- Submit disabled until valid
- Success toast on creation

#### Dynamic Fields

- Add multiple origins
- Remove origin button per field
- Minimum 1 origin field
- Add new field button

#### Submission

1. Validate all fields
2. Send POST request to `/api-keys`
3. On success:
   - Show success toast
   - Navigate to detail page with new key ID
   - Display full key (one-time view)
4. On error:
   - Show error toast
   - Display validation errors
   - Keep form data

### Security Considerations

**Key Generation:**

- Server-side generation
- Cryptographically secure
- Unique identifier
- Prefix: `ency-`

**One-Time Display:**

- Full key shown only once after creation
- Copy to clipboard reminder
- Warning message about storage
- Cannot retrieve full key later

---

## 3. API Key Detail

**Route:** `/api-keys/:id`  
**Component:** `ApiKeyDetail.tsx`

### Purpose

View, edit, monitor, and manage individual API keys with comprehensive statistics and controls.

### View Mode Components

#### 📊 Statistics Cards

**Component:** `ApiKeyStats.tsx`

**Total Requests**

- Total API calls made with this key
- Icon: Activity
- Live updating

**Last Used**

- Timestamp of most recent API call
- Icon: Clock
- Relative time display (e.g., "2 hours ago")

**Rate Limit**

- Current rate limit setting
- Icon: Zap
- "Unlimited" if not set

**Expiration**

- Expiration date if configured
- Icon: Calendar
- "Never" if not set
- Warning color if expired/expiring soon

#### 🔑 API Key Display

**Component:** `ApiKeyDisplay.tsx`

Features:

- Masked key display (first 20 characters)
- Copy to clipboard button
- Security warning message
- Visual copy confirmation
- "Key copied!" toast

Display Format:

```
Key: ency-abc123def456...
[Copy] button
⚠️ Store this key securely. It provides access to your account.
```

#### ℹ️ Basic Information

**Component:** `ApiKeyBasicInfo.tsx`

View Mode:

- Name display
- Description (if any)
- Expiration date
- Rate limit
- Created date
- Status (Active/Inactive)

Edit Mode:

- Editable input fields
- Date picker for expiration
- Number input for rate limit
- Text area for description
- Save/Cancel buttons

#### 🔒 Permissions

**Component:** `ApiKeyPermissions.tsx`

View Mode:

- List of granted permissions
- Grouped by category
- Badge display
- Count indicator

Edit Mode:

- Checkbox list
- Select/deselect all
- Category grouping
- Permission descriptions

#### 🌐 Allowed Origins

**Component:** `ApiKeyAllowedOrigins.tsx`

View Mode:

- List of allowed origins
- Badge display for each
- Count indicator
- Empty state if none

Edit Mode:

- Add/remove origin fields
- URL validation
- Multiple entries
- Save/Cancel actions

#### 📄 Metadata

**Component:** `ApiKeyMetadata.tsx`

Display:

- **ID**: Unique identifier
- **Created By**: Admin who created the key
- **Created At**: Creation timestamp
- **Updated At**: Last modification timestamp
- Non-editable
- Copy ID button

### Actions

#### 🔄 Activate/Deactivate

- Toggle button
- Immediate effect
- Status badge update
- API calls blocked when inactive
- Confirmation dialog
- Success toast

Endpoints:

```
PATCH /api-keys/:id/activate
PATCH /api-keys/:id/deactivate
```

#### ✏️ Edit Mode

- Toggle edit/view mode
- Editable fields:
  - Name
  - Description
  - Expiration date
  - Rate limit
  - Permissions
  - Allowed origins
- Save button (validates and updates)
- Cancel button (reverts changes)
- Optimistic updates

#### 🗑️ Delete

**Component:** `DeleteApiKeyDialog.tsx`

Features:

- Confirmation dialog
- Warning message
- Impact explanation
- Type-to-confirm (optional)
- Permanent action
- Success redirect to list

Dialog Content:

```
⚠️ Delete API Key

Are you sure you want to delete this API key?

This action cannot be undone. All applications using
this key will immediately lose access.

[Cancel] [Delete]
```

### Usage Monitoring

#### Real-Time Statistics

Endpoint: `GET /api-keys/:id/stats`

**Metrics Tracked:**

- Total requests
- Requests today
- Requests this week
- Requests this month
- Last used timestamp
- Average requests per day
- Peak usage times

**Refresh:**

- Auto-refresh every 30 seconds (optional)
- Manual refresh button
- Loading state indicators

#### Usage Trends (Future Enhancement)

- Chart showing requests over time
- Peak hour analysis
- Endpoint breakdown
- Response time metrics
- Error rate tracking

---

## 🔐 Security Features

### Key Security

**Generation:**

- Server-side only
- Cryptographically secure random string
- Unique prefix (`ency-`)
- Sufficient entropy (256-bit)

**Storage:**

- Hashed in database
- Original key never stored
- Only shown once on creation
- Admin cannot retrieve later

**Transmission:**

- HTTPS only
- Secure headers
- No key logging
- Clipboard security

### Access Control

**Permissions System:**

- Granular endpoint control
- Resource-based permissions
- Action-level restrictions
- Minimum privilege principle

**Origin Restrictions:**

- CORS enforcement
- Wildcard support for subdomains
- Protocol validation
- Multiple origin support

**Rate Limiting:**

- Per-key limits
- Configurable thresholds
- Sliding window algorithm
- 429 response on exceed

### Monitoring & Auditing

**Activity Tracking:**

- All API calls logged
- Usage statistics
- Last used timestamp
- Anomaly detection (future)

**Audit Trail:**

- Key creation logged
- Permission changes tracked
- Activation/deactivation recorded
- Deletion logged with admin ID

---

## 🎯 Use Cases

### 1. Mobile Application

```yaml
Name: "Mobile App - Production"
Description: "API access for iOS and Android apps"
Expiration: Never
Rate Limit: 10,000/hour
Permissions:
  - assessment:read
  - question:read
  - attempt:create
  - attempt:read
Origins:
  - https://app.example.com
```

### 2. Partner Integration

```yaml
Name: "Partner XYZ Integration"
Description: "Third-party integration for assessment delivery"
Expiration: 2025-12-31
Rate Limit: 5,000/hour
Permissions:
  - assessment:create
  - assessment:read
  - question:create
  - attempt:read
Origins:
  - https://partner-xyz.com
  - https://api.partner-xyz.com
```

### 3. Internal Service

```yaml
Name: "Internal Analytics Service"
Description: "Backend service for data aggregation"
Expiration: Never
Rate Limit: 50,000/hour
Permissions:
  - assessment:read
  - question:read
  - attempt:read
  - attempt:send
Origins:
  - https://analytics.internal.example.com
```

### 4. Development/Testing

```yaml
Name: "Development Environment"
Description: "Testing API integration locally"
Expiration: 30 days from creation
Rate Limit: 1,000/hour
Permissions:
  - All permissions (for testing)
Origins:
  - http://localhost:3000
  - http://localhost:8080
  - https://*.dev.example.com
```

---

## 🛠️ Technical Details

### API Endpoints

```typescript
// List all API keys
GET /api-keys
Response: {
  code: 200,
  message: "API keys retrieved successfully",
  data: {
    results: ApiKey[],
    page: number,
    limit: number,
    totalPages: number,
    totalResults: number
  }
}

// Create new API key
POST /api-keys
Body: {
  name: string,
  description?: string,
  expiresAt?: string,
  rateLimit?: number,
  permissions?: string[],
  allowedOrigins?: string[]
}
Response: {
  code: 201,
  message: "API key created successfully",
  data: {
    id: string,
    key: string, // Full key, shown only once
    ...otherFields
  }
}

// Get API key details
GET /api-keys/:id
Response: {
  code: 200,
  data: ApiKey
}

// Update API key
PATCH /api-keys/:id
Body: Partial<ApiKeyUpdate>
Response: {
  code: 200,
  data: ApiKey
}

// Delete API key
DELETE /api-keys/:id
Response: {
  code: 204
}

// Activate API key
PATCH /api-keys/:id/activate
Response: {
  code: 200,
  data: ApiKey
}

// Deactivate API key
PATCH /api-keys/:id/deactivate
Response: {
  code: 200,
  data: ApiKey
}

// Get API key statistics
GET /api-keys/:id/stats
Response: {
  code: 200,
  data: {
    totalRequests: number,
    lastUsedAt: string,
    requestsToday: number,
    requestsThisWeek: number,
    requestsThisMonth: number
  }
}
```

### Data Models

```typescript
interface ApiKey {
  id: string;
  name: string;
  description?: string;
  key: string; // Hashed in DB, full key shown only on creation
  isActive: boolean;
  expiresAt?: Date;
  rateLimit?: number; // requests per hour
  permissions: Permission[];
  allowedOrigins: string[];
  usage: {
    totalRequests: number;
    lastUsedAt?: Date;
  };
  createdBy: string; // Admin user ID
  createdAt: Date;
  updatedAt: Date;
}

interface Permission {
  id: string;
  resource: "assessment" | "question" | "attempt";
  action: "create" | "read" | "update" | "delete" | "send";
  fullPermission: string; // e.g., "assessment:read"
}

interface ApiKeyStats {
  totalRequests: number;
  lastUsedAt?: Date;
  requestsToday: number;
  requestsThisWeek: number;
  requestsThisMonth: number;
  averageRequestsPerDay: number;
  peakHour?: number;
}
```

### Validation Rules

```typescript
const validationRules = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  description: {
    required: false,
    maxLength: 500,
  },
  expiresAt: {
    required: false,
    type: "date",
    mustBeFuture: true,
  },
  rateLimit: {
    required: false,
    type: "number",
    min: 1,
    max: 10000,
  },
  permissions: {
    required: false,
    type: "array",
    items: {
      enum: [
        "assessment:create",
        "assessment:read",
        "question:create",
        "question:read",
        "attempt:create",
        "attempt:read",
        "attempt:send",
      ],
    },
  },
  allowedOrigins: {
    required: false,
    type: "array",
    items: {
      type: "url",
      allowWildcard: true,
    },
  },
};
```

---

## 📊 Usage Analytics

### Metrics Tracked

**Per-Key Metrics:**

- Total requests
- Requests per endpoint
- Response times
- Error rates
- Last used timestamp

**Platform-Wide Metrics:**

- Total API keys
- Active vs inactive keys
- Total API requests
- Average requests per key
- Most used endpoints

**Future Analytics:**

- Geographic distribution
- Peak usage times
- Quota consumption
- Anomaly detection
- Cost allocation

---

## 🚀 Future Enhancements

### 1. Advanced Permissions

- Custom permission definitions
- Role-based access templates
- IP whitelisting/blacklisting
- Webhook permissions

### 2. Enhanced Monitoring

- Real-time usage charts
- Alert thresholds
- Anomaly detection
- Cost tracking
- SLA monitoring

### 3. Key Rotation

- Automated key rotation schedule
- Dual-key support during rotation
- Rotation notifications
- Audit trail

### 4. Advanced Rate Limiting

- Quota management
- Burst allowance
- Dynamic rate limiting
- Cost-based limits

### 5. Integration Features

- API key templates
- Bulk operations
- CSV export
- Webhook events
- Audit log export

### 6. Developer Experience

- API playground
- Code examples
- SDK generation
- Interactive documentation
- Testing sandbox

---

## 📝 Best Practices

### Creating API Keys

1. **Use descriptive names** - Clearly identify the purpose
2. **Set expiration dates** - For temporary or test keys
3. **Implement least privilege** - Only grant necessary permissions
4. **Configure rate limits** - Protect against abuse
5. **Restrict origins** - Limit to known domains

### Managing API Keys

1. **Regular audits** - Review active keys quarterly
2. **Remove unused keys** - Delete inactive or expired keys
3. **Monitor usage** - Track for anomalies
4. **Rotate keys** - Periodically refresh production keys
5. **Document usage** - Maintain clear descriptions

### Security Guidelines

1. **Never share keys** - Treat as passwords
2. **Store securely** - Use environment variables or secret managers
3. **Use HTTPS only** - Never transmit over HTTP
4. **Monitor logs** - Watch for suspicious activity
5. **Revoke immediately** - If compromised, deactivate instantly

### Development Workflow

1. **Separate keys** - Different keys for dev/staging/production
2. **Short expiration** - Dev keys expire in 30-90 days
3. **Lower rate limits** - Conservative limits for testing
4. **Local origins** - Include localhost for development
5. **Version control** - Never commit keys to git

---

## 🔍 Troubleshooting

### Common Issues

**Issue: API Key Not Working**

- Check if key is active
- Verify expiration date
- Confirm permissions are granted
- Validate origin is allowed
- Check rate limit not exceeded

**Issue: Rate Limit Exceeded (429)**

- Review current rate limit setting
- Check usage statistics
- Consider increasing limit
- Implement request throttling in application

**Issue: Origin Blocked (CORS)**

- Verify origin format (include protocol)
- Check for wildcards in allowed origins
- Ensure origin exactly matches (no trailing slash)
- Test with browser dev tools

**Issue: Key Creation Fails**

- Validate all required fields
- Check name uniqueness
- Verify future expiration date
- Ensure valid URL format for origins

---

## 📚 Related Documentation

- [API Reference](./API_ENDPOINTS.md)
- [Authentication Guide](./AUTHENTICATION.md)
- [Security Policies](./SECURITY.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
