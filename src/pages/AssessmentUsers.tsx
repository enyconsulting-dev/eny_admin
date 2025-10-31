import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appService } from "@/lib/api/service";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  User,
  Users,
} from "lucide-react";
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

export interface UsersInfoPayload {
  firstName: string;
  lastName: string;
  emailAddress: string;
  mobileNumber?: string;
}

const emptyUser = (): UsersInfoPayload => ({
  firstName: "",
  lastName: "",
  emailAddress: "",
  mobileNumber: "",
});

const AssessmentUsers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UsersInfoPayload>(emptyUser());
  const [createForm, setCreateForm] = useState<UsersInfoPayload>(emptyUser());
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["assessment users", id],
    queryFn: () => appService.getAssessmentUsers(id || ""),
    enabled: !!id,
  });

  const {
    data: allUsersData,
    isLoading: isAssessmentLoading,
    isError: isAssessmentError,
  } = useQuery({
    queryKey: ["all users"],
    queryFn: () => appService.getUsers(),
    enabled: !id,
  });

  useEffect(() => {
    if (!editingUserId) setEditForm(emptyUser());
  }, [editingUserId]);

  const createUserMutation = useMutation({
    mutationFn: (payload: UsersInfoPayload) => appService.createUser(payload),
    onSuccess: () => {
      toast({ title: "User created" });
      queryClient.invalidateQueries({ queryKey: ["assessment users", id] });
      setCreateForm(emptyUser());
      setCreateDialogOpen(false);
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.message,
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UsersInfoPayload;
    }) => appService.updateUser(userId, data),
    onSuccess: () => {
      toast({ title: "User updated" });
      queryClient.invalidateQueries({ queryKey: ["assessment users", id] });
      queryClient.invalidateQueries({ queryKey: ["all users"] });
      setEditingUserId(null);
      setEditForm(emptyUser());
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.message,
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => appService.deleteUser(userId),
    onSuccess: () => {
      toast({ title: "User deleted" });
      queryClient.invalidateQueries({ queryKey: ["assessment users", id] });
      queryClient.invalidateQueries({ queryKey: ["all users"] });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.message,
        variant: "destructive",
      });
    },
  });

  const bulkCreateMutation = useMutation({
    mutationFn: (payload: UsersInfoPayload[]) =>
      appService.createUsersBulk(payload),
    onSuccess: () => {
      toast({ title: "Users uploaded" });
      queryClient.invalidateQueries({ queryKey: ["assessment users", id] });
      queryClient.invalidateQueries({ queryKey: ["all users"] });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (user: any) => {
    setEditingUserId(user._id || user.id);
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      emailAddress: user.emailAddress || user.email || "",
      mobileNumber: user.mobileNumber || "",
    });
  };

  const handleUpdateUser = () => {
    if (editingUserId) {
      if (!editForm.firstName || !editForm.emailAddress) {
        toast({
          title: "Missing details",
          description:
            "First name and email are required to update a candidate.",
          variant: "destructive",
        });
        return;
      }
      updateUserMutation.mutate({ userId: editingUserId, data: editForm });
      return;
    }
  };

  const handleDelete = (userId?: string) => {
    if (!userId) return;
    if (!confirm("Delete this user?")) return;
    deleteUserMutation.mutate(userId);
  };

  const handleCsvUpload = (file: File | null) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast({
        title: "Unsupported file",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result || "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length === 0) {
        toast({
          title: "No data found",
          description: "Your CSV appears to be empty.",
          variant: "destructive",
        });
        return;
      }
      const parsed: UsersInfoPayload[] = lines.map((line) => {
        const cols = line.split(",").map((c) => c.trim());
        return {
          firstName: cols[0] || "",
          lastName: cols[1] || "",
          emailAddress: cols[2] || "",
          mobileNumber: cols[3] || "",
        };
      });
      bulkCreateMutation.mutate(parsed);
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const users: any[] = useMemo(() => {
    return allUsersData?.data.results ?? usersData?.data ?? [];
  }, [allUsersData, usersData]);
  
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.trim().toLowerCase();
    return users.filter((user) => {
      const name = `${user.firstName || ""} ${
        user.lastName || ""
      }`.toLowerCase();
      const email = (user.emailAddress || user.email || "").toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  }, [users, searchTerm]);

  const totalUsers = users.length;
  const profilesWithPhone = users.filter((user) => user.mobileNumber).length;
  const completionRate = totalUsers
    ? Math.round((profilesWithPhone / totalUsers) * 100)
    : 0;
  const distinctDomains = new Set(
    users
      .map((user) =>
        (user.emailAddress || user.email || "").split("@")[1]?.toLowerCase()
      )
      .filter(Boolean)
  ).size;
  const missingEmailCount = users.filter(
    (user) => !(user.emailAddress || user.email)
  ).length;

  const overviewStats = [
    {
      key: "total",
      label: "Total candidates",
      value: totalUsers,
      description: "Everyone currently linked to this assessment.",
      icon: Users,
    },
    {
      key: "completion",
      label: "Profile completeness",
      value: `${completionRate}%`,
      description: `${profilesWithPhone} have provided a phone number.`,
      icon: CheckCircle2,
    },
    {
      key: "coverage",
      label: "Email coverage",
      value: `${distinctDomains || 0} domains`,
      description:
        missingEmailCount > 0
          ? `${missingEmailCount} candidate${
              missingEmailCount === 1 ? "" : "s"
            } need an email.`
          : "All candidates include an email address.",
      icon: Mail,
    },
  ];

  const isUploading = bulkCreateMutation.isPending;
  const isCreating = createUserMutation.isPending;
  const isUpdating = updateUserMutation.isPending;
  const isDeleting = deleteUserMutation.isPending;
  const showEmptyState = !isLoading && filteredUsers.length === 0;
  const currentEditingName = editingUserId
    ? `${editForm.firstName} ${editForm.lastName}`.trim()
    : "";

  const handleDialogOpenChange = (open: boolean) => {
    setCreateDialogOpen(open);
    if (!open) {
      setCreateForm(emptyUser());
    }
  };

  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!createForm.firstName || !createForm.emailAddress) {
      toast({
        title: "Missing details",
        description: "First name and email are required to create a candidate.",
        variant: "destructive",
      });
      return;
    }

    createUserMutation.mutate(createForm);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditForm(emptyUser());
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-8">
        <div className="w-[100%] relative flex items-center justfiy-between">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-1 w-fit px-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Candidate directory
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Invite new candidates, keep profiles up to date, and monitor the
                roster for this assessment.
              </p>
            </div>
          </div>

          <div className="md:absolute right-1">
            <Dialog
              open={createDialogOpen}
              onOpenChange={handleDialogOpenChange}
            >
              <DialogTrigger asChild>
                <Button className="gap-2" disabled={!!id}>
                  <Plus className="h-4 w-4" />
                  Add candidate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite a new candidate</DialogTitle>
                  <DialogDescription>
                    Capture the essentials so you can send assessment invites
                    right away. You can add more details later.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4 pt-2" onSubmit={handleCreateSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="create-first-name">First name</Label>
                      <Input
                        id="create-first-name"
                        autoComplete="given-name"
                        value={createForm.firstName}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="Ada"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-last-name">Last name</Label>
                      <Input
                        id="create-last-name"
                        autoComplete="family-name"
                        value={createForm.lastName}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            lastName: e.target.value,
                          })
                        }
                        placeholder="Lovelace"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-email">Email address</Label>
                    <Input
                      id="create-email"
                      type="email"
                      autoComplete="email"
                      value={createForm.emailAddress}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          emailAddress: e.target.value,
                        })
                      }
                      placeholder="ada@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-mobile">Mobile number</Label>
                    <Input
                      id="create-mobile"
                      type="tel"
                      autoComplete="tel"
                      value={createForm.mobileNumber}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          mobileNumber: e.target.value,
                        })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <DialogFooter className="gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleDialogOpenChange(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create candidate"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {overviewStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.key}
                className="border border-border/60 bg-muted/40 shadow-sm dark:bg-muted/10"
              >
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-background p-2 shadow-sm">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="gap-6">
              <div>
                <CardTitle>Manage roster</CardTitle>
                <CardDescription>
                  Search, filter, or bulk upload candidates. Select a row to
                  fine-tune the candidate profile.
                </CardDescription>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="text/csv"
                    className="hidden"
                    disabled={!!id}
                    onChange={(e) =>
                      handleCsvUpload(e.target.files ? e.target.files[0] : null)
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || !!id}
                  >
                    <UploadCloud className="h-4 w-4" />
                    {isUploading ? "Uploading..." : "Upload CSV"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 no-scrollbar">
              <div className="overflow-x-auto no-scrollbar">
                <Table className="no-scrollbar">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[220px]">Candidate</TableHead>
                      <TableHead className="min-w-[220px]">Contact</TableHead>
                      <TableHead className="min-w-[140px]">Phone</TableHead>
                      <TableHead className="min-w-[140px]">Status</TableHead>
                      <TableHead className="min-w-[160px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="no-scrollbar">
                    {isLoading && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="space-y-3 p-6">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-4/5" />
                            <Skeleton className="h-5 w-3/4" />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {showEmptyState && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="flex flex-col items-center gap-3 py-10 text-center">
                            <Users className="h-8 w-8 text-muted-foreground" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-foreground">
                                No candidates yet
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Start by uploading a CSV or create your first
                                candidate.
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              className="gap-2"
                              onClick={() => setCreateDialogOpen(true)}
                              disabled={!!id}
                            >
                              <Plus className="h-4 w-4" />
                              New candidate
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {!isLoading &&
                      filteredUsers.map((user: any) => {
                        const userId = user._id || user.id;
                        const profileStatus = user.mobileNumber
                          ? { label: "Complete", variant: "secondary" as const }
                          : {
                              label: "Needs phone",
                              variant: "outline" as const,
                            };
                        const email = user.emailAddress || user.email || "—";
                        const phone = user.mobileNumber || "—";
                        const isActiveRow = editingUserId === userId;

                        return (
                          <TableRow
                            key={userId}
                            className={`transition-colors hover:bg-muted/50 ${
                              isActiveRow ? "bg-primary/5" : ""
                            }`}
                          >
                            <TableCell className="align-top">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {[user.firstName, user.lastName]
                                      .filter(Boolean)
                                      .join(" ") || "Unnamed candidate"}
                                  </span>
                                  {isActiveRow && (
                                    <Badge variant="secondary">Editing</Badge>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  ID{" "}
                                  {String(userId || "—")
                                    .slice(-6)
                                    .toUpperCase()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="truncate">{email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{phone}</span>
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <Badge
                                variant={profileStatus.variant}
                                className="rounded-full px-3 py-1 text-xs"
                              >
                                {profileStatus.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="gap-2"
                                  onClick={() => handleEdit(user)}
                                >
                                  <User className="h-4 w-4" />
                                  Review
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="gap-2 text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(userId)}
                                  disabled={isDeleting}
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
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>
                  {editingUserId
                    ? "Edit candidate profile"
                    : "Select a candidate"}
                </CardTitle>
                <CardDescription>
                  {editingUserId
                    ? "Update the selected candidate’s profile so they are ready for upcoming assessments."
                    : "Choose a candidate from the table to view and edit their details."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editingUserId ? (
                  <div className="space-y-4">
                    {currentEditingName && (
                      <div className="rounded-md border border-dashed border-border/70 bg-muted/40 p-3 text-sm">
                        Managing{" "}
                        <span className="font-medium text-foreground">
                          {currentEditingName}
                        </span>
                        {editForm.emailAddress ? (
                          <>
                            <span className="mx-2 text-muted-foreground">
                              •
                            </span>
                            {editForm.emailAddress}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="edit-first-name">First name</Label>
                      <Input
                        id="edit-first-name"
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-last-name">Last name</Label>
                      <Input
                        id="edit-last-name"
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email address</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editForm.emailAddress}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            emailAddress: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-mobile">Mobile number</Label>
                      <Input
                        id="edit-mobile"
                        type="tel"
                        value={editForm.mobileNumber}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            mobileNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button onClick={handleUpdateUser} disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 p-6 text-sm text-muted-foreground">
                    Pick a candidate from the table to review their profile,
                    update details, or resend information.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-dashed border-border/70 bg-muted/20 shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Bulk upload tips</CardTitle>
                <CardDescription>
                  Format your CSV with columns in this order:{" "}
                  <code>firstName,lastName,emailAddress,mobileNumber</code>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4" />
                  <p>
                    We recommend using corporate email addresses to avoid
                    duplicate candidate records.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4" />
                  <p>
                    Include phone numbers so you can send SMS nudges before the
                    assessment window closes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssessmentUsers;
