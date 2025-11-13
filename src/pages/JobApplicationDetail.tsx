import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  ShieldCheck,
  Sparkles,
  FileText,
  CheckCircle,
  Eye,
  UserCheck,
  Calendar,
  Briefcase,
  XCircle,
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
import { appService } from "@/lib/api/service";

interface JobApplication {
  _id: string;
  jobPostingId: {
    _id: string;
    title: string;
  };
  jobSeekerId: {
    _id: string;
    email: string;
    jobSeekerProfile: {
      fullName: string;
    };
  };
  companyId: {
    _id: string;
    email: string;
    employerProfile: {
      name: string;
    };
  };
  postingSnapshot: {
    location: {
      country: string;
      state: string;
      city: string;
    };
    title: string;
    workMode: string;
    employmentType: string;
    applicationDeadline: string;
  };
  resume: {
    url: string;
    name: string;
    mimeType: string;
    size: number;
    uploadedAt: string;
  };
  coverLetter: string;
  portfolioLinks: string[];
  answers: {
    questionId: string;
    responseType: string;
    valueText: string;
    valueOptions: string[];
    questionLabel: string;
  }[];
  status: "Submitted" | "Viewed" | "NoteAdded" | "StageChanged" | "InterviewScheduled" | "InterviewCompleted" | "OfferMade" | "OfferAccepted" | "Rejected" | "Withdrawn" | "UnderReview";
  source: string;
  notes: string[];
  timeline: {
    at: string;
    by?: string;
    type: string;
    note?: string;
    meta?: any;
  }[];
  submittedAt: string;
  lastViewedAt: string;
  createdAt: string;
  updatedAt: string;
}

const JobApplicationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: applicationData,
    isLoading: applicationLoading,
    isError: applicationError,
    refetch: refetchApplication,
  } = useQuery({
    queryKey: ["job-application", id],
    queryFn: () => appService.getJobApplicationById(id!),
    enabled: !!id,
  });

  const application: JobApplication | undefined = applicationData?.data;

  console.log(application)

  if (applicationLoading) {
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

  if (applicationError || !application) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center">
            <h2 className="text-xl font-semibold">Application not found</h2>
            <p className="text-muted-foreground">
              The job application you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button onClick={() => navigate("/jobs/applications")}>
            Back to applications
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const appliedAt = application.submittedAt ? format(new Date(application.submittedAt), "PPP") : "Unknown";
  const updatedAt = application.updatedAt ? format(new Date(application.updatedAt), "PPP") : "Unknown";
  const appliedRelative = application.submittedAt ? formatDistanceToNow(new Date(application.submittedAt), { addSuffix: true }) : null;
  const updatedRelative = application.updatedAt ? formatDistanceToNow(new Date(application.updatedAt), { addSuffix: true }) : null;

  const applicantName = application.jobSeekerId?.jobSeekerProfile?.fullName || "Unknown Applicant";
  const initials = application.jobSeekerId?.jobSeekerProfile?.fullName
    ? application.jobSeekerId.jobSeekerProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : "U";

  const quickStats = [
    {
      key: "applied",
      label: "Applied",
      value: appliedAt,
      hint: appliedRelative ?? "—",
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
      value: application.status,
      hint: getStatusDescription(application.status),
      icon: getStatusIcon(application.status),
      accent: getStatusAccent(application.status),
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Submitted": { variant: "secondary" as const, icon: FileText },
      "Viewed": { variant: "default" as const, icon: Eye },
      "NoteAdded": { variant: "outline" as const, icon: FileText },
      "StageChanged": { variant: "outline" as const, icon: UserCheck },
      "InterviewScheduled": { variant: "default" as const, icon: Calendar },
      "InterviewCompleted": { variant: "default" as const, icon: CheckCircle },
      "OfferMade": { variant: "default" as const, icon: Briefcase },
      "OfferAccepted": { variant: "default" as const, icon: CheckCircle },
      "Rejected": { variant: "destructive" as const, icon: XCircle },
      "Withdrawn": { variant: "secondary" as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: "outline" as const, icon: FileText };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  function getStatusIcon(status: string) {
    const icons = {
      "Submitted": FileText,
      "Viewed": Eye,
      "NoteAdded": FileText,
      "StageChanged": UserCheck,
      "InterviewScheduled": Calendar,
      "InterviewCompleted": CheckCircle,
      "OfferMade": Briefcase,
      "OfferAccepted": CheckCircle,
      "Rejected": XCircle,
      "Withdrawn": XCircle,
    };
    return icons[status as keyof typeof icons] || FileText;
  }

  function getStatusAccent(status: string) {
    const accents = {
      "Submitted": "bg-gray-500/10 text-gray-500",
      "Viewed": "bg-blue-500/10 text-blue-500",
      "NoteAdded": "bg-yellow-500/10 text-yellow-500",
      "StageChanged": "bg-purple-500/10 text-purple-500",
      "InterviewScheduled": "bg-green-500/10 text-green-500",
      "InterviewCompleted": "bg-emerald-500/10 text-emerald-500",
      "OfferMade": "bg-indigo-500/10 text-indigo-500",
      "OfferAccepted": "bg-teal-500/10 text-teal-500",
      "Rejected": "bg-red-500/10 text-red-500",
      "Withdrawn": "bg-orange-500/10 text-orange-500",
    };
    return accents[status as keyof typeof accents] || "bg-gray-500/10 text-gray-500";
  }

  function getStatusDescription(status: string) {
    const descriptions = {
      "Submitted": "Application submitted, awaiting review",
      "Viewed": "Application has been reviewed",
      "NoteAdded": "Notes have been added to the application",
      "StageChanged": "Application moved to a different stage",
      "InterviewScheduled": "Interview has been scheduled",
      "InterviewCompleted": "Interview process completed",
      "OfferMade": "Job offer has been extended",
      "OfferAccepted": "Job offer accepted by candidate",
      "Rejected": "Application was not successful",
      "Withdrawn": "Application withdrawn by candidate",
    };
    return descriptions[status as keyof typeof descriptions] || "Status description unavailable";
  }

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
                  onClick={() => navigate("/jobs/applications")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to applications
                </Button>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative flex flex-col items-center sm:items-start">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                      <AvatarImage src="" alt={`${applicantName} avatar`} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/40 via-primary/20 to-primary/40 text-lg font-semibold uppercase text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary-foreground shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      applicant
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        {applicantName}
                      </h1>
                      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                        Applied for: {application.jobPostingId?.title || "Unknown Position"} at {application.companyId?.employerProfile?.name || "Unknown Company"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        {application.jobSeekerId?.email}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                        <CalendarClock className="h-3.5 w-3.5 text-primary" />
                        Applied {appliedRelative ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-xs rounded-2xl border border-border/60 bg-background/80 p-4 text-sm shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${getStatusAccent(application.status)}`}>
                      {React.createElement(getStatusIcon(application.status), { className: "h-5 w-5" })}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Application status
                      </p>
                      <p className="font-medium text-foreground">
                        {application.status}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {getStatusDescription(application.status)}
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
            <div className="space-y-6">
              {application.coverLetter && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle>Cover Letter</CardTitle>
                    <CardDescription>
                      Applicant's cover letter submission.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground whitespace-pre-wrap">
                      {application.coverLetter}
                    </div>
                  </CardContent>
                </Card>
              )}

              {application.resume && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle>Resume</CardTitle>
                    <CardDescription>
                      Applicant's resume document.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{application.resume.name}</p>
                        <p className="text-xs text-muted-foreground">Type: {application.resume.mimeType}</p>
                        <p className="text-xs text-muted-foreground">Size: {(application.resume.size / 1024).toFixed(1)} KB</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {new Date(application.resume.uploadedAt).toLocaleDateString()}
                        </p>
                        {application.resume.url && (
                          <a href={application.resume.url} target="_blank" rel="noopener noreferrer"
                             className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                            <span>📄</span>
                            View Resume
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {application.answers && application.answers.length > 0 && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle>Application Answers</CardTitle>
                    <CardDescription>
                      Responses to application questions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {application.answers.map((answer, index) => (
                        <div key={index} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-foreground">{answer.questionLabel}</h4>
                            <p className="text-sm text-muted-foreground">Type: {answer.responseType}</p>
                            <div className="rounded-lg border border-border/60 bg-background/50 px-3 py-2">
                              <p className="text-sm text-foreground whitespace-pre-wrap">{answer.valueText}</p>
                            </div>
                            {answer.valueOptions && answer.valueOptions.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Selected Options</p>
                                <div className="flex flex-wrap gap-1">
                                  {answer.valueOptions.map((option, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">{option}</Badge>
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

              {application.notes && application.notes.length > 0 && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                    <CardDescription>
                      Internal notes and comments on the application.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {application.notes.map((note, index) => (
                        <div key={index} className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                          <p className="text-sm text-foreground">{note}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {application.timeline && application.timeline.length > 0 && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle>Application Timeline</CardTitle>
                    <CardDescription>
                      History of status changes and activities.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {application.timeline.map((event, index) => (
                        <div key={index} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-xs font-medium text-primary">
                              {event.type.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium text-foreground">{event.type}</p>
                            {event.note && (
                              <p className="text-sm text-muted-foreground">{event.note}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.at).toLocaleString()}
                              {event.by && ` by ${event.by}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {application.portfolioLinks && application.portfolioLinks.length > 0 && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle>Portfolio Links</CardTitle>
                    <CardDescription>
                      External portfolio and work samples.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {application.portfolioLinks.map((link, index) => (
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

              <Card className="border border-border/60 bg-background/80 shadow-sm">
                <CardHeader>
                  <CardTitle>Applied Position</CardTitle>
                  <CardDescription>
                    Details of the job position applied for.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Job Title
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span>{application.jobPostingId?.title}</span>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Company
                      </label>
                      <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                        <span>{application.companyId?.employerProfile?.name}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Location
                      </label>
                      <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                        <CalendarClock className="h-4 w-4 text-primary" />
                        <span>{application.postingSnapshot.location.city}, {application.postingSnapshot.location.state}, {application.postingSnapshot.location.country}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Work Mode
                      </label>
                      <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                        {application.postingSnapshot.workMode}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Employment Type
                      </label>
                      <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                        {application.postingSnapshot.employmentType}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border border-border/60 bg-background/80 shadow-sm">
                <CardHeader>
                  <CardTitle>Application details</CardTitle>
                  <CardDescription>Metadata and identifiers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <Hash className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Application ID
                      </p>
                      <p className="font-mono text-sm text-foreground">{application._id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Applied
                      </p>
                      <p className="text-sm text-foreground">{appliedAt}</p>
                      <p className="text-xs text-muted-foreground">{appliedRelative ?? "—"}</p>
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
                  <CardTitle>Applicant info</CardTitle>
                  <CardDescription>Contact and location details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {application.jobSeekerId?.jobSeekerProfile?.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {application.jobSeekerId?.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 bg-background/80 shadow-sm">
                <CardHeader>
                  <CardTitle>Application management</CardTitle>
                  <CardDescription>Guidelines for handling applications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Review process</p>
                      <p>Ensure fair and consistent evaluation of all applications.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Communication</p>
                      <p>Keep applicants informed throughout the hiring process.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <FileText className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Documentation</p>
                      <p>Maintain detailed records of application progress and decisions.</p>
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

export default JobApplicationDetail;