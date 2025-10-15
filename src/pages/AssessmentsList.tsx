import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Edit,
  Eye,
  ListChecks,
  Plus,
  Search,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { appService } from "@/lib/api/service";

interface Assessment {
  id: string;
  title: string;
  description?: string;
  timeLimitSec: number;
  questionOrder: "fixed" | "random";
  isActive: boolean;
  questionCount?: number;
}

const formatDuration = (seconds: number) => {
  if (!seconds) return "No limit";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (!hours && !minutes) parts.push("<1m");
  return parts.join(" ");
};

const AssessmentsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const {
    data: assessmentsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["assessments"],
    queryFn: appService.getAssessments,
  });

  const assessments: Assessment[] = useMemo(
    () =>
      (assessmentsData?.data?.results ?? []).map((a: any) => ({
        id: a._id || a.id,
        title: a.title,
        description: a.description,
        timeLimitSec: a.timeLimitSec ?? 0,
        questionOrder: a.questionOrder,
        isActive: Boolean(a.isActive),
        questionCount: a.questionCount ?? 0,
      })),
    [assessmentsData],
  );

  const totalAssessments = assessments.length;
  const liveAssessments = assessments.filter((assessment) => assessment.isActive).length;
  const draftAssessments = totalAssessments - liveAssessments;
  const averageQuestions = totalAssessments
    ? Math.round(
        assessments.reduce((count, assessment) => count + (assessment.questionCount ?? 0), 0) /
          totalAssessments,
      )
    : 0;

  const filteredAssessments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return assessments.filter((assessment) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && assessment.isActive) ||
        (statusFilter === "inactive" && !assessment.isActive);
      const matchesSearch =
        !term ||
        assessment.title.toLowerCase().includes(term) ||
        (assessment.description ?? "").toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [assessments, statusFilter, searchTerm]);

  const isFiltering = statusFilter !== "all" || Boolean(searchTerm.trim());
  const showEmptyState = !isLoading && filteredAssessments.length === 0;
  const filterOptions: Array<{ value: "all" | "active" | "inactive"; label: string }> = [
    { value: "all", label: `All (${totalAssessments})` },
    { value: "active", label: `Live (${liveAssessments})` },
    { value: "inactive", label: `Draft (${draftAssessments})` },
  ];

  const statCards = [
    {
      key: "total",
      label: "Total assessments",
      value: totalAssessments,
      description: "Everything in your workspace.",
      icon: ListChecks,
    },
    {
      key: "active",
      label: "Live right now",
      value: liveAssessments,
      description: "Collecting candidate responses.",
      icon: Sparkles,
    },
    {
      key: "average",
      label: "Average questions",
      value: averageQuestions,
      description: "Helps gauge candidate effort.",
      icon: Clock3,
    },
  ];

  if (isError) {
    return (
      <DashboardLayout>
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-6 py-20 text-center">
          <Card className="w-full border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                We couldn&apos;t load your assessments right now. Give it another try in a few seconds.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center gap-3">
              <Button variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
              <Button variant="ghost" onClick={() => navigate("/assessments/create")}>
                Start a new assessment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="w-fit border-primary/30 bg-primary/5 text-xs uppercase tracking-wide">
              Assessments
            </Badge>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Assessment workspace</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Monitor the status of every assessment, keep drafts moving, and jump into edits without losing context.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/assessments/users")}
            >
              <CheckCircle2 className="h-4 w-4" />
              Candidate directory
            </Button>
            <Button className="gap-2" onClick={() => navigate("/assessments/create")}>
              <Plus className="h-4 w-4" />
              New assessment
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.key} className="border border-border/60 bg-muted/40 shadow-sm dark:bg-muted/10">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <span className="rounded-full bg-background p-2 shadow-sm">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 shadow-sm dark:bg-muted/10 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search assessments by name or description..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((filter) => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.value === "active" && <Sparkles className="h-4 w-4" />}
                {filter.value === "inactive" && <ArrowRight className="h-4 w-4 rotate-180" />}
                {filter.value === "all" && <ListChecks className="h-4 w-4" />}
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={`assessment-skeleton-${index}`}
                className="border border-border/60 bg-muted/20 shadow-sm dark:bg-muted/10"
              >
                <CardHeader className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}

          {!isLoading &&
            filteredAssessments.map((assessment) => {
              const statusClassName = assessment.isActive
                ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                : "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/30 dark:bg-amber-500/15 dark:text-amber-200";

              const orderLabel =
                assessment.questionOrder === "random" ? "Randomized delivery" : "Fixed order";

              const questionCount = assessment.questionCount ?? 0;
              const questionCopy = `${questionCount} ${questionCount === 1 ? "question" : "questions"}`;

              return (
                <Card
                  key={assessment.id}
                  className="group relative overflow-hidden border border-border/60 bg-gradient-to-br from-background via-muted/50 to-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20" />
                  </div>
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <Badge variant="outline" className={`w-fit rounded-full px-2.5 py-1 text-xs ${statusClassName}`}>
                          {assessment.isActive ? "Live" : "Draft"}
                        </Badge>
                        <CardTitle className="text-xl font-semibold leading-tight text-foreground line-clamp-2">
                          {assessment.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {assessment.description ||
                            "Add a short description so collaborators and candidates know what to expect."}
                        </CardDescription>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 shrink-0 text-muted-foreground hover:text-primary"
                        onClick={() => navigate(`/assessments/${assessment.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 text-sm sm:grid-cols-3">
                      <div className="rounded-lg border border-border/60 bg-background/80 p-3 dark:bg-background/60">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <Clock3 className="h-4 w-4" />
                          Time limit
                        </div>
                        <p className="mt-1 text-sm font-semibold text-foreground">{formatDuration(assessment.timeLimitSec)}</p>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-background/80 p-3 dark:bg-background/60">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <ListChecks className="h-4 w-4" />
                          Inventory
                        </div>
                        <p className="mt-1 text-sm font-semibold text-foreground">{questionCopy}</p>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-background/80 p-3 dark:bg-background/60">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <Shuffle className="h-4 w-4" />
                          Flow
                        </div>
                        <p className="mt-1 text-sm font-semibold text-foreground">{orderLabel}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span>Tip: add rule-based scoring or sections from the assessment detail view.</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 pt-0">
                    <Button
                      size="sm"
                      className="flex-1 gap-2 sm:flex-none"
                      onClick={() => navigate(`/assessments/${assessment.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      Open overview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2 sm:flex-none"
                      onClick={() => navigate(`/assessments/edit/${assessment.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                      Quick edit
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
        </div>

        {showEmptyState && (
          <Card className="mx-auto max-w-3xl border border-dashed border-border/60 bg-muted/20 py-12 text-center shadow-none dark:bg-muted/10">
            <CardHeader className="items-center space-y-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <CardTitle>No assessments match your filters</CardTitle>
              <CardDescription className="max-w-md">
                {isFiltering
                  ? "Try adjusting your search or status filter to rediscover assessments."
                  : "Kick things off by creating your first assessment."}
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setSearchTerm("");
                }}
                disabled={!isFiltering}
              >
                Reset filters
              </Button>
              <Button onClick={() => navigate("/assessments/create")}>
                <Plus className="mr-2 h-4 w-4" />
                Create assessment
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssessmentsList;
