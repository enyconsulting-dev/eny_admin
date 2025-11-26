import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuickStat {
    key: string;
    label: string;
    value: string;
    hint: string;
    icon: LucideIcon;
    accent: string;
}

interface QuickStatsCardsProps {
    stats: QuickStat[];
}

export const QuickStatsCards = ({ stats }: QuickStatsCardsProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card
                        key={stat.key}
                        className="group relative overflow-hidden border border-border/60 bg-background/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                    >
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <CardContent className="relative space-y-3 p-5">
                            <span
                                className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${stat.accent}`}
                            >
                                <Icon className="h-5 w-5" />
                            </span>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
                                    {stat.label}
                                </p>
                                <p className="text-lg font-semibold text-foreground">
                                    {stat.value}
                                </p>
                                <p className="text-xs text-muted-foreground">{stat.hint}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
