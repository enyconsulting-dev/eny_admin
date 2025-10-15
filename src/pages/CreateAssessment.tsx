import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Clock3, ListChecks, RefreshCcw, Shuffle, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { appService } from "@/lib/api/service";
import { Skeleton } from "@/components/ui/skeleton";

interface AssessmentPayload {
  title: string;
  description?: string;
  timeLimitSec: number;
  questionOrder?: "fixed" | "random";
  isActive?: boolean;
}

const DEFAULT_TIME_LIMIT_SEC = 3600;

const formatDuration = (totalSeconds: number) => {
  if (!totalSeconds) return "No time limit";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const parts: string[] = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (!hours && !minutes) parts.push("<1m");
  return parts.join(" ");
};

const CreateAssessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<AssessmentPayload>({
    title: "",
    description: "",
    timeLimitSec: DEFAULT_TIME_LIMIT_SEC,
    questionOrder: "fixed",
    isActive: true,
  });

  const [hasLoadedAssessment, setHasLoadedAssessment] = useState(false);

  const {
    data: assessmentData,
    isLoading: isAssessmentLoading,
    isError: isAssessmentError,
    refetch: refetchAssessment,
  } = useQuery({
    queryKey: ["assessments retrieve", id],
    queryFn: () => appService.getAssessmentById(id || ""),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!assessmentData?.data) return;
    const details: any = assessmentData.data;
    setFormData((prev) => ({
      ...prev,
      title: details.title ?? prev.title,
      description: details.description ?? prev.description,
      timeLimitSec: details.timeLimitSec ?? prev.timeLimitSec,
      questionOrder: details.questionOrder === "random" ? "random" : "fixed",
      isActive: typeof details.isActive === "boolean" ? details.isActive : prev.isActive,
    }));
    setHasLoadedAssessment(true);
  }, [assessmentData]);

  const createAssessmentMutation = useMutation({
    mutationFn: appService.createAssessMent,
    onSuccess: (data: any) => {
      toast({
        title: "Assessment created",
        description: `${formData.title} is ready for configuration.`,
      });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      navigate(`/assessments/${data.data._id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Could not create assessment",
        description: error?.message || "Something went wrong while saving.",
        variant: "destructive",
      });
    },
  });

  const updateAssessmentMutation = useMutation({
    mutationFn: ({ id: assessmentId, data }: { id: string; data: AssessmentPayload }) =>
      appService.updateAssessment(assessmentId, data),
    onSuccess: () => {
      toast({
        title: "Assessment updated",
        description: `${formData.title} has been refreshed with the latest changes.`,
      });
      queryClient.invalidateQueries({ queryKey: ["assessments", id] });
      navigate(`/assessments/${id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Could not update assessment",
        description: error?.message || "Something went wrong while saving.",
        variant: "destructive",
      });
    },
  });

  const isSaving = createAssessmentMutation.isPending || updateAssessmentMutation.isPending;

  const handleTimeLimitChange = (hours: number, minutes: number) => {
    const boundedHours = Number.isNaN(hours) ? 0 : Math.max(0, hours);
    const boundedMinutes = Number.isNaN(minutes) ? 0 : Math.min(59, Math.max(0, minutes));
    setFormData((prev) => ({
      ...prev,
      timeLimitSec: boundedHours * 3600 + boundedMinutes * 60,
    }));
  };

  const { hours, minutes } = useMemo(() => {
    const currentHours = Math.floor(formData.timeLimitSec / 3600);
    const currentMinutes = Math.floor((formData.timeLimitSec % 3600) / 60);
    return { hours: currentHours, minutes: currentMinutes };
  }, [formData.timeLimitSec]);

  const descriptionLength = formData.description?.length ?? 0;

  const summaryItems = useMemo(
    () => [
      {
        key: "time-limit",
        label: "Attempt time limit",
        value: formatDuration(formData.timeLimitSec),
        helper:
          formData.timeLimitSec === 0
            ? "Candidates can spend as long as they like."
            : "Runs per attempt and restarts if a candidate leaves early.",
        icon: Clock3,
      },
      {
        key: "order",
        label: "Question flow",
        value: formData.questionOrder === "random" ? "Randomised delivery" : "Sequential delivery",
        helper:
          formData.questionOrder === "random"
            ? "Ideal when you want to minimise collaboration between candidates."
            : "Great for story-driven or section-based assessments.",
        icon: Shuffle,
      },
      {
        key: "status",
        label: "Assessment status",
        value: formData.isActive ? "Active" : "Draft",
        helper: formData.isActive
          ? "Visible to invited candidates once published."
          : "Keep as draft until you’re ready to launch.",
        icon: Sparkles,
      },
    ],
    [formData.isActive, formData.questionOrder, formData.timeLimitSec],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Add a clear assessment title so your team can find it later.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && id) {
      updateAssessmentMutation.mutate({ id, data: formData });
      return;
    }

    createAssessmentMutation.mutate(formData);
  };

  const showSkeleton = isEditing && isAssessmentLoading && !hasLoadedAssessment;

  return (
    <DashboardLayout>
      <div className="w-full space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Button variant="ghost" size="icon" onClick={() => navigate("/assessments")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-xs uppercase tracking-widest">
                Assessment builder
              </Badge>
            </div>
            <div className="space-y-2">
              {showSkeleton ? (
                <>
                  <Skeleton className="h-10 w-72" />
                  <Skeleton className="h-4 w-96" />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    {isEditing ? "Refine assessment details" : "Create a new assessment"}
                  </h1>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {isEditing
                      ? "Adjust the essentials before inviting candidates or opening attempts."
                      : "Start with the basics—title, description, and timing—and tune the details later in the workspace."}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isEditing && (
              <Button variant="outline" className="gap-2" onClick={() => navigate(`/assessments/${id}`)}>
                <ListChecks className="h-4 w-4" />
                View assessment
              </Button>
            )}
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => refetchAssessment()}
              disabled={!isEditing || isAssessmentLoading}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {isAssessmentError && (
          <Card className="border border-destructive/30 bg-destructive/10 text-destructive">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg">Unable to load this assessment</CardTitle>
              <CardDescription className="text-sm text-destructive/80">
                The details couldn&apos;t be fetched. Try refreshing or return to the assessments list.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button variant="destructive" onClick={() => refetchAssessment()}>
                Try again
              </Button>
              <Button variant="ghost" className="text-destructive" onClick={() => navigate("/assessments")}>
                Go back
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-semibold text-foreground">General details</CardTitle>
              <CardDescription>
                These details help your teammates recognise the assessment and understand its purpose.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title">Assessment title *</Label>
                    <span className="text-xs font-medium uppercase text-muted-foreground">Visible to admins only</span>
                  </div>
                  <Input
                    id="title"
                    placeholder="e.g. Full-stack Fundamentals"
                    value={formData.title}
                    onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                    required
                    disabled={isSaving || showSkeleton}
                  />
                  <p className="text-xs text-muted-foreground">
                    Keep things concise and descriptive so the right reviewers pick it up quickly.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Short description</Label>
                    <span className="text-xs text-muted-foreground">{descriptionLength}/250</span>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Explain who this assessment is for and what success looks like."
                    value={formData.description}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, description: event.target.value.slice(0, 250) }))
                    }
                    rows={4}
                    disabled={isSaving || showSkeleton}
                  />
                  <p className="text-xs text-muted-foreground">
                    This appears in the workspace and candidate invite messages. Use it to set expectations.
                  </p>
                </div>

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="hours">Time limit</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="hours" className="text-xs uppercase text-muted-foreground">
                            Hours
                          </Label>
                          <Input
                            id="hours"
                            type="number"
                            min={0}
                            value={hours}
                            onChange={(event) =>
                              handleTimeLimitChange(Number.parseInt(event.target.value, 10) || 0, minutes)
                            }
                            disabled={isSaving || showSkeleton}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="minutes" className="text-xs uppercase text-muted-foreground">
                            Minutes
                          </Label>
                          <Input
                            id="minutes"
                            type="number"
                            min={0}
                            max={59}
                            value={minutes}
                            onChange={(event) =>
                              handleTimeLimitChange(hours, Number.parseInt(event.target.value, 10) || 0)
                            }
                            disabled={isSaving || showSkeleton}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="rounded-md border border-dashed border-border/70 bg-muted/20 p-3 text-xs text-muted-foreground">
                      Consider how long a fully prepared candidate should need. Add extra time if you’re including coding
                      challenges or uploads.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="questionOrder">Question order</Label>
                    <Select
                      value={formData.questionOrder}
                      onValueChange={(value: "fixed" | "random") =>
                        setFormData((prev) => ({ ...prev, questionOrder: value }))
                      }
                      disabled={isSaving || showSkeleton}
                    >
                      <SelectTrigger id="questionOrder">
                        <SelectValue placeholder="Select order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">
                          <div className="space-y-1">
                            <p className="font-medium">Fixed order</p>
                            <p className="text-xs text-muted-foreground">
                              Questions appear in the same sequence for every candidate.
                            </p>
                          </div>
                        </SelectItem>
                        <SelectItem value="random">
                          <div className="space-y-1">
                            <p className="font-medium">Random order</p>
                            <p className="text-xs text-muted-foreground">
                              Each candidate gets a unique order. Great for knowledge checks.
                            </p>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-start gap-3 rounded-md border border-border/70 bg-muted/20 p-3 text-xs text-muted-foreground">
                      <Shuffle className="mt-0.5 h-3.5 w-3.5 text-primary" />
                      <span>
                        You can still group questions into sections later using the assessment workspace.
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="isActive">Assessment visibility</Label>
                    <p className="text-xs text-muted-foreground">
                      When toggled on, invited candidates will be able to start new attempts.
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                    disabled={isSaving || showSkeleton}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/assessments")}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="gap-2" disabled={isSaving || showSkeleton}>
                    <Sparkles className="h-4 w-4" />
                    {isSaving
                      ? isEditing
                        ? "Saving changes..."
                        : "Creating assessment..."
                      : isEditing
                      ? "Save changes"
                      : "Create assessment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-border/60 bg-muted/20 shadow-sm dark:bg-muted/10">
              <CardHeader>
                <CardTitle className="text-base">Review summary</CardTitle>
                <CardDescription className="text-xs">
                  A quick snapshot of how this assessment will behave once you publish it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {summaryItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.key}
                      className="rounded-lg border border-border/60 bg-background/70 p-3 dark:bg-background/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-xs font-medium uppercase text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-semibold text-foreground">{item.value}</p>
                          <p className="text-xs text-muted-foreground">{item.helper}</p>
                        </div>
                        <span className="rounded-full bg-primary/10 p-2 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border border-dashed border-border/60 bg-muted/10 shadow-none dark:bg-muted/5">
              <CardHeader>
                <CardTitle className="text-base">Next steps</CardTitle>
                <CardDescription className="text-xs">
                  After saving, head to the assessment workspace to continue building.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <ListChecks className="mt-0.5 h-4 w-4 text-primary" />
                  <p>Add questions or sections to shape the candidate journey.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                  <p>Set scoring rules, invitations, and automated reminders.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                  <p>Preview timing from a candidate perspective before launching.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateAssessment;
