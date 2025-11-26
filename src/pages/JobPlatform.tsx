import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Users,
  Briefcase,
  FileText,
  CreditCard,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { appService } from "@/lib/api/service";

const JobPlatform = () => {
  const navigate = useNavigate();

  const {
    data: userStatsData,
    isLoading: userStatsLoading,
    isError: userStatsError,
    refetch: refetchUserStats,
  } = useQuery({
    queryKey: ["job-user-statistics"],
    queryFn: appService.getJobUserStatistics,
    staleTime: 2,
    refetchOnMount: true,
  });

  const {
    data: platformStatsData,
    isLoading: platformStatsLoading,
    isError: platformStatsError,
    refetch: refetchPlatformStats,
  } = useQuery({
    queryKey: ["job-platform-stats"],
    queryFn: appService.getJobPostingStatistics,
    staleTime: 2,
    refetchOnMount: true,
  });

  const userStats = userStatsData?.data || {
    totalUsers: 0,
    totalJobSeekers: 0,
    totalEmployers: 0,
  };

  const platformStats = platformStatsData?.data || {
    totalJobPostings: 0,
    totalPublished: 0,
    totalDraft: 0,
  };

  const statsLoading = userStatsLoading || platformStatsLoading;
  const statsError = userStatsError || platformStatsError;
  const refetchStats = () => {
    refetchUserStats();
    refetchPlatformStats();
  };

  const summaryCards = [
    {
      key: "users",
      label: "All users",
      value: userStats.totalUsers,
      description: "Total registered users in the platform.",
      icon: Users,
      href: "/jobs/users",
    },
    {
      key: "jobPostings",
      label: "Job postings",
      value: platformStats.totalJobPostings,
      description: "Total job opportunities created.",
      icon: Briefcase,
      href: "/jobs/postings",
    },
    {
      key: "applications",
      label: "Job applications",
      value: 0, // Will be updated when we have application stats
      description: "Total job applications submitted.",
      icon: FileText,
      href: "/jobs/applications",
    },
    {
      key: "subscriptions",
      label: "Subscription plans",
      value: 0,
      description: "Manage subscription plans.",
      icon: CreditCard,
      href: "/jobs/subscriptions",
    },
    {
      key: "userSubscriptions",
      label: "User subscriptions",
      value: 0,
      description: "Monitor active user subscriptions.",
      icon: Users,
      href: "/jobs/user-subscriptions",
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
                Job search platform
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Platform overview
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Monitor platform activity, manage users, job postings, and applications.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => refetchStats()}
              disabled={statsLoading}
            >
              <Loader2
                className={`h-4 w-4 ${statsLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {summaryCards.map((summary) => {
            const Icon = summary.icon;
            return (
              <Card
                key={summary.key}
                className="border border-border/60 bg-muted/30 shadow-sm dark:bg-muted/10 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(summary.href)}
              >
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                      {summary.label}
                    </p>
                    <p className="text-2xl font-semibold text-foreground">
                      {statsLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        summary.value
                      )}
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

        {statsError && (
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">
                    We couldn't load platform statistics.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Check your connection and refresh to try again.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => refetchStats()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobPlatform;