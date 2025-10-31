import { create } from "domain";
import { apiClient } from "./client";

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
      return apiClient.post(`/users-info/bulk`, { users: data });
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
  getAttemptEvents: (attemptId: string, page: number = 1, limit: number = 10) => {
    try {
      return apiClient.get(`/attempt-event-tracking/attempt/${attemptId}?page=${page}&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },
};
