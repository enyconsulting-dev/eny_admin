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
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
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

interface JobPosting {
  _id: string;
  title: string;
  slug: string;
  externalReferenceId?: string;
  companyId: {
    _id: string;
    employerProfile: {
      name: string;
    };
  };
  postedBy: string;
  department?: string;
  team?: string;
  location: {
    geo?: {
      coordinates: [number, number];
      type: string;
    };
    country: string;
    state: string;
    city: string;
    addressLine?: string;
  };
  workMode: string;
  employmentType: string;
  experienceLevel: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  skills: string[];
  benefits?: string[];
  visaSponsorship: boolean;
  relocationSupport: boolean;
  educationLevel?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
    isVisible: boolean;
  };
  applicationDeadline?: string;
  applicationMethod: {
    type: string;
    externalLink?: string;
    email?: string;
    askResume: boolean;
    askCoverLetter: boolean;
    askPortfolio: boolean;
    customQuestions?: {
      id: string;
      label: string;
      required: boolean;
      responseType: string;
      options: string[];
    }[];
  };
  publishStatus: "Published" | "Draft";
  isFeatured: boolean;
  tags: string[];
  views: number;
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
}

const JobPostings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: postingsData,
    isLoading: postingsLoading,
    isError: postingsError,
    refetch: refetchPostings,
  } = useQuery({
    queryKey: ["job-postings"],
    queryFn: () => appService.getJobPostings(1, 10),
    staleTime: 2,
    refetchOnMount: true,
  });

  const deletePostingMutation = useMutation({
    mutationFn: appService.deleteJobPosting,
    onSuccess: () => {
      toast({
        title: "Job posting removed",
        description: "The job posting has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["job-postings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to delete job posting",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const blockPostingMutation = useMutation({
    mutationFn: appService.blockJobPosting,
    onSuccess: () => {
      toast({
        title: "Job posting blocked",
        description: "The job posting has been blocked.",
      });
      queryClient.invalidateQueries({ queryKey: ["job-postings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to block job posting",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const unblockPostingMutation = useMutation({
    mutationFn: appService.unblockJobPosting,
    onSuccess: () => {
      toast({
        title: "Job posting unblocked",
        description: "The job posting has been unblocked.",
      });
      queryClient.invalidateQueries({ queryKey: ["job-postings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to unblock job posting",
        description: error?.message || "Try again shortly.",
        variant: "destructive",
      });
    },
  });

  const postings: JobPosting[] = postingsData?.data?.data?.results ?? [];

  const filteredPostings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return postings.filter((posting) => {
      const title = posting.title?.toLowerCase() ?? "";
      const company = posting.companyId?.employerProfile?.name?.toLowerCase() ?? "";
      const location = `${posting.location.city}, ${posting.location.state}, ${posting.location.country}`.toLowerCase();
      const matchesQuery =
        !query ||
        title.includes(query) ||
        company.includes(query) ||
        location.includes(query);
      return matchesQuery;
    });
  }, [postings, searchTerm]);

  const totalPostings = postings.length;
  const publishedPostings = postings.filter((posting) => posting.publishStatus === "Published").length;
  const draftPostings = postings.filter((posting) => posting.publishStatus === "Draft").length;

  const handleDeletePosting = (postingId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this job posting? This action cannot be undone."
      )
    ) {
      return;
    }
    deletePostingMutation.mutate(postingId);
  };

  const handleBlockPosting = (postingId: string) => {
    blockPostingMutation.mutate(postingId);
  };

  const handleUnblockPosting = (postingId: string) => {
    unblockPostingMutation.mutate(postingId);
  };

  const summaryCards = [
    {
      key: "total",
      label: "All job postings",
      value: totalPostings,
      description: "Total job opportunities created.",
      icon: Briefcase,
    },
    {
      key: "published",
      label: "Published postings",
      value: publishedPostings,
      description: "Active job listings visible to seekers.",
      icon: CheckCircle,
    },
    {
      key: "draft",
      label: "Draft postings",
      value: draftPostings,
      description: "Job postings awaiting publication.",
      icon: Clock,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return <Badge variant="default">Published</Badge>;
      case "Draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
                onClick={() => navigate("/jobs")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs uppercase tracking-widest"
              >
                Job postings
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Job postings
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Manage job opportunities, control publication status and moderate content.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => refetchPostings()}
              disabled={postingsLoading}
            >
              <Loader2
                className={`h-4 w-4 ${postingsLoading ? "animate-spin" : ""}`}
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
              <CardTitle>Job postings roster</CardTitle>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, company, or location…"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {postingsLoading ? (
              <div className="space-y-3 p-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/5" />
              </div>
            ) : postingsError ? (
              <div className="flex items-center justify-between gap-4 border-t border-border/60 px-6 py-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">
                      We couldn't load job postings.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Check your connection and refresh to try again.
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => refetchPostings()}>
                  Retry
                </Button>
              </div>
            ) : filteredPostings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 border-t border-dashed border-border/60 py-16 text-center">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    No job postings match your search
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Adjust your search or check back later.
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Job Title</TableHead>
                    <TableHead className="min-w-[150px]">Company</TableHead>
                    <TableHead className="min-w-[120px]">Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="min-w-[150px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPostings.map((posting) => {
                    const createdAt = posting.createdAt
                      ? format(
                          new Date(posting.createdAt),
                          "MMM d, yyyy"
                        )
                      : "Unknown";
                    const location = `${posting.location.city}, ${posting.location.state}, ${posting.location.country}`;
                    const company = posting.companyId?.employerProfile?.name || "Unknown Company";

                    return (
                      <TableRow
                        key={posting._id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {posting.title}
                            </p>
                            {posting.externalReferenceId && (
                              <p className="text-xs text-muted-foreground">
                                {posting.externalReferenceId}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {company}
                            </p>
                            {posting.department && (
                              <p className="text-xs text-muted-foreground">
                                {posting.department}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              {location}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {posting.workMode}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          {getStatusBadge(posting.publishStatus)}
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
                                navigate(`/jobs/postings/${posting._id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-destructive hover:text-destructive"
                              onClick={() => handleDeletePosting(posting._id)}
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

export default JobPostings;