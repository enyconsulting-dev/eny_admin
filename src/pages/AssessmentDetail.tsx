import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { appService } from "@/lib/api/service";
import { useToast } from "@/hooks/use-toast";
import QuestionCard from "@/components/QuestionCard";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  AlignLeft,
  AlertCircle,
  CheckSquare,
  Clock3,
  FileQuestion,
  Filter,
  ListChecks,
  Plus,
  Search,
  Shuffle,
  Sparkles,
  Timer,
  Code2,
  SearchX,
  Loader2,
} from "lucide-react";

interface QuestionOption {
  key: string;
  text: string;
}

interface Question {
  id?: string;
  assessmentId: string;
  type: "mcq" | "multi" | "text" | "code";
  prompt: string;
  options?: QuestionOption[];
  correct?: string[];
  weight?: number;
  order: number;
  metadata?: Record<string, unknown>;
}

interface AssessmentSummary {
  id: string;
  title: string;
  description: string;
  timeLimitSec: number;
  questionOrder: "fixed" | "random";
  isActive: boolean;
}

const formatDuration = (seconds: number) => {
  if (!seconds) return "No limit";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (parts.length === 0) parts.push("<1m");
  return parts.join(" ");
};

const QUESTION_FILTERS: Array<{ value: "all" | Question["type"]; label: string }> = [
  { value: "all", label: "All types" },
  { value: "mcq", label: "Single choice" },
  { value: "multi", label: "Multi select" },
  { value: "text", label: "Written" },
  { value: "code", label: "Code" },
];

const FILTER_ICONS: Record<"all" | Question["type"], LucideIcon> = {
  all: Filter,
  mcq: ListChecks,
  multi: CheckSquare,
  text: AlignLeft,
  code: Code2,
};

const TYPE_LABEL_MAP: Record<Question["type"], string> = {
  mcq: "single choice",
  multi: "multi select",
  text: "written",
  code: "code",
};

const AssessmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const listRef = useRef<HTMLDivElement | null>(null);

  const [assessment, setAssessment] = useState<AssessmentSummary>({
    id: id || "",
    title: "Assessment workspace",
    description: "Configure, iterate, and launch assessments with confidence.",
    timeLimitSec: 3600,
    questionOrder: "fixed",
    isActive: true,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [questionTypeFilter, setQuestionTypeFilter] = useState<(typeof QUESTION_FILTERS)[number]["value"]>("all");

  const {
    data: assessmentData,
    isLoading: isAssessmentLoading,
    isError: isAssessmentError,
    refetch: refetchAssessment,
  } = useQuery({
    queryKey: ["assessments", id],
    queryFn: () => appService.getAssessmentById(id ?? ""),
    enabled: Boolean(id),
  });

  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ["assessments questions", id],
    queryFn: () => appService.getAssessmentQuestionsByAssessmentId(id),
    enabled: Boolean(id),
  });

  const isAssessmentHydrated = Boolean(assessmentData?.data);
  const isAssessmentNotFound = !isAssessmentLoading && !isAssessmentHydrated && !isAssessmentError;
  const showMetricSkeleton = isAssessmentLoading && !isAssessmentHydrated;

  useEffect(() => {
    if (!assessmentData?.data) return;
    const details: any = assessmentData.data;
    setAssessment((prev) => ({
      id: details._id || details.id || prev.id,
      title: details.title || prev.title,
      description: details.description || prev.description,
      timeLimitSec: details.timeLimitSec ?? prev.timeLimitSec,
      questionOrder: details.questionOrder === "random" ? "random" : "fixed",
      isActive: Boolean(details.isActive ?? prev.isActive),
    }));
  }, [assessmentData]);

  useEffect(() => {
    if (!questionsData?.data) return;
    const mapped: Question[] = (questionsData.data ?? []).map((raw: any, index: number) => ({
      id: raw._id || raw.id,
      assessmentId: raw.assessmentId?._id || raw.assessmentId || id || "",
      type: raw.type,
      prompt: raw.prompt,
      options: raw.options || [],
      correct: raw.correct || [],
      weight: raw.weight ?? 1,
      order: raw.order ?? index + 1,
      metadata: raw.metadata,
    }));
    setQuestions(mapped);
  }, [questionsData, id]);

  const createQuestionMutation = useMutation({
    mutationFn: appService.createQuestion,
    onSuccess: () => {
      toast({ title: "Question created successfully" });
      queryClient.invalidateQueries({ queryKey: ["assessments questions", id] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to create question",
        description: error?.message || "Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const editQuestionMutation = useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: any }) =>
      appService.updateQuestionByQuestionId(questionId, data),
    onSuccess: () => {
      toast({ title: "Question updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["assessments questions", id] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to update question",
        description: error?.message || "Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const handleAddCard = () => {
    const tempId = `new-${Date.now()}`;
    const placeholder: Question = {
      id: tempId,
      assessmentId: id || "",
      type: "mcq",
      prompt: "",
      options: [],
      correct: [],
      weight: 1,
      order: questions.length + 1,
      metadata: {},
    };
    setQuestions((current) => [...current, placeholder]);
    setTimeout(() => {
      const element = document.getElementById(`question-${tempId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 60);
  };

  const handleToggleStatus = (checked: boolean) => {
    setAssessment((prev) => ({ ...prev, isActive: checked }));
    toast({
      title: checked ? "Assessment activated" : "Assessment paused",
      description: checked
        ? "Candidates can now begin attempts."
        : "New candidates will no longer be able to start this assessment.",
    });
  };

  const typeCounts = useMemo(() => {
    return questions.reduce(
      (acc, question) => {
        acc[question.type] = (acc[question.type] ?? 0) + 1;
        return acc;
      },
      {} as Record<Question["type"], number>,
    );
  }, [questions]);

  const typeSummary = useMemo(() => {
    const entries = Object.entries(typeCounts) as Array<[Question["type"], number]>;
    return entries
      .filter(([, count]) => count > 0)
      .map(([type, count]) => `${count} ${TYPE_LABEL_MAP[type]}`)
      .join(" · ");
  }, [typeCounts]);

  const totalWeight = useMemo(
    () => questions.reduce((total, question) => total + (question.weight ?? 0), 0),
    [questions],
  );

  const filteredQuestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return questions.filter((question) => {
      const matchesType = questionTypeFilter === "all" || question.type === questionTypeFilter;
      const matchesTerm =
        !term ||
        question.prompt.toLowerCase().includes(term) ||
        question.options?.some((option) => option.text.toLowerCase().includes(term));
      return matchesType && matchesTerm;
    });
  }, [questions, searchTerm, questionTypeFilter]);

  const showQuestionEmptyState = !isQuestionsLoading && filteredQuestions.length === 0;
  const showQuestionsSkeleton = isQuestionsLoading;

  const metricCards = [
    {
      key: "time",
      label: "Time limit",
      value: formatDuration(assessment.timeLimitSec),
      description: "Per attempt limit",
      icon: Timer,
    },
    {
      key: "questions",
      label: "Questions configured",
      value: questions.length,
      description: typeSummary || "Add your first question to see a breakdown.",
      icon: ListChecks,
    },
    {
      key: "order",
      label: "Delivery flow",
      value: assessment.questionOrder === "random" ? "Randomised" : "Fixed order",
      description:
        assessment.questionOrder === "random"
          ? "Each attempt shuffles questions."
          : "Questions follow the exact order shown.",
      icon: Shuffle,
    },
    {
      key: "status",
      label: "Assessment status",
      value: assessment.isActive ? "Live" : "Draft",
      description: assessment.isActive ? "Invited candidates can start." : "Toggle live when ready.",
      icon: Sparkles,
    },
  ];

  const handleDeleteQuestion = (questionId?: string) => {
    if (!questionId) {
      setQuestions((current) => current.filter((question) => question.id));
      return;
    }
    if (!confirm("Remove this question?")) return;
    setQuestions((current) => current.filter((question) => question.id !== questionId));
    toast({
      title: "Question removed",
      description: "It will disappear for collaborators after you save your changes.",
    });
  };

  if (isAssessmentError) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center py-24">
          <Card className="w-full max-w-xl border border-destructive/30 bg-destructive/10 text-destructive shadow-xl animate-in fade-in-50 zoom-in-95">
            <CardHeader className="items-center space-y-4 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15">
                <AlertCircle className="h-6 w-6" />
              </span>
              <CardTitle className="text-2xl">We couldn&apos;t load this assessment</CardTitle>
              <CardDescription className="text-sm text-destructive/80">
                Something prevented the workspace from loading. Try refreshing, or head back to the assessments list.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="destructive" onClick={() => refetchAssessment()}>
                Retry loading
              </Button>
              <Button variant="ghost" className="text-destructive" onClick={() => navigate("/assessments")}>
                Go to assessments
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (isAssessmentNotFound) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center py-24">
          <Card className="w-full max-w-xl border border-border/60 bg-muted/30 shadow-lg animate-in fade-in-50 slide-in-from-bottom-8">
            <CardHeader className="items-center space-y-4 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SearchX className="h-6 w-6" />
              </span>
              <CardTitle className="text-2xl">Assessment not found</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                We couldn&apos;t find an assessment that matches this link. It may have been deleted or moved.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" onClick={() => navigate("/assessments")}>
                Browse assessments
              </Button>
              <Button onClick={() => navigate("/assessments/create")}>Create new assessment</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in-50">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Button variant="ghost" size="icon" onClick={() => navigate("/assessments")}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Badge variant={assessment.isActive ? "secondary" : "outline"}>
                  {assessment.isActive ? "Live" : "Draft"}
                </Badge>
              </div>
              <div className="space-y-2">
                {isAssessmentLoading ? (
                  <>
                    <Skeleton className="h-8 w-80" />
                    <Skeleton className="h-4 w-96" />
                  </>
                ) : (
                  <>
                    <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
                      {assessment.title}
                    </CardTitle>
                    <CardDescription className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                      {assessment.description ||
                        "Add a short description to align collaborators on who this assessment is for and how it works."}
                    </CardDescription>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Switch
                  id="assessment-status"
                  checked={assessment.isActive}
                  onCheckedChange={handleToggleStatus}
                  disabled={isAssessmentLoading}
                />
                <Label htmlFor="assessment-status" className="cursor-pointer">
                  {assessment.isActive ? "Assessment is accepting attempts" : "Assessment is paused"}
                </Label>
                <span className="hidden h-4 w-px bg-border lg:block" />
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Total weight {totalWeight.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" className="gap-2" onClick={() => handleAddCard()}>
                <Plus className="h-4 w-4" />
                Add question
              </Button>
              <Button
                variant="ghost"
                className="gap-2"
                onClick={() => refetchQuestions()}
                disabled={isQuestionsLoading}
              >
                <Loader2 className={`h-4 w-4 ${isQuestionsLoading ? "animate-spin" : ""}`} />
                {isQuestionsLoading ? "Refreshing…" : "Refresh questions"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card
                  key={metric.key}
                  className="border border-border/60 bg-muted/20 shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:bg-muted/10"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CardContent className="flex items-start justify-between gap-4 p-4">
                    {showMetricSkeleton ? (
                      <div className="flex w-full items-center justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-10 w-10 rounded-full" />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {metric.label}
                          </p>
                          <p className="text-xl font-semibold text-foreground">{metric.value}</p>
                          <p className="text-xs text-muted-foreground">{metric.description}</p>
                        </div>
                        <span className="rounded-full border border-border/60 bg-background p-2 shadow-sm">
                          <Icon className="h-5 w-5 text-primary" />
                        </span>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 shadow-sm dark:bg-muted/10 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search prompts or option text…"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {QUESTION_FILTERS.map((filter) => {
              const Icon = FILTER_ICONS[filter.value];
              return (
                <Button
                  key={filter.value}
                  variant={questionTypeFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setQuestionTypeFilter(filter.value)}
                >
                  <Icon className="h-4 w-4" />
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)]" ref={listRef}>
          {isQuestionsError ? (
            <Card className="border border-destructive/30 bg-destructive/10 py-12 text-destructive shadow-none dark:bg-destructive/20">
              <CardHeader className="items-center space-y-4 text-center">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                  <AlertCircle className="h-5 w-5" />
                </span>
                <CardTitle>We ran into an issue loading questions</CardTitle>
                <CardDescription className="text-sm text-destructive/80">
                  Something interrupted the questions fetch. Retry in a moment or add a draft question offline.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-center gap-3">
                <Button variant="destructive" onClick={() => refetchQuestions()}>
                  Try again
                </Button>
                <Button variant="ghost" className="text-destructive" onClick={() => handleAddCard()}>
                  Add draft
                </Button>
              </CardContent>
            </Card>
          ) : showQuestionsSkeleton ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={`question-skeleton-${index}`}
                className="overflow-hidden border border-border/60 bg-muted/20 shadow-sm dark:bg-muted/10"
              >
                <div className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-[shimmer_2s_linear_infinite]" />
                <CardHeader className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-10 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            filteredQuestions.map((question, index) => {
              const originalIndex = questions.findIndex((item) => item.id === question.id);
              const displayIndex = originalIndex >= 0 ? originalIndex : index;
              return (
                <QuestionCard
                  key={question.id || `draft-${index}`}
                  question={question}
                  index={displayIndex}
                  onCreate={(payload) => createQuestionMutation.mutate(payload)}
                  onUpdate={(questionId, payload) => editQuestionMutation.mutate({ questionId, data: payload })}
                  onDelete={(questionId) => {
                    if (String(questionId ?? "").startsWith("new-")) {
                      setQuestions((current) => current.filter((item) => item.id !== questionId));
                      return;
                    }
                    handleDeleteQuestion(questionId);
                  }}
                />
              );
            })
          )}
        </div>

        {showQuestionEmptyState && (
          <Card className="mx-auto max-w-3xl border border-dashed border-border/60 bg-muted/20 py-16 text-center shadow-none dark:bg-muted/10">
            <CardHeader className="items-center space-y-3">
              <FileQuestion className="h-10 w-10 text-primary" />
              <CardTitle>No questions match your filters</CardTitle>
              <CardDescription className="max-w-xl">
                {searchTerm || questionTypeFilter !== "all"
                  ? "Adjust your filters or search term to rediscover existing content."
                  : "Start building your assessment by adding your first question."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setQuestionTypeFilter("all");
                }}
                disabled={!searchTerm && questionTypeFilter === "all"}
              >
                Reset filters
              </Button>
              <Button className="gap-2" onClick={() => handleAddCard()}>
                <Plus className="h-4 w-4" />
                Create question
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssessmentDetail;
