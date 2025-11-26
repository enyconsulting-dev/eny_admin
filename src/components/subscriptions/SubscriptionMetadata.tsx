import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionPlan } from "@/types/subscription";

interface SubscriptionMetadataProps {
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

export const SubscriptionMetadata = ({ plan }: SubscriptionMetadataProps) => {
    return (
        <Card className="border border-border/60 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <Label className="text-xs text-muted-foreground">Created at</Label>
                        <p className="text-sm font-medium">
                            {(() => {
                                const date = new Date(plan.createdAt);
                                return !isNaN(date.getTime()) ? format(date, "MMM d, yyyy 'at' h:mm a") : "Invalid date";
                            })()}
                        </p>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Last updated</Label>
                        <p className="text-sm font-medium">
                            {(() => {
                                const date = new Date(plan.updatedAt);
                                return !isNaN(date.getTime()) ? format(date, "MMM d, yyyy 'at' h:mm a") : "Invalid date";
                            })()}
                        </p>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Plan ID</Label>
                        <p className="text-sm font-medium font-mono">{plan._id}</p>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Interval</Label>
                        <p className="text-sm font-medium">{getIntervalLabel(plan.interval)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};