
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
                  {user.isAccountVerified ? (
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
            {/* Basic Information */}
            {/* <Card className="border border-border/60 bg-background/80 shadow-sm">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Account details and verification status.
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
            </Card> */}

            {/* Job Seeker Profile */}
            {user.accountType === "job_seeker" && user.jobSeekerProfile && (
              <div className="space-y-6">
                {/* Personal Information */}
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Basic profile details and contact information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Full name
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.jobSeekerProfile.fullName || "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Phone
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.jobSeekerProfile.phone || "Not provided"}
                        </div>
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
                    {user.jobSeekerProfile.bio && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Bio
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground whitespace-pre-wrap">
                          {user.jobSeekerProfile.bio}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Role, experience, and career preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Primary role
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.jobSeekerProfile.primaryRole || "Not specified"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Experience level
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.jobSeekerProfile.experienceLevel || "Not specified"}
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Years of experience
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.jobSeekerProfile.yearsOfExperience || "Not specified"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Available from
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.jobSeekerProfile.workPreferences?.availableFrom || "Not specified"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Work Preferences */}
                {user.jobSeekerProfile.workPreferences && (
                  <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                      <CardTitle>Work Preferences</CardTitle>
                      <CardDescription>Preferred work arrangements and salary expectations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Employment types
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.jobSeekerProfile.workPreferences.employmentTypes?.join(", ") || "Not specified"}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Work modes
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.jobSeekerProfile.workPreferences.workModes?.join(", ") || "Not specified"}
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Relocation
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.jobSeekerProfile.workPreferences.relocation ? "Open to relocation" : "Not open to relocation"}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Preferred locations
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.jobSeekerProfile.workPreferences.preferredLocations?.join(", ") || "Not specified"}
                          </div>
                        </div>
                      </div>
                      {user.jobSeekerProfile.workPreferences.salaryExpectation && (
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Salary expectation
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.jobSeekerProfile.workPreferences.salaryCurrency} {user.jobSeekerProfile.workPreferences.salaryExpectation.min} - {user.jobSeekerProfile.workPreferences.salaryExpectation.max} per {user.jobSeekerProfile.workPreferences.salaryExpectation.period}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Skills & Languages */}
                <div className="grid gap-6 md:grid-cols-2">
                  {user.jobSeekerProfile.skills && user.jobSeekerProfile.skills.length > 0 && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                      <CardHeader>
                        <CardTitle>Skills</CardTitle>
                        <CardDescription>Technical and professional skills.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {user.jobSeekerProfile.skills.map((skill, index) => (
                            <div key={index} className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{skill.level}</Badge>
                                <span className="text-xs text-muted-foreground">{skill.years} years</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {user.jobSeekerProfile.languages && user.jobSeekerProfile.languages.length > 0 && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                      <CardHeader>
                        <CardTitle>Languages</CardTitle>
                        <CardDescription>Language proficiency levels.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {user.jobSeekerProfile.languages.map((language, index) => (
                            <div key={index} className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                              <span className="text-sm font-medium">{language.name}</span>
                              <Badge variant="outline" className="text-xs">{language.proficiency}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Experience */}
                {user.jobSeekerProfile.experience && user.jobSeekerProfile.experience.length > 0 && (
                  <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                      <CardTitle>Work Experience</CardTitle>
                      <CardDescription>Professional work history and achievements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.jobSeekerProfile.experience.map((exp, index) => (
                          <div key={index} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-foreground">{exp.title}</h4>
                                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {exp.currentlyWorking ? "Current" : `${exp.startDate} - ${exp.endDate || "Present"}`}
                                </Badge>
                              </div>
                              <div className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                                <span>Type: {exp.employmentType}</span>
                                <span>Location: {exp.location}</span>
                                <span>Mode: {exp.workMode}</span>
                              </div>
                              {exp.achievements && exp.achievements.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Achievements</p>
                                  <ul className="text-sm text-foreground space-y-1">
                                    {exp.achievements.map((achievement, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{achievement}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Skills Used</p>
                                  <div className="flex flex-wrap gap-1">
                                    {exp.skillsUsed.map((skill, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Education */}
                {user.jobSeekerProfile.education && user.jobSeekerProfile.education.length > 0 && (
                  <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                      <CardTitle>Education</CardTitle>
                      <CardDescription>Academic background and qualifications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.jobSeekerProfile.education.map((edu, index) => (
                          <div key={index} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-foreground">{edu.degree} in {edu.fieldOfStudy}</h4>
                                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {edu.startDate} - {edu.endDate}
                                </span>
                              </div>
                              {edu.grade && (
                                <p className="text-sm text-muted-foreground">Grade: {edu.grade}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Certifications */}
                {user.jobSeekerProfile.certifications && user.jobSeekerProfile.certifications.length > 0 && (
                  <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                      <CardTitle>Certifications</CardTitle>
                      <CardDescription>Professional certifications and credentials.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.jobSeekerProfile.certifications.map((cert, index) => (
                          <div key={index} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-foreground">{cert.name}</h4>
                                  <p className="text-sm text-muted-foreground">Issued by {cert.issuer}</p>
                                </div>
                                <div className="text-right text-sm text-muted-foreground">
                                  <p>Issued: {cert.issueDate}</p>
                                  {cert.expiryDate && <p>Expires: {cert.expiryDate}</p>}
                                </div>
                              </div>
                              {cert.credentialId && (
                                <p className="text-sm text-muted-foreground">ID: {cert.credentialId}</p>
                              )}
                              {cert.credentialUrl && (
                                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                  View Credential
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Projects & Portfolio */}
                <div className="grid gap-6 md:grid-cols-2">
                  {user.jobSeekerProfile.projects && user.jobSeekerProfile.projects.length > 0 && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                      <CardHeader>
                        <CardTitle>Projects</CardTitle>
                        <CardDescription>Personal and professional projects.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {user.jobSeekerProfile.projects.map((project, index) => (
                            <div key={index} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                              <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-foreground">{project.name}</h4>
                                    {project.url && (
                                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                        View Project
                                      </a>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{project.summary}</p>
                                {project.skills && project.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {project.skills.map((skill, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {user.jobSeekerProfile.portfolioLinks && user.jobSeekerProfile.portfolioLinks.length > 0 && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                      <CardHeader>
                        <CardTitle>Portfolio Links</CardTitle>
                        <CardDescription>External portfolio and work samples.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {user.jobSeekerProfile.portfolioLinks.map((link, index) => (
                            <a key={index} href={link} target="_blank" rel="noopener noreferrer"
                               className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-primary hover:bg-muted/50 transition-colors">
                              <span>🔗</span>
                              <span className="truncate">{link}</span>
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Social Media & Resume */}
                <div className="grid gap-6 md:grid-cols-2">
                  {user.jobSeekerProfile.socials && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                      <CardHeader>
                        <CardTitle>Social Media</CardTitle>
                        <CardDescription>Professional social media profiles.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(user.jobSeekerProfile.socials).map(([platform, url]) => (
                            url && (
                              <div key={platform} className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                                <span className="text-sm font-medium capitalize">{platform}:</span>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                                  {url}
                                </a>
                              </div>
                            )
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {user.jobSeekerProfile.resume && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                      <CardHeader>
                        <CardTitle>Resume</CardTitle>
                        <CardDescription>Resume document information.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium">{user.jobSeekerProfile.resume.fileName}</p>
                              <p className="text-xs text-muted-foreground">Type: {user.jobSeekerProfile.resume.mimeType}</p>
                              <p className="text-xs text-muted-foreground">
                                Last updated: {new Date(user.jobSeekerProfile.resume.lastUpdated).toLocaleDateString()}
                              </p>
                              {user.jobSeekerProfile.resume.fileUrl && (
                                <a href={user.jobSeekerProfile.resume.fileUrl} target="_blank" rel="noopener noreferrer"
                                   className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                                  <span>📄</span>
                                  View Resume
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Consents */}
                {user.jobSeekerProfile.consents && (
                  <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                      <CardTitle>Privacy & Consents</CardTitle>
                      <CardDescription>User privacy preferences and consents.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${user.jobSeekerProfile.consents.shareProfileWithEmployers ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">Share Profile</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${user.jobSeekerProfile.consents.emailNotifications ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">Email Notifications</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${user.jobSeekerProfile.consents.gdprAcknowledgement ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">GDPR Acknowledged</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Employer Profile */}
            {user.accountType === "employer" && user.employerProfile && (
              <div className="space-y-6">
                {/* Company Information */}
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Basic company details and registration information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Company name
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.employerProfile.name || "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Legal name
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.employerProfile.legalName || "Not provided"}
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Registration number
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.employerProfile.registrationNumber || "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Industry
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.employerProfile.industry || "Not provided"}
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Company size
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.employerProfile.companySize || "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Founded year
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                          {user.employerProfile.foundedYear || "Not provided"}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Website
                      </label>
                      <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                        {user.employerProfile.website ? (
                          <a href={user.employerProfile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {user.employerProfile.website}
                          </a>
                        ) : "Not provided"}
                      </div>
                    </div>
                    {user.employerProfile.about && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          About
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground whitespace-pre-wrap">
                          {user.employerProfile.about}
                        </div>
                      </div>
                    )}
                    {user.employerProfile.mission && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Mission
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground whitespace-pre-wrap">
                          {user.employerProfile.mission}
                        </div>
                      </div>
                    )}
                    {user.employerProfile.values && user.employerProfile.values.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Values
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {user.employerProfile.values.map((value, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{value}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Primary Contact */}
                {user.employerProfile.primaryContact && (
                  <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                      <CardTitle>Primary Contact</CardTitle>
                      <CardDescription>Main point of contact for the company.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Full name
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.employerProfile.primaryContact.fullName || "Not provided"}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Role
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.employerProfile.primaryContact.role || "Not provided"}
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Email
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.employerProfile.primaryContact.email || "Not provided"}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Phone
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.employerProfile.primaryContact.phone || "Not provided"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Addresses */}
                {user.employerProfile.addresses && user.employerProfile.addresses.length > 0 && (
                  <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                      <CardTitle>Company Addresses</CardTitle>
                      <CardDescription>Registered office and branch locations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.employerProfile.addresses.map((address, index) => (
                          <div key={index} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h4 className="font-semibold text-foreground">{address.label}</h4>
                                {address.geo && (
                                  <span className="text-xs text-muted-foreground">
                                    {address.geo.lat}, {address.geo.lng}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>{address.addressLine}</p>
                                <p>{address.city}, {address.state} {address.postalCode}</p>
                                <p>{address.country}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Billing Information */}
                {user.employerProfile.billing && (
                  <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                      <CardTitle>Billing Information</CardTitle>
                      <CardDescription>Billing contact and tax information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Billing email
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.employerProfile.billing.billingEmail || "Not provided"}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Tax ID
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.employerProfile.billing.taxId || "Not provided"}
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Currency
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.employerProfile.billing.currency || "Not provided"}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Billing address
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.employerProfile.billing.billingAddress || "Not provided"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Verification & Hiring Preferences */}
                <div className="grid gap-6 md:grid-cols-2">
                  {user.employerProfile.verification && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                      <CardHeader>
                        <CardTitle>Verification</CardTitle>
                        <CardDescription>Company verification status and documents.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${user.employerProfile.verification.domainVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">Domain Verified</span>
                        </div>
                        {user.employerProfile.verification.businessDocsUrl && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                              Business documents
                            </label>
                            <a href={user.employerProfile.verification.businessDocsUrl} target="_blank" rel="noopener noreferrer"
                               className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                              <span>📄</span>
                              View Documents
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {user.employerProfile.hiringPreferences && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                      <CardHeader>
                        <CardTitle>Hiring Preferences</CardTitle>
                        <CardDescription>Company's hiring policies and preferences.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Default work modes
                          </label>
                          <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {user.employerProfile.hiringPreferences.defaultWorkModes?.join(", ") || "Not specified"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${user.employerProfile.hiringPreferences.visaSponsorship ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">Visa Sponsorship Available</span>
                        </div>
                        {user.employerProfile.hiringPreferences.equalOpportunityStatement && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                              Equal opportunity statement
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground whitespace-pre-wrap">
                              {user.employerProfile.hiringPreferences.equalOpportunityStatement}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Social Media */}
                {user.employerProfile.socials && (
                  <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                      <CardTitle>Social Media</CardTitle>
                      <CardDescription>Company social media profiles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(user.employerProfile.socials).map(([platform, url]) => (
                          url && (
                            <div key={platform} className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                              <span className="text-sm font-medium capitalize">{platform}:</span>
                              <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                                {url}
                              </a>
                            </div>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Logo */}
                {user.employerProfile.logoUrl && (
                  <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                      <CardTitle>Company Logo</CardTitle>
                      <CardDescription>Company branding and visual identity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <img src={user.employerProfile.logoUrl} alt="Company logo" className="w-16 h-16 object-contain rounded-lg border border-border/60" />
                        <div>
                          <p className="text-sm text-muted-foreground">Company logo image</p>
                          <a href={user.employerProfile.logoUrl} target="_blank" rel="noopener noreferrer"
                             className="text-sm text-primary hover:underline">
                            View full size
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Consents */}
                {user.employerProfile.consents && (
                  <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                      <CardTitle>Privacy & Consents</CardTitle>
                      <CardDescription>Company privacy preferences and consents.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${user.employerProfile.consents.termsAccepted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">Terms Accepted</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${user.employerProfile.consents.emailNotifications ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">Email Notifications</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${user.employerProfile.consents.dataProcessingAgreementAccepted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">Data Processing Accepted</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

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