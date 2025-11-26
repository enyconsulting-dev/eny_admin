import { format } from "date-fns";
import { Eye, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserSubscription } from "@/types/subscription";
import { getStatusBadge } from "@/utils/subscriptionHelpers";
import { Link } from "react-router-dom";

interface SubscriptionTableRowProps {
    subscription: UserSubscription;
    onViewDetails: (subscription: UserSubscription) => void;
}

export const SubscriptionTableRow = ({
    subscription,
    onViewDetails,
}: SubscriptionTableRowProps) => {
    return (
        <TableRow>
            <TableCell>
                <div className="space-y-1">
                    <Link
                        to={`/jobs/users/${subscription.userId._id}`}
                        className="font-medium hover:underline"
                    >
                        {subscription.userId.firstName} {subscription.userId.lastName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        {subscription.userId.email}
                    </p>
                </div>
            </TableCell>
            <TableCell>
                <div className="space-y-1">
                    <p className="font-medium">{subscription.subscriptionPlanId.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                        {subscription.subscriptionPlanId.interval}
                    </p>
                </div>
            </TableCell>
            <TableCell>{getStatusBadge(subscription.status)}</TableCell>
            <TableCell>
                <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {subscription.subscriptionPlanId.price.toFixed(2)}
                </div>
            </TableCell>
            <TableCell>
                <div className="space-y-1">
                    <p className="text-xs">
                        {format(new Date(subscription.currentPeriodStart), "MMM dd, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        to {format(new Date(subscription.currentPeriodEnd), "MMM dd, yyyy")}
                    </p>
                </div>
            </TableCell>
            <TableCell>
                {format(new Date(subscription.createdAt), "MMM dd, yyyy")}
            </TableCell>
            <TableCell className="text-right">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(subscription)}
                >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                </Button>
            </TableCell>
        </TableRow>
    );
};
