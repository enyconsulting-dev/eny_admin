import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  CalendarClock,
  Clock,
  Building,
  Briefcase,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { appService } from "@/lib/api/service";
import { UserHeader } from "@/components/job-users/UserHeader";
import { QuickStatsCards } from "@/components/job-users/QuickStatsCards";
import { JobSeekerProfileDisplay } from "@/components/job-users/JobSeekerProfileDisplay";
import { EmployerProfileDisplay } from "@/components/job-users/EmployerProfileDisplay";
import { AccountSnapshot } from "@/components/job-users/AccountSnapshot";
import { UserSubscriptionHistory } from "@/components/job-users/UserSubscriptionHistory";
import { PlatformGuidelines } from "@/components/job-users/PlatformGuidelines";
import { PushNotificationDialog } from "@/components/job-users/PushNotificationDialog";

interface JobUser {
  _id: string;
  accountType: "job_seeker" | "employer";
  isAccountVerified: boolean;
  clerkId: string;
  email: string;
  password_enabled: boolean;
  jobSeekerProfile?: {
    fullName: string;
    phone?: string;
    addressLine?: string;
    bio?: string;
    geo?: {
      lat: number;
      lng: number;
    };
    workAuthorization?: {
      authorizedCountries: string[];
      visaSponsorshipNeeded: boolean;
    };
    primaryRole?: string;
    experienceLevel?: string;
    yearsOfExperience?: number;
    workPreferences?: {
      employmentTypes: string[];
      workModes: string[];
      relocation: boolean;
      preferredLocations: string[];
      salaryCurrency?: string;
      salaryExpectation?: {
        min: number;
        max: number;
        period: string;
      };
      availableFrom?: string;
    };
    skills?: {
      name: string;
      level: string;
      years: number;
    }[];
    languages?: {
      name: string;
      proficiency: string;
    }[];
    experience?: {
      company: string;
      title: string;
      employmentType: string;
      location: string;
      workMode: string;
      startDate: string;
      endDate?: string;
      currentlyWorking: boolean;
      achievements: string[];
      skillsUsed: string[];
    }[];
    education?: {
      institution: string;
      degree: string;
      fieldOfStudy: string;
      startDate: string;
      endDate?: string;
      grade?: string;
    }[];
    certifications?: {
      name: string;
      issuer: string;
      issueDate: string;
      expiryDate?: string;
      credentialId?: string;
      credentialUrl?: string;
    }[];
    projects?: {
      name: string;
      summary: string;
      url?: string;
      skills: string[];
    }[];
    portfolioLinks?: string[];
    socials?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
      website?: string;
    };
    resume?: {
      fileUrl: string;
      fileName: string;
      mimeType: string;
      lastUpdated: string;
    };
    consents?: {
      shareProfileWithEmployers: boolean;
      emailNotifications: boolean;
      gdprAcknowledgement: boolean;
    };
  };
  employerProfile?: {
    name: string;
    legalName?: string;
    registrationNumber?: string;
    industry?: string;
    companySize?: string;
    foundedYear?: number;
    website?: string;
    about?: string;
    mission?: string;
    values?: string[];
    logoUrl?: string;
    socials?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
      website?: string;
    };
    primaryContact?: {
      fullName: string;
      role: string;
      email: string;
      phone?: string;
    };
    addresses?: {
      label: string;
      country: string;
      state: string;
      city: string;
      addressLine: string;
      postalCode: string;
      geo?: {
        lat: number;
        lng: number;
      };
    }[];
    billing?: {
      billingEmail: string;
      billingAddress: string;
      taxId?: string;
      currency: string;
    };
    verification?: {
      domainVerified: boolean;
      businessDocsUrl?: string;
    };
    hiringPreferences?: {
      defaultWorkModes: string[];
      visaSponsorship: boolean;
      equalOpportunityStatement?: string;
    };
    consents?: {
      termsAccepted: boolean;
      emailNotifications: boolean;
      dataProcessingAgreementAccepted: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

const JobUserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["job-user", id],
    queryFn: () => appService.getJobUserById(id!),
    enabled: !!id,
  });

  // Fetch user subscriptions
  const { data: subscriptionsData, isLoading: subscriptionsLoading } =
    useQuery({
      queryKey: ["user-subscriptions", id],
      queryFn: () => appService.getUserSubscriptionsByUserId(id!, 1, 5),
      enabled: !!id,
    });

  // Push notification state
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);

  const sendPushNotificationMutation = useMutation({
    mutationFn: (data: { userId: string; message: string }) =>
      appService.sendPushNotificationToUser(data),
    onSuccess: () => {
      toast({
        title: "Notification sent",
        description:
          "Push notification has been sent to the user successfully.",
      });
      setIsPushDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send notification",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const handleSendPushNotification = (message: string) => {
    sendPushNotificationMutation.mutate({
      userId: id!,
      message,
    });
  };

  const deleteUserMutation = useMutation({
    mutationFn: () => appService.deleteJobUser(id!),
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "The user account has been removed.",
      });
      navigate("/jobs/users");
    },
    onError: (error: any) => {
      toast({
        title: "Unable to delete user",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: () => appService.activateJobUser(id!),
    onSuccess: () => {
      toast({
        title: "User activated",
        description: "The user account is now active.",
      });
      queryClient.invalidateQueries({ queryKey: ["job-user", id] });
      queryClient.invalidateQueries({ queryKey: ["job-users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to activate user",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: () => appService.deactivateJobUser(id!),
    onSuccess: () => {
      toast({
        title: "User deactivated",
        description: "The user account has been deactivated.",
      });
      queryClient.invalidateQueries({ queryKey: ["job-user", id] });
      queryClient.invalidateQueries({ queryKey: ["job-users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to deactivate user",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const user: JobUser | undefined = userData?.data;

  const handleDelete = () => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }
    deleteUserMutation.mutate();
  };

  const handleActivate = () => {
    activateUserMutation.mutate();
  };

  const handleDeactivate = () => {
    deactivateUserMutation.mutate();
  };

  if (userLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (userError || !user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center">
            <h2 className="text-xl font-semibold">User not found</h2>
            <p className="text-muted-foreground">
              The user you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button onClick={() => navigate("/jobs/users")}>
            Back to users
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const displayName =
    user.accountType === "job_seeker"
      ? user.jobSeekerProfile?.fullName || "Unknown User"
      : user.employerProfile?.name || "Unknown Company";

  const createdAt = user.createdAt
    ? format(new Date(user.createdAt), "PPP")
    : "Unknown";
  const updatedAt = user.updatedAt
    ? format(new Date(user.updatedAt), "PPP")
    : "Unknown";
  const createdRelative = user.createdAt
    ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
    : null;
  const updatedRelative = user.updatedAt
    ? formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true })
    : null;

  const RoleIcon = user.accountType === "employer" ? Building : Briefcase;

  const quickStats = [
    {
      key: "created",
      label: "Created",
      value: createdAt,
      hint: createdRelative ?? "—",
      icon: CalendarClock,
      accent: "bg-blue-500/10 text-blue-500",
    },
    {
      key: "updated",
      label: "Last updated",
      value: updatedAt,
      hint: updatedRelative ?? "—",
      icon: Clock,
      accent: "bg-purple-500/10 text-purple-500",
    },
    {
      key: "role",
      label: "Role",
      value: user.accountType === "employer" ? "Employer" : "Job Seeker",
      hint: user.isAccountVerified ? "Account verified" : "Account unverified",
      icon: RoleIcon,
      accent: "bg-amber-500/10 text-amber-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-[140px]" />
        <div className="relative space-y-8 p-6 animate-in fade-in-50">
          <UserHeader
            user={user}
            onBack={() => navigate("/jobs/users")}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onDelete={handleDelete}
            onSendNotification={() => setIsPushDialogOpen(true)}
            isActivating={activateUserMutation.isPending}
            isDeactivating={deactivateUserMutation.isPending}
            isDeleting={deleteUserMutation.isPending}
          />

          <QuickStatsCards stats={quickStats} />

          <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
            {/* Job Seeker Profile */}
            {user.accountType === "job_seeker" && user.jobSeekerProfile && (
              <JobSeekerProfileDisplay profile={user.jobSeekerProfile} />
            )}

            {/* Employer Profile */}
            {user.accountType === "employer" && user.employerProfile && (
              <EmployerProfileDisplay profile={user.employerProfile} />
            )}

            <div className="relative space-y-6">
              <div className="sticky top-6 spacey-y-6">
                <AccountSnapshot
                  userId={user._id}
                  createdAt={createdAt}
                  updatedAt={updatedAt}
                  createdRelative={createdRelative}
                  updatedRelative={updatedRelative}
                />

                <UserSubscriptionHistory
                  subscriptionsData={subscriptionsData}
                  isLoading={subscriptionsLoading}
                  onViewAll={() => navigate(`/jobs/user-subscriptions`)}
                />

                <PlatformGuidelines />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PushNotificationDialog
        isOpen={isPushDialogOpen}
        onClose={() => setIsPushDialogOpen(false)}
        onSend={handleSendPushNotification}
        displayName={displayName}
        isPending={sendPushNotificationMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default JobUserDetail;