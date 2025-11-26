export interface UserSubscription {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  subscriptionPlanId: {
    _id: string;
    name: string;
    description: string;
    price: number;
    interval: string;
    features?: string[];
  };
  
  stripeSessionId: string;
  status: "active" | "canceled" | "expired" | "pending_payment";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  limits: Record<string, number>;
  usage?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStatistics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  pendingPaymentSubscriptions: number;
}

// Feature enums
export enum JobSeekerFeature {
  AI_LINKEDIN_OPTIMIZATION = "ai_linkedin_optimization",
  AI_RESUME_BUILDER_PDF = "ai_resume_builder_pdf",
  RESUME_BUILDER = "resume_builder",
  MULTI_TENANT_CV_STORAGE = "multi_tenant_cv_storage",
  JOB_APPLICATION = "job_application",
  AI_COVER_LETTER_GENERATION = "ai_cover_letter_generation",
  SEND_RECEIVE_MESSAGE_EMPLOYER = "send_receive_message_employer",
  SEND_RECEIVE_MESSAGE_ALL = "send_receive_message_all",
  CREATE_JOB_ALERT = "create_job_alert",
  GET_JOB_ALERT = "get_job_alert",
  PROFILE_VIEW_NOTIFICATION = "profile_view_notification",
}

export enum EmployerFeature {
  POST_JOB_ADS = "post_job_ads",
  POST_JOB_ADS_LIMIT = "post_job_ads_limit",
  FEATURED_JOB_POST = "featured_job_post",
  RECEIVE_JOB_APPLICATION = "receive_job_application",
  SEND_MESSAGE_ALL = "send_message_all",
  APPLICATION_RECEIVED_MONTHLY = "application_received_monthly",
  PROFILE_VIEW_NOTIFICATION = "profile_view_notification",
  JOB_APPLICATION_NOTIFICATION = "job_application_notification",
  CREATE_ASSESSMENT = "create_assessment",
  CREATE_ASSESSMENT_LIMIT = "create_assessment_limit",
  SEND_ASSESSMENT = "send_assessment",
  INSTANT_ASSESSMENT_SEND = "instant_assessment_send",
  VIEW_ASSESSMENT_ATTEMPT = "view_assessment_attempt",
  UPDATE_JOB_APPLICATION = "update_job_application",
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  accountType: "job_seeker" | "employer";
  price: number;
  currency: string;
  interval: "month" | "3month" | "6month" | "year" | "enterprise";
  features: string[];
  limits: any;
  isActive: boolean;
  isCustom?: boolean;
  isFree?: boolean;
  stripePriceId?: string;
  discountPercentage?: number;
  discountValidUntil?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionFormData {
  name: string;
  description: string;
  accountType?: "job_seeker" | "employer";
  price: string;
  currency: string;
  interval?: "month" | "3month" | "6month" | "year" | "enterprise";
  stripePriceId: string;
  discountPercentage: string;
  discountValidUntil: string;
  features?: string[];
  limits?: any;
  isActive?: boolean;
  isCustom?: boolean;
  isFree?: boolean;
}

// Form data for creating subscriptions (all fields required)
export interface CreateSubscriptionFormData {
  name: string;
  description: string;
  accountType: "job_seeker" | "employer";
  price: string;
  currency: string;
  interval: "month" | "3month" | "6month" | "year" | "enterprise";
  stripePriceId: string;
  discountPercentage: string;
  discountValidUntil: string;
  features: string[];
  limits: any;
  isActive: boolean;
  isCustom: boolean;
  isFree: boolean;
}