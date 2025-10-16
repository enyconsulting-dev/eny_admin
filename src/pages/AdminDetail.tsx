import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  Clock,
  Edit,
  Hash,
  Mail,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const initials = (() => {
    const first = admin.firstName?.charAt(0) ?? "";
    const last = admin.lastName?.charAt(0) ?? "";
    const fallback = `${first}${last}`.trim();
    return fallback ? fallback.toUpperCase() : "AD";
  })();
  const createdAt = admin.createdAt ? format(new Date(admin.createdAt), "PPP") : "Unknown";
  const updatedAt = admin.updatedAt ? format(new Date(admin.updatedAt), "PPP") : "Unknown";
  const createdRelative = admin.createdAt ? formatDistanceToNow(new Date(admin.createdAt), { addSuffix: true }) : null;
  const updatedRelative = admin.updatedAt ? formatDistanceToNow(new Date(admin.updatedAt), { addSuffix: true }) : null;

  const StatusIcon = admin.isActive ? ShieldCheck : ShieldAlert;

  const quickStats = [
    {
      key: "created",
      label: "Created",
      value: createdAt,
      hint: createdRelative ?? "—",
      icon: CalendarClock,
      accent: "bg-blue-500/10 text-blue-500",
    },
    {
      key: "updated",
      label: "Last updated",
      value: updatedAt,
      hint: updatedRelative ?? "—",
      icon: Clock,
      accent: "bg-purple-500/10 text-purple-500",
    },
    {
      key: "role",
      label: "Role",
      value: admin.role,
      hint: admin.isActive ? "Privileges enabled" : "Awaiting reactivation",
      icon: BadgeCheck,
      accent: "bg-amber-500/10 text-amber-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-[140px]" />
        <div className="relative space-y-8 p-6 animate-in fade-in-50">
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-6 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full border border-border/60 bg-muted/30 px-4 text-xs uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/50"
                  onClick={() => navigate("/admins")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to admins
                </Button>
                <div className="flex flex-wrap items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        className="rounded-full border-border/60 bg-background/70 px-4"
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
                        className="rounded-full px-4"
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
                        className="gap-2 rounded-full border-border/60 bg-background/70 px-4"
                      >
                        <Edit className="h-4 w-4" />
                        Edit profile
                      </Button>
                      {admin.isActive ? (
                        <Button
                          variant="outline"
                          onClick={handleDeactivate}
                          disabled={deactivateAdminMutation.isPending}
                          className="gap-2 rounded-full border-orange-500/30 bg-orange-500/10 px-4 text-orange-600 hover:text-orange-600"
                        >
                          <UserX className="h-4 w-4" />
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={handleActivate}
                          disabled={activateAdminMutation.isPending}
                          className="gap-2 rounded-full border-emerald-500/30 bg-emerald-500/10 px-4 text-emerald-600 hover:text-emerald-600"
                        >
                          <UserCheck className="h-4 w-4" />
                          Activate
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteAdminMutation.isPending}
                        className="gap-2 rounded-full px-4"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete admin
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative flex flex-col items-center sm:items-start">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                      <AvatarImage src="" alt={`${fullName || "Administrator"} avatar`} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/40 via-primary/20 to-primary/40 text-lg font-semibold uppercase text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary-foreground shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      avatar coming soon
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-widest text-primary"
                      >
                        {admin.role}
                      </Badge>
                      <Badge
                        variant={admin.isActive ? "default" : "secondary"}
                        className="rounded-full px-3 py-1 text-[11px] uppercase tracking-widest"
                      >
                        {admin.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        {fullName || "Administrator"}
                      </h1>
                      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                        Keep profile details current to ensure precise audit trails and tailored access.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        {admin.email}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
                        <CalendarClock className="h-3.5 w-3.5 text-primary" />
                        Joined {createdRelative ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-xs rounded-2xl border border-border/60 bg-background/80 p-4 text-sm shadow-sm">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        admin.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      <StatusIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Account status
                      </p>
                      <p className="font-medium text-foreground">
                        {admin.isActive ? "In good standing" : "Temporarily inactive"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {admin.isActive
                      ? `Last updated ${updatedRelative ?? "recently"}.`
                      : "Reactivate to restore access privileges."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.key}
                  className="group relative overflow-hidden border border-border/60 bg-background/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <CardContent className="relative space-y-3 p-5">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${stat.accent}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
                        {stat.label}
                      </p>
                      <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.hint}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
            <Card className="border border-border/60 bg-background/80 shadow-sm">
              <CardHeader>
                <CardTitle>Profile information</CardTitle>
                <CardDescription>
                  Update names or contact details to keep communication flowing smoothly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      First name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editData.firstName}
                        onChange={(event) =>
                          setEditData({ ...editData, firstName: event.target.value })
                        }
                        className="rounded-2xl border-border/60 bg-background/90"
                      />
                    ) : (
                      <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                        {admin.firstName}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Last name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editData.lastName}
                        onChange={(event) =>
                          setEditData({ ...editData, lastName: event.target.value })
                        }
                        className="rounded-2xl border-border/60 bg-background/90"
                      />
                    ) : (
                      <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                        {admin.lastName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Email address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(event) =>
                        setEditData({ ...editData, email: event.target.value })
                      }
                      className="rounded-2xl border-border/60 bg-background/90"
                    />
                  ) : (
                    <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                      {admin.email}
                    </div>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Role
                    </Label>
                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span>{admin.role}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Status
                    </Label>
                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                      <StatusIcon className={`h-4 w-4 ${admin.isActive ? "text-emerald-500" : "text-amber-500"}`} />
                      <span>{admin.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                </div>
                {!isEditing && (
                  <p className="text-xs text-muted-foreground">
                    Ready for updates? Tap <strong>Edit profile</strong> to refresh any of these fields.
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border border-border/60 bg-background/80 shadow-sm">
                <CardHeader>
                  <CardTitle>Account snapshot</CardTitle>
                  <CardDescription>Key identifiers and lifecycle moments.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <Hash className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Account ID
                      </p>
                      <p className="font-mono text-sm text-foreground">{admin._id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Created
                      </p>
                      <p className="text-sm text-foreground">{createdAt}</p>
                      <p className="text-xs text-muted-foreground">{createdRelative ?? "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Last updated
                      </p>
                      <p className="text-sm text-foreground">{updatedAt}</p>
                      <p className="text-xs text-muted-foreground">{updatedRelative ?? "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 bg-background/80 shadow-sm">
                <CardHeader>
                  <CardTitle>Safety & access</CardTitle>
                  <CardDescription>Quick reminders to keep this admin future-ready.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Enforce strong authentication</p>
                      <p>Encourage this admin to rotate credentials regularly.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Profile photo support</p>
                      <p>Avatar slots are ready—sync a profile photo when available.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                    <ShieldAlert className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Track approvals</p>
                      <p>Use the activity feed to verify who changed sensitive settings.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDetail;
