# Job Search Platform

## 📚 Overview

The Job Search Platform is a comprehensive job board management system that connects job seekers with employers. It includes user management, job posting administration, application tracking, and subscription plan management.

## 🎯 Purpose

Facilitate the entire job search ecosystem by providing tools to:

- Manage job seekers and employers
- Create and publish job postings
- Track job applications
- Administer subscription plans
- Monitor platform activity

## 🗺️ Platform Architecture

The platform consists of five main sections:

1. **Platform Overview** - Dashboard with statistics
2. **Users Management** - Job seekers and employers
3. **Job Postings** - Create and manage job listings
4. **Applications** - Track job applications
5. **Subscriptions** - Manage subscription plans and user subscriptions

---

## 📖 Feature Documentation

## 1. Platform Overview

**Route:** `/jobs`

### Purpose

Central hub for the job platform with real-time statistics and quick navigation.

### Statistics Cards

#### 👥 All Users

- **Value**: Total registered users (job seekers + employers)
- **Description**: Total registered users in the platform
- **Navigate to**: `/jobs/users`

#### 💼 Job Postings

- **Value**: Total job opportunities created
- **Description**: Total job opportunities created
- **Navigate to**: `/jobs/postings`

#### 📄 Job Applications

- **Value**: Total applications submitted
- **Description**: Total job applications submitted
- **Navigate to**: `/jobs/applications`

#### 💳 Subscription Plans

- **Value**: Number of subscription plans
- **Description**: Manage subscription plans
- **Navigate to**: `/jobs/subscriptions`

#### 👥 User Subscriptions

- **Value**: Active user subscriptions
- **Description**: Monitor active user subscriptions
- **Navigate to**: `/jobs/user-subscriptions`

### Features

- **Real-time Statistics**: Auto-refreshing platform metrics
- **Quick Navigation**: Click cards to navigate to respective sections
- **Refresh Button**: Manual data refresh capability
- **Error Handling**: Graceful error display with retry option

---

## 2. Users Management

**Routes:**

- List: `/jobs/users`
- Detail: `/jobs/users/:id`

### 2.1 User List (`/jobs/users`)

#### Purpose

Manage all platform users including job seekers and employers.

#### Features

##### Statistics Overview

- **Total Users**: Combined count
- **Job Seekers**: Total job seeker accounts
- **Employers**: Total employer accounts
- **Active Today**: Users active in last 24 hours

##### User Table

Display columns:

- Name (with avatar)
- Email address
- Account type (Job Seeker / Employer)
- Registration date
- Last active
- Status (Active/Inactive/Suspended)
- Subscription status
- Actions

##### Filtering & Search

- **Search**: By name or email
- **Account Type Filter**:
  - All
  - Job Seekers
  - Employers
- **Status Filter**:
  - All
  - Active
  - Inactive
  - Suspended
- **Subscription Filter**:
  - All
  - Free
  - Basic
  - Premium
  - Enterprise

##### Bulk Actions

- Export user data
- Send notifications
- Update subscription status

#### User Card Display

- Profile picture
- Full name and contact info
- Account type badge
- Subscription level
- Member since date
- Last login time

---

### 2.2 User Detail Page

**Route:** `/jobs/users/:id`  
**Component:** `JobUserDetailExpanded.tsx`

#### Comprehensive User Profile

##### 📋 User Header

**Component:** `UserHeader.tsx`

- Profile picture
- Full name
- Account type (Job Seeker/Employer badge)
- Email address (with verification status)
- Phone number (with verification status)
- Account status controls (Activate/Deactivate/Suspend)
- Send notification button

##### 📊 Quick Stats Cards

**Component:** `QuickStatsCards.tsx`

For Job Seekers:

- **Applications Submitted**
- **Profile Views**
- **Saved Jobs**
- **Profile Completion**

For Employers:

- **Job Postings Created**
- **Total Applications Received**
- **Active Postings**
- **Profile Views**

##### 👤 Account Snapshot

**Component:** `AccountSnapshot.tsx`

- Account creation date
- Last login time
- Total logins count
- Account status
- Subscription plan
- Payment status

##### 📱 Push Notifications

**Component:** `PushNotificationDialog.tsx`

Features:

- Send targeted push notifications
- Title and message input
- Preview before sending
- Delivery confirmation
- Notification history

##### 💳 Subscription History

**Component:** `UserSubscriptionHistory.tsx`

Display:

- Current subscription plan
- Subscription status (Active/Expired/Cancelled)
- Start date and end date
- Payment history
- Upgrade/downgrade history
- Renewal date

Timeline view showing:

- Plan name
- Status badge
- Duration
- Amount paid
- Payment method

##### 👔 Job Seeker Profile

**Component:** `JobSeekerProfileDisplay.tsx`

Comprehensive profile sections:

**Personal Information**

- Full name
- Date of birth
- Gender
- Location (city, country)
- Languages spoken

**Professional Summary**

- Bio/About section
- Career objective
- Years of experience

**Work Experience**

- Company name
- Job title
- Employment period
- Responsibilities
- Achievements

**Education**

- Institution name
- Degree/Certificate
- Field of study
- Graduation year
- GPA (if provided)

**Skills**

- Technical skills
- Soft skills
- Skill level indicators
- Endorsements

**Certifications**

- Certificate name
- Issuing organization
- Issue date
- Expiry date (if applicable)
- Credential ID

**Portfolio/Projects**

- Project title
- Description
- Technologies used
- Links
- Images

**Preferences**

- Desired job titles
- Preferred locations
- Expected salary range
- Job type preference
- Work arrangement (Remote/Hybrid/On-site)

##### 🏢 Employer Profile

**Component:** `EmployerProfileDisplay.tsx`

Company information sections:

**Company Details**

- Company name
- Industry
- Company size
- Founded year
- Website
- Company logo

**About Company**

- Company description
- Mission statement
- Vision statement
- Company culture

**Contact Information**

- Primary contact person
- Email address
- Phone number
- Office locations

**Social Media**

- LinkedIn
- Twitter
- Facebook
- Instagram

**Benefits Offered**

- Health insurance
- Retirement plans
- PTO policy
- Remote work options
- Professional development
- Other perks

##### 📋 Platform Guidelines

**Component:** `PlatformGuidelines.tsx`

User compliance tracking:

- Terms of service acceptance
- Privacy policy agreement
- Community guidelines status
- Warning history
- Violation count
- Account restrictions

---

## 3. Job Postings Management

**Routes:**

- List: `/jobs/postings`
- Detail: `/jobs/postings/:id`

### 3.1 Job Postings List

**Route:** `/jobs/postings`  
**Component:** `JobPostings.tsx`

#### Statistics Cards

- **Total Postings**: All job postings created
- **Published**: Live job postings
- **Draft**: Unpublished postings
- **Applications**: Total applications received

#### Job Posting Display

Each posting shows:

- Job title
- Company name and logo
- Location
- Job type (Full-time, Part-time, Contract, Internship)
- Salary range
- Posted date
- Application deadline
- Status badge (Published, Draft, Closed, Expired)
- Application count
- View count

#### Filters & Search

- **Search**: By job title, company, or location
- **Status Filter**: Published, Draft, Closed, Expired
- **Job Type**: Full-time, Part-time, Contract, Internship
- **Location**: Filter by city or remote
- **Salary Range**: Min-max slider
- **Date Posted**: Last 24h, 7 days, 30 days, All time

#### Actions

- View posting details
- Edit posting
- Publish/unpublish
- Close posting
- Delete posting
- View applications

---

### 3.2 Job Posting Detail

**Route:** `/jobs/postings/:id`  
**Component:** `JobPostingDetail.tsx`

#### Job Details Display

##### Header Section

- Job title
- Company name
- Location
- Salary range
- Status badge
- Action buttons (Edit, Publish, Close, Delete)

##### Job Information

- **Job Type**: Full-time, Part-time, etc.
- **Experience Level**: Entry, Mid, Senior
- **Education Required**: Minimum education
- **Posted Date**: When the job was posted
- **Deadline**: Application deadline
- **Remote Work**: Yes/No
- **Visa Sponsorship**: Available/Not available

##### Job Description

- Full job description
- Responsibilities
- Requirements
- Qualifications
- Nice to have

##### Application Statistics

- Total applications received
- Pending review count
- Reviewed count
- Shortlisted count
- Rejected count

##### Company Information

- Company logo
- Company name
- Industry
- Company size
- About company

##### Applications List

Quick view of recent applications:

- Applicant name
- Applied date
- Status
- Actions (View, Shortlist, Reject)

#### Edit Mode

Toggle to edit:

- Job title and description
- Requirements
- Salary range
- Location
- Deadline
- Status

---

## 4. Job Applications Management

**Routes:**

- List: `/jobs/applications`
- Detail: `/jobs/applications/:id`

### 4.1 Applications List

**Route:** `/jobs/applications`  
**Component:** `JobApplications.tsx`

#### Statistics

- **Total Applications**: All applications received
- **Pending Review**: Awaiting review
- **Shortlisted**: Candidates shortlisted
- **Rejected**: Rejected applications

#### Application Display

Each application shows:

- Applicant name and photo
- Job title applied for
- Company name
- Applied date
- Status (Pending, Reviewed, Shortlisted, Rejected)
- Resume/CV link
- Cover letter preview

#### Filters

- **Status**: Pending, Reviewed, Shortlisted, Rejected
- **Date Applied**: Date range picker
- **Job Posting**: Filter by specific job
- **Company**: Filter by company

#### Bulk Actions

- Mark as reviewed
- Shortlist multiple
- Reject multiple
- Export applications

---

### 4.2 Application Detail

**Route:** `/jobs/applications/:id`  
**Component:** `JobApplicationDetail.tsx`

#### Comprehensive Application View

##### Applicant Information

- Full name
- Email and phone
- Current location
- Profile picture
- LinkedIn profile
- Portfolio website

##### Application Details

- Job applied for
- Company name
- Applied date
- Application status
- Status history timeline

##### Resume/CV

- View inline or download
- PDF preview
- Resume parsing (if available)

##### Cover Letter

- Full text display
- Formatted view

##### Candidate Profile Summary

Quick view of:

- Years of experience
- Current/last position
- Education level
- Key skills
- Availability

##### Assessment Results

If assessment was completed:

- Assessment name
- Score
- Pass/Fail
- Completion date
- View detailed results

##### Status Management

Update application status:

- Pending Review
- Under Review
- Shortlisted
- Interview Scheduled
- Offer Extended
- Rejected
- Withdrawn

##### Notes & Comments

- Add internal notes
- Track communication
- Tag team members
- Set reminders

##### Actions

- **Schedule Interview**: Create interview event
- **Send Email**: Contact applicant
- **Download Resume**: Export CV
- **View Full Profile**: See complete job seeker profile
- **Reject**: Decline application
- **Shortlist**: Add to shortlist
- **Extend Offer**: Make job offer

---

## 5. Subscription Management

### 5.1 Subscription Plans

**Routes:**

- List: `/jobs/subscriptions`
- Create: `/jobs/subscriptions/create`
- Detail: `/jobs/subscriptions/:id`

#### 5.1.1 Subscription Plans List

**Route:** `/jobs/subscriptions`  
**Component:** `Subscriptions.tsx`

##### Statistics

- **Total Plans**: Number of subscription plans
- **Active Plans**: Currently available plans
- **Total Subscribers**: Users with active subscriptions
- **Monthly Revenue**: Total subscription revenue

##### Plan Display

Each plan shows:

- Plan name
- Price (monthly/yearly)
- Account type (Job Seeker/Employer)
- Features included
- Subscriber count
- Status (Active/Inactive)
- Actions

##### Plan Types

**Job Seeker Plans:**

- Free
- Basic
- Premium
- Enterprise

**Employer Plans:**

- Free Trial
- Starter
- Professional
- Enterprise

---

#### 5.1.2 Create Subscription Plan

**Route:** `/jobs/subscriptions/create`  
**Component:** `CreateSubscription.tsx`

##### Form Sections

**Basic Information**  
**Component:** `SubscriptionBasicInfo.tsx`

- Plan name (required)
- Description
- Price (monthly/yearly)
- Account type (Job Seeker/Employer)
- Billing interval (Monthly/Yearly)
- Status toggles:
  - Is Active
  - Is Custom
  - Is Free

**Features Selection**  
**Component:** `SubscriptionFeaturesInput.tsx`

Job Seeker Features:

- ✓ Profile creation
- ✓ Job search
- ✓ Application tracking
- ✓ Resume builder
- ✓ Skill assessments
- ✓ Career resources
- ✓ Priority support

Employer Features:

- ✓ Post jobs
- ✓ Search candidates
- ✓ Application management
- ✓ Company profile
- ✓ Analytics dashboard
- ✓ Team collaboration
- ✓ Priority support

**Feature Limits**  
**Component:** `SubscriptionLimitsInput.tsx`

Configure limits for:

- Number of job applications (Job Seekers)
- Number of saved jobs (Job Seekers)
- Number of job postings (Employers)
- Number of active postings (Employers)
- Team member count (Employers)
- Monthly search credits
- Feature access duration

##### Validation

```typescript
{
  name: required, min 3, max 100 chars
  price: >= 0, numeric
  interval: 'monthly' | 'yearly'
  accountType: 'jobseeker' | 'employer'
  features: array of selected features
  limits: numeric values >= 0
}
```

---

#### 5.1.3 Subscription Plan Detail

**Route:** `/jobs/subscriptions/:id`  
**Component:** `SubscriptionDetail.tsx`

##### View Components

**Summary Cards**  
**Component:** `SubscriptionSummaryCards.tsx`

- Total subscribers
- Monthly revenue
- Churn rate
- Growth rate

**Basic Info Display**  
**Component:** `SubscriptionBasicInfo.tsx`

- Plan name and description
- Pricing information
- Account type
- Status badges

**Features Display**  
**Component:** `SubscriptionFeatures.tsx`

- List of included features
- Feature limits
- Comparison table

**Metadata**  
**Component:** `SubscriptionMetadata.tsx`

- Created date
- Last updated
- Created by
- Plan ID

##### Edit Mode

- Toggle edit mode
- Modify plan details
- Update pricing
- Change features
- Adjust limits
- Save or cancel changes

##### Delete Plan

**Component:** `DeleteSubscriptionDialog.tsx`

- Confirmation dialog
- Warning about active subscribers
- Option to migrate users
- Permanent deletion

---

### 5.2 User Subscriptions

**Route:** `/jobs/user-subscriptions`  
**Component:** `UserSubscriptions.tsx`

#### Purpose

Monitor and manage active user subscriptions across the platform.

#### Statistics Cards

**Component:** `SubscriptionStatisticsCards.tsx`

- **Total Subscriptions**: All active subscriptions
- **Active**: Currently active
- **Expiring Soon**: Expiring in 7 days
- **Cancelled**: Recently cancelled

#### Subscription Table

**Component:** `SubscriptionTableRow.tsx` (per row)

Display columns:

- User name and email
- Account type
- Subscription plan
- Status (Active/Expired/Cancelled)
- Start date
- End date
- Amount
- Payment status
- Auto-renewal status
- Actions

#### Filters

- **Status**: Active, Expired, Cancelled, Expiring Soon
- **Account Type**: Job Seeker, Employer
- **Plan**: Filter by specific plan
- **Payment Status**: Paid, Pending, Failed

#### User Subscription Detail

**Component:** `SubscriptionDetailDialog.tsx`

Dialog showing:

- User information
- Current plan details
- Billing history
- Payment method
- Renewal date
- Cancellation option
- Upgrade/downgrade options

#### Actions

- View subscription details
- Cancel subscription
- Refund payment
- Send renewal reminder
- Upgrade/downgrade plan
- Extend subscription

---

## 🎯 User Workflows

### For Job Seekers

#### 1. Registration & Profile Setup

1. Create account → Select "Job Seeker"
2. Complete profile information
3. Upload resume/CV
4. Add work experience and education
5. List skills and certifications
6. Set job preferences

#### 2. Job Search & Application

1. Browse job postings
2. Filter by location, type, salary
3. View job details
4. Submit application
5. Track application status
6. Receive notifications

### For Employers

#### 1. Company Setup

1. Create account → Select "Employer"
2. Complete company profile
3. Add company logo and details
4. List company benefits
5. Verify company

#### 2. Posting a Job

1. Navigate to job postings
2. Click "Create Job"
3. Fill in job details
4. Set requirements
5. Publish job
6. Monitor applications

#### 3. Reviewing Applications

1. View applications list
2. Filter and search
3. Review candidate profiles
4. Shortlist candidates
5. Schedule interviews
6. Update application status

---

## 🔐 Access Control

### Admin Permissions

- Full access to all features
- User management
- Subscription management
- Platform configuration
- Analytics access

### Employer Permissions

- Post jobs
- View own job postings
- Manage applications for own jobs
- Edit company profile
- View analytics for own content

### Job Seeker Permissions

- Create and edit profile
- Browse and apply to jobs
- Track own applications
- Save jobs
- View own statistics

---

## 🛠️ Technical Details

### API Endpoints

#### Users

```
GET    /job-users                  - List all users
GET    /job-users/:id              - Get user detail
PATCH  /job-users/:id              - Update user
DELETE /job-users/:id              - Delete user
GET    /job-users/statistics       - Get user statistics
POST   /job-users/:id/notification - Send push notification
GET    /job-users/:id/subscriptions - Get user subscription history
```

#### Job Postings

```
GET    /job-postings               - List all postings
POST   /job-postings               - Create posting
GET    /job-postings/:id           - Get posting detail
PATCH  /job-postings/:id           - Update posting
DELETE /job-postings/:id           - Delete posting
POST   /job-postings/:id/publish   - Publish posting
POST   /job-postings/:id/close     - Close posting
GET    /job-postings/statistics    - Get posting statistics
```

#### Applications

```
GET    /job-applications           - List all applications
POST   /job-applications           - Submit application
GET    /job-applications/:id       - Get application detail
PATCH  /job-applications/:id       - Update application status
DELETE /job-applications/:id       - Delete application
GET    /job-applications/statistics - Get application statistics
```

#### Subscriptions

```
GET    /subscriptions              - List all plans
POST   /subscriptions              - Create plan
GET    /subscriptions/:id          - Get plan detail
PATCH  /subscriptions/:id          - Update plan
DELETE /subscriptions/:id          - Delete plan
GET    /user-subscriptions         - List user subscriptions
POST   /user-subscriptions         - Create user subscription
PATCH  /user-subscriptions/:id     - Update user subscription
```

---

## 📊 Data Models

### Job User

```typescript
interface JobUser {
  id: string;
  email: string;
  accountType: "jobseeker" | "employer";
  profile: JobSeekerProfile | EmployerProfile;
  status: "active" | "inactive" | "suspended";
  subscriptionId?: string;
  createdAt: Date;
  lastLoginAt: Date;
}
```

### Job Posting

```typescript
interface JobPosting {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: "fulltime" | "parttime" | "contract" | "internship";
  salaryMin?: number;
  salaryMax?: number;
  requirements: string[];
  employerId: string;
  status: "draft" | "published" | "closed" | "expired";
  deadline: Date;
  applications: string[];
  createdAt: Date;
}
```

### Subscription Plan

```typescript
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "monthly" | "yearly";
  accountType: "jobseeker" | "employer";
  features: string[];
  limits: FeatureLimits;
  isActive: boolean;
  isCustom: boolean;
  isFree: boolean;
}
```

---

## 🚀 Future Enhancements

1. **AI-Powered Matching**

   - Automatic job-candidate matching
   - Skill gap analysis
   - Resume optimization suggestions

2. **Video Interviews**

   - In-platform video calls
   - Interview scheduling
   - Recording capabilities

3. **Advanced Analytics**

   - Hiring funnel analysis
   - Time-to-hire metrics
   - Source effectiveness

4. **Integration Features**

   - ATS integration
   - Calendar sync
   - Background check services
   - Payment gateway integration

5. **Mobile App**
   - Native iOS and Android apps
   - Push notifications
   - Offline access

---

## 📝 Best Practices

### For Managing Users

- Verify employer accounts
- Monitor for spam/fake profiles
- Respond to support requests promptly
- Regular data cleanup

### For Job Postings

- Review postings for quality
- Enforce community guidelines
- Monitor for duplicates
- Ensure clear job descriptions

### For Subscriptions

- Clear pricing communication
- Flexible cancellation policy
- Regular feature updates
- Customer support availability
