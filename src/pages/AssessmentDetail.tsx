import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { appService } from "@/lib/api/service";
import { useToast } from "@/hooks/use-toast";
import {
  Question,
  AssessmentSummary,
  TYPE_LABEL_MAP,
} from "@/types/assessment";
import { AssessmentError } from "@/components/assessment/AssessmentError";
import { AssessmentNotFound } from "@/components/assessment/AssessmentNotFound";
import { AssessmentHeader } from "@/components/assessment/AssessmentHeader";
import { AssessmentMetricCards } from "@/components/assessment/AssessmentMetricCards";
import { AssessmentFilters } from "@/components/assessment/AssessmentFilters";
import { AssessmentQuestionsList } from "@/components/assessment/AssessmentQuestionsList";

const AssessmentDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const listRef = useRef<HTMLDivElement | null>(null);

  const [assessment, setAssessment] = useState<AssessmentSummary>({
    id: id || "",
    title: "Assessment workspace",
    description: "Configure, iterate, and launch assessments with confidence.",
    timeLimitSec: 3600,
    questionOrder: "fixed",
    assessmentType: "text-based",
    isActive: true,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [questionTypeFilter, setQuestionTypeFilter] = useState<"all" | Question["type"]>("all");

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
  const isAssessmentNotFound =
    !isAssessmentLoading && !isAssessmentHydrated && !isAssessmentError;
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
      assessmentType: details.assessmentType,
      isActive: Boolean(details.isActive ?? prev.isActive),
    }));
  }, [assessmentData]);

  useEffect(() => {
    if (!questionsData?.data) return;
    const mapped: Question[] = (questionsData.data ?? []).map(
      (raw: any, index: number) => ({
        id: raw._id || raw.id,
        assessmentId: raw.assessmentId?._id || raw.assessmentId || id || "",
        type: raw.type,
        prompt: raw.prompt,
        options: raw.options || [],
        correct: raw.correct || [],
        weight: raw.weight ?? 1,
        order: raw.order ?? index + 1,
        metadata: raw.metadata,
      })
    );
    setQuestions(mapped);
  }, [questionsData, id]);

  const createQuestionMutation = useMutation({
    mutationFn: appService.createQuestion,
    onSuccess: () => {
      toast({ title: "Question created successfully" });
      queryClient.invalidateQueries({
        queryKey: ["assessments questions", id],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["assessments questions", id],
      });
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
      type: assessment.assessmentType === "video-based" ? "video" : "mcq",
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
    return questions.reduce((acc, question) => {
      acc[question.type] = (acc[question.type] ?? 0) + 1;
      return acc;
    }, {} as Record<Question["type"], number>);
  }, [questions]);

  const typeSummary = useMemo(() => {
    const entries = Object.entries(typeCounts) as Array<
      [Question["type"], number]
    >;
    return entries
      .filter(([, count]) => count > 0)
      .map(([type, count]) => `${count} ${TYPE_LABEL_MAP[type]}`)
      .join(" · ");
  }, [typeCounts]);

  const totalWeight = useMemo(
    () =>
      questions.reduce((total, question) => total + (question.weight ?? 0), 0),
    [questions]
  );

  const filteredQuestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return questions.filter((question) => {
      const matchesType =
        questionTypeFilter === "all" || question.type === questionTypeFilter;
      const matchesTerm =
        !term ||
        question.prompt.toLowerCase().includes(term) ||
        question.options?.some((option) =>
          option.text.toLowerCase().includes(term)
        );
      return matchesType && matchesTerm;
    });
  }, [questions, searchTerm, questionTypeFilter]);

  const handleDeleteQuestion = (questionId?: string) => {
    if (!questionId) {
      setQuestions((current) => current.filter((question) => question.id));
      return;
    }
    if (!confirm("Remove this question?")) return;
    setQuestions((current) =>
      current.filter((question) => question.id !== questionId)
    );
    toast({
      title: "Question removed",
      description:
        "It will disappear for collaborators after you save your changes.",
    });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setQuestionTypeFilter("all");
  };

  if (isAssessmentError) {
    return <AssessmentError refetchAssessment={refetchAssessment} />;
  }

  if (isAssessmentNotFound) {
    return <AssessmentNotFound />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in-50">
        <AssessmentHeader
          assessment={assessment}
          isLoading={isAssessmentLoading}
          totalWeight={totalWeight}
          onToggleStatus={handleToggleStatus}
          onAddQuestion={handleAddCard}
          onRefreshQuestions={refetchQuestions}
          isRefreshing={isQuestionsLoading}
        />

        <AssessmentMetricCards
          assessment={assessment}
          questionCount={questions.length}
          typeSummary={typeSummary}
          showSkeleton={showMetricSkeleton}
        />

        <AssessmentFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={questionTypeFilter}
          onFilterChange={setQuestionTypeFilter}
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)]" ref={listRef}>
          <AssessmentQuestionsList
            questions={questions}
            allQuestions={questions}
            filteredQuestions={filteredQuestions}
            assessment={assessment}
            isLoading={isQuestionsLoading}
            isError={isQuestionsError}
            searchTerm={searchTerm}
            questionTypeFilter={questionTypeFilter}
            onRefetch={refetchQuestions}
            onAddQuestion={handleAddCard}
            onCreate={(payload) => createQuestionMutation.mutate(payload)}
            onUpdate={(questionId, payload) =>
              editQuestionMutation.mutate({ questionId, data: payload })
            }
            onDelete={(questionId) => {
              if (String(questionId ?? "").startsWith("new-")) {
                setQuestions((current) =>
                  current.filter((item) => item.id !== questionId)
                );
                return;
              }
              handleDeleteQuestion(questionId);
            }}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssessmentDetail;
