import { format, formatDistanceToNow } from "date-fns";
import {
    ArrowLeft,
    CalendarClock,
    Mail,
    MessageSquare,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Trash2,
    UserCheck,
    UserX,
    Building,
    Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface JobUser {
    _id: string;
    accountType: "job_seeker" | "employer";
    isAccountVerified: boolean;
    email: string;
    jobSeekerProfile?: {
        fullName: string;
    };
    employerProfile?: {
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface UserHeaderProps {
    user: JobUser;
    onBack: () => void;
    onActivate: () => void;
    onDeactivate: () => void;
    onDelete: () => void;
    onSendNotification: () => void;
    isActivating: boolean;
    isDeactivating: boolean;
    isDeleting: boolean;
}

export const UserHeader = ({
    user,
    onBack,
    onActivate,
    onDeactivate,
    onDelete,
    onSendNotification,
    isActivating,
    isDeactivating,
    isDeleting,
}: UserHeaderProps) => {
    const displayName =
        user.accountType === "job_seeker"
            ? user.jobSeekerProfile?.fullName || "Unknown User"
            : user.employerProfile?.name || "Unknown Company";

    const initials = (() => {
        const name =
            user.accountType === "job_seeker"
                ? user.jobSeekerProfile?.fullName || ""
                : user.employerProfile?.name || "";
        const first = name.charAt(0) ?? "";
        const fallback = first.trim();
        return fallback ? fallback.toUpperCase() : "U";
    })();

    const createdRelative = user.createdAt
        ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
        : null;

    const StatusIcon = user.isAccountVerified ? ShieldCheck : ShieldAlert;
    const RoleIcon = user.accountType === "employer" ? Building : Briefcase;

    return (
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-6 p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 rounded-full border border-border/60 bg-muted/30 px-4 text-xs uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/50"
                        onClick={onBack}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to users
                    </Button>
                    <div className="flex flex-wrap items-center gap-2">
                        {user.isAccountVerified ? (
                            <Button
                                variant="outline"
                                onClick={onDeactivate}
                                disabled={isDeactivating}
                                className="gap-2 rounded-full border-orange-500/30 bg-orange-500/10 px-4 text-orange-600 hover:text-orange-600"
                            >
                                <UserX className="h-4 w-4" />
                                Deactivate
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={onActivate}
                                disabled={isActivating}
                                className="gap-2 rounded-full border-emerald-500/30 bg-emerald-500/10 px-4 text-emerald-600 hover:text-emerald-600"
                            >
                                <UserCheck className="h-4 w-4" />
                                Activate
                            </Button>
                        )}
                        <Button
                            variant="destructive"
                            onClick={onDelete}
                            disabled={isDeleting}
                            className="gap-2 rounded-full px-4"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete user
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="relative flex flex-col items-center sm:items-start">
                            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                                <AvatarImage src="" alt={`${displayName} avatar`} />
                                <AvatarFallback className="bg-gradient-to-br from-primary/40 via-primary/20 to-primary/40 text-lg font-semibold uppercase text-primary-foreground">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary-foreground shadow-lg">
                                <Sparkles className="h-3 w-3" />
                                avatar coming soon
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-widest text-primary"
                                >
                                    {user.accountType === "employer" ? "Employer" : "Job Seeker"}
                                </Badge>
                                <Badge
                                    variant={user.isAccountVerified ? "default" : "secondary"}
                                    className="rounded-full px-3 py-1 text-[11px] uppercase tracking-widest"
                                >
                                    {user.isAccountVerified ? "Verified" : "Unverified"}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                                    {displayName}
                                </h1>
                                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                                    {user.accountType === "employer"
                                        ? "Employer account for posting job opportunities."
                                        : "Job seeker account for finding employment opportunities."}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                                    <Mail className="h-3.5 w-3.5 text-primary" />
                                    {user.email}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                                    <CalendarClock className="h-3.5 w-3.5 text-primary" />
                                    Joined {createdRelative ?? "—"}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onSendNotification}
                                    className="inline-flex items-center gap-1.5 rounded-full border-primary/30 bg-primary/10 px-3 py-1 h-auto text-xs hover:bg-primary/20"
                                >
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    Send notification
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-xs rounded-2xl border border-border/60 bg-background/80 p-4 text-sm shadow-sm">
                        <div className="flex items-center gap-3">
                            <span
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${user.isAccountVerified
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : "bg-amber-500/10 text-amber-500"
                                    }`}
                            >
                                <StatusIcon className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Account status
                                </p>
                                <p className="font-medium text-foreground">
                                    {user.isAccountVerified ? "Verified" : "Unverified"}
                                </p>
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                            {user.isAccountVerified
                                ? `Account verified and active on the platform.`
                                : "Account requires verification to access full platform features."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
