import { create } from "domain";
import { apiClient } from "./client";
import { jbsApiClient } from "./jbs-client";

export const appService = {
  //admin authentication
  adminAuth: (data: {email: string, password: string}) => {
    try {
        return apiClient.post("/admins/login", data);
    } catch (error) {
      throw error;
    }
  },
  createAssessMent: (data: any) => {
    try {
      return apiClient.post("/assessments", data);
    } catch (error) {
      throw error;
    }
  },
  updateAssessment: (id: string, data: any) => {
    try {
      return apiClient.patch(`/assessments/${id}`, data);
    } catch (error) {
      throw error;
    }
  },
  getAssessments: () => {
    try {
      return apiClient.get("/assessments");
    } catch (error) {
      throw error;
    }
  },
  getAssessmentById: (id: string) => {
    try {
      return apiClient.get(`/assessments/${id}`);
    } catch (error) {
      throw error;
    }
  },
  deleteAssessmentById: (id: string) => {
    try {
      return apiClient.delete(`/assessments/${id}`);
    } catch (error) {
      throw error;
    }
  },
  getAssessmentQuestionsByAssessmentId: (assessmentId: string) => {
    try {
      return apiClient.get(`/questions/assessment/${assessmentId}`);
    } catch (error) {
      throw error;
    }
  },
  // Users / participants for assessments
  getAssessmentUsers: (assessmentId: string) => {
    try {
      return apiClient.get(`/assessments/${assessmentId}/users`);
    } catch (error) {
      throw error;
    }
  },
  // Create a single user (global)
  createUser: (data: any) => {
    try {
      return apiClient.post(`/users-info`, data);
    } catch (error) {
      throw error;
    }
  },
  updateUser: (userId: string, data: any) => {
    try {
      return apiClient.patch(`/users-info/${userId}`, data);
    } catch (error) {
      throw error;
    }
  },
  // Get all users (global)
  getUsers: () => {
    try {
      return apiClient.get(`/users-info`);
    } catch (error) {
      throw error;
    }
  },
  deleteUser: (userId: string) => {
    try {
      return apiClient.delete(`/users-info/${userId}`);
    } catch (error) {
      throw error;
    }
  },
  // Bulk create users
  createUsersBulk: (data: any[]) => {
    try {
      return apiClient.post(`/users-info/bulk`, data);
    } catch (error) {
      throw error;
    }
  },
  createQuestion: (data: any) => {
    try {
      return apiClient.post("/questions", data);
    } catch (error) {
      throw error;
    }
  },
  updateQuestionByQuestionId: (questionId: string, data: any) => {
    try {
      return apiClient.patch(`/questions/${questionId}`, data);
    } catch (error) {
      throw error;
    }
  },
  // Assessment Attempts
  createAttempt: (data: { assessmentId: string; userId: string }) => {
    try {
      return apiClient.post("/attempts", data);
    } catch (error) {
      throw error;
    }
  },
  createAttemptsMany: (data: { userInfoIds: string[]; assessmentIds: string[] }) => {
    try {
      return apiClient.post("/attempts/many", data);
    } catch (error) {
      throw error;
    }
  },
  getAttempts: () => {
    try {
      return apiClient.get("/attempts");
    } catch (error) {
      throw error;
    }
  },
  deleteAttempt: (attemptId: string) => {
    try {
      return apiClient.delete(`/attempts/${attemptId}`);
    } catch (error) {
      throw error;
    }
  },
  getAttemptById: (attemptId: string) => {
    try {
      return apiClient.get(`/attempts/${attemptId}`);
    } catch (error) {
      throw error;
    }
  },
  // Admin management
  getAdmins: () => {
    try {
      return apiClient.get("/admins");
    } catch (error) {
      throw error;
    }
  },
  createAdmin: (data: {firstName: string, lastName: string, email: string, password: string}) => {
    try {
      return apiClient.post("/admins", data);
    } catch (error) {
      throw error;
    }
  },
  getAdminById: (id: string) => {
    try {
      return apiClient.get(`/admins/${id}`);
    } catch (error) {
      throw error;
    }
  },
  updateAdmin: (id: string, data: Partial<{firstName: string, lastName: string, email: string}>) => {
    try {
      return apiClient.patch(`/admins/${id}`, data);
    } catch (error) {
      throw error;
    }
  },
  deleteAdmin: (id: string) => {
    try {
      return apiClient.delete(`/admins/${id}`);
    } catch (error) {
      throw error;
    }
  },
  activateAdmin: (id: string) => {
    try {
      return apiClient.patch(`/admins/${id}/activate`);
    } catch (error) {
      throw error;
    }
  },
  deactivateAdmin: (id: string) => {
    try {
      return apiClient.patch(`/admins/${id}/deactivate`);
    } catch (error) {
      throw error;
    }
  },
  inviteAdmin: (data: {firstName: string, lastName: string, email: string}) => {
    try {
      return apiClient.post("/admins/invite", data);
    } catch (error) {
      throw error;
    }
  },
  setPassword: (data: {token: string, password: string}) => {
    try {
      return apiClient.post("/admins/accept-invitation", data);
    } catch (error) {
      throw error;
    }
  },
  getAttemptEvents: (attemptId: string, page: number = 1, limit: number = 10) => {
    try {
      return apiClient.get(`/attempt-event-tracking/attempt/${attemptId}?page=${page}&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },
  // Job Search Platform APIs
  // Users
  getJobUsers: (page: number = 1, limit: number = 10) => {
    try {
      return jbsApiClient.get(`/admin/jbs/users?page=${page}&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },
  getJobUserById: (id: string) => {
    try {
      return jbsApiClient.get(`/admin/jbs/users/${id}`);
    } catch (error) {
      throw error;
    }
  },
  getJobUserStatistics: () => {
    try {
      return jbsApiClient.get("/admin/jbs/statistics/users");
    } catch (error) {
      throw error;
    }
  },
  activateJobUser: (id: string) => {
    try {
      return jbsApiClient.patch(`/admin/jbs/users/${id}/activate`);
    } catch (error) {
      throw error;
    }
  },
  deactivateJobUser: (id: string) => {
    try {
      return jbsApiClient.patch(`/admin/jbs/users/${id}/deactivate`);
    } catch (error) {
      throw error;
    }
  },
  deleteJobUser: (id: string) => {
    try {
      return jbsApiClient.delete(`/admin/jbs/users/${id}`);
    } catch (error) {
      throw error;
    }
  },
  // Job Postings
  getJobPostings: (page: number = 1, limit: number = 10) => {
    try {
      return jbsApiClient.get(`/admin/jbs/job-postings?page=${page}&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },
  getJobPostingStatistics: () => {
    try {
      return jbsApiClient.get("/admin/jbs/statistics/job-postings");
    } catch (error) {
      throw error;
    }
  },
  getJobPostingById: (id: string) => {
    try {
      return jbsApiClient.get(`/admin/jbs/job-postings/${id}`);
    } catch (error) {
      throw error;
    }
  },
  blockJobPosting: (id: string) => {
    try {
      return jbsApiClient.patch(`/admin/jbs/job-postings/${id}/block`);
    } catch (error) {
      throw error;
    }
  },
  unblockJobPosting: (id: string) => {
    try {
      return jbsApiClient.patch(`/admin/jbs/job-postings/${id}/unblock`);
    } catch (error) {
      throw error;
    }
  },
  deleteJobPosting: (id: string) => {
    try {
      return jbsApiClient.delete(`/admin/jbs/job-postings/${id}`);
    } catch (error) {
      throw error;
    }
  },
  // Job Applications
  getJobApplications: () => {
    try {
      return jbsApiClient.get("/admin/jbs/job-applications");
    } catch (error) {
      throw error;
    }
  },
  getJobApplicationById: (id: string) => {
    try {
      return jbsApiClient.get(`/admin/jbs/job-applications/${id}`);
    } catch (error) {
      throw error;
    }
  },
  // Statistics
  getJobPlatformStats: () => {
    try {
      return jbsApiClient.get("/admin/jbs/statistics");
    } catch (error) {
      throw error;
    }
  },
  // API Keys management
  getApiKeys: () => {
    try {
      return apiClient.get("/api-keys");
    } catch (error) {
      throw error;
    }
  },
  getApiKeyById: (id: string) => {
    try {
      return apiClient.get(`/api-keys/${id}`);
    } catch (error) {
      throw error;
    }
  },
  createApiKey: (data: {
    name: string;
    description?: string;
    expiresAt?: string;
    allowedOrigins?: string[];
    rateLimit?: number;
    permissions?: string[];
  }) => {
    try {
      return apiClient.post("/api-keys", data);
    } catch (error) {
      throw error;
    }
  },
  updateApiKey: (id: string, data: {
    name?: string;
    description?: string;
    expiresAt?: string;
    allowedOrigins?: string[];
    rateLimit?: number;
    permissions?: string[];
  }) => {
    try {
      return apiClient.patch(`/api-keys/${id}`, data);
    } catch (error) {
      throw error;
    }
  },
  deleteApiKey: (id: string) => {
    try {
      return apiClient.delete(`/api-keys/${id}`);
    } catch (error) {
      throw error;
    }
  },
  activateApiKey: (id: string) => {
    try {
      return apiClient.patch(`/api-keys/${id}/reactivate`);
    } catch (error) {
      throw error;
    }
  },
  deactivateApiKey: (id: string) => {
    try {
      return apiClient.patch(`/api-keys/${id}/deactivate`);
    } catch (error) {
      throw error;
    }
  },
  getApiKeyStats: (id: string) => {
    try {
      return apiClient.get(`/api-keys/${id}/stats`);
    } catch (error) {
      throw error;
    }
  },
  // Subscription Plans
  getSubscriptionPlans: () => {
    try {
      return jbsApiClient.get("/subscriptions/plans");
    } catch (error) {
      throw error;
    }
  },
  getSubscriptionPlanById: (id: string) => {
    try {
      return jbsApiClient.get(`/subscriptions/plans/${id}`);
    } catch (error) {
      throw error;
    }
  },
  createSubscriptionPlan: (data: any) => {
    try {
      return jbsApiClient.post("/subscriptions/plans", data);
    } catch (error) {
      throw error;
    }
  },
  updateSubscriptionPlan: (id: string, data: any) => {
    try {
      return jbsApiClient.patch(`/subscriptions/plans/${id}`, data);
    } catch (error) {
      throw error;
    }
  },
  deleteSubscriptionPlan: (id: string) => {
    try {
      return jbsApiClient.delete(`/subscriptions/plans/${id}`);
    } catch (error) {
      throw error;
    }
  },
  // User Subscriptions
  getUserSubscriptionStatistics: () => {
    try {
      return jbsApiClient.get("/admin/jbs/subscriptions/statistics");
    } catch (error) {
      throw error;
    }
  },
  getUserSubscriptions: (page: number = 1, limit: number = 10) => {
    try {
      return jbsApiClient.get(`/admin/jbs/subscriptions?page=${page}&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },
  getUserSubscriptionById: (id: string) => {
    try {
      return jbsApiClient.get(`/admin/jbs/subscriptions/${id}`);
    } catch (error) {
      throw error;
    }
  },
  updateUserSubscriptionStatus: (id: string, data: { status: string }) => {
    try {
      return jbsApiClient.patch(`/admin/jbs/subscriptions/${id}`, data);
    } catch (error) {
      throw error;
    }
  },
  getUserSubscriptionsByUserId: (userId: string, page: number = 1, limit: number = 10) => {
    try {
      return jbsApiClient.get(`/admin/jbs/subscriptions/user/${userId}?page=${page}&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },
  // Push Notifications
  sendPushNotificationToUser: (data: { userId: string; message: string }) => {
    try {
      return jbsApiClient.post("/admin/jbs/push-notifications/send-to-user", data);
    } catch (error) {
      throw error;
    }
  },
};