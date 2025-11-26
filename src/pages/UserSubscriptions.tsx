import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, RefreshCw, AlertCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { appService } from "@/lib/api/service";
import { UserSubscription, SubscriptionStatistics } from "@/types/subscription";
import { SubscriptionStatisticsCards } from "@/components/subscriptions/SubscriptionStatisticsCards";
import { SubscriptionTableRow } from "@/components/subscriptions/SubscriptionTableRow";
import { SubscriptionDetailDialog } from "@/components/subscriptions/SubscriptionDetailDialog";

const UserSubscriptions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState<UserSubscription | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Fetch statistics
  const { data: statsData } = useQuery({
    queryKey: ["userSubscriptionStatistics"],
    queryFn: appService.getUserSubscriptionStatistics,
  });

  const stats: SubscriptionStatistics = statsData?.data || {
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    expiredSubscriptions: 0,
    pendingPaymentSubscriptions: 0,
  };

  // Fetch subscriptions
  const { data: subscriptionsData, isLoading } = useQuery({
    queryKey: ["userSubscriptions", page],
    queryFn: () => appService.getUserSubscriptions(page, 10),
  });

  const subscriptions: UserSubscription[] = subscriptionsData?.data?.results || [];
  const pagination = subscriptionsData?.data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  };

  // Update subscription status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      appService.updateUserSubscriptionStatus(id, { status }),
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Subscription status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["userSubscriptionStatistics"] });
      setIsDetailDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error?.response?.data?.message || "Failed to update subscription status.",
        variant: "destructive",
      });
    },
  });

  const handleViewDetails = async (subscription: UserSubscription) => {
    try {
      const response = await appService.getUserSubscriptionById(subscription._id);
      setSelectedSubscription(response.data);
      setIsDetailDialogOpen(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to fetch subscription details.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      sub.userId.firstName.toLowerCase().includes(search) ||
      sub.userId.lastName.toLowerCase().includes(search) ||
      sub.userId.email.toLowerCase().includes(search) ||
      sub.subscriptionPlanId.name.toLowerCase().includes(search)
    );
  });


  return (
    <DashboardLayout>
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs uppercase tracking-widest"
              >
                Job Platform
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                User Subscriptions
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Manage and monitor all user subscriptions across the platform.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <SubscriptionStatisticsCards stats={stats} />

        {/* Subscriptions Table */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">All User Subscriptions</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSubscriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No subscriptions found</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((subscription) => (
                      <SubscriptionTableRow
                        key={subscription._id}
                        subscription={subscription}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                    {pagination.total} subscriptions
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <SubscriptionDetailDialog
        subscription={selectedSubscription}
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        onStatusChange={handleStatusChange}
      />
    </DashboardLayout>
  );
};

export default UserSubscriptions;

