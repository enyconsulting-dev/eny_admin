import { format } from "date-fns";
import { DollarSign, Tag, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SubscriptionPlan } from "@/types/subscription";

interface SubscriptionSummaryCardsProps {
    plan: SubscriptionPlan;
}

const getIntervalLabel = (interval: string) => {
    const labels: Record<string, string> = {
        month: "Monthly",
        "3month": "Quarterly",
        "6month": "Semi-annual",
        year: "Annual",
        enterprise: "Enterprise",
    };
    return labels[interval] || interval;
};

export const SubscriptionSummaryCards = ({ plan }: SubscriptionSummaryCardsProps) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="border border-border/60 bg-muted/30 shadow-sm dark:bg-muted/10">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                            Price
                        </p>
                        <p className="text-2xl font-semibold text-foreground">
                            {plan.isCustom
                                ? "Custom"
                                : `${plan.currency} ${(plan.price || 0).toFixed(2)}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {getIntervalLabel(plan.interval)}
                        </p>
                    </div>
                    <span className="rounded-full bg-primary/10 p-3 text-primary">
                        <DollarSign className="h-5 w-5" />
                    </span>
                </CardContent>
            </Card>

            <Card className="border border-border/60 bg-muted/30 shadow-sm dark:bg-muted/10">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                            Account type
                        </p>
                        <p className="text-xl font-semibold text-foreground">
                            {plan.accountType === "job_seeker" ? "Job Seeker" : "Employer"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Target audience
                        </p>
                    </div>
                    <span className="rounded-full bg-primary/10 p-3 text-primary">
                        <Tag className="h-5 w-5" />
                    </span>
                </CardContent>
            </Card>

            <Card className="border border-border/60 bg-muted/30 shadow-sm dark:bg-muted/10">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                            Features
                        </p>
                        <p className="text-2xl font-semibold text-foreground">
                            {plan.features.length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Included features
                        </p>
                    </div>
                    <span className="rounded-full bg-primary/10 p-3 text-primary">
                        <CreditCard className="h-5 w-5" />
                    </span>
                </CardContent>
            </Card>

            <Card className="border border-border/60 bg-muted/30 shadow-sm dark:bg-muted/10">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                            Discount
                        </p>
                        <p className="text-2xl font-semibold text-foreground">
                            {plan.discountPercentage ? `${plan.discountPercentage}%` : "None"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {plan.discountValidUntil
                                ? (() => {
                                    const date = new Date(plan.discountValidUntil);
                                    return !isNaN(date.getTime()) ? `Until ${format(date, "MMM d, yyyy")}` : "Invalid date";
                                  })()
                                : "No discount"}
                        </p>
                    </div>
                    <span className="rounded-full bg-primary/10 p-3 text-primary">
                        <Tag className="h-5 w-5" />
                    </span>
                </CardContent>
            </Card>
        </div>
    );
};