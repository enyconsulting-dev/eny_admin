import { useState, useEffect } from "react";
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
  UserCheck,
  UserX,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { appService } from "@/lib/api/service";

interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

const AdminDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const {
    data: adminData,
    isLoading: adminLoading,
    isError: adminError,
    refetch: refetchAdmin,
  } = useQuery({
    queryKey: ["admin", id],
    queryFn: () => appService.getAdminById(id!),
    enabled: !!id,
  });

  const updateAdminMutation = useMutation({
    mutationFn: (data: typeof editData) => appService.updateAdmin(id!, data),
    onSuccess: () => {
      toast({
        title: "Admin updated",
        description: "The admin profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin", id] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Unable to update admin",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: () => appService.deleteAdmin(id!),
    onSuccess: () => {
      toast({
        title: "Admin deleted",
        description: "The admin account has been removed.",
      });
      navigate("/admins");
    },
    onError: (error: any) => {
      toast({
        title: "Unable to delete admin",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const activateAdminMutation = useMutation({
    mutationFn: () => appService.activateAdmin(id!),
    onSuccess: () => {
      toast({
        title: "Admin activated",
        description: "The admin account is now active.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin", id] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to activate admin",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const deactivateAdminMutation = useMutation({
    mutationFn: () => appService.deactivateAdmin(id!),
    onSuccess: () => {
      toast({
        title: "Admin deactivated",
        description: "The admin account has been deactivated.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin", id] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to deactivate admin",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const admin: Admin | undefined = adminData?.data;

  useEffect(() => {
    if (admin) {
      setEditData({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      });
    }
  }, [admin]);

  const handleSave = () => {
    if (!editData.firstName.trim() || !editData.lastName.trim() || !editData.email.trim()) {
      toast({
        title: "Invalid data",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    updateAdminMutation.mutate(editData);
  };

  const handleDelete = () => {
    if (
      !confirm(
        "Are you sure you want to delete this admin? This action cannot be undone."
      )
    ) {
      return;
    }
    deleteAdminMutation.mutate();
  };

  const handleActivate = () => {
    activateAdminMutation.mutate();
  };

  const handleDeactivate = () => {
    deactivateAdminMutation.mutate();
  };

  if (adminLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (adminError || !admin) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center">
            <h2 className="text-xl font-semibold">Admin not found</h2>
            <p className="text-muted-foreground">
              The admin you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button onClick={() => navigate("/admins")}>
            Back to admins
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const fullName = `${admin.firstName} ${admin.lastName}`.trim();
  const createdAt = admin.createdAt
    ? format(new Date(admin.createdAt), "PPP")
    : "Unknown";
  const updatedAt = admin.updatedAt
    ? format(new Date(admin.updatedAt), "PPP")
    : "Unknown";

  return (
    <DashboardLayout>
      <div className="w-full space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admins")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs uppercase tracking-widest"
              >
                Admin profile
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {fullName}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                View and manage admin account details and permissions.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      firstName: admin.firstName,
                      lastName: admin.lastName,
                      email: admin.email,
                    });
                  }}
                  disabled={updateAdminMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateAdminMutation.isPending}
                >
                  {updateAdminMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit profile
                </Button>
                {admin.isActive ? (
                  <Button
                    variant="outline"
                    onClick={handleDeactivate}
                    disabled={deactivateAdminMutation.isPending}
                    className="gap-2 text-orange-600 hover:text-orange-600"
                  >
                    <UserX className="h-4 w-4" />
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleActivate}
                    disabled={activateAdminMutation.isPending}
                    className="gap-2 text-green-600 hover:text-green-600"
                  >
                    <UserCheck className="h-4 w-4" />
                    Activate
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteAdminMutation.isPending}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete admin
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Basic admin account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={editData.firstName}
                      onChange={(e) =>
                        setEditData({ ...editData, firstName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {admin.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={editData.lastName}
                      onChange={(e) =>
                        setEditData({ ...editData, lastName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {admin.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {admin.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Badge variant="outline">{admin.role}</Badge>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Badge variant={admin.isActive ? "default" : "secondary"}>
                  {admin.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                Account creation and modification timestamps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Account ID</Label>
                <p className="text-sm text-muted-foreground font-mono">
                  {admin._id}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Created</Label>
                <p className="text-sm text-muted-foreground">
                  {createdAt}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Last Updated</Label>
                <p className="text-sm text-muted-foreground">
                  {updatedAt}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDetail;