import { format } from "date-fns";
import { Loader2, CreditCard, Eye, DollarSign } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Subscription {
    _id: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    subscriptionPlanId?: {
        name: string;
        price: number;
        interval: string;
    };
}

interface SubscriptionData {
    results: Subscription[];
    pagination?: {
        total: number;
    };
}

interface UserSubscriptionHistoryProps {
    subscriptionsData?: { data: SubscriptionData };
    isLoading: boolean;
    onViewAll: () => void;
}

export const UserSubscriptionHistory = ({
    subscriptionsData,
    isLoading,
    onViewAll,
}: UserSubscriptionHistoryProps) => {
    return (
        <Card className="border border-border/60 bg-background/80 shadow-sm mb-4">
            <CardHeader>
                <CardTitle>Subscription history</CardTitle>
                <CardDescription>
                    User's subscription plans and payment history.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : subscriptionsData?.data?.results.length ? (
                    <div className="space-y-3">
                        {subscriptionsData.data.results.map((subscription) => (
                            <div
                                key={subscription._id}
                                className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-4 py-3"
                            >
                                <div className="flex items-start gap-3 flex-1">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <CreditCard className="h-5 w-5" />
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-foreground truncate">
                                            {subscription.subscriptionPlanId?.name || "Unknown Plan"}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge
                                                variant={
                                                    subscription.status === "active"
                                                        ? "default"
                                                        : subscription.status === "expired"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                                className="text-xs"
                                            >
                                                {subscription.status}
                                            </Badge>
                                            {subscription.subscriptionPlanId && (
                                                <span className="text-xs text-muted-foreground capitalize">
                                                    {subscription.subscriptionPlanId.interval}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                            <span>
                                                {format(
                                                    new Date(subscription.currentPeriodStart),
                                                    "MMM dd, yyyy"
                                                )}{" "}
                                                -{" "}
                                                {format(
                                                    new Date(subscription.currentPeriodEnd),
                                                    "MMM dd, yyyy"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {subscription.subscriptionPlanId && (
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-sm font-semibold">
                                                <DollarSign className="h-3.5 w-3.5" />
                                                {subscription.subscriptionPlanId.price?.toFixed(2)}
                                            </div>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                per {subscription.subscriptionPlanId.interval}
                                            </p>
                                        </div>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onViewAll}
                                        className="gap-1"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {(subscriptionsData?.data?.pagination?.total ?? 0) > 5 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={onViewAll}
                            >
                                View all subscriptions (
                                {subscriptionsData.data.pagination!.total})
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-3" />
                        <p className="text-sm text-muted-foreground">
                            No subscription history found
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            This user has not subscribed to any plans yet
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
