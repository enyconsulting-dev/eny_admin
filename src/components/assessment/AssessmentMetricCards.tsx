import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Timer, ListChecks, Shuffle, Sparkles, type LucideIcon } from "lucide-react";
import type { AssessmentSummary } from "@/types/assessment";
import { formatDuration } from "@/types/assessment";

interface MetricCard {
    key: string;
    label: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
}

interface AssessmentMetricCardsProps {
    assessment: AssessmentSummary;
    questionCount: number;
    typeSummary: string;
    showSkeleton: boolean;
}

export const AssessmentMetricCards = ({
    assessment,
    questionCount,
    typeSummary,
    showSkeleton,
}: AssessmentMetricCardsProps) => {
    const metricCards: MetricCard[] = [
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
            value: questionCount,
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
            description: assessment.isActive
                ? "Invited candidates can start."
                : "Toggle live when ready.",
            icon: Sparkles,
        },
    ];

    return (
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
                            {showSkeleton ? (
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
                                        <p className="text-xl font-semibold text-foreground">
                                            {metric.value}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {metric.description}
                                        </p>
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
    );
};