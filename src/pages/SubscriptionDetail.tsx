import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Edit,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { appService } from "@/lib/api/service";
import { SubscriptionPlan, SubscriptionFormData } from "@/types/subscription";
import { SubscriptionSummaryCards } from "@/components/subscriptions/SubscriptionSummaryCards";
import { SubscriptionBasicInfo } from "@/components/subscriptions/SubscriptionBasicInfo";
import { SubscriptionFeatures } from "@/components/subscriptions/SubscriptionFeatures";
import { SubscriptionMetadata } from "@/components/subscriptions/SubscriptionMetadata";
import { DeleteSubscriptionDialog } from "@/components/subscriptions/DeleteSubscriptionDialog";

const SubscriptionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: "",
    description: "",
    accountType: undefined,
    price: "",
    currency: "USD",
    interval: undefined,
    stripePriceId: "",
    discountPercentage: "",
    discountValidUntil: "",
    features: [],
    limits: {},
    isActive: true,
    isCustom: false,
    isFree: false,
  });

  const {
    data: planData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["subscriptionPlan", id],
    queryFn: () => appService.getSubscriptionPlanById(id!),
    enabled: !!id,
  });

  const plan: SubscriptionPlan | undefined = planData?.data;

  useEffect(() => {
    if (plan && !isEditing) {
      setFormData({
        name: plan.name || "",
        description: plan.description || "",
        accountType: plan.accountType,
        price: plan.price ? plan.price.toString() : "custom",
        currency: plan.currency || "USD",
        interval: plan.interval,
        stripePriceId: plan.stripePriceId || "",
        discountPercentage: plan.discountPercentage?.toString() || "",
        discountValidUntil: plan.discountValidUntil
          ? (() => {
              const date = new Date(plan.discountValidUntil);
              return !isNaN(date.getTime()) ? format(date, "yyyy-MM-dd'T'HH:mm") : "";
            })()
          : "",
        features: plan.features || [],
        limits: plan.limits || {},
        isActive: plan.isActive ?? true,
        isCustom: plan.isCustom ?? false,
        isFree: plan.isFree ?? false,
      });
    }
  }, [plan, isEditing]);

  const updatePlanMutation = useMutation({
    mutationFn: (data: any) => appService.updateSubscriptionPlan(id!, data),
    onSuccess: () => {
      toast({
        title: "Subscription updated",
        description: "The subscription plan has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["subscriptionPlan", id] });
      queryClient.invalidateQueries({ queryKey: ["subscriptionPlans"] });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Unable to update subscription",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: () => appService.deleteSubscriptionPlan(id!),
    onSuccess: () => {
      toast({
        title: "Subscription deleted",
        description: "The subscription plan has been deleted successfully.",
      });
      navigate("/jobs/subscriptions");
    },
    onError: (error: any) => {
      toast({
        title: "Unable to delete subscription",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (
      !formData.name.trim() ||
      formData.name.length < 1 ||
      formData.name.length > 100
    ) {
      toast({
        title: "Invalid name",
        description: "Name must be between 1 and 100 characters.",
        variant: "destructive",
      });
      return;
    }

    const payload: any = {
      name: formData.name,
      description: formData.description || undefined,
      accountType: formData.accountType,
      currency: formData.currency,
      interval: formData.interval,
      features: formData.features,
      limits: formData.limits,
      isActive: formData.isActive,
      isCustom: formData.isCustom,
      isFree: formData.isFree,
      stripePriceId: formData.stripePriceId || undefined,
      discountPercentage: formData.discountPercentage
        ? parseFloat(formData.discountPercentage)
        : undefined,
      discountValidUntil: formData.discountValidUntil
        ? new Date(formData.discountValidUntil).toISOString()
        : undefined,
    };

    // Set price based on plan type
    if (formData.isFree) {
      payload.price = 0;
    } else if (!formData.isCustom) {
      payload.price = parseFloat(formData.price);
    }
    // For custom plans, don't include price

    updatePlanMutation.mutate(payload);
  };

  const handleDelete = () => {
    deletePlanMutation.mutate();
  };



  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="w-full space-y-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !plan) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center">
            <h2 className="text-xl font-semibold">Subscription not found</h2>
            <p className="text-sm text-muted-foreground">
              The subscription plan you're looking for doesn't exist.
            </p>
          </div>
          <Button onClick={() => navigate("/jobs/subscriptions")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to subscriptions
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/jobs/subscriptions")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs uppercase tracking-widest"
              >
                Subscription details
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  {plan.name}
                </h1>
                <Badge variant={plan.isActive ? "default" : "secondary"}>
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {plan.description || "No description provided"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={updatePlanMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  className="gap-2"
                  onClick={handleSave}
                  disabled={updatePlanMutation.isPending}
                >
                  {updatePlanMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <SubscriptionSummaryCards plan={plan} />

        {/* Basic Information */}
        <SubscriptionBasicInfo
          formData={formData}
          isEditing={isEditing}
          onFormChange={setFormData}
        />

        {/* Features */}
        <SubscriptionFeatures features={plan.features} />

        {/* Metadata */}
        <SubscriptionMetadata plan={plan} />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteSubscriptionDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={deletePlanMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default SubscriptionDetail;