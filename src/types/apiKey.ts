export const AVAILABLE_PERMISSIONS = [
  { value: "assessment:create", label: "Create Assessments" },
  { value: "assessment:read", label: "Read Assessments" },
  { value: "question:create", label: "Create Questions" },
  { value: "question:read", label: "Read Questions" },
  { value: "attempt:create", label: "Create Attempts" },
  { value: "attempt:read", label: "Read Attempts" },
  { value: "attempt:send", label: "Send Attempts" },
];

export interface ApiKey {
  _id: string;
  name: string;
  description: string;
  key: string;
  isActive: boolean;
  usageCount: number;
  lastUsedAt: string | null;
  rateLimit: number;
  permissions: string[];
  expiresAt: string | null;
  allowedOrigins: string[];
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiKeyStats {
  usageCount: number;
  lastUsedAt: string | null;
}
