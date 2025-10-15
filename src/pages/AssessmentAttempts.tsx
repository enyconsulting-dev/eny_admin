import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  Clock3,
  Eye,
  Loader2,
  Plus,
  Search,
  Trash2,
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
import { useToast } from "@/hooks/use-toast";
import { appService } from "@/lib/api/service";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  const [selectedUser, setSelectedUser] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
      setSelectedUser("");
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

  const handleCreateAttempt = () => {
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
      icon: Users,
    },
    {
      key: "active",
      label: "Active right now",
      value: activeAttempts,
      description: "Candidates currently progressing through assessments.",
      icon: Clock3,
    },
    {
      key: "completed",
      label: "Completed",
      value: completedAttempts,
      description: "Finished attempts waiting for review or scoring.",
      icon: CalendarClock,
    },
  ];

  const statusFilters = [
    { value: "all", label: "All statuses" },
    ...Object.keys(STATUS_LABELS).map((key) => ({
      value: key,
      label: STATUS_LABELS[key],
    })),
  ];

  return (
    <DashboardLayout>
      <div className="w-full space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/assessments")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs uppercase tracking-widest"
              >
                Attempts overview
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Assessment attempts
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Monitor candidate progress, activate new attempts, and keep an
                eye on statuses in real time.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New attempt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-scroll no-scrollbar">
                <DialogHeader>
                  <DialogTitle>Launch a candidate attempt</DialogTitle>
                  <DialogDescription>
                    Choose the assessment and candidate you want to activate.
                    They can start immediately after creation.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Assessment</Label>
                    <div className="rounded-lg border border-border/60 bg-muted/10">
                      <Command>
                        <CommandInput
                          autoFocus
                          disabled={assessmentsLoading}
                          placeholder={
                            assessmentsLoading
                              ? "Loading assessments…"
                              : "Search assessments…"
                          }
                          className="h-10 text-sm"
                        />
                        <CommandList className="max-h-56">
                          <CommandEmpty className="py-6 text-sm text-muted-foreground">
                            {assessmentsLoading
                              ? "Fetching assessments…"
                              : "No assessments found."}
                          </CommandEmpty>
                          <CommandGroup className="max-h-56 overflow-y-scroll no-scrollbar">
                            {assessments.map((assessment: any) => (
                              <CommandItem
                                key={assessment._id}
                                value={assessment.title}
                                className="flex items-start gap-3 px-3 py-2 text-sm"
                                onSelect={() =>
                                  setSelectedAssessment(assessment._id)
                                }
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
                                {selectedAssessment === assessment._id && (
                                  <Badge
                                    variant="outline"
                                    className="ml-auto text-xs"
                                  >
                                    Selected
                                  </Badge>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                    {selectedAssessment && (
                      <p className="text-xs text-muted-foreground">
                        Selected assessment ID:{" "}
                        <span className="font-mono text-foreground/80">
                          {selectedAssessment}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Candidate</Label>
                    <div className="rounded-lg border border-border/60 bg-muted/10">
                      <Command>
                        <CommandInput
                          disabled={usersLoading}
                          placeholder={
                            usersLoading
                              ? "Loading candidates…"
                              : "Search candidates…"
                          }
                          className="h-10 text-sm"
                        />
                        <CommandList className="max-h-56">
                          <CommandEmpty className="py-6 text-sm text-muted-foreground">
                            {usersLoading
                              ? "Fetching candidates…"
                              : "No candidates found."}
                          </CommandEmpty>
                          <CommandGroup className="max-h-56 overflow-y-scroll no-scrollbar">
                            {users.map((user: any) => {
                              const fullName =
                                `${user.firstName} ${user.lastName}`.trim();
                              return (
                                <CommandItem
                                  key={user._id}
                                  value={`${fullName} ${user.emailAddress}`}
                                  className="flex items-start gap-3 px-3 py-2 text-sm"
                                  onSelect={() => setSelectedUser(user._id)}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-foreground">
                                      {fullName || "Unnamed candidate"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {user.emailAddress}
                                    </span>
                                  </div>
                                  {selectedUser === user._id && (
                                    <Badge
                                      variant="outline"
                                      className="ml-auto text-xs"
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
                      <p className="text-xs text-muted-foreground">
                        Selected candidate ID:{" "}
                        <span className="font-mono text-foreground/80">
                          {selectedUser}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter className="flex flex-wrap items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={createAttemptMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAttempt}
                    disabled={createAttemptMutation.isPending}
                  >
                    {createAttemptMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      "Create attempt"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => refetchAttempts()}
              disabled={attemptsLoading}
            >
              <Loader2
                className={`h-4 w-4 ${attemptsLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
              <CardTitle>Attempt roster</CardTitle>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by assessment or candidate…"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="md:w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {attemptsLoading ? (
              <div className="space-y-3 p-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/5" />
              </div>
            ) : attemptsError ? (
              <div className="flex items-center justify-between gap-4 border-t border-border/60 px-6 py-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">
                      We couldn&apos;t load attempts.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Check your connection and refresh to try again.
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => refetchAttempts()}>
                  Retry
                </Button>
              </div>
            ) : filteredAttempts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 border-t border-dashed border-border/60 py-16 text-center">
                <Users className="h-8 w-8 text-muted-foreground" />
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Assessment</TableHead>
                    <TableHead className="min-w-[200px]">Candidate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="min-w-[120px] text-right">
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
                      attempt.assessmentId?.title ?? "Untitled assessment";
                    const candidateName = `${
                      attempt.userId?.firstName ?? "Unknown"
                    } ${attempt.userId?.lastName ?? ""}`.trim();
                    const candidateEmail =
                      attempt.userId?.emailAddress ?? "No email";
                    const deadline = attempt.serverDeadline
                      ? format(
                          new Date(attempt.serverDeadline),
                          "MMM d, yyyy h:mm a"
                        )
                      : "No deadline";
                    const lastTouched = attempt.startedAt
                      ? format(
                          new Date(attempt.startedAt),
                          "MMM d, yyyy h:mm a"
                        )
                      : "Not started";
                    const createdAt = attempt.createdAt
                      ? format(
                          new Date(attempt.createdAt),
                          "MMM d, yyyy h:mm a"
                        )
                      : "Unknown";

                    return (
                      <TableRow
                        key={attempt._id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {assessmentTitle}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Deadline {deadline}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {candidateName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {candidateEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <Badge variant={statusIntent.variant}>
                              {label}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {statusIntent.copy}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top text-sm text-muted-foreground">
                          {lastTouched}
                        </TableCell>
                        <TableCell className="align-top text-sm text-muted-foreground">
                          {createdAt}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() =>
                                navigate(`/assessments/attempts/${attempt._id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteAttempt(attempt._id)}
                              disabled={deleteAttemptMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
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

export default AssessmentAttempts;
