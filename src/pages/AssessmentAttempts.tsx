import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  Clock,
  Activity,
  CheckCircle2,
  Eye,
  Loader2,
  Mail,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  Sparkles,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { appService } from "@/lib/api/service";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Attempt {
  _id: string;
  assessmentId: {
    _id?: string;
    title: string;
    timeLimitSec: number;
  };
  userId: {
    _id?: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    mobileNumber: string;
  };
  status: string;
  state: {
    isStarted: boolean;
    isExpired: boolean;
    isCompleted: boolean;
    isAbandoned: boolean;
    isClosed: boolean;
  };
  createdAt: string;
  lastHeartbeatAt: string;
  serverDeadline: string;
  startedAt?: string;
  endedAt?: string;
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  completed: "Completed",
  expired: "Expired",
  abandoned: "Abandoned",
  closed: "Closed",
  pending: "Pending",
};

const STATUS_INTENTS: Record<
  string,
  { variant: "default" | "secondary" | "destructive" | "outline"; copy: string }
> = {
  active: { variant: "default", copy: "Candidate currently in progress." },
  completed: { variant: "secondary", copy: "Attempt finished successfully." },
  expired: {
    variant: "destructive",
    copy: "Deadline reached without submission.",
  },
  abandoned: {
    variant: "outline",
    copy: "Candidate exited before completion.",
  },
  closed: { variant: "outline", copy: "Attempt closed by an administrator." },
  pending: { variant: "outline", copy: "Waiting for candidate to start." },
};

const AssessmentAttempts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAssessment, setSelectedAssessment] = useState("");
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [attemptMode, setAttemptMode] = useState<"single" | "multi">("single");

  const {
    data: attemptsData,
    isLoading: attemptsLoading,
    isError: attemptsError,
    refetch: refetchAttempts,
  } = useQuery({
    queryKey: ["attempts"],
    queryFn: appService.getAttempts,
  });

  const { data: assessmentsData, isLoading: assessmentsLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: appService.getAssessments,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: appService.getUsers,
  });

  const createAttemptMutation = useMutation({
    mutationFn: appService.createAttempt,
    onSuccess: () => {
      toast({
        title: "Attempt created",
        description: "The candidate can now begin their assessment.",
      });
      queryClient.invalidateQueries({ queryKey: ["attempts"] });
      setIsCreateDialogOpen(false);
      setSelectedAssessment("");
      setSelectedAssessments([]);
      setSelectedUser("");
      setAttemptMode("single");
    },
    onError: (error: any) => {
      toast({
        title: "Unable to create attempt",
        description:
          error?.message || "Please review your selections and try again.",
        variant: "destructive",
      });
    },
  });

  const createAttemptsManyMutation = useMutation({
    mutationFn: appService.createAttemptsMany,
    onSuccess: () => {
      toast({
        title: "Attempts created",
        description: "The candidate can now begin their assessments.",
      });
      queryClient.invalidateQueries({ queryKey: ["attempts"] });
      setIsCreateDialogOpen(false);
      setSelectedAssessments([]);
      setSelectedUser("");
      setAttemptMode("single");
    },
    onError: (error: any) => {
      toast({
        title: "Unable to create attempts",
        description:
          error?.message || "Please review your selections and try again.",
        variant: "destructive",
      });
    },
  });

  const deleteAttemptMutation = useMutation({
    mutationFn: appService.deleteAttempt,
    onSuccess: () => {
      toast({
        title: "Attempt removed",
        description: "The attempt will no longer be visible in reporting.",
      });
      queryClient.invalidateQueries({ queryKey: ["attempts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to delete attempt",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const attempts: Attempt[] = attemptsData?.data?.results ?? [];
  const assessments = assessmentsData?.data?.results ?? [];
  const users = usersData?.data?.results ?? [];

  const filteredAttempts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return attempts.filter((attempt) => {
      const title = attempt.assessmentId?.title?.toLowerCase() ?? "";
      const firstName = attempt.userId?.firstName?.toLowerCase() ?? "";
      const lastName = attempt.userId?.lastName?.toLowerCase() ?? "";
      const email = attempt.userId?.emailAddress?.toLowerCase() ?? "";
      const status = attempt.status?.toLowerCase() ?? "";
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesQuery =
        !query ||
        title.includes(query) ||
        firstName.includes(query) ||
        lastName.includes(query) ||
        email.includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [attempts, searchTerm, statusFilter]);

  const statusSummary = useMemo(() => {
    return attempts.reduce<Record<string, number>>((acc, attempt) => {
      const normalized = attempt.status?.toLowerCase?.() ?? "unknown";
      acc[normalized] = (acc[normalized] ?? 0) + 1;
      return acc;
    }, {});
  }, [attempts]);

  const totalAttempts = attempts.length;
  const activeAttempts = statusSummary.active ?? 0;
  const completedAttempts = statusSummary.completed ?? 0;
  const completionRate = totalAttempts
    ? Math.round((completedAttempts / totalAttempts) * 100)
    : 0;

  const lastCreatedRelative = useMemo(() => {
    const timestamps = attempts
      .map((attempt) => attempt.createdAt)
      .filter(Boolean)
      .map((createdAt) => new Date(createdAt).getTime());
    if (timestamps.length === 0) {
      return null;
    }
    const latest = Math.max(...timestamps);
    return formatDistanceToNow(new Date(latest), { addSuffix: true });
  }, [attempts]);

  const nextDeadlineRelative = useMemo(() => {
    const futureDeadlines = attempts
      .map((attempt) => attempt.serverDeadline)
      .filter(Boolean)
      .map((deadline) => new Date(deadline).getTime())
      .filter((timestamp) => timestamp > Date.now());

    if (futureDeadlines.length === 0) {
      return null;
    }

    const nextDeadline = Math.min(...futureDeadlines);
    return formatDistanceToNow(new Date(nextDeadline), { addSuffix: true });
  }, [attempts]);

  const upcomingDeadlineCount = useMemo(() => {
    const now = Date.now();
    const threshold = now + 24 * 60 * 60 * 1000;

    return attempts.filter((attempt) => {
      if (!attempt.serverDeadline) {
        return false;
      }
      const deadline = new Date(attempt.serverDeadline).getTime();
      return deadline >= now && deadline <= threshold;
    }).length;
  }, [attempts]);

  const handleCreateAttempt = () => {
    if (attemptMode === "single") {
      if (!selectedAssessment || !selectedUser) {
        toast({
          title: "Selection required",
          description: "Choose both an assessment and a candidate to continue.",
          variant: "destructive",
        });
        return;
      }
      createAttemptMutation.mutate({
        assessmentId: selectedAssessment,
        userId: selectedUser,
      });
    } else {
      if (selectedAssessments.length === 0 || !selectedUser) {
        toast({
          title: "Selection required",
          description: "Choose assessments and a candidate to continue.",
          variant: "destructive",
        });
        return;
      }
      createAttemptsManyMutation.mutate({
        userInfoId: selectedUser,
        assessmentIds: selectedAssessments,
      });
    }
  };

  const handleDeleteAttempt = (attemptId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this attempt? This action cannot be undone."
      )
    ) {
      return;
    }
    deleteAttemptMutation.mutate(attemptId);
  };

  const summaryCards = [
    {
      key: "total",
      label: "Total attempts",
      value: totalAttempts,
      description: "All tracked attempts across assessments.",
      icon: Sparkles,
      accent: "bg-primary/10 text-primary",
      hint: lastCreatedRelative
        ? `Latest ${lastCreatedRelative}`
        : "No attempts recorded yet",
    },
    {
      key: "active",
      label: "In progress",
      value: activeAttempts,
      description: "Candidates currently progressing through assessments.",
      icon: Activity,
      accent: "bg-blue-500/10 text-blue-500",
      hint: nextDeadlineRelative
        ? `Next deadline ${nextDeadlineRelative}`
        : "No upcoming deadlines",
    },
    {
      key: "upcoming",
      label: "Expiring soon",
      value: upcomingDeadlineCount,
      description: "Attempts expiring within 24 hours.",
      icon: CalendarClock,
      accent: "bg-amber-500/10 text-amber-500",
      hint: nextDeadlineRelative
        ? `Earliest ${nextDeadlineRelative}`
        : "All deadlines clear",
    },
    {
      key: "completed",
      label: "Completion rate",
      value: `${completionRate}%`,
      description: "Portion of attempts finished by candidates.",
      icon: CheckCircle2,
      accent: "bg-emerald-500/10 text-emerald-500",
      hint: `${completedAttempts} of ${totalAttempts || 0} complete`,
    },
  ];

  const statusFilters = [
    { value: "all", label: "All statuses" },
    ...Object.keys(STATUS_LABELS).map((key) => ({
      value: key,
      label: STATUS_LABELS[key],
    })),
  ];

  const getCandidateInitials = (attempt: Attempt) => {
    const first = attempt.userId?.firstName?.charAt(0) ?? "";
    const last = attempt.userId?.lastName?.charAt(0) ?? "";
    const fallback = `${first}${last}`.trim();
    if (fallback) {
      return fallback.toUpperCase();
    }
    const emailInitial = attempt.userId?.emailAddress?.charAt(0) ?? "C";
    return emailInitial.toUpperCase();
  };

  const isCreatingAttempt =
    createAttemptMutation.isPending || createAttemptsManyMutation.isPending;
  const showingCount = filteredAttempts.length;

  const renderDialogContent = (
    <DialogContent className="max-h-[82vh] overflow-hidden overflow-y-scroll no-scrollbar rounded-3xl border border-border/60 bg-background/95 p-0 shadow-xl">
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <DialogHeader className="space-y-3 text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Quick launch
          </span>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
            Launch a candidate attempt
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose the assessment experience and candidate. Attempts activate
            instantly.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5">
          <div className="flex gap-2 flex-col">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Mode
              </Label>
              <Select
                value={attemptMode}
                onValueChange={(value: "single" | "multi") => {
                  setAttemptMode(value);
                  setSelectedAssessment("");
                  setSelectedAssessments([]);
                }}
              >
                <SelectTrigger className="h-11 rounded-2xl border-border/60 bg-background/90">
                  <SelectValue placeholder="Select attempt mode" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border border-border/60 bg-background/95">
                  {/* <SelectItem value="single">Single assessment</SelectItem> */}
                  <SelectItem value="multi">Multiple assessments</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {attemptMode === "single"
                  ? "Launch one assessment for the candidate."
                  : "Queue several assessments in one sweep."}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Candidate
              </Label>
              <div className="rounded-2xl border border-border/60 bg-muted/20">
                <Command>
                  <CommandInput
                    disabled={usersLoading}
                    placeholder={
                      usersLoading
                        ? "Loading candidates…"
                        : "Search by name or email…"
                    }
                    className="h-11 border-b border-border/60 text-sm"
                  />
                  <CommandList className="max-h-56">
                    <CommandEmpty className="py-6 text-sm text-muted-foreground">
                      {usersLoading
                        ? "Fetching candidates…"
                        : "No candidates found."}
                    </CommandEmpty>
                    <CommandGroup className="max-h-56 overflow-y-auto no-scrollbar">
                      {users.map((user: any) => {
                        const fullName =
                          `${user.firstName ?? ""} ${
                            user.lastName ?? ""
                          }`.trim() || "Unnamed candidate";
                        const isSelected = selectedUser === user._id;
                        return (
                          <CommandItem
                            key={user._id}
                            value={`${fullName} ${user.emailAddress}`}
                            className="flex items-center gap-3 px-3 py-2 text-sm"
                            onSelect={() => setSelectedUser(user._id)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">
                                {fullName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {user.emailAddress}
                              </span>
                            </div>
                            {isSelected && (
                              <Badge
                                variant="outline"
                                className="ml-auto rounded-full text-[11px] uppercase tracking-widest"
                              >
                                Selected
                              </Badge>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
              {selectedUser && (
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 font-mono">
                    {selectedUser}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {attemptMode === "single" ? "Assessment" : "Assessments"}
            </Label>
            <div className="rounded-2xl border border-border/60 bg-muted/20">
              <Command>
                <CommandInput
                  disabled={assessmentsLoading}
                  placeholder={
                    assessmentsLoading
                      ? "Loading assessments…"
                      : "Search assessments…"
                  }
                  className="h-11 border-b border-border/60 text-sm"
                />
                <CommandList className="max-h-56">
                  <CommandEmpty className="py-6 text-sm text-muted-foreground">
                    {assessmentsLoading
                      ? "Fetching assessments…"
                      : "No assessments found."}
                  </CommandEmpty>
                  <CommandGroup className="max-h-56 overflow-y-auto no-scrollbar">
                    {assessments.map((assessment: any) => {
                      const isSelected =
                        attemptMode === "single"
                          ? selectedAssessment === assessment._id
                          : selectedAssessments.includes(assessment._id);
                      return (
                        <CommandItem
                          key={assessment._id}
                          value={`${assessment.title} ${
                            assessment.description ?? ""
                          }`}
                          className="flex items-center gap-3 px-3 py-2 text-sm"
                          onSelect={() => {
                            if (attemptMode === "single") {
                              setSelectedAssessment(assessment._id);
                            } else {
                              setSelectedAssessments((prev) =>
                                prev.includes(assessment._id)
                                  ? prev.filter((id) => id !== assessment._id)
                                  : [...prev, assessment._id]
                              );
                            }
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {assessment.title}
                            </span>
                            {assessment.description && (
                              <span className="text-xs text-muted-foreground line-clamp-1">
                                {assessment.description}
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <Badge
                              variant="outline"
                              className="ml-auto rounded-full text-[11px] uppercase tracking-widest"
                            >
                              Selected
                            </Badge>
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            {attemptMode === "single" && selectedAssessment && (
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 font-mono">
                  {selectedAssessment}
                </span>
              </div>
            )}
            {attemptMode === "multi" && selectedAssessments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedAssessments.map((assessmentId) => {
                  const assessment = assessments.find(
                    (item: any) => item._id === assessmentId
                  );
                  return (
                    <Badge
                      key={assessmentId}
                      variant="outline"
                      className="rounded-full border-border/60 bg-background/90 px-3 py-1 text-xs font-medium"
                    >
                      {assessment?.title ?? assessmentId}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full px-4"
            onClick={() => setIsCreateDialogOpen(false)}
            disabled={isCreatingAttempt}
          >
            Cancel
          </Button>
          <Button
            className="gap-2 rounded-full px-5"
            onClick={handleCreateAttempt}
            disabled={isCreatingAttempt || assessmentsLoading || usersLoading}
          >
            {isCreatingAttempt ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              `Create ${attemptMode === "single" ? "attempt" : "attempts"}`
            )}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
  return (
    <DashboardLayout>
      <TooltipProvider delayDuration={120}>
        <div className="relative">
          <div className="pointer-events-none absolute -top-28 right-0 h-64 w-64 rounded-full bg-primary/20 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-[-20%] left-0 h-72 w-72 rounded-full bg-emerald-500/15 blur-[120px]" />
          <div className="relative space-y-8 p-6 animate-in fade-in-50">
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-sm backdrop-blur-sm">
              <div className="flex flex-col gap-6 p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 rounded-full border border-border/60 bg-muted/30 px-4 text-xs uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/50"
                    onClick={() => navigate("/assessments")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to assessments
                  </Button>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      className="gap-2 rounded-full border-border/60 bg-background/70 px-4"
                      onClick={() => refetchAttempts()}
                      disabled={attemptsLoading}
                    >
                      <RefreshCcw
                        className={cn(
                          "h-4 w-4",
                          attemptsLoading ? "animate-spin" : undefined
                        )}
                      />
                      Refresh
                    </Button>
                    <Dialog
                      open={isCreateDialogOpen}
                      onOpenChange={setIsCreateDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="gap-2 rounded-full bg-primary px-5 py-2 text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                          <Plus className="h-4 w-4" />
                          New attempt
                        </Button>
                      </DialogTrigger>
                      {renderDialogContent}
                    </Dialog>
                  </div>
                </div>
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Attempt command center
                  </span>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      Assessment attempts
                    </h1>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      Monitor candidate progress, orchestrate new attempts, and
                      keep key deadlines front and center.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                      <Users className="h-3.5 w-3.5" />
                      {totalAttempts} total
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                      <Activity className="h-3.5 w-3.5 text-blue-500" />
                      {activeAttempts} active
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      {completedAttempts} completed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={card.key}
                    className="group relative overflow-hidden border border-border/60 bg-background/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <CardContent className="relative space-y-3 p-5">
                      <span
                        className={cn(
                          "inline-flex h-10 w-10 items-center justify-center rounded-full",
                          card.accent
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
                          {card.label}
                        </p>
                        <p className="text-2xl font-semibold text-foreground">
                          {card.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {card.description}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground/80">
                        {card.hint}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border border-border/60 bg-background/80 shadow-sm">
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      Attempt roster
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Keep your candidate pipeline silky smooth with live status
                      updates.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-full border-border/60 bg-muted/30 px-3 py-1 text-xs uppercase tracking-widest"
                  >
                    Showing {showingCount} / {totalAttempts}
                  </Badge>
                </div>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="relative w-full lg:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search by candidate, email, or assessment…"
                      className="h-11 rounded-full border-border/60 bg-background/90 pl-10"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {statusFilters.map((filter) => (
                      <Button
                        key={filter.value}
                        variant={
                          statusFilter === filter.value ? "default" : "outline"
                        }
                        className={cn(
                          "rounded-full border-border/60 px-3 py-1 text-xs",
                          statusFilter === filter.value
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-background/80 text-muted-foreground hover:bg-muted/30"
                        )}
                        onClick={() => setStatusFilter(filter.value)}
                      >
                        {filter.label}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      className="rounded-full px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {attemptsLoading ? (
                  <div className="space-y-3 p-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={`attempt-skeleton-${index}`}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4"
                      >
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-56" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : attemptsError ? (
                  <div className="flex flex-col items-center gap-4 border-t border-border/60 px-6 py-16 text-center">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        We couldn&apos;t load attempts.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Check your connection and refresh to try again.
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => refetchAttempts()}>
                      Retry
                    </Button>
                  </div>
                ) : showingCount === 0 ? (
                  <div className="flex flex-col items-center gap-4 border-t border-dashed border-border/60 px-6 py-16 text-center">
                    <Users className="h-10 w-10 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        No attempts match your filters
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Adjust your search or create a fresh attempt to populate
                        this list.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create attempt
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-y-scroll h-[40vh] no-scrollbar">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[220px]">
                            Assessment
                          </TableHead>
                          <TableHead className="min-w-[220px]">
                            Candidate
                          </TableHead>
                          <TableHead className="min-w-[160px]">
                            Status
                          </TableHead>
                          <TableHead className="min-w-[220px]">
                            Timeline
                          </TableHead>
                          <TableHead className="min-w-[150px]">
                            Created
                          </TableHead>
                          <TableHead className="w-[120px] text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAttempts.map((attempt) => {
                          const normalizedStatus =
                            attempt.status?.toLowerCase() ?? "pending";
                          const statusIntent =
                            STATUS_INTENTS[normalizedStatus] ??
                            STATUS_INTENTS.pending;
                          const label =
                            STATUS_LABELS[normalizedStatus] ??
                            attempt.status ??
                            "Unknown";
                          const assessmentTitle =
                            attempt.assessmentId?.title ??
                            "Untitled assessment";
                          const candidateName = `${
                            attempt.userId?.firstName ?? "Unknown"
                          } ${attempt.userId?.lastName ?? ""}`.trim();
                          const candidateEmail =
                            attempt.userId?.emailAddress ?? "No email";
                          const deadlineAbsolute = attempt.serverDeadline
                            ? format(
                                new Date(attempt.serverDeadline),
                                "MMM d, yyyy h:mm a"
                              )
                            : null;
                          const deadlineRelative = attempt.serverDeadline
                            ? formatDistanceToNow(
                                new Date(attempt.serverDeadline),
                                { addSuffix: true }
                              )
                            : null;
                          const startedRelative = attempt.startedAt
                            ? formatDistanceToNow(new Date(attempt.startedAt), {
                                addSuffix: true,
                              })
                            : null;
                          const createdAbsolute = attempt.createdAt
                            ? format(
                                new Date(attempt.createdAt),
                                "MMM d, yyyy h:mm a"
                              )
                            : "Unknown";
                          const createdRelative = attempt.createdAt
                            ? formatDistanceToNow(new Date(attempt.createdAt), {
                                addSuffix: true,
                              })
                            : null;
                          const heartbeatRelative = attempt.lastHeartbeatAt
                            ? formatDistanceToNow(
                                new Date(attempt.lastHeartbeatAt),
                                { addSuffix: true }
                              )
                            : null;
                          return (
                            <TableRow
                              key={attempt._id}
                              className="transition-colors hover:bg-muted/40"
                            >
                              <TableCell className="align-top">
                                <div className="space-y-1">
                                  <p className="font-medium text-foreground">
                                    {assessmentTitle}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Deadline {deadlineRelative ?? "—"}
                                  </p>
                                  {deadlineAbsolute && (
                                    <p className="text-[11px] text-muted-foreground/70">
                                      {deadlineAbsolute}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="align-top">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-9 w-9 border border-border/60">
                                    <AvatarFallback className="bg-primary/10 text-xs font-semibold uppercase text-primary">
                                      {getCandidateInitials(attempt)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="space-y-1">
                                    <p className="font-medium text-foreground">
                                      {candidateName || "Unknown candidate"}
                                    </p>
                                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Mail className="h-3 w-3" />
                                      {candidateEmail}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="align-top">
                                <div className="space-y-1">
                                  <Badge
                                    variant={statusIntent.variant}
                                    className="rounded-full px-3 py-1 text-[11px] uppercase tracking-widest"
                                  >
                                    {label}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground">
                                    {statusIntent.copy}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="align-top">
                                <div className="space-y-1 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1 text-foreground">
                                    <Clock className="h-3 w-3 text-primary" />
                                    {startedRelative
                                      ? `Started ${startedRelative}`
                                      : "Not started yet"}
                                  </div>
                                  <p>Deadline {deadlineRelative ?? "—"}</p>
                                  {heartbeatRelative && (
                                    <p className="text-[11px] text-muted-foreground/70">
                                      Heartbeat {heartbeatRelative}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="align-top">
                                <div className="space-y-1 text-xs text-muted-foreground">
                                  <p className="text-sm text-foreground">
                                    {createdAbsolute}
                                  </p>
                                  {createdRelative && (
                                    <p className="text-[11px] text-muted-foreground/70">
                                      {createdRelative}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="align-top">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full border-border/60 bg-background/90 text-foreground"
                                        onClick={() =>
                                          navigate(
                                            `/assessments/attempts/${attempt._id}`
                                          )
                                        }
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      View attempt
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() =>
                                          handleDeleteAttempt(attempt._id)
                                        }
                                        disabled={
                                          deleteAttemptMutation.isPending
                                        }
                                      >
                                        {deleteAttemptMutation.isPending ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Trash2 className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Remove attempt
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
};

export default AssessmentAttempts;
