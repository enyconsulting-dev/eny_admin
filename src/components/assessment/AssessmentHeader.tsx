import { ArrowLeft, Sparkles, VideoIcon, FileQuestion, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import type { AssessmentSummary } from "@/types/assessment";

interface AssessmentHeaderProps {
    assessment: AssessmentSummary;
    isLoading: boolean;
    totalWeight: number;
    onToggleStatus: (checked: boolean) => void;
    onAddQuestion: () => void;
    onRefreshQuestions: () => void;
    isRefreshing: boolean;
}

export const AssessmentHeader = ({
    assessment,
    isLoading,
    totalWeight,
    onToggleStatus,
    onAddQuestion,
    onRefreshQuestions,
    isRefreshing,
}: AssessmentHeaderProps) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/assessments")}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Badge variant={assessment.isActive ? "secondary" : "outline"}>
                            {assessment.isActive ? "Live" : "Draft"}
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        {isLoading ? (
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
                            onCheckedChange={onToggleStatus}
                            disabled={isLoading}
                        />
                        <Label htmlFor="assessment-status" className="cursor-pointer">
                            {assessment.isActive
                                ? "Assessment is accepting attempts"
                                : "Assessment is paused"}
                        </Label>
                        <span className="hidden h-4 w-px bg-border lg:block" />
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span>Total weight {totalWeight.toFixed(1)}</span>
                        </div>
                        <span className="hidden h-4 w-px bg-border lg:block" />
                        <div className="flex items-center gap-2">
                            {assessment.assessmentType === "video-based" ? (
                                <VideoIcon className="h-4 w-4 text-primary" />
                            ) : (
                                <FileQuestion className="h-4 w-4 text-primary" />
                            )}
                            <span>{assessment.assessmentType}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={onAddQuestion}>
                        <Plus className="h-4 w-4" />
                        Add question
                    </Button>
                    <Button
                        variant="ghost"
                        className="gap-2"
                        onClick={onRefreshQuestions}
                        disabled={isRefreshing}
                    >
                        <Loader2 className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        {isRefreshing ? "Refreshing…" : "Refresh questions"}
                    </Button>
                </div>
            </div>
        </div>
    );
};