import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
    switch (status) {
        case "active":
            return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
        case "canceled":
            return <Badge variant="destructive">Canceled</Badge>;
        case "expired":
            return <Badge variant="secondary">Expired</Badge>;
        case "pending_payment":
            return <Badge className="bg-amber-500 hover:bg-amber-600">Pending Payment</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};
