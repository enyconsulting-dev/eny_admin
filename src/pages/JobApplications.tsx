import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  Loader2,
  Search,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
  Calendar,
  Briefcase,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { appService } from "@/lib/api/service";

interface JobApplication {
  _id: string;
  jobPostingId: {
    _id: string;
    title: string;
    slug: string;
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
  portfolioLinks: string[];
  status: "Submitted" | "Viewed" | "NoteAdded" | "StageChanged" | "InterviewScheduled" | "InterviewCompleted" | "OfferMade" | "OfferAccepted" | "Rejected" | "Withdrawn" | "UnderReview";
  source: string;
  submittedAt: string;
  lastViewedAt: string;
  createdAt: string;
  updatedAt: string;
}

const JobApplications = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isError: applicationsError,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["job-applications"],
    queryFn: appService.getJobApplications,
    staleTime: 2,
    refetchOnMount: true,
  });

  const applications: JobApplication[] = applicationsData?.data?.data?.results ?? [];

  const filteredApplications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return applications.filter((application) => {
      const seekerName = application.jobSeekerId?.jobSeekerProfile?.fullName?.toLowerCase() ?? "";
      const jobTitle = application.jobPostingId?.title?.toLowerCase() ?? "";
      const company = application.companyId?.employerProfile?.name?.toLowerCase() ?? "";
      const matchesQuery =
        !query ||
        seekerName.includes(query) ||
        jobTitle.includes(query) ||
        company.includes(query);
      return matchesQuery;
    });
  }, [applications, searchTerm]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "Submitted": 0,
      "Viewed": 0,
      "NoteAdded": 0,
      "StageChanged": 0,
      "InterviewScheduled": 0,
      "InterviewCompleted": 0,
      "OfferMade": 0,
      "OfferAccepted": 0,
      "Rejected": 0,
      "Withdrawn": 0,
      "UnderReview": 0,
    };

    applications.forEach((app) => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    });

    return counts;
  }, [applications]);

  const totalApplications = applications.length;

  const summaryCards = [
    {
      key: "total",
      label: "All applications",
      value: totalApplications,
      description: "Total job applications submitted.",
      icon: FileText,
    },
    {
      key: "submitted",
      label: "Submitted",
      value: statusCounts.Submitted,
      description: "New applications awaiting review.",
      icon: FileText,
    },
    {
      key: "viewed",
      label: "Viewed",
      value: statusCounts.Viewed,
      description: "Applications that have been reviewed.",
      icon: Eye,
    },
    {
      key: "interviewScheduled",
      label: "Interview scheduled",
      value: statusCounts.InterviewScheduled,
      description: "Applications with scheduled interviews.",
      icon: Calendar,
    },
    {
      key: "offerMade",
      label: "Offers made",
      value: statusCounts.OfferMade,
      description: "Job offers extended to candidates.",
      icon: Briefcase,
    },
    {
      key: "offerAccepted",
      label: "Offers accepted",
      value: statusCounts.OfferAccepted,
      description: "Offers that have been accepted.",
      icon: CheckCircle,
    },
    {
      key: "rejected",
      label: "Rejected",
      value: statusCounts.Rejected,
      description: "Applications that were not successful.",
      icon: XCircle,
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
      "UnderReview": { variant: "default" as const, icon: Clock },
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

  return (
    <DashboardLayout>
      <div className="w-full space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/jobs")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs uppercase tracking-widest"
              >
                Job applications
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Job applications
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Track and manage job applications across all statuses and stages.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => refetchApplications()}
              disabled={applicationsLoading}
            >
              <Loader2
                className={`h-4 w-4 ${applicationsLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {summaryCards.map((summary) => {
            const Icon = summary.icon;
            return (
              <Card
                key={summary.key}
                className="border border-border/60 bg-muted/30 shadow-sm dark:bg-muted/10"
              >
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                      {summary.label}
                    </p>
                    <p className="text-2xl font-semibold text-foreground">
                      {summary.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {summary.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle>Applications overview</CardTitle>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by applicant or job title…"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {applicationsLoading ? (
              <div className="space-y-3 p-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/5" />
              </div>
            ) : applicationsError ? (
              <div className="flex items-center justify-between gap-4 border-t border-border/60 px-6 py-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">
                      We couldn't load job applications.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Check your connection and refresh to try again.
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => refetchApplications()}>
                  Retry
                </Button>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="flex flex-col items-center gap-3 border-t border-dashed border-border/60 py-16 text-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    No applications match your search
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Adjust your search or check back later.
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Applicant</TableHead>
                    <TableHead className="min-w-[200px]">Job Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead className="min-w-[120px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => {
                    const appliedAt = application.submittedAt
                      ? format(
                          new Date(application.submittedAt),
                          "MMM d, yyyy"
                        )
                      : "Unknown";
                    const applicantName = application.jobSeekerId?.jobSeekerProfile?.fullName || "Unknown Applicant";
                    const jobTitle = application.jobPostingId?.title || "Unknown Position";
                    const company = application.companyId?.employerProfile?.name || "Unknown Company";

                    return (
                      <TableRow
                        key={application._id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {applicantName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {application.jobSeekerId?.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {jobTitle}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {company}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          {getStatusBadge(application.status)}
                        </TableCell>
                        <TableCell className="align-top text-sm text-muted-foreground">
                          {appliedAt}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() =>
                                navigate(`/jobs/applications/${application._id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JobApplications;