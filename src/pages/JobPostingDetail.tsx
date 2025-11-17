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
  Eye,
  Hash,
  MapPin,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Briefcase,
  Building,
  FileText,
  CheckCircle,
  Users,
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

interface JobPosting {
  _id: string;
  title: string;
  slug: string;
  externalReferenceId?: string;
  companyId: {
    _id: string;
    email: string;
    employerProfile: {
      name: string;
    };
  };
  postedBy: string;
  department?: string;
  team?: string;
  location: {
    geo?: {
      coordinates: [number, number];
      type: string;
    };
    country: string;
    state: string;
    city: string;
    addressLine?: string;
  };
  workMode: string;
  employmentType: string;
  experienceLevel: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  skills: string[];
  benefits?: string[];
  visaSponsorship: boolean;
  relocationSupport: boolean;
  educationLevel?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
    isVisible: boolean;
  };
  applicationDeadline?: string;
  applicationMethod: {
    type: string;
    externalLink?: string;
    email?: string;
    askResume: boolean;
    askCoverLetter: boolean;
    askPortfolio: boolean;
    customQuestions?: {
      id: string;
      label: string;
      required: boolean;
      responseType: string;
      options: string[];
    }[];
  };
  publishStatus: "Published" | "Draft";
  isFeatured: boolean;
  tags: string[];
  views: number;
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
}

const JobPostingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: postingData,
    isLoading: postingLoading,
    isError: postingError,
    refetch: refetchPosting,
  } = useQuery({
    queryKey: ["job-posting", id],
    queryFn: () => appService.getJobPostingById(id!),
    enabled: !!id,
  });

  const deletePostingMutation = useMutation({
    mutationFn: () => appService.deleteJobPosting(id!),
    onSuccess: () => {
      toast({
        title: "Job posting deleted",
        description: "The job posting has been removed.",
      });
      navigate("/jobs/postings");
    },
    onError: (error: any) => {
      toast({
        title: "Unable to delete job posting",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const blockPostingMutation = useMutation({
    mutationFn: () => appService.blockJobPosting(id!),
    onSuccess: () => {
      toast({
        title: "Job posting blocked",
        description: "The job posting has been blocked.",
      });
      queryClient.invalidateQueries({ queryKey: ["job-posting", id] });
      queryClient.invalidateQueries({ queryKey: ["job-postings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to block job posting",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const unblockPostingMutation = useMutation({
    mutationFn: () => appService.unblockJobPosting(id!),
    onSuccess: () => {
      toast({
        title: "Job posting unblocked",
        description: "The job posting has been unblocked.",
      });
      queryClient.invalidateQueries({ queryKey: ["job-posting", id] });
      queryClient.invalidateQueries({ queryKey: ["job-postings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to unblock job posting",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const posting: JobPosting | undefined = postingData?.data;

  const handleDelete = () => {
    if (
      !confirm(
        "Are you sure you want to delete this job posting? This action cannot be undone."
      )
    ) {
      return;
    }
    deletePostingMutation.mutate();
  };

  const handleBlock = () => {
    blockPostingMutation.mutate();
  };

  const handleUnblock = () => {
    unblockPostingMutation.mutate();
  };

  if (postingLoading) {
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

  if (postingError || !posting) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center">
            <h2 className="text-xl font-semibold">Job posting not found</h2>
            <p className="text-muted-foreground">
              The job posting you're looking for doesn't exist or has been
              removed.
            </p>
          </div>
          <Button onClick={() => navigate("/jobs/postings")}>
            Back to job postings
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const createdAt = posting.createdAt
    ? format(new Date(posting.createdAt), "PPP")
    : "Unknown";
  const updatedAt = posting.updatedAt
    ? format(new Date(posting.updatedAt), "PPP")
    : "Unknown";
  const createdRelative = posting.createdAt
    ? formatDistanceToNow(new Date(posting.createdAt), { addSuffix: true })
    : null;
  const updatedRelative = posting.updatedAt
    ? formatDistanceToNow(new Date(posting.updatedAt), { addSuffix: true })
    : null;

  const StatusIcon =
    posting.publishStatus === "Draft" ? ShieldAlert : ShieldCheck;

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
      key: "status",
      label: "Status",
      value: posting.publishStatus,
      hint:
        posting.publishStatus === "Published"
          ? "Visible to job seekers"
          : "Not yet published",
      icon: posting.publishStatus === "Draft" ? ShieldAlert : CheckCircle,
      accent:
        posting.publishStatus === "Draft"
          ? "bg-red-500/10 text-red-500"
          : "bg-green-500/10 text-green-500",
    },
    {
      key: "views",
      label: "Views",
      value: posting.views.toString(),
      hint: "Total page views",
      icon: Eye,
      accent: "bg-indigo-500/10 text-indigo-500",
    },
    {
      key: "applicants",
      label: "Applicants",
      value: posting.applicantsCount.toString(),
      hint: "Number of applicants",
      icon: Users,
      accent: "bg-teal-500/10 text-teal-500",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="default">Published</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
                  onClick={() => navigate("/jobs/postings")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to job postings
                </Button>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deletePostingMutation.isPending}
                    className="gap-2 rounded-full px-4"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete posting
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative flex flex-col items-center sm:items-start">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                      <AvatarImage
                        src=""
                        alt={`${posting.companyId?.employerProfile?.name} logo`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary/40 via-primary/20 to-primary/40 text-lg font-semibold uppercase text-primary-foreground">
                        {posting.companyId?.employerProfile?.name?.charAt(0) ||
                          "C"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary-foreground shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      company logo
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(posting.publishStatus)}
                      <Badge
                        variant="outline"
                        className="rounded-full px-3 py-1 text-[11px] uppercase tracking-widest"
                      >
                        {posting.employmentType}
                      </Badge>
                      {posting.isFeatured && (
                        <Badge
                          variant="secondary"
                          className="rounded-full px-3 py-1 text-[11px] uppercase tracking-widest"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        {posting.title}
                      </h1>
                      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                        {posting.companyId?.employerProfile?.name} •{" "}
                        {posting.location.addressLine
                          ? `${posting.location.addressLine}, `
                          : ""}
                        {posting.location.city}, {posting.location.state}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                        <Building className="h-3.5 w-3.5 text-primary" />
                        {posting.companyId?.employerProfile?.name}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {posting.location.addressLine
                          ? `${posting.location.addressLine}, `
                          : ""}
                        {posting.location.city}, {posting.location.state},{" "}
                        {posting.location.country}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                        <CalendarClock className="h-3.5 w-3.5 text-primary" />
                        Posted {createdRelative ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-xs rounded-2xl border border-border/60 bg-background/80 p-4 text-sm shadow-sm">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        posting.publishStatus === "Draft"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}
                    >
                      <StatusIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Posting status
                      </p>
                      <p className="font-medium text-foreground">
                        {posting.publishStatus === "Published"
                          ? "Published"
                          : "Draft"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {posting.publishStatus === "Published"
                      ? "This posting is visible to job seekers."
                      : "This posting is in draft and not visible to job seekers."}
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
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${stat.accent}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
                        {stat.label}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.hint}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
            <Card className="border border-border/60 bg-background/80 shadow-sm">
              <CardHeader>
                <CardTitle>Job details</CardTitle>
                <CardDescription>
                  Complete job posting information and requirements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Job description
                  </label>
                  <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground whitespace-pre-wrap">
                    {posting.description}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Requirements
                  </label>
                  <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                    <ul className="list-disc list-inside space-y-1">
                      {posting.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Responsibilities
                  </label>
                  <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                    <ul className="list-disc list-inside space-y-1">
                      {posting.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {posting.niceToHave && posting.niceToHave.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Nice to Have
                    </label>
                    <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                      <ul className="list-disc list-inside space-y-1">
                        {posting.niceToHave.map((nice, index) => (
                          <li key={index}>{nice}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Skills
                  </label>
                  <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                    <ul className="list-disc list-inside space-y-1">
                      {posting.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {posting.benefits && posting.benefits.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Benefits
                    </label>
                    <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                      <ul className="list-disc list-inside space-y-1">
                        {posting.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Salary range
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span>
                        {posting.salary
                          ? `${
                              posting.salary.currency
                            } ${posting.salary.min.toLocaleString()} - ${posting.salary.max.toLocaleString()} per ${
                              posting.salary.period
                            }`
                          : "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Employment type
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                      <BadgeCheck className="h-4 w-4 text-primary" />
                      <span>{posting.employmentType}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Department
                    </label>
                    <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                      {posting.department || "Not specified"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Team
                    </label>
                    <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                      {posting.team || "Not specified"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Experience Level
                    </label>
                    <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                      {posting.experienceLevel}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Work Mode
                    </label>
                    <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                      {posting.workMode}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Education Level
                    </label>
                    <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                      {posting.educationLevel || "Not specified"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="relative space-y-6">
              <div className="sticky top-6 space-y-6">
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle>Application Details</CardTitle>
                    <CardDescription>
                      How to apply for this position.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Application Deadline
                      </label>
                      <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                        {posting.applicationDeadline
                          ? format(new Date(posting.applicationDeadline), "PPP")
                          : "No deadline"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Application Method
                      </label>
                      <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground space-y-1">
                        <p>Type: {posting.applicationMethod.type}</p>
                        {posting.applicationMethod.email && (
                          <p>Email: {posting.applicationMethod.email}</p>
                        )}
                        {posting.applicationMethod.externalLink && (
                          <p>Link: {posting.applicationMethod.externalLink}</p>
                        )}
                        <p>
                          Ask Resume:{" "}
                          {posting.applicationMethod.askResume ? "Yes" : "No"}
                        </p>
                        <p>
                          Ask Cover Letter:{" "}
                          {posting.applicationMethod.askCoverLetter
                            ? "Yes"
                            : "No"}
                        </p>
                        <p>
                          Ask Portfolio:{" "}
                          {posting.applicationMethod.askPortfolio
                            ? "Yes"
                            : "No"}
                        </p>
                        {posting.applicationMethod.customQuestions &&
                          posting.applicationMethod.customQuestions.length >
                            0 && (
                            <div>
                              <p>Custom Questions:</p>
                              <ul className="list-disc list-inside">
                                {posting.applicationMethod.customQuestions.map(
                                  (q, index) => (
                                    <li key={index}>
                                      {q.label} (
                                      {q.required ? "Required" : "Optional"}) -{" "}
                                      {q.responseType}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                 <Card className="border border-border/60 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle>Moderation guidelines</CardTitle>
                    <CardDescription>
                      Content management best practices.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs text-muted-foreground">
                    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          Content review
                        </p>
                        <p>
                          Regularly check job postings for compliance with
                          platform policies.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                      <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          Quality assurance
                        </p>
                        <p>
                          Ensure job descriptions are clear and requirements are
                          reasonable.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                      <ShieldAlert className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          Fraud prevention
                        </p>
                        <p>
                          Monitor for suspicious activity and verify employer
                          legitimacy.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border border-border/60 bg-background/80 shadow-sm">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Other details about the position.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Visa Sponsorship
                  </label>
                  <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                    {posting.visaSponsorship ? "Yes" : "No"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Relocation Support
                  </label>
                  <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                    {posting.relocationSupport ? "Yes" : "No"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {posting.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 relative">
              <div className="sticky top-6 space-y-6">
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle>Posting information</CardTitle>
                    <CardDescription>Metadata and identifiers.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                      <Hash className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Posting ID
                        </p>
                        <p className="font-mono text-sm text-foreground">
                          {posting._id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                      <CalendarClock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Created
                        </p>
                        <p className="text-sm text-foreground">{createdAt}</p>
                        <p className="text-xs text-muted-foreground">
                          {createdRelative ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Last updated
                        </p>
                        <p className="text-sm text-foreground">{updatedAt}</p>
                        <p className="text-xs text-muted-foreground">
                          {updatedRelative ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                      <Hash className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Slug
                        </p>
                        <p className="font-mono text-sm text-foreground">
                          {posting.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                      <Hash className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          External Reference ID
                        </p>
                        <p className="font-mono text-sm text-foreground">
                          {posting.externalReferenceId || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                      <Building className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Company Email
                        </p>
                        <p className="text-sm text-foreground">
                          {posting.companyId.email}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPostingDetail;
