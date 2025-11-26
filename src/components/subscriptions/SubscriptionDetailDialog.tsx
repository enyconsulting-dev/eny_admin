import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserSubscription } from "@/types/subscription";
import { getStatusBadge } from "@/utils/subscriptionHelpers";

interface SubscriptionDetailDialogProps {
    subscription: UserSubscription | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onStatusChange: (id: string, status: string) => void;
}

export const SubscriptionDetailDialog = ({
    subscription,
    isOpen,
    onOpenChange,
    onStatusChange,
}: SubscriptionDetailDialogProps) => {
    if (!subscription) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar">
                <DialogHeader>
                    <DialogTitle>Subscription Details</DialogTitle>
                    <DialogDescription>
                        View and manage subscription information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* User Info */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">User Information</h3>
                        <Card>
                            <CardContent className="pt-6 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Name:</span>
                                    <span className="font-medium">
                                        {subscription.userId.firstName} {subscription.userId.lastName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Email:</span>
                                    <span className="font-medium">{subscription.userId.email}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Plan Info */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">Plan Information</h3>
                        <Card>
                            <CardContent className="pt-6 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Plan:</span>
                                    <span className="font-medium">{subscription.subscriptionPlanId.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Description:</span>
                                    <span className="font-medium text-right max-w-xs">
                                        {subscription.subscriptionPlanId.description}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Price:</span>
                                    <span className="font-medium">
                                        ${subscription.subscriptionPlanId.price.toFixed(2)} /{" "}
                                        {subscription.subscriptionPlanId.interval}
                                    </span>
                                </div>
                                {subscription.subscriptionPlanId.features && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm text-muted-foreground">Features:</span>
                                        <div className="flex flex-wrap gap-1 max-w-xs justify-end">
                                            {subscription.subscriptionPlanId.features.map((feature) => (
                                                <Badge key={feature} variant="outline" className="text-xs">
                                                    {feature.replace(/_/g, " ")}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Subscription Status */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">Subscription Status</h3>
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Current Status:</span>
                                    {getStatusBadge(subscription.status)}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Period Start:</span>
                                    <span className="font-medium">
                                        {format(new Date(subscription.currentPeriodStart), "PPP")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Period End:</span>
                                    <span className="font-medium">
                                        {format(new Date(subscription.currentPeriodEnd), "PPP")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Cancel at Period End:</span>
                                    <span className="font-medium">
                                        {subscription.cancelAtPeriodEnd ? "Yes" : "No"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Stripe Session ID:</span>
                                    <span className="font-mono text-xs">{subscription.stripeSessionId}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Limits */}
                    {Object.keys(subscription.limits).length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-medium text-sm text-muted-foreground">Limits</h3>
                            <Card>
                                <CardContent className="pt-6 space-y-2">
                                    {Object.entries(subscription.limits).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="text-sm text-muted-foreground capitalize">
                                                {key.replace(/_/g, " ")}:
                                            </span>
                                            <span className="font-medium">{value === -1 ? "Unlimited" : value}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Usage */}
                    {subscription.usage && Object.keys(subscription.usage).length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-medium text-sm text-muted-foreground">Usage</h3>
                            <Card>
                                <CardContent className="pt-6 space-y-2">
                                    {Object.entries(subscription.usage).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="text-sm text-muted-foreground capitalize">
                                                {key.replace(/_/g, " ")}:
                                            </span>
                                            <span className="font-medium">{value}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">Change Status</h3>
                        <div className="flex gap-2">
                            <Select
                                value={subscription.status}
                                onValueChange={(value) => onStatusChange(subscription._id, value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="canceled">Canceled</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="pending_payment">Pending Payment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
