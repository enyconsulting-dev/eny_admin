import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  Key,
  Loader2,
  Plus,
  Search,
  Activity,
  CheckCircle,
  XCircle,
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
import { appService } from "@/lib/api/service";

interface ApiKey {
  _id: string;
  name: string;
  description: string;
  key: string;
  isActive: boolean;
  usageCount: number;
  lastUsedAt: string | null;
  rateLimit: number;
  permissions: string[];
  expiresAt: string | null;
  allowedOrigins: string[];
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ApiKeysResponse {
  code: number;
  message: string;
  data: {
    results: ApiKey[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

const ApiKeys = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: apiKeysData,
    isLoading: apiKeysLoading,
    isError: apiKeysError,
    refetch: refetchApiKeys,
  } = useQuery<ApiKeysResponse>({
    queryKey: ["apiKeys"],
    queryFn: appService.getApiKeys,
    staleTime: 2,
    refetchOnMount: true,
  });

  const apiKeys: ApiKey[] = apiKeysData?.data?.results ?? [];

  const filteredApiKeys = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return apiKeys.filter((apiKey) => {
      const name = apiKey.name?.toLowerCase() ?? "";
      const description = apiKey.description?.toLowerCase() ?? "";
      const matchesQuery =
        !query ||
        name.includes(query) ||
        description.includes(query);
      return matchesQuery;
    });
  }, [apiKeys, searchTerm]);

  const totalApiKeys = apiKeys.length;
  const activeApiKeys = apiKeys.filter((key) => key.isActive).length;
  const inactiveApiKeys = apiKeys.filter((key) => !key.isActive).length;
  const totalUsage = apiKeys.reduce((sum, key) => sum + key.usageCount, 0);

  const summaryCards = [
    {
      key: "total",
      label: "Total API keys",
      value: totalApiKeys,
      description: "All registered API keys",
      icon: Key,
    },
    {
      key: "active",
      label: "Active keys",
      value: activeApiKeys,
      description: "Currently active API keys",
      icon: CheckCircle,
    },
    {
      key: "inactive",
      label: "Inactive keys",
      value: inactiveApiKeys,
      description: "Deactivated API keys",
      icon: XCircle,
    },
    {
      key: "usage",
      label: "Total requests",
      value: totalUsage.toLocaleString(),
      description: "Total API requests made",
      icon: Activity,
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
                API keys management
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                API keys
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Manage API keys, create new keys, and monitor usage across all integrations.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="gap-2"
              onClick={() => navigate("/api-keys/create")}
            >
              <Plus className="h-4 w-4" />
              Create API key
            </Button>
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => refetchApiKeys()}
              disabled={apiKeysLoading}
            >
              <Loader2
                className={`h-4 w-4 ${apiKeysLoading ? "animate-spin" : ""}`}
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
              <CardTitle>API keys list</CardTitle>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or description…"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {apiKeysLoading ? (
              <div className="space-y-3 p-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/5" />
              </div>
            ) : apiKeysError ? (
              <div className="flex items-center justify-between gap-4 border-t border-border/60 px-6 py-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">
                      We couldn't load API keys.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Check your connection and refresh to try again.
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => refetchApiKeys()}>
                  Retry
                </Button>
              </div>
            ) : filteredApiKeys.length === 0 ? (
              <div className="flex flex-col items-center gap-3 border-t border-dashed border-border/60 py-16 text-center">
                <Key className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    No API keys match your search
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Adjust your search or create a new API key.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate("/api-keys/create")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create API key
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="min-w-[250px]">Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="min-w-[120px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApiKeys.map((apiKey) => {
                    const expiresAt = apiKey.expiresAt
                      ? format(new Date(apiKey.expiresAt), "MMM d, yyyy")
                      : "Never";
                    const isExpired =
                      apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date();

                    return (
                      <TableRow
                        key={apiKey._id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {apiKey.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {apiKey.key.substring(0, 20)}...
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {apiKey.description || "No description"}
                          </p>
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge
                            variant={
                              isExpired
                                ? "destructive"
                                : apiKey.isActive
                                ? "default"
                                : "secondary"
                            }
                          >
                            {isExpired
                              ? "Expired"
                              : apiKey.isActive
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {apiKey.usageCount.toLocaleString()}
                            </p>
                            {apiKey.lastUsedAt && (
                              <p className="text-xs text-muted-foreground">
                                Last: {format(new Date(apiKey.lastUsedAt), "MMM d")}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <p className="text-sm text-muted-foreground">
                            {apiKey.permissions.length} permissions
                          </p>
                        </TableCell>
                        <TableCell className="align-top">
                          <p
                            className={`text-sm ${
                              isExpired ? "text-destructive" : "text-muted-foreground"
                            }`}
                          >
                            {expiresAt}
                          </p>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => navigate(`/api-keys/${apiKey._id}`)}
                            >
                              <Eye className="h-4 w-4" />
                              View
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

export default ApiKeys;