import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  CheckCircle,
  FileText,
  Loader2,
  SearchX,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { appService } from "@/lib/api/service";

interface Answer {
  questionId: {
    type: string;
    prompt: string;
    weight: number;
  };
  value: any;
  answeredAt: string;
}

interface AttemptDetail {
  _id: string;
  assessmentId: {
    _id: string;
    title: string;
    description: string;
    timeLimitSec: number;
  };
  userId: {
    firstName: string;
    lastName: string;
    phone: string;
    emailAddress: string;
    mobileNumber: string;
    createdAt: string;
    updatedAt: string;
  };
  status: string;
  state: {
    isStarted: boolean;
    isExpired: boolean;
    isCompleted: boolean;
    isAbandoned: boolean;
    isClosed: boolean;
  };
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
  lastHeartbeatAt: string;
  leaseExpiresAt?: string;
  lockId?: string;
  serverDeadline: string;
  startedAt?: string;
  endedAt?: string;
}

const AttemptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: attemptData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["attempt", id],
    queryFn: () => appService.getAttemptById(id!),
    enabled: !!id,
  });

  const attempt: AttemptDetail | undefined = attemptData?.data;
  const isHydrated = Boolean(attempt);
  const showSkeleton = isLoading && !isHydrated;
  const showNotFound = !isLoading && !isError && !attempt;

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "expired":
        return "destructive";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const statusCopy: Record<string, string> = {
    active: "Candidate is in progress or ready to resume.",
    completed: "Candidate completed the attempt successfully.",
    expired: "Time limit elapsed before the attempt was submitted.",
    abandoned: "Candidate exited before completion.",
    closed: "Attempt was closed by an administrator.",
  };

  const getStateIcon = (state: boolean) => {
  return state ? (
    <CheckCircle className="h-4 w-4 text-green-500" />
  ) : (
    <XCircle className="h-4 w-4 text-red-500" />
  );
};

const TimelineItem = ({ label, value }: { label: string; value?: string }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className="text-sm text-foreground">
      {value ? format(new Date(value), "PPP p") : "—"}
    </p>
  </div>
);
  
  const renderValue = (value: any): string => {
    if (value === null || value === undefined) {
      return "No answer";
    }
  
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
  
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return "Empty array";
      }
  
      // Check if it's an array of objects with key/text structure
      if (value.every(item => typeof item === "object" && item !== null && "key" in item && "text" in item)) {
        return value.map((item: any) => `${item.key}: ${item.text}`).join(", ");
      }
  
      // Otherwise, stringify the array
      return JSON.stringify(value, null, 2);
    }
  
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
  
    return String(value);
  };

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center py-24">
          <Card className="w-full max-w-xl border border-destructive/30 bg-destructive/10 text-destructive shadow-xl animate-in fade-in-50 zoom-in-95">
            <CardHeader className="items-center space-y-4 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
                <AlertCircle className="h-6 w-6" />
              </span>
              <CardTitle className="text-2xl">We couldn&apos;t load this attempt</CardTitle>
              <p className="text-sm text-destructive/80">
                Please check the link and try refreshing the page.
              </p>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="destructive" onClick={() => refetch()}>
                Retry loading
              </Button>
              <Button variant="ghost" className="text-destructive" onClick={() => navigate("/assessments/attempts")}>
                Back to attempts
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (showNotFound) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center py-24">
          <Card className="w-full max-w-xl border border-border/60 bg-muted/30 shadow-lg animate-in fade-in-50 slide-in-from-bottom-8">
            <CardHeader className="items-center space-y-4 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SearchX className="h-6 w-6" />
              </span>
              <CardTitle className="text-2xl">Attempt not found</CardTitle>
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t find an attempt that matches this link. It may have been removed or never existed.
              </p>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" onClick={() => navigate("/assessments/attempts")}>
                View attempts
              </Button>
              <Button onClick={() => navigate("/assessments")}>Go to assessments</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (showSkeleton) {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-6 animate-in fade-in-50">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-40 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card key={`summary-skeleton-${idx}`} className="overflow-hidden border border-border/60 bg-muted/20 dark:bg-muted/10">
                <div className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-[shimmer_2s_linear_infinite]" />
                <CardContent className="space-y-3 p-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card key={`info-skeleton-${idx}`} className="border border-border/60 bg-muted/20 dark:bg-muted/10">
                <CardContent className="space-y-3 p-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border border-border/60 bg-muted/20 dark:bg-muted/10">
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!attempt) {
    return null;
  }

  const statusKey = attempt.status?.toLowerCase?.() ?? "unknown";
  const summaryCards = useMemo(
    () => [
      {
        key: "status",
        label: "Current status",
        value: attempt.status,
        description: statusCopy[statusKey] ?? "Attempt status is being tracked.",
        icon: Sparkles,
      },
      {
        key: "created",
        label: "Created at",
        value: format(new Date(attempt.createdAt), "MMM d, yyyy h:mm a"),
        description: "When this attempt record was created.",
        icon: CalendarClock,
      },
      {
        key: "progress",
        label: "Progress",
        value: attempt.startedAt
          ? attempt.endedAt
            ? "Completed"
            : "In progress"
          : "Not started",
        description: attempt.startedAt
          ? attempt.endedAt
            ? "Candidate submitted their attempt."
            : "Candidate has started but not ended the attempt."
          : "Waiting for the candidate to begin.",
        icon: Loader2,
      },
    ],
    [attempt.createdAt, attempt.endedAt, attempt.startedAt, attempt.status, statusKey],
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6 animate-in fade-in-50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-fit gap-2" onClick={() => navigate("/assessments/attempts")}>
              <ArrowLeft className="h-4 w-4" />
              Back to attempts
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight">Attempt details</h1>
              <p className="text-sm text-muted-foreground">
                Attempt ID: <span className="font-mono text-foreground/80">{attempt._id}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={getStatusBadgeVariant(attempt.status)}>
              {attempt.status}
            </Badge>
            <Badge variant="outline">{attempt.state.isStarted ? "Started" : "Not started"}</Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {summaryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.key}
                className="border border-border/60 bg-muted/20 shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:bg-muted/10"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {card.label}
                    </p>
                    <p className="text-xl font-semibold text-foreground">{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.description}</p>
                  </div>
                  <span className="rounded-full border border-border/60 bg-background p-2 shadow-sm">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border border-border/60 bg-card shadow-sm dark:bg-muted/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Assessment
              </CardTitle>
              <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                {attempt.assessmentId._id}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Title</p>
                <p className="text-sm text-foreground">{attempt.assessmentId.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Description</p>
                <p className="text-sm text-muted-foreground">
                  {attempt.assessmentId.description || "No description provided."}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Time limit</p>
                <p className="flex items-center gap-2 text-sm text-foreground">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  {attempt.assessmentId.timeLimitSec} seconds
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card shadow-sm dark:bg-muted/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Candidate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Name</p>
                <p className="text-sm text-foreground">
                  {attempt.userId.firstName} {attempt.userId.lastName}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Email</p>
                <p className="text-sm text-muted-foreground">{attempt.userId.emailAddress}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Phone</p>
                <p className="text-sm text-muted-foreground">{attempt.userId.mobileNumber || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Joined</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(attempt.userId.createdAt), "PPP p")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card shadow-sm dark:bg-muted/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Status & state</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(attempt.status)}>{attempt.status}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {statusCopy[statusKey] ?? "Status information is unavailable."}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase text-muted-foreground">State flags</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  {Object.entries(attempt.state).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-1 rounded-full border border-border/70 bg-muted/30 px-3 py-1 capitalize dark:bg-muted/20"
                    >
                      {getStateIcon(value)}
                      {key.replace(/([A-Z])/g, " $1")}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border/60 bg-card shadow-sm dark:bg-muted/10">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <TimelineItem label="Created" value={attempt.createdAt} />
              <TimelineItem label="Started" value={attempt.startedAt} />
              <TimelineItem label="Ended" value={attempt.endedAt} />
              <TimelineItem label="Last heartbeat" value={attempt.lastHeartbeatAt} />
              <TimelineItem label="Server deadline" value={attempt.serverDeadline} />
              <TimelineItem label="Lease expires" value={attempt.leaseExpiresAt} />
              <TimelineItem label="Updated" value={attempt.updatedAt} />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card shadow-sm dark:bg-muted/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Answers ({attempt.answers.length})</CardTitle>
            <span className="text-xs text-muted-foreground">
              {attempt.answers.length > 0
                ? "Review each response and its submission timestamp."
                : "No answers have been submitted yet."}
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            {attempt.answers.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                No answers submitted yet.
              </div>
            ) : (
              attempt.answers.map((answer, index) => (
                <Card
                  key={`${answer.questionId.prompt}-${index}`}
                  className="border border-border/60 bg-background/70 shadow-sm transition-transform duration-200 hover:-translate-y-1 dark:bg-muted/10"
                >
                  <CardContent className="space-y-4 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                          Question {index + 1}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(answer.answeredAt), "PPP p")}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Weight {answer.questionId.weight}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">{answer.questionId.prompt}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span className="uppercase tracking-widest">Type: {answer.questionId.type}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase text-muted-foreground">Answer</p>
                      <div className="rounded-md border border-border/70 bg-muted/20 p-3 font-mono text-sm text-foreground whitespace-pre-wrap dark:bg-muted/10">
                        {renderValue(answer.value)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {(attempt.lockId || attempt.leaseExpiresAt) && (
          <Card className="border border-border/60 bg-card shadow-sm dark:bg-muted/10">
            <CardHeader>
              <CardTitle>Technical details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {attempt.lockId && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase text-muted-foreground">Lock ID</p>
                    <p className="rounded-md border border-border/70 bg-muted/20 p-2 font-mono text-xs text-muted-foreground dark:bg-muted/10">
                      {attempt.lockId}
                    </p>
                  </div>
                )}
                {attempt.leaseExpiresAt && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase text-muted-foreground">Lease expires</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(attempt.leaseExpiresAt), "PPP p")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AttemptDetail;
