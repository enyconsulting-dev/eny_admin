import { ShieldCheck, Sparkles, ShieldAlert } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const PlatformGuidelines = () => {
    return (
        <Card className="border border-border/60 bg-background/80 shadow-sm">
            <CardHeader>
                <CardTitle>Platform guidelines</CardTitle>
                <CardDescription>
                    Quick reminders for platform management.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                        <p className="font-medium text-foreground">Account verification</p>
                        <p>Ensure user accounts are properly verified before activation.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                        <p className="font-medium text-foreground">Profile completion</p>
                        <p>Encourage users to complete their profiles for better matching.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <ShieldAlert className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                        <p className="font-medium text-foreground">Content moderation</p>
                        <p>
                            Regularly review user content for compliance with platform
                            policies.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
