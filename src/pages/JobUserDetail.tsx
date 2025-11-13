import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  Clock,
  Hash,
  Mail,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
  UserX,
  Briefcase,
  Building,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { appService } from "@/lib/api/service";

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
  isActive: boolean;
  isVerified: boolean;
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
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["job-user", id],
    queryFn: () => appService.getJobUserById(id!),
    enabled: !!id,
  });

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

  const displayName = user.accountType === "job_seeker"
    ? user.jobSeekerProfile?.fullName || "Unknown User"
    : user.employerProfile?.name || "Unknown Company";
  const initials = (() => {
    const name = user.accountType === "job_seeker"
      ? user.jobSeekerProfile?.fullName || ""
      : user.employerProfile?.name || "";
    const first = name.charAt(0) ?? "";
    const fallback = first.trim();
    return fallback ? fallback.toUpperCase() : "U";
  })();
  const createdAt = user.createdAt ? format(new Date(user.createdAt), "PPP") : "Unknown";
  const updatedAt = user.updatedAt ? format(new Date(user.updatedAt), "PPP") : "Unknown";
  const createdRelative = user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : null;
  const updatedRelative = user.updatedAt ? formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true }) : null;

  const StatusIcon = user.isAccountVerified ? ShieldCheck : ShieldAlert;
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
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-6 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full border border-border/60 bg-muted/30 px-4 text-xs uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/50"
                  onClick={() => navigate("/jobs/users")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to users
                </Button>
                <div className="flex flex-wrap items-center gap-2">
                  {user.isActive ? (
                    <Button
                      variant="outline"
                      onClick={handleDeactivate}
                      disabled={deactivateUserMutation.isPending}
                      className="gap-2 rounded-full border-orange-500/30 bg-orange-500/10 px-4 text-orange-600 hover:text-orange-600"
                    >
                      <UserX className="h-4 w-4" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleActivate}
                      disabled={activateUserMutation.isPending}
                      className="gap-2 rounded-full border-emerald-500/30 bg-emerald-500/10 px-4 text-emerald-600 hover:text-emerald-600"
                    >
                      <UserCheck className="h-4 w-4" />
                      Activate
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteUserMutation.isPending}
                    className="gap-2 rounded-full px-4"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete user
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative flex flex-col items-center sm:items-start">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                      <AvatarImage src="" alt={`${displayName} avatar`} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/40 via-primary/20 to-primary/40 text-lg font-semibold uppercase text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary-foreground shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      avatar coming soon
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-widest text-primary"
                      >
                        {user.accountType === "employer" ? "Employer" : "Job Seeker"}
                      </Badge>
                      <Badge
                        variant={user.isAccountVerified ? "default" : "secondary"}
                        className="rounded-full px-3 py-1 text-[11px] uppercase tracking-widest"
                      >
                        {user.isAccountVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        {displayName}
                      </h1>
                      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                        {user.accountType === "employer"
                          ? "Employer account for posting job opportunities."
                          : "Job seeker account for finding employment opportunities."}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        {user.email}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                        <CalendarClock className="h-3.5 w-3.5 text-primary" />
                        Joined {createdRelative ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-xs rounded-2xl border border-border/60 bg-background/80 p-4 text-sm shadow-sm">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        user.isAccountVerified ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      <StatusIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Account status
                      </p>
                      <p className="font-medium text-foreground">
                        {user.isAccountVerified ? "Verified" : "Unverified"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {user.isAccountVerified
                      ? `Account verified and active on the platform.`
                      : "Account requires verification to access full platform features."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.key}
                  className="group relative overflow-hidden border border-border/60 bg-background/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <CardContent className="relative space-y-3 p-5">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${stat.accent}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
                        {stat.label}
                      </p>
                      <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.hint}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
            <Card className="border border-border/60 bg-background/80 shadow-sm">
              <CardHeader>
                <CardTitle>Profile information</CardTitle>
                <CardDescription>
                  Basic user information and account details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Email address
                  </label>
                  <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                    {user.email}
                  </div>
                </div>
                {user.accountType === "job_seeker" && user.jobSeekerProfile && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Full name
                      </label>
                      <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                        {user.jobSeekerProfile.fullName || "Not provided"}
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Phone
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.jobSeekerProfile.phone || "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Address
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.jobSeekerProfile.addressLine || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {user.accountType === "employer" && user.employerProfile && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Company name
                      </label>
                      <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                        {user.employerProfile.name || "Not provided"}
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Legal name
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.employerProfile.legalName || "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Website
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.employerProfile.website || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Account type
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                      <RoleIcon className="h-4 w-4 text-primary" />
                      <span>{user.accountType === "employer" ? "Employer" : "Job Seeker"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Verification status
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                      <StatusIcon className={`h-4 w-4 ${user.isAccountVerified ? "text-emerald-500" : "text-amber-500"}`} />
                      <span>{user.isAccountVerified ? "Verified" : "Unverified"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border border-border/60 bg-background/80 shadow-sm">
                <CardHeader>
                  <CardTitle>Account snapshot</CardTitle>
                  <CardDescription>Key identifiers and lifecycle moments.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <Hash className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Account ID
                      </p>
                      <p className="font-mono text-sm text-foreground">{user._id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Created
                      </p>
                      <p className="text-sm text-foreground">{createdAt}</p>
                      <p className="text-xs text-muted-foreground">{createdRelative ?? "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Last updated
                      </p>
                      <p className="text-sm text-foreground">{updatedAt}</p>
                      <p className="text-xs text-muted-foreground">{updatedRelative ?? "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 bg-background/80 shadow-sm">
                <CardHeader>
                  <CardTitle>Platform guidelines</CardTitle>
                  <CardDescription>Quick reminders for platform management.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Account verification</p>
                      <p>Ensure user accounts are properly verified before activation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Profile completion</p>
                      <p>Encourage users to complete their profiles for better matching.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <ShieldAlert className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Content moderation</p>
                      <p>Regularly review user content for compliance with platform policies.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobUserDetail;