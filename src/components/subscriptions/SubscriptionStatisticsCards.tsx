import { Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionStatistics } from "@/types/subscription";

interface SubscriptionStatisticsCardsProps {
    stats: SubscriptionStatistics;
}

export const SubscriptionStatisticsCards = ({ stats }: SubscriptionStatisticsCardsProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSubscriptions}</div>
                    <p className="text-xs text-muted-foreground">All time subscriptions</p>
                </CardContent>
            </Card>

            <Card className="border-border/60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                    <p className="text-xs text-muted-foreground">Currently active</p>
                </CardContent>
            </Card>

            <Card className="border-border/60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Expired</CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.expiredSubscriptions}</div>
                    <p className="text-xs text-muted-foreground">Past subscriptions</p>
                </CardContent>
            </Card>

            <Card className="border-border/60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
                    <Clock className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingPaymentSubscriptions}</div>
                    <p className="text-xs text-muted-foreground">Awaiting payment</p>
                </CardContent>
            </Card>
        </div>
    );
};
