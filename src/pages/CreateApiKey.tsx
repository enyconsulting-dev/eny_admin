import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Key,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { appService } from "@/lib/api/service";

const AVAILABLE_PERMISSIONS = [
  { value: "assessment:create", label: "Create Assessments" },
  { value: "assessment:read", label: "Read Assessments" },
  { value: "question:create", label: "Create Questions" },
  { value: "question:read", label: "Read Questions" },
  { value: "attempt:create", label: "Create Attempts" },
  { value: "attempt:read", label: "Read Attempts" },
  { value: "attempt:send", label: "Send Attempts" },
];

const CreateApiKey = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    expiresAt: "",
    rateLimit: "",
    permissions: [] as string[],
    allowedOrigins: [""],
  });

  const createApiKeyMutation = useMutation({
    mutationFn: appService.createApiKey,
    onSuccess: (response) => {
      toast({
        title: "API key created",
        description: "Your new API key has been created successfully. Please save it securely.",
      });
      // Navigate to detail page to show the key
      navigate(`/api-keys/${response.data._id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Unable to create API key",
        description: error?.response?.data?.message || error?.message || "Please review your inputs and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || formData.name.length < 3 || formData.name.length > 100) {
      toast({
        title: "Invalid name",
        description: "Name must be between 3 and 100 characters.",
        variant: "destructive",
      });
      return;
    }

    if (formData.description && formData.description.length > 500) {
      toast({
        title: "Description too long",
        description: "Description must not exceed 500 characters.",
        variant: "destructive",
      });
      return;
    }

    if (formData.rateLimit && (parseInt(formData.rateLimit) < 1 || parseInt(formData.rateLimit) > 10000)) {
      toast({
        title: "Invalid rate limit",
        description: "Rate limit must be between 1 and 10000.",
        variant: "destructive",
      });
      return;
    }

    if (formData.expiresAt && new Date(formData.expiresAt) <= new Date()) {
      toast({
        title: "Invalid expiration date",
        description: "Expiration date must be in the future.",
        variant: "destructive",
      });
      return;
    }

    // Filter out empty origins
    const validOrigins = formData.allowedOrigins.filter(origin => origin.trim() !== "");

    const payload: any = {
      name: formData.name,
    };

    if (formData.description) {
      payload.description = formData.description;
    }

    if (formData.expiresAt) {
      payload.expiresAt = new Date(formData.expiresAt).toISOString();
    }

    if (validOrigins.length > 0) {
      payload.allowedOrigins = validOrigins;
    }

    if (formData.rateLimit) {
      payload.rateLimit = parseInt(formData.rateLimit);
    }

    if (formData.permissions.length > 0) {
      payload.permissions = formData.permissions;
    }

    createApiKeyMutation.mutate(payload);
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
                Create API key
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                New API key
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Create a new API key for external integrations. Configure permissions and access controls.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Basic information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Partner Company XYZ"
                  required
                  minLength={3}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  A descriptive name for this API key (3-100 characters)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the purpose of this API key..."
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  Optional description (max 500 characters)
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Expiration date
                  </Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional. Leave empty for no expiration.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rateLimit">Rate limit (requests/hour)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={formData.rateLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, rateLimit: e.target.value })
                    }
                    placeholder="e.g., 2000"
                    min={1}
                    max={10000}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional. Max: 10,000 requests/hour
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Select the permissions this API key should have access to:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {AVAILABLE_PERMISSIONS.map((permission) => (
                    <div
                      key={permission.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={permission.value}
                        checked={formData.permissions.includes(permission.value)}
                        onCheckedChange={() =>
                          handlePermissionToggle(permission.value)
                        }
                      />
                      <Label
                        htmlFor={permission.value}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {permission.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.permissions.length === 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-500">
                    Warning: No permissions selected. This key will have no access.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Allowed origins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Specify the URLs that are allowed to use this API key (optional):
              </p>
              {formData.allowedOrigins.map((origin, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="url"
                    value={origin}
                    onChange={(e) => handleOriginChange(index, e.target.value)}
                    placeholder="https://example.com"
                  />
                  {formData.allowedOrigins.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOrigin(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOrigin}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add origin
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/api-keys")}
              disabled={createApiKeyMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createApiKeyMutation.isPending}
              className="gap-2"
            >
              {createApiKeyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create API key
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateApiKey;