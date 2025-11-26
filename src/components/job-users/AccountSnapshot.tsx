import { format } from "date-fns";
import { Hash, CalendarClock, Clock } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface AccountSnapshotProps {
    userId: string;
    createdAt: string;
    updatedAt: string;
    createdRelative: string | null;
    updatedRelative: string | null;
}

export const AccountSnapshot = ({
    userId,
    createdAt,
    updatedAt,
    createdRelative,
    updatedRelative,
}: AccountSnapshotProps) => {
    return (
        <Card className="border border-border/60 bg-background/80 shadow-sm mb-6">
            <CardHeader>
                <CardTitle>Account snapshot</CardTitle>
                <CardDescription>
                    Key identifiers and lifecycle moments.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <Hash className="h-4 w-4 text-primary" />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Account ID
                        </p>
                        <p className="font-mono text-sm text-foreground">{userId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Created
                        </p>
                        <p className="text-sm text-foreground">{createdAt}</p>
                        <p className="text-xs text-muted-foreground">
                            {createdRelative ?? "—"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Last updated
                        </p>
                        <p className="text-sm text-foreground">{updatedAt}</p>
                        <p className="text-xs text-muted-foreground">
                            {updatedRelative ?? "—"}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
