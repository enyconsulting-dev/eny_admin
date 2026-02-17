import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  Loader2,
  Search,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Briefcase,
  Building,
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
import { useToast } from "@/hooks/use-toast";
import { appService } from "@/lib/api/service";

interface JobUser {
  _id: string;
  accountType: "job_seeker" | "employer";
  isAccountVerified: boolean;
  clerkId: string;
  email: string;
  password_enabled: boolean;
  jobSeekerProfile?: {
    fullName: string;
    phone?: string;
    addressLine?: string;
    bio?: string;
  };
  employerProfile?: {
    name: string;
    legalName?: string;
    website?: string;
    about?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const JobUsers = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "job_seeker" | "employer">("all");

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["job-users"],
    queryFn: () => appService.getJobUsers(1, 100),
    staleTime: 2,
    refetchOnMount: true,
  });

  const deleteUserMutation = useMutation({
    mutationFn: appService.deleteJobUser,
    onSuccess: () => {
      toast({
        title: "User removed",
        description: "The user account has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["job-users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to delete user",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: appService.activateJobUser,
    onSuccess: () => {
      toast({
        title: "User activated",
        description: "The user account is now active.",
      });
      queryClient.invalidateQueries({ queryKey: ["job-users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to activate user",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: appService.deactivateJobUser,
    onSuccess: () => {
      toast({
        title: "User deactivated",
        description: "The user account has been deactivated.",
      });
      queryClient.invalidateQueries({ queryKey: ["job-users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to deactivate user",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const users: JobUser[] = usersData?.data?.users ?? [];

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return users.filter((user) => {
      const fullName = user.accountType === "job_seeker"
        ? user.jobSeekerProfile?.fullName?.toLowerCase() ?? ""
        : user.employerProfile?.name?.toLowerCase() ?? "";
      const email = user.email?.toLowerCase() ?? "";
      const matchesQuery =
        !query ||
        fullName.includes(query) ||
        email.includes(query);
      const matchesType = filterType === "all" || user.accountType === filterType;
      return matchesQuery && matchesType;
    });
  }, [users, searchTerm, filterType]);

  const totalUsers = users.length;
  const jobSeekers = users.filter((user) => user.accountType === "job_seeker").length;
  const employers = users.filter((user) => user.accountType === "employer").length;

  const handleDeleteUser = (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }
    deleteUserMutation.mutate(userId);
  };

  const handleActivateUser = (userId: string) => {
    activateUserMutation.mutate(userId);
  };

  const handleDeactivateUser = (userId: string) => {
    deactivateUserMutation.mutate(userId);
  };

  const summaryCards = [
    {
      key: "total",
      label: "All users",
      value: totalUsers,
      description: "Total registered users.",
      icon: Users,
    },
    {
      key: "seekers",
      label: "Job seekers",
      value: jobSeekers,
      description: "Users seeking employment.",
      icon: UserCheck,
    },
    {
      key: "employers",
      label: "Employers",
      value: employers,
      description: "Users posting job opportunities.",
      icon: Building,
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
                onClick={() => navigate("/jobs")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs uppercase tracking-widest"
              >
                Job users
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Platform users
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Manage job seekers and employers, control account status and access.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => refetchUsers()}
              disabled={usersLoading}
            >
              <Loader2
                className={`h-4 w-4 ${usersLoading ? "animate-spin" : ""}`}
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
              <CardTitle>User </CardTitle>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="flex gap-2">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterType === "job_seeker" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("job_seeker")}
                  >
                    Job Seekers
                  </Button>
                  <Button
                    variant={filterType === "employer" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("employer")}
                  >
                    Employers
                  </Button>
                </div>
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
            {usersLoading ? (
              <div className="space-y-3 p-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/5" />
              </div>
            ) : usersError ? (
              <div className="flex items-center justify-between gap-4 border-t border-border/60 px-6 py-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">
                      We couldn't load users.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Check your connection and refresh to try again.
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => refetchUsers()}>
                  Retry
                </Button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center gap-3 border-t border-dashed border-border/60 py-16 text-center">
                <Users className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    No users match your search{filterType !== "all" ? ` and filter (${filterType === "job_seeker" ? "Job Seekers" : "Employers"})` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Adjust your search or filter and check back later.
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="min-w-[150px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const displayName = user.accountType === "job_seeker"
                      ? user.jobSeekerProfile?.fullName || "Unknown"
                      : user.employerProfile?.name || "Unknown";
                    const createdAt = user.createdAt
                      ? format(
                        new Date(user.createdAt),
                        "MMM d, yyyy"
                      )
                      : "Unknown";

                    return (
                      <TableRow
                        key={user._id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {displayName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge variant="outline">
                            {user.accountType === "job_seeker" ? "Job Seeker" : "Employer"}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge variant={user.isAccountVerified ? "default" : "secondary"}>
                            {user.isAccountVerified ? "Verified" : "Unverified"}
                          </Badge>
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
                                navigate(`/jobs/users/${user._id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            {user.isActive ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-orange-600 hover:text-orange-600"
                                onClick={() => handleDeactivateUser(user._id)}
                              >
                                <UserX className="h-4 w-4" />
                                Deactivate
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-green-600 hover:text-green-600"
                                onClick={() => handleActivateUser(user._id)}
                              >
                                <UserCheck className="h-4 w-4" />
                                Activate
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteUser(user._id)}
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

export default JobUsers;