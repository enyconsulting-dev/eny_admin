import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { appService } from "@/lib/api/service";
import { SubscriptionFormData, CreateSubscriptionFormData } from "@/types/subscription";
import { SubscriptionBasicInfo } from "@/components/subscriptions/SubscriptionBasicInfo";
import { SubscriptionFeaturesInput } from "@/components/subscriptions/SubscriptionFeaturesInput";
import { SubscriptionLimitsInput } from "@/components/subscriptions/SubscriptionLimitsInput";

const CreateSubscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateSubscriptionFormData>({
    name: "",
    description: "",
    accountType: "job_seeker" as "job_seeker" | "employer",
    price: "",
    currency: "USD",
    interval: "month" as "month" | "3month" | "6month" | "year" | "enterprise",
    features: [] as string[],
    limits: {} as any,
    stripePriceId: "",
    discountPercentage: "",
    discountValidUntil: "",
    isActive: true,
    isCustom: false,
    isFree: false,
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: appService.createSubscriptionPlan,
    onSuccess: (response) => {
      toast({
        title: "Subscription created",
        description: "The subscription plan has been created successfully.",
      });
      navigate(`/jobs/subscriptions/${response.data._id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Unable to create subscription",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Please review your inputs and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || formData.name.length < 1 || formData.name.length > 100) {
      toast({
        title: "Invalid name",
        description: "Name must be between 1 and 100 characters.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim() || formData.description.length < 1 || formData.description.length > 500) {
      toast({
        title: "Invalid description",
        description: "Description must be between 1 and 500 characters.",
        variant: "destructive",
      });
      return;
    }

    // Price validation: not required for custom plans, must be 0 for free plans
    if (!formData.isCustom) {
      if (!formData.price || parseFloat(formData.price) < 0) {
        toast({
          title: "Invalid price",
          description: "Price must be 0 or greater.",
          variant: "destructive",
        });
        return;
      }
    }

    if (formData.features.length === 0) {
      toast({
        title: "No features selected",
        description: "Please select at least one feature.",
        variant: "destructive",
      });
      return;
    }

    const payload: any = {
      name: formData.name,
      description: formData.description,
      accountType: formData.accountType,
      currency: formData.currency,
      interval: formData.interval,
      features: formData.features,
      limits: formData.limits,
      isActive: formData.isActive,
      isCustom: formData.isCustom,
      isFree: formData.isFree,
    };

    // Set price based on plan type
    if (formData.isFree) {
      payload.price = 0;
    } else if (!formData.isCustom) {
      payload.price = parseFloat(formData.price);
    }
    // For custom plans, don't include price

    if (formData.stripePriceId) {
      payload.stripePriceId = formData.stripePriceId;
    }

    if (formData.discountPercentage) {
      payload.discountPercentage = parseFloat(formData.discountPercentage);
    }

    if (formData.discountValidUntil) {
      payload.discountValidUntil = new Date(formData.discountValidUntil).toISOString();
    }

    createSubscriptionMutation.mutate(payload);
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  // Wrapper to handle partial form data updates from SubscriptionBasicInfo
  const handleFormChange = (data: SubscriptionFormData) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      // Ensure required fields are preserved
      accountType: data.accountType || prev.accountType,
      interval: data.interval || prev.interval,
      features: data.features || prev.features,
      limits: data.limits !== undefined ? data.limits : prev.limits,
      isActive: data.isActive !== undefined ? data.isActive : prev.isActive,
      isCustom: data.isCustom !== undefined ? data.isCustom : prev.isCustom,
      isFree: data.isFree !== undefined ? data.isFree : prev.isFree,
    }));
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
                onClick={() => navigate("/jobs/subscriptions")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs uppercase tracking-widest"
              >
                Create subscription
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                New subscription plan
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Create a new subscription plan for job seekers or employers.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <SubscriptionBasicInfo
            formData={formData}
            isEditing={true}
            onFormChange={handleFormChange}
            showTypeAndInterval={true}
          />

          {/* Features */}
          <SubscriptionFeaturesInput
            accountType={formData.accountType}
            selectedFeatures={formData.features}
            onFeatureToggle={handleFeatureToggle}
          />

          {/* Limits */}
          <SubscriptionLimitsInput
            accountType={formData.accountType}
            selectedFeatures={formData.features}
            limits={formData.limits}
            onLimitsChange={(limits) => setFormData({ ...formData, limits })}
          />

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/jobs/subscriptions")}
              disabled={createSubscriptionMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createSubscriptionMutation.isPending}
              className="gap-2"
            >
              {createSubscriptionMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create subscription
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateSubscription;
