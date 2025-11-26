import { AlertCircle, FileQuestion, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import QuestionCard from "@/components/QuestionCard";
import type { Question, AssessmentSummary } from "@/types/assessment";

interface AssessmentQuestionsListProps {
    questions: Question[];
    allQuestions: Question[];
    filteredQuestions: Question[];
    assessment: AssessmentSummary;
    isLoading: boolean;
    isError: boolean;
    searchTerm: string;
    questionTypeFilter: "all" | Question["type"];
    onRefetch: () => void;
    onAddQuestion: () => void;
    onCreate: (payload: any) => void;
    onUpdate: (questionId: string, payload: any) => void;
    onDelete: (questionId?: string) => void;
    onResetFilters: () => void;
}

export const AssessmentQuestionsList = ({
    questions,
    allQuestions,
    filteredQuestions,
    assessment,
    isLoading,
    isError,
    searchTerm,
    questionTypeFilter,
    onRefetch,
    onAddQuestion,
    onCreate,
    onUpdate,
    onDelete,
    onResetFilters,
}: AssessmentQuestionsListProps) => {
    const showQuestionEmptyState = !isLoading && filteredQuestions.length === 0;
    const showQuestionsSkeleton = isLoading;

    if (isError) {
        return (
            <Card className="border border-destructive/30 bg-destructive/10 py-12 text-destructive shadow-none dark:bg-destructive/20">
                <CardHeader className="items-center space-y-4 text-center">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                        <AlertCircle className="h-5 w-5" />
                    </span>
                    <CardTitle>We ran into an issue loading questions</CardTitle>
                    <CardDescription className="text-sm text-destructive/80">
                        Something interrupted the questions fetch. Retry in a moment or add a
                        draft question offline.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-center gap-3">
                    <Button variant="destructive" onClick={onRefetch}>
                        Try again
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-destructive"
                        onClick={onAddQuestion}
                    >
                        Add draft
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (showQuestionsSkeleton) {
        return (
            <>
                {Array.from({ length: 3 }).map((_, index) => (
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
                ))}
            </>
        );
    }

    if (showQuestionEmptyState) {
        return (
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
                        onClick={onResetFilters}
                        disabled={!searchTerm && questionTypeFilter === "all"}
                    >
                        Reset filters
                    </Button>
                    <Button className="gap-2" onClick={onAddQuestion}>
                        <Plus className="h-4 w-4" />
                        Create question
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {filteredQuestions.map((question, index) => {
                const originalIndex = allQuestions.findIndex(
                    (item) => item.id === question.id
                );
                const displayIndex = originalIndex >= 0 ? originalIndex : index;
                return (
                    <QuestionCard
                        key={question.id || `draft-${index}`}
                        question={question}
                        index={displayIndex}
                        onCreate={(payload) => onCreate(payload)}
                        onUpdate={(questionId, payload) => onUpdate(questionId, payload)}
                        onDelete={onDelete}
                        allowedTypes={
                            assessment.assessmentType === "video-based"
                                ? ["video"]
                                : ["mcq", "multi", "text", "code", "video"]
                        }
                    />
                );
            })}
        </>
    );
};