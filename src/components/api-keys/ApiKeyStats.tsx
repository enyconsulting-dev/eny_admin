import { Activity, Calendar, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ApiKey, ApiKeyStats as IApiKeyStats } from "@/types/apiKey";

interface ApiKeyStatsProps {
    apiKey: ApiKey;
    stats?: IApiKeyStats;
    isLoading: boolean;
}

export const ApiKeyStats = ({ apiKey, stats, isLoading }: ApiKeyStatsProps) => {
    const isExpired = apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date();

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="border border-border/60 bg-muted/30 shadow-sm dark:bg-muted/10">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                            Total requests
                        </p>
                        <p className="text-2xl font-semibold text-foreground">
                            {isLoading ? "..." : (stats?.usageCount || apiKey.usageCount).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">API calls made</p>
                    </div>
                    <span className="rounded-full bg-primary/10 p-3 text-primary">
                        <Activity className="h-5 w-5" />
                    </span>
                </CardContent>
            </Card>

            <Card className="border border-border/60 bg-muted/30 shadow-sm dark:bg-muted/10">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                            Last used
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                            {isLoading
                                ? "..."
                                : (stats?.lastUsedAt || apiKey.lastUsedAt)
                                    ? format(
                                        new Date(stats?.lastUsedAt || apiKey.lastUsedAt || ""),
                                        "MMM d, yyyy"
                                    )
                                    : "Never"}
                        </p>
                        <p className="text-xs text-muted-foreground">Most recent activity</p>
                    </div>
                    <span className="rounded-full bg-primary/10 p-3 text-primary">
                        <Clock className="h-5 w-5" />
                    </span>
                </CardContent>
            </Card>

            <Card className="border border-border/60 bg-muted/30 shadow-sm dark:bg-muted/10">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                            Rate limit
                        </p>
                        <p className="text-2xl font-semibold text-foreground">
                            {apiKey.rateLimit ? `${apiKey.rateLimit}/hr` : "No limit"}
                        </p>
                        <p className="text-xs text-muted-foreground">Requests per hour</p>
                    </div>
                    <span className="rounded-full bg-primary/10 p-3 text-primary">
                        <TrendingUp className="h-5 w-5" />
                    </span>
                </CardContent>
            </Card>

            <Card className="border border-border/60 bg-muted/30 shadow-sm dark:bg-muted/10">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                            Expires
                        </p>
                        <p
                            className={`text-lg font-semibold ${isExpired ? "text-destructive" : "text-foreground"
                                }`}
                        >
                            {apiKey.expiresAt
                                ? format(new Date(apiKey.expiresAt), "MMM d, yyyy")
                                : "Never"}
                        </p>
                        <p className="text-xs text-muted-foreground">Expiration date</p>
                    </div>
                    <span className="rounded-full bg-primary/10 p-3 text-primary">
                        <Calendar className="h-5 w-5" />
                    </span>
                </CardContent>
            </Card>
        </div>
    );
};
