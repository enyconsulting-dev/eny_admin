import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Edit,
  Loader2,
  Lock,
  Save,
  Trash2,
  Unlock,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { appService } from "@/lib/api/service";
import { ApiKey } from "@/types/apiKey";
import { ApiKeyStats } from "@/components/api-keys/ApiKeyStats";
import { ApiKeyDisplay } from "@/components/api-keys/ApiKeyDisplay";
import { ApiKeyBasicInfo } from "@/components/api-keys/ApiKeyBasicInfo";
import { ApiKeyPermissions } from "@/components/api-keys/ApiKeyPermissions";
import { ApiKeyAllowedOrigins } from "@/components/api-keys/ApiKeyAllowedOrigins";
import { ApiKeyMetadata } from "@/components/api-keys/ApiKeyMetadata";
import { DeleteApiKeyDialog } from "@/components/api-keys/DeleteApiKeyDialog";

const ApiKeyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    expiresAt: "",
    rateLimit: "",
    permissions: [] as string[],
    allowedOrigins: [""],
  });

  const {
    data: apiKeyData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["apiKey", id],
    queryFn: () => appService.getApiKeyById(id!),
    enabled: !!id,
  });

  const {
    data: statsData,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["apiKeyStats", id],
    queryFn: () => appService.getApiKeyStats(id!),
    enabled: !!id,
  });

  const apiKey: ApiKey | undefined = apiKeyData?.data;
  const stats = statsData?.data;

  useEffect(() => {
    if (apiKey && !isEditing) {
      setFormData({
        name: apiKey.name || "",
        description: apiKey.description || "",
        expiresAt: apiKey.expiresAt
          ? format(new Date(apiKey.expiresAt), "yyyy-MM-dd'T'HH:mm")
          : "",
        rateLimit: apiKey.rateLimit ? apiKey.rateLimit.toString() : "",
        permissions: apiKey.permissions || [],
        allowedOrigins:
          apiKey.allowedOrigins && apiKey.allowedOrigins.length > 0
            ? apiKey.allowedOrigins
            : [""],
      });
    }
  }, [apiKey, isEditing]);

  const updateApiKeyMutation = useMutation({
    mutationFn: (data: any) => appService.updateApiKey(id!, data),
    onSuccess: () => {
      toast({
        title: "API key updated",
        description: "The API key has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["apiKey", id] });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Unable to update API key",
        description: error?.response?.data?.message || error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const deleteApiKeyMutation = useMutation({
    mutationFn: () => appService.deleteApiKey(id!),
    onSuccess: () => {
      toast({
        title: "API key deleted",
        description: "The API key has been deleted successfully.",
      });
      navigate("/api-keys");
    },
    onError: (error: any) => {
      toast({
        title: "Unable to delete API key",
        description: error?.response?.data?.message || error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const activateApiKeyMutation = useMutation({
    mutationFn: () => appService.activateApiKey(id!),
    onSuccess: () => {
      toast({
        title: "API key activated",
        description: "The API key is now active.",
      });
      queryClient.invalidateQueries({ queryKey: ["apiKey", id] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to activate API key",
        description: error?.response?.data?.message || error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const deactivateApiKeyMutation = useMutation({
    mutationFn: () => appService.deactivateApiKey(id!),
    onSuccess: () => {
      toast({
        title: "API key deactivated",
        description: "The API key has been deactivated.",
      });
      queryClient.invalidateQueries({ queryKey: ["apiKey", id] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to deactivate API key",
        description: error?.response?.data?.message || error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!formData.name.trim() || formData.name.length < 3 || formData.name.length > 100) {
      toast({
        title: "Invalid name",
        description: "Name must be between 3 and 100 characters.",
        variant: "destructive",
      });
      return;
    }

    const validOrigins = formData.allowedOrigins.filter(origin => origin.trim() !== "");

    const payload: any = {
      name: formData.name,
      description: formData.description || undefined,
      permissions: formData.permissions.length > 0 ? formData.permissions : undefined,
      allowedOrigins: validOrigins.length > 0 ? validOrigins : undefined,
      rateLimit: formData.rateLimit ? parseInt(formData.rateLimit) : undefined,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
    };

    updateApiKeyMutation.mutate(payload);
  };

  const handleDelete = () => {
    deleteApiKeyMutation.mutate();
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleOriginChange = (index: number, value: string) => {
    const newOrigins = [...formData.allowedOrigins];
    newOrigins[index] = value;
    setFormData((prev) => ({ ...prev, allowedOrigins: newOrigins }));
  };

  const handleAddOrigin = () => {
    setFormData((prev) => ({
      ...prev,
      allowedOrigins: [...prev.allowedOrigins, ""],
    }));
  };

  const handleRemoveOrigin = (index: number) => {
    if (formData.allowedOrigins.length > 1) {
      const newOrigins = formData.allowedOrigins.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, allowedOrigins: newOrigins }));
    }
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

  if (isError || !apiKey) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center">
            <h2 className="text-xl font-semibold">API key not found</h2>
            <p className="text-sm text-muted-foreground">
              The API key you're looking for doesn't exist.
            </p>
          </div>
          <Button onClick={() => navigate("/api-keys")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to API keys
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isExpired = apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date();

  return (
    <DashboardLayout>
      <div className="w-full space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/api-keys")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs uppercase tracking-widest"
              >
                API key details
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  {apiKey.name}
                </h1>
                <Badge
                  variant={
                    isExpired
                      ? "destructive"
                      : apiKey.isActive
                        ? "default"
                        : "secondary"
                  }
                >
                  {isExpired ? "Expired" : apiKey.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {apiKey.description || "No description provided"}
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
                {apiKey.isActive ? (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => deactivateApiKeyMutation.mutate()}
                    disabled={deactivateApiKeyMutation.isPending}
                  >
                    <Lock className="h-4 w-4" />
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => activateApiKeyMutation.mutate()}
                    disabled={activateApiKeyMutation.isPending}
                  >
                    <Unlock className="h-4 w-4" />
                    Activate
                  </Button>
                )}
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
                  disabled={updateApiKeyMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  className="gap-2"
                  onClick={handleSave}
                  disabled={updateApiKeyMutation.isPending}
                >
                  {updateApiKeyMutation.isPending ? (
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

        <ApiKeyStats apiKey={apiKey} stats={stats} isLoading={statsLoading} />

        <ApiKeyDisplay apiKey={apiKey.key} />

        <ApiKeyBasicInfo
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
        />

        <ApiKeyPermissions
          permissions={formData.permissions}
          onToggle={handlePermissionToggle}
          isEditing={isEditing}
        />

        <ApiKeyAllowedOrigins
          allowedOrigins={formData.allowedOrigins}
          onChange={handleOriginChange}
          onAdd={handleAddOrigin}
          onRemove={handleRemoveOrigin}
          isEditing={isEditing}
        />

        <ApiKeyMetadata apiKey={apiKey} />
      </div>

      <DeleteApiKeyDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={deleteApiKeyMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default ApiKeyDetail;

