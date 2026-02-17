import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  Clock3,
  Eye,
  Loader2,
  Plus,
  Search,
  Trash2,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

const Admins = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [inviteAdmin, setInviteAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const {
    data: adminsData,
    isLoading: adminsLoading,
    isError: adminsError,
    refetch: refetchAdmins,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: appService.getAdmins,
    staleTime: 2,
    refetchOnMount: true,
    // networkMode
  });

  const createAdminMutation = useMutation({
    mutationFn: appService.createAdmin,
    onSuccess: () => {
      toast({
        title: "Admin created",
        description: "The new admin has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsCreateDialogOpen(false);
      setNewAdmin({ firstName: "", lastName: "", email: "", password: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to create admin",
        description: error?.message || "Please review your inputs and try again.",
        variant: "destructive",
      });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: appService.deleteAdmin,
    onSuccess: () => {
      toast({
        title: "Admin removed",
        description: "The admin account has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
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
    mutationFn: appService.activateAdmin,
    onSuccess: () => {
      toast({
        title: "Admin activated",
        description: "The admin account is now active.",
      });
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
    mutationFn: appService.deactivateAdmin,
    onSuccess: () => {
      toast({
        title: "Admin deactivated",
        description: "The admin account has been deactivated.",
      });
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

  const inviteAdminMutation = useMutation({
    mutationFn: appService.inviteAdmin,
    onSuccess: () => {
      toast({
        title: "Invitation sent",
        description: "The admin invitation has been sent successfully.",
      });
      setIsInviteDialogOpen(false);
      setInviteAdmin({ firstName: "", lastName: "", email: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to send invitation",
        description: error?.message || "Please review your inputs and try again.",
        variant: "destructive",
      });
    },
  });

  const admins: Admin[] = adminsData?.data?.results ?? [];

  const filteredAdmins = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return admins.filter((admin) => {
      const firstName = admin.firstName?.toLowerCase() ?? "";
      const lastName = admin.lastName?.toLowerCase() ?? "";
      const email = admin.email?.toLowerCase() ?? "";
      const matchesQuery =
        !query ||
        firstName.includes(query) ||
        lastName.includes(query) ||
        email.includes(query);
      return matchesQuery;
    });
  }, [admins, searchTerm]);

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter((admin) => admin.isActive).length;
  const inactiveAdmins = admins.filter((admin) => !admin.isActive).length;

  const handleCreateAdmin = () => {
    if (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || !newAdmin.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createAdminMutation.mutate(newAdmin);
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this admin? This action cannot be undone."
      )
    ) {
      return;
    }
    deleteAdminMutation.mutate(adminId);
  };

  const handleActivateAdmin = (adminId: string) => {
    activateAdminMutation.mutate(adminId);
  };

  const handleDeactivateAdmin = (adminId: string) => {
    deactivateAdminMutation.mutate(adminId);
  };

  const handleInviteAdmin = () => {
    if (!inviteAdmin.firstName || !inviteAdmin.lastName || !inviteAdmin.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    inviteAdminMutation.mutate(inviteAdmin);
  };

  const summaryCards = [
    {
      key: "total",
      label: "Total admins",
      value: totalAdmins,
      description: "All registered admin accounts.",
      icon: Users,
    },
    {
      key: "active",
      label: "Active admins",
      value: activeAdmins,
      description: "Currently active admin accounts.",
      icon: UserCheck,
    },
    {
      key: "inactive",
      label: "Inactive admins",
      value: inactiveAdmins,
      description: "Deactivated admin accounts.",
      icon: UserX,
    },
  ];

  return (
    <DashboardLayout>
      <div className="w-full space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs uppercase tracking-widest"
              >
                Admin management
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Admin accounts
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Manage admin users, create new accounts, and control access permissions.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog
              open={isInviteDialogOpen}
              onOpenChange={setIsInviteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Invite admin
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-scroll no-scrollbar">
                <DialogHeader>
                  <DialogTitle>Invite new admin</DialogTitle>
                  <DialogDescription>
                    Send an invitation to a new administrator by email.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inviteFirstName">First Name</Label>
                      <Input
                        id="inviteFirstName"
                        value={inviteAdmin.firstName}
                        onChange={(e) =>
                          setInviteAdmin({ ...inviteAdmin, firstName: e.target.value })
                        }
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inviteLastName">Last Name</Label>
                      <Input
                        id="inviteLastName"
                        value={inviteAdmin.lastName}
                        onChange={(e) =>
                          setInviteAdmin({ ...inviteAdmin, lastName: e.target.value })
                        }
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inviteEmail">Email</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      value={inviteAdmin.email}
                      onChange={(e) =>
                        setInviteAdmin({ ...inviteAdmin, email: e.target.value })
                      }
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                <DialogFooter className="flex flex-wrap items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsInviteDialogOpen(false)}
                    disabled={inviteAdminMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInviteAdmin}
                    disabled={inviteAdminMutation.isPending}
                  >
                    {inviteAdminMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Send invitation"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add admin
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-scroll no-scrollbar">
                <DialogHeader>
                  <DialogTitle>Create new admin account</DialogTitle>
                  <DialogDescription>
                    Add a new administrator with full access to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newAdmin.firstName}
                        onChange={(e) =>
                          setNewAdmin({ ...newAdmin, firstName: e.target.value })
                        }
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newAdmin.lastName}
                        onChange={(e) =>
                          setNewAdmin({ ...newAdmin, lastName: e.target.value })
                        }
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, email: e.target.value })
                      }
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, password: e.target.value })
                      }
                      placeholder="Enter password"
                    />
                  </div>
                </div>
                <DialogFooter className="flex flex-wrap items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={createAdminMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAdmin}
                    disabled={createAdminMutation.isPending}
                  >
                    {createAdminMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      "Create admin"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => refetchAdmins()}
              disabled={adminsLoading}
            >
              <Loader2
                className={`h-4 w-4 ${adminsLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
              <CardTitle>Admin </CardTitle>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email…"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {adminsLoading ? (
              <div className="space-y-3 p-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/5" />
              </div>
            ) : adminsError ? (
              <div className="flex items-center justify-between gap-4 border-t border-border/60 px-6 py-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">
                      We couldn't load admins.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Check your connection and refresh to try again.
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => refetchAdmins()}>
                  Retry
                </Button>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="flex flex-col items-center gap-3 border-t border-dashed border-border/60 py-16 text-center">
                <Users className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    No admins match your search
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Adjust your search or create a new admin account.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add admin
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="min-w-[150px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => {
                    const fullName = `${admin.firstName} ${admin.lastName}`.trim();
                    const createdAt = admin.createdAt
                      ? format(
                        new Date(admin.createdAt),
                        "MMM d, yyyy"
                      )
                      : "Unknown";

                    return (
                      <TableRow
                        key={admin._id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {fullName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {admin.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge variant={admin.isActive ? "default" : "secondary"}>
                            {admin.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge variant="outline">{admin.role}</Badge>
                        </TableCell>
                        <TableCell className="align-top text-sm text-muted-foreground">
                          {createdAt}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() =>
                                navigate(`/admins/${admin._id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            {admin.isActive ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-orange-600 hover:text-orange-600"
                                onClick={() => handleDeactivateAdmin(admin._id)}
                                // disabled={deactivateAdminMutation.isPending}
                                disabled
                              >
                                <UserX className="h-4 w-4" />
                                Deactivate
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-green-600 hover:text-green-600"
                                onClick={() => handleActivateAdmin(admin._id)}
                                // disabled={activateAdminMutation.isPending}
                                disabled
                              >
                                <UserCheck className="h-4 w-4" />
                                Activate
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteAdmin(admin._id)}
                              // disabled={deleteAdminMutation.isPending}
                              disabled
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Admins;