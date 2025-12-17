# Assessment Management System

## 📚 Overview

The Assessment Management System is a comprehensive platform for creating, managing, and monitoring skill assessments. It provides tools for question creation, candidate tracking, attempt monitoring, and detailed analytics.

## 🎯 Purpose

Create and deploy professional assessments to evaluate candidate skills, track completion rates, and analyze performance metrics across your organization.

## 🗂️ System Architecture

The assessment system consists of four main workspaces:

### 1. **Assessment Hub** (`/assessments`)

Central navigation page with three main sections

### 2. **Assessment Workspace** (`/assessments/list`)

Manage all assessments

### 3. **Candidate Directory** (`/assessments/users`)

Manage assessment participants

### 4. **Performance Insights** (`/assessments/attempts`)

Track and analyze assessment attempts

---

## 📖 Feature Documentation

## 1. Assessment Hub

**Route:** `/assessments`

### Purpose

Landing page that provides navigation to all assessment-related features.

### Sections

#### 🎯 Assessment Workspace Card

- **Badge**: "Plan & launch"
- **Description**: Design rich assessments, control scoring rules, and get instant visibility over live sessions
- **Highlights**:
  - Spin up new assessments with templates and smart defaults
  - Monitor draft, live, and closed states
  - Preview candidate journey before publishing
- **Primary Action**: Open workspace → `/assessments/list`
- **Secondary Action**: Create assessment → `/assessments/create`

#### 👥 Candidate Directory Card

- **Badge**: "People & invites"
- **Description**: Invite cohorts, manage bulk uploads, and track individual progress
- **Highlights**:
  - Send invitations or reminders to specific groups
  - Review eligibility, status, and last seen details
  - Bulk import CSVs with validation feedback
- **Primary Action**: Manage candidates → `/assessments/users`
- **Secondary Action**: Invite people → `/assessments/users`

#### 📊 Performance Insights Card

- **Badge**: "Attempts"
- **Description**: Track candidate attempts, flag anomalies, and surface completion analytics
- **Highlights**:
  - Understand per-question performance
  - Spot at-risk cohorts with automated alerts
  - Export attempt data to BI tools
- **Primary Action**: Preview roadmap → `/assessments/attempts`

---

## 2. Assessment Workspace

**Routes:**

- List: `/assessments/list`
- Create: `/assessments/create`
- Edit: `/assessments/edit/:id`
- Detail: `/assessments/:id`

### 2.1 Assessment List (`/assessments/list`)

#### Features

- **Search & Filter**: Find assessments by title or description
- **Status Filtering**: Filter by draft, published, or closed
- **Statistics Cards**:
  - Total assessments
  - Published assessments
  - Draft assessments
  - Total attempts

#### Assessment Card Display

Each assessment shows:

- Title and description
- Status badge (Draft, Published, Closed)
- Question count
- Duration (formatted: "1h 30m")
- Attempt count
- Creation date
- Quick actions (View, Edit, Delete)

#### Actions

- **Create New**: Navigate to creation form
- **View Details**: Open assessment detail page
- **Edit**: Modify existing assessment
- **Delete**: Remove assessment (with confirmation)
- **Refresh**: Update data

---

### 2.2 Create/Edit Assessment

**Routes:**

- Create: `/assessments/create`
- Edit: `/assessments/edit/:id`

#### Form Sections

##### Basic Information

- **Title** (required, 3-200 characters)
- **Description** (optional, max 1000 characters)
- **Duration** (in minutes, 1-300)

##### Questions Management

Add and configure questions with:

- **Question Text** (required)
- **Question Type**:
  - Multiple Choice
  - True/False
  - Short Answer
  - Essay
- **Points** (1-100)
- **Options** (for multiple choice)
- **Correct Answer** (for auto-grading)

##### Settings

- **Pass Score** (percentage, 0-100)
- **Show Results**: Immediately or after review
- **Shuffle Questions**: Randomize order
- **Shuffle Options**: Randomize answer choices

#### Validation Rules

```typescript
{
  title: min 3, max 200 characters
  description: max 1000 characters
  duration: 1-300 minutes
  questions: minimum 1 question
  passScore: 0-100%
  points: 1-100 per question
}
```

#### Actions

- **Save as Draft**: Store without publishing
- **Publish**: Make available to candidates
- **Preview**: View candidate experience
- **Cancel**: Discard changes

---

### 2.3 Assessment Detail Page

**Route:** `/assessments/:id`

#### View Mode

##### Header Section

- Assessment title
- Description
- Status badge
- Action buttons (Edit, Delete, Publish/Unpublish)

##### Metric Cards

Display key statistics:

1. **Total Questions**
   - Count of all questions
   - Icon: HelpCircle
2. **Total Attempts**
   - Number of attempts made
   - Icon: Users
3. **Pass Rate**
   - Percentage of successful attempts
   - Icon: Award
4. **Average Score**
   - Mean score across all attempts
   - Icon: TrendingUp

##### Filters

- **Search**: Filter questions by text
- **Type Filter**: Dropdown to filter by question type
  - All Types
  - Multiple Choice
  - True/False
  - Short Answer
  - Essay

##### Questions List

For each question display:

- Question number and text
- Type badge with icon
- Points value
- Options (for multiple choice)
- Correct answer indicator

#### Components Used

- `AssessmentError.tsx` - Error state display
- `AssessmentNotFound.tsx` - 404 state
- `AssessmentHeader.tsx` - Title, actions, status
- `AssessmentMetricCards.tsx` - Statistics display
- `AssessmentFilters.tsx` - Search and filtering
- `AssessmentQuestionsList.tsx` - Question rendering

---

## 3. Candidate Directory

**Route:** `/assessments/users`

### Purpose

Manage assessment participants, track invitations, and monitor candidate progress.

### Features

#### Candidate List

Display all users with:

- Full name and email
- Assessment status
- Last activity
- Completion progress
- Score (if completed)

#### Actions

- **Invite Candidates**: Send assessment invitations
- **Bulk Import**: CSV upload for multiple users
- **Filter by Status**:
  - Not Started
  - In Progress
  - Completed
  - Expired
- **Export**: Download candidate data

#### Invitation Management

- Individual invitations
- Bulk invitations
- Reminder emails
- Expiration dates
- Access link generation

---

## 4. Performance Insights (Attempts)

**Routes:**

- List: `/assessments/attempts`
- Detail: `/assessments/attempts/:id`

### 4.1 Assessment Attempts List

#### Features

- **Search**: Find attempts by candidate or assessment
- **Status Filter**:
  - In Progress
  - Completed
  - Abandoned
  - Flagged
- **Time Filter**: Date range selection

#### Attempt Display

Each attempt shows:

- Candidate information
- Assessment title
- Start time
- Completion time
- Duration
- Score
- Status
- Flags/Anomalies

#### Statistics

- Total attempts
- Completion rate
- Average duration
- Average score
- Flagged attempts

---

### 4.2 Attempt Detail Page

**Route:** `/assessments/attempts/:id`

#### Comprehensive Attempt Analysis

##### Attempt Overview

- Candidate details
- Assessment information
- Timeline (start, end, duration)
- Overall score and grade
- Pass/Fail status

##### Question-by-Question Review

For each question:

- Question text and type
- Candidate's answer
- Correct answer
- Points earned/possible
- Time spent
- Status (Correct/Incorrect/Partial)

##### Performance Metrics

- Accuracy percentage
- Time management
- Question type performance breakdown
- Comparison to average

##### Flags & Anomalies

Detection and display of:

- Suspiciously fast completion
- Copy-paste detection
- Tab switching (if tracked)
- Unusual patterns

##### Actions

- Review and grade manually
- Add comments
- Flag for review
- Reset attempt
- Export results

---

## 🎨 Question Types

### 1. Multiple Choice

- Single correct answer
- 2-6 options
- Auto-graded
- Shuffle option support

### 2. True/False

- Binary choice
- Auto-graded
- Quick assessment tool

### 3. Short Answer

- Text input (max 500 characters)
- Manual or keyword-based grading
- Case-sensitive option

### 4. Essay

- Long-form text (max 5000 characters)
- Manual grading required
- Rich text support

---

## 📊 Analytics & Reporting

### Assessment-Level Analytics

- Completion rate
- Average score
- Pass/fail distribution
- Time to complete (average)
- Question difficulty analysis

### Candidate-Level Analytics

- Individual performance tracking
- Attempt history
- Improvement over time
- Comparison to cohort

### Question-Level Analytics

- Answer distribution
- Difficulty rating
- Time spent average
- Discrimination index

---

## 🔐 Access Control

**Required Permission:** Authenticated admin user

**Available Actions:**

- Create assessments
- Edit assessments
- Delete assessments
- View all attempts
- Grade attempts
- Manage candidates

---

## 🎯 User Workflows

### Creating an Assessment

1. Navigate to `/assessments`
2. Click "Create assessment"
3. Fill in basic information
4. Add questions
5. Configure settings
6. Save as draft or publish

### Inviting Candidates

1. Navigate to `/assessments/users`
2. Click "Invite people"
3. Enter email addresses or upload CSV
4. Select assessment
5. Set expiration (optional)
6. Send invitations

### Reviewing Attempts

1. Navigate to `/assessments/attempts`
2. Filter or search for specific attempts
3. Click on attempt to view details
4. Review answers
5. Grade manually if needed
6. Export results

---

## 🛠️ Technical Details

### API Endpoints

```
GET    /assessments              - List all assessments
POST   /assessments              - Create assessment
GET    /assessments/:id          - Get assessment detail
PATCH  /assessments/:id          - Update assessment
DELETE /assessments/:id          - Delete assessment
POST   /assessments/:id/publish  - Publish assessment
GET    /assessments/:id/stats    - Get statistics
GET    /assessment-attempts      - List all attempts
GET    /assessment-attempts/:id  - Get attempt detail
POST   /assessment-attempts      - Create attempt
PATCH  /assessment-attempts/:id  - Update attempt
```

### Data Models

#### Assessment

```typescript
interface Assessment {
  id: string;
  title: string;
  description?: string;
  duration: number; // minutes
  passScore: number; // percentage
  status: "draft" | "published" | "closed";
  questions: Question[];
  settings: AssessmentSettings;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Question

```typescript
interface Question {
  id: string;
  text: string;
  type: "multipleChoice" | "trueFalse" | "shortAnswer" | "essay";
  points: number;
  options?: QuestionOption[];
  correctAnswer?: string | string[];
  order: number;
}
```

#### Attempt

```typescript
interface Attempt {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: "in_progress" | "completed" | "abandoned";
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  answers: Answer[];
  flags: string[];
}
```

---

## 🚀 Future Enhancements

1. **Question Bank**

   - Reusable question library
   - Tagging and categorization
   - Difficulty ratings

2. **Advanced Analytics**

   - Predictive scoring
   - Candidate ranking
   - Trend analysis

3. **Integration Features**

   - Calendar integration
   - Email notifications
   - Webhook support
   - Export to LMS

4. **Accessibility**
   - Screen reader support
   - Keyboard navigation
   - High contrast mode
   - Text-to-speech

---

## 📝 Best Practices

### Creating Effective Assessments

1. Clear, concise question text
2. Appropriate difficulty distribution
3. Sufficient time allocation
4. Varied question types
5. Clear instructions

### Managing Candidates

1. Set reasonable deadlines
2. Send reminder emails
3. Provide support resources
4. Monitor progress
5. Give constructive feedback

### Reviewing Results

1. Grade consistently
2. Provide detailed feedback
3. Analyze patterns
4. Identify improvement areas
5. Document decisions
