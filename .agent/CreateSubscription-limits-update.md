# CreateSubscription Limits Feature Update

## Summary
Updated the `CreateSubscription.tsx` component to include comprehensive limits configuration based on selected features, aligning with the backend's `UpdateSubscriptionPlanDto` interface.

## Changes Made

### 1. Added Feature Limits Card
- **New Section**: Added a "Feature limits" card between the Features section and the submit buttons
- **Dynamic Display**: Shows limit fields only for features that have been selected
- **Empty State**: Displays helpful messages when no features are selected or when selected features don't require limit configuration

### 2. Supported Limit Fields

#### Job Seeker Limits
- `linkedin_optimization_limit` - For AI LinkedIn Optimization feature
- `ai_resume_builder_limit` - For AI Resume Builder and Resume Builder features
- `cv_storage_limit` - For Multi-tenant CV Storage feature
- `job_application_limit` - For Job Application feature
- `cover_letter_generation_limit` - For AI Cover Letter Generation feature
- `job_alert_limit` - For Create Job Alert feature

#### Employer Limits
- `post_job_ads_limit` - For Post Job Ads features
- `create_assessment_limit` - For Create Assessment features
- `send_assessment_limit` - For Send Assessment feature
- `application_received_monthly_limit` - For Application Received Monthly feature

### 3. Helper Function
Added `hasAnyRelevantLimitFields()` function to determine if any of the selected features require limit configuration. This prevents showing an empty limits section.

### 4. State Management
- Updated account type change handler to clear both features AND limits when switching between job_seeker and employer
- All limit inputs properly update the formData.limits object
- Limits are included in the submission payload

## Payload Structure
The component now sends limits in the correct format:

```typescript
{
  name: string,
  description: string,
  accountType: "job_seeker" | "employer",
  price: number,
  currency: string,
  interval: string,
  features: string[],
  limits: {
    // Job Seeker limits
    linkedin_optimization_limit?: number,
    ai_resume_builder_limit?: number,
    cv_storage_limit?: number,
    job_application_limit?: number,
    cover_letter_generation_limit?: number,
    job_alert_limit?: number,
    
    // Employer limits
    post_job_ads_limit?: number,
    create_assessment_limit?: number,
    send_assessment_limit?: number,
    application_received_monthly_limit?: number,
  },
  stripePriceId?: string,
  discountPercentage?: number,
  discountValidUntil?: Date
}
```

## User Experience

### Feature Selection Flow
1. User selects account type (job_seeker or employer)
2. User selects desired features from the available list
3. Limits section automatically shows relevant limit fields based on selected features
4. User can configure limits for each applicable feature
5. All data is validated and submitted together

### Validation & Guidance
- All limit fields accept numbers with minimum value of 0
- Helper text explains each limit (e.g., "-1 for unlimited")
- Placeholder values provide examples
- Empty state messages guide users when no features are selected

## Notes
- Limits are **optional** - users can leave them empty if not needed
- The form validates that at least one feature is selected before submission
- When switching account types, both features and limits are reset to prevent invalid configurations
- The limits object is sent to the backend even if empty (as `{}`)