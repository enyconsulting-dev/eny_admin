import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Plus,
  Search,
  CreditCard,
  Eye,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { appService } from "@/lib/api/service";
import { useToast } from "@/hooks/use-toast";

// Types
interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  accountType: "job_seeker" | "employer";
  price: number;
  currency: string;
  interval: "month" | "3month" | "6month" | "year" | "enterprise";
  features: string[];
  limits: any;
  isActive: boolean;
  stripePriceId?: string;
  discountPercentage?: number;
  discountValidUntil?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionPlansResponse {
  message: string;
  data: {
    results: SubscriptionPlan[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

const Subscriptions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Fetch subscription plans
  const {
    data: plansData,
    isLoading: plansLoading,
    isError: plansError,
    refetch: refetchPlans,
  } = useQuery<SubscriptionPlansResponse>({
    queryKey: ["subscriptionPlans"],
    queryFn: appService.getSubscriptionPlans,
    staleTime: 2,
    refetchOnMount: true,
  });

  const plans: SubscriptionPlan[] = plansData?.data?.results ?? [];

  const deleteMutation = useMutation({
    mutationFn: appService.deleteSubscriptionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionPlans"] });
      toast({
        title: "Success",
        description: "Subscription plan deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedPlan(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete subscription plan",
        variant: "destructive",
      });
    },
  });

  // Filter plans
  const filteredPlans = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return plans.filter((plan) => {
      const name = plan.name?.toLowerCase() ?? "";
      const description = plan.description?.toLowerCase() ?? "";
      const matchesQuery =
        !query || name.includes(query) || description.includes(query);
      return matchesQuery;
    });
  }, [plans, searchTerm]);

  // Summary stats
  const totalPlans = plans.length;
  const activePlans = plans.filter((plan) => plan.isActive).length;
  const jobSeekerPlans = plans.filter((plan) => plan.accountType === "job_seeker").length;
  const employerPlans = plans.filter((plan) => plan.accountType === "employer").length;

  const summaryCards = [
    {
      key: "total",
      label: "Total plans",
      value: totalPlans,
      description: "All subscription plans",
      icon: CreditCard,
    },
    {
      key: "active",
      label: "Active plans",
      value: activePlans,
      description: "Currently active plans",
      icon: CheckCircle,
    },
    {
      key: "jobSeeker",
      label: "Job seeker plans",
      value: jobSeekerPlans,
      description: "Plans for job seekers",
      icon: CreditCard,
    },
    {
      key: "employer",
      label: "Employer plans",
      value: employerPlans,
      description: "Plans for employers",
      icon: CreditCard,
    },
  ];

  const handleDelete = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPlan) {
      deleteMutation.mutate(selectedPlan._id);
    }
  };

  const getIntervalLabel = (interval: string) => {
    const labels: Record<string, string> = {
      month: "Monthly",
      "3month": "Quarterly",
      "6month": "Semi-annual",
      year: "Annual",
      enterprise: "Enterprise",
    };
    return labels[interval] || interval;
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/jobs")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs uppercase tracking-widest"
              >
                Subscription management
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Subscription plans
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Manage subscription plans for job seekers and employers.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="gap-2"
              onClick={() => navigate("/jobs/subscriptions/create")}
            >
              <Plus className="h-4 w-4" />
              Create plan
            </Button>
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => refetchPlans()}
              disabled={plansLoading}
            >
              <Loader2
                className={`h-4 w-4 ${plansLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((summary) => {
            const Icon = summary.icon;
            return (
              <Card
                key={summary.key}
                className="border border-border/60 bg-muted/30 shadow-sm dark:bg-muted/10"
              >
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                      {summary.label}
                    </p>
                    <p className="text-2xl font-semibold text-foreground">
                      {summary.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {summary.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle>Subscription plans</CardTitle>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name…"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {plansLoading ? (
              <div className="space-y-3 p-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/5" />
              </div>
            ) : plansError ? (
              <div className="flex items-center justify-between gap-4 border-t border-border/60 px-6 py-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">
                      We couldn't load subscription plans.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Check your connection and refresh to try again.
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => refetchPlans()}>
                  Retry
                </Button>
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="flex flex-col items-center gap-3 border-t border-dashed border-border/60 py-16 text-center">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    No subscription plans found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Create a new subscription plan to get started.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate("/jobs/subscriptions/create")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create plan
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="min-w-[200px]">Description</TableHead>
                    <TableHead>Account type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Interval</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="min-w-[150px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow
                      key={plan._id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="align-top">
                        <p className="font-medium text-foreground">
                          {plan.name}
                        </p>
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {plan.description}
                        </p>
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant="outline">
                          {plan.accountType === "job_seeker"
                            ? "Job Seeker"
                            : "Employer"}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="text-sm font-medium">
                          {plan.currency} {plan.price ? plan.price.toFixed(2) : "custom"}
                        </p>
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="text-sm text-muted-foreground">
                          {getIntervalLabel(plan.interval)}
                        </p>
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="text-sm text-muted-foreground">
                          {plan.features.length} features
                        </p>
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge
                          variant={plan.isActive ? "default" : "secondary"}
                        >
                          {plan.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => navigate(`/jobs/subscriptions/${plan._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDelete(plan)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete subscription plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedPlan?.name}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedPlan(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Subscriptions;