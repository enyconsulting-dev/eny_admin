import { Fragment, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
  ExternalHyperlink,
} from "docx";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Loader2,
  Monitor,
  SearchX,
  Smartphone,
  Sparkles,
  User,
  XCircle,
  Activity,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { appService } from "@/lib/api/service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Answer {
  questionId: {
    type: string;
    prompt: string;
    weight: number;
  };
  value: unknown;
  answeredAt: string;
  isAnswerCorrect?: boolean;
  scoreAwarded?: number;
}

interface AttemptDetail {
  _id: string;
  assessmentId: {
    _id: string;
    title: string;
    description: string;
    timeLimitSec: number;
  };
  userId: {
    firstName: string;
    lastName: string;
    phone: string;
    emailAddress: string;
    mobileNumber: string;
    createdAt: string;
    updatedAt: string;
  };
  status: string;
  state: {
    isStarted: boolean;
    isExpired: boolean;
    isCompleted: boolean;
    isAbandoned: boolean;
    isClosed: boolean;
  };
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
  lastHeartbeatAt: string;
  leaseExpiresAt?: string;
  lockId?: string;
  serverDeadline: string;
  startedAt?: string;
  endedAt?: string;
  totals: {
    score: number;
    correct: number;
    totalQuestions: number;
  };
}

interface EventTracking {
  _id: string;
  attemptId: string;
  assessmentId: string;
  ts: string;
  type: string;
  data: unknown;
  userAgent: string;
}

interface EventsResponse {
  results: EventTracking[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
}

const AttemptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [eventsPage, setEventsPage] = useState(1);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const {
    data: attemptData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["attempt", id],
    queryFn: () => appService.getAttemptById(id!),
    enabled: !!id,
  });

  const {
    data: eventsData,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useQuery({
    queryKey: ["attempt-events", id, eventsPage],
    queryFn: () => appService.getAttemptEvents(id!, eventsPage, 10),
    enabled: !!id,
  });

  const attempt: AttemptDetail | undefined = attemptData?.data;
  const events: EventsResponse | undefined = eventsData?.data;

  useEffect(() => {
    setExpandedEventId(null);
  }, [eventsPage, id]);

  const toggleEventRow = (eventId: string) => {
    setExpandedEventId((previous) => (previous === eventId ? null : eventId));
  };

  const generateDocxContent = () => {
    if (!attempt) return [];

    const content = [];

    // Title
    content.push(
      new Paragraph({
        text: "Assessment Attempt Report",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      })
    );

    // Add blank paragraph after title
    content.push(new Paragraph({ text: "" }));

    // Assessment Info
    content.push(
      new Paragraph({
        text: `Assessment: ${attempt.assessmentId.title}`,
      })
    );

    content.push(
      new Paragraph({
        text: `Description: ${attempt.assessmentId.description}`,
      })
    );

    // Add blank paragraph
    content.push(new Paragraph({ text: "" }));

    // Candidate Info
    content.push(
      new Paragraph({
        text: "Candidate Information",
        heading: HeadingLevel.HEADING_2,
      })
    );

    content.push(
      new Paragraph({
        text: `Name: ${attempt.userId.firstName} ${attempt.userId.lastName}`,
      })
    );

    content.push(
      new Paragraph({
        text: `Email: ${attempt.userId.emailAddress}`,
      })
    );

    // Add blank paragraph
    content.push(new Paragraph({ text: "" }));

    // Attempt Info
    content.push(
      new Paragraph({
        text: "Attempt Information",
        heading: HeadingLevel.HEADING_2,
      })
    );

    content.push(
      new Paragraph({
        text: `Status: ${attempt.status}`,
      })
    );

    content.push(
      new Paragraph({
        text: `Started: ${attempt.startedAt ? format(new Date(attempt.startedAt), "PPP p") : "Not started"}`,
      })
    );

    content.push(
      new Paragraph({
        text: `Completed: ${attempt.endedAt ? format(new Date(attempt.endedAt), "PPP p") : "Not completed"}`,
      })
    );

    if (attempt.totals) {
      content.push(
        new Paragraph({
          text: `Score: ${attempt.totals.score} points (${attempt.totals.correct}/${attempt.totals.totalQuestions} correct)`,
        })
      );
    }

    // Add blank paragraph
    content.push(new Paragraph({ text: "" }));

    // Answers Section - Bold and Underlined
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Answers",
            bold: true,
            underline: {},
          }),
        ],
      })
    );

    // Add blank paragraph
    content.push(new Paragraph({ text: "" }));

    attempt.answers.forEach((answer, index) => {
      // Question prompt - Handle newlines without bold
      const questionLines = answer.questionId.prompt.split('\n');
      const questionChildren = questionLines.flatMap((line, i) => {
        const textRun = new TextRun({
          text: line,
        });
        if (i < questionLines.length - 1) {
          return [textRun, new TextRun({ text: "", break: 1 })];
        }
        return [textRun];
      });

      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Question ${index + 1}: `,
            }),
            ...questionChildren,
          ],
        })
      );

      content.push(new Paragraph({ text: "" }));

      content.push(
        new Paragraph({
          text: `Type: ${answer.questionId.type}`,
        })
      );

      content.push(
        new Paragraph({
          text: `Weight: ${answer.questionId.weight}`,
        })
      );

      content.push(new Paragraph({ text: "" }));

      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Candidate Response",
              bold: true,
              underline: {},
            }),
          ],
        })
      );

      content.push(
        new Paragraph({
          text: `${format(new Date(answer.answeredAt), "PPP p")}`,
        })
      );

      if (answer.isAnswerCorrect !== undefined) {
        content.push(
          new Paragraph({
            text: `Correct: ${answer.isAnswerCorrect ? "Yes" : "No"}`,
          })
        );
      }

      if (answer.scoreAwarded !== undefined) {
        content.push(
          new Paragraph({
            text: `Score Awarded: ${answer.scoreAwarded}`,
          })
        );
      }

      // Handle different answer types
      if (answer.value === null || answer.value === undefined) {
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Answer: No answer",
                bold: true,
              }),
            ],
          })
        );
      } else if (typeof answer.value === "string") {
        // Handle string answers with newlines
        const answerLines = String(answer.value).split('\n');
        const answerChildren = answerLines.flatMap((line, i) => {
          const textRun = new TextRun({
            text: line,
            bold: true,
          });
          if (i < answerLines.length - 1) {
            return [textRun, new TextRun({ text: "", break: 1 })];
          }
          return [textRun];
        });

        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Answer: ",
                bold: true,
              }),
            ],
          })
        );

        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "",
                bold: true,
              }),
              ...answerChildren,
            ],
          })
        );
      } else if (typeof answer.value === "number" || typeof answer.value === "boolean") {
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Answer:`,
                bold: true,
              }),
            ],
          })
        );

        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${String(answer.value)}`,
                bold: true,
              }),
            ],
          })
        );
      } else if (Array.isArray(answer.value)) {
        let answerText = "";
        if (answer.value.every(item => typeof item === "object" && item !== null && "key" in item && "text" in item)) {
          answerText = answer.value.map(item => `${item.key}: ${item.text}`).join(", ");
        } else {
          answerText = JSON.stringify(answer.value, null, 2);
        }
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Answer:`,
                bold: true,
              }),
            ],
          })
        );
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${answerText}`,
                bold: true,
              }),
            ],
          })
        );
      } else if (typeof answer.value === "object") {
        const obj = answer.value as Record<string, unknown>;
        const videoUrl = typeof obj["video_url"] === "string" ? (obj["video_url"] as string) : undefined;

        if (videoUrl && answer.questionId.type === "Video") {
          const src = /^(https?:)?\/\//i.test(videoUrl) ? videoUrl : `https://${videoUrl}`;

          // Create clickable link for video
          content.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Answer: Video Response - ",
                  bold: true,
                }),
                new ExternalHyperlink({
                  children: [
                    new TextRun({
                      text: src,
                      style: "Hyperlink",
                      underline: {},
                      color: "0000FF",
                      bold: true,
                    }),
                  ],
                  link: src,
                }),
              ],
            })
          );
        } else if ("key" in obj && "text" in obj) {
          content.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Answer:`,
                  bold: true,
                }),
              ],
            })
          );

          content.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${obj.key}: ${obj.text}`,
                  bold: true,
                }),
              ],
            })
          );
        } else {
          content.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Answer`,
                  bold: true,
                }),
              ],
            })
          );

          content.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${JSON.stringify(answer.value, null, 2)}`,
                  bold: true,
                }),
              ],
            })
          );
        }
      } else {
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Answer:`,
                bold: true,
              }),
            ],
          })
        );

        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${String(answer.value)}`,
                bold: true,
              }),
            ],
          })
        );
      }

      // Add spacing between questions
      content.push(new Paragraph({ text: "" }));
    });

    return content;
  };

  const downloadDocx = async () => {
    if (!attempt) return;

    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: generateDocxContent(),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attempt-${attempt.userId.firstName}-${attempt.userId.lastName}-${attempt._id}-answers.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating DOCX:", error);
      // You could add a toast notification here
    }
  };

  const isHydrated = Boolean(attempt);
  const showSkeleton = isLoading && !isHydrated;
  const showNotFound = !isLoading && !isError && !attempt;

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "expired":
        return "destructive";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const statusCopy = useMemo<Record<string, string>>(
    () => ({
      active: "Candidate is in progress or ready to resume.",
      completed: "Candidate completed the attempt successfully.",
      expired: "Time limit elapsed before the attempt was submitted.",
      abandoned: "Candidate exited before completion.",
      closed: "Attempt was closed by an administrator.",
    }),
    []
  );
  const statusKey = attempt?.status?.toLowerCase?.() ?? "unknown";

  const summaryCards = useMemo(
    () =>
      attempt
        ? [
          {
            key: "status",
            label: "Current status",
            value: attempt.status,
            description:
              statusCopy[statusKey] ?? "Attempt status is being tracked.",
            icon: Sparkles,
          },
          {
            key: "created",
            label: "Created at",
            value: format(new Date(attempt.createdAt), "MMM d, yyyy h:mm a"),
            description: "When this attempt record was created.",
            icon: CalendarClock,
          },
          {
            key: "progress",
            label: "Progress",
            value: attempt.startedAt
              ? attempt.endedAt
                ? "Completed"
                : "In progress"
              : "Not started",
            description: attempt.startedAt
              ? attempt.endedAt
                ? "Candidate submitted their attempt."
                : "Candidate has started but not ended the attempt."
              : "Waiting for the candidate to begin.",
            icon: Loader2,
          },
        ]
        : [],
    [attempt, statusKey, statusCopy]
  );

  const eventStats = useMemo(() => {
    if (!events?.results || events.results.length === 0) {
      return null;
    }

    const typeCounts = events.results.reduce<Record<string, number>>(
      (acc, current) => {
        acc[current.type] = (acc[current.type] ?? 0) + 1;
        return acc;
      },
      {}
    );
    const sortedByTs = [...events.results].sort(
      (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime()
    );
    const firstEvent = sortedByTs[0];
    const latestEvent = sortedByTs[sortedByTs.length - 1];
    const topTypeEntry = Object.entries(typeCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      uniqueTypes: Object.keys(typeCounts).length,
      mostFrequentType: topTypeEntry?.[0],
      mostFrequentCount: topTypeEntry?.[1],
      totalItems: events.pagination?.totalItems ?? events.results.length,
      firstRelative: firstEvent?.ts
        ? formatDistanceToNow(new Date(firstEvent.ts), { addSuffix: true })
        : null,
      lastRelative: latestEvent?.ts
        ? formatDistanceToNow(new Date(latestEvent.ts), { addSuffix: true })
        : null,
    };
  }, [events?.results, events?.pagination]);

  const getStateIcon = (state: boolean) => {
    return state ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const TimelineItem = ({
    label,
    value,
  }: {
    label: string;
    value?: string;
  }) => (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground">
        {value ? format(new Date(value), "PPP p") : "—"}
      </p>
    </div>
  );

  const renderValue = (value: unknown): ReactNode => {
    if (value === null || value === undefined) {
      return "No answer";
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return "Empty array";
      }

      // Check if it's an array of objects with key/text structure
      if (
        value.every(
          (item): item is { key: string; text: string } =>
            typeof item === "object" &&
            item !== null &&
            "key" in item &&
            "text" in item &&
            typeof (item as { key?: unknown }).key === "string" &&
            typeof (item as { text?: unknown }).text === "string"
        )
      ) {
        return value.map((item) => `${item.key}: ${item.text}`).join(", ");
      }

      // Otherwise, stringify the array
      return JSON.stringify(value, null, 2);
    }

    if (typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const fileType = typeof obj["file_type"] === "string" ? (obj["file_type"] as string) : undefined;
      const videoUrl = typeof obj["video_url"] === "string" ? (obj["video_url"] as string) : undefined;
      const key = typeof obj["key"] === "string" ? (obj["key"] as string) : undefined;
      const text = typeof obj["text"] === "string" ? (obj["text"] as string) : undefined;

      // Special handling for recorded video answers
      if (fileType && videoUrl) {
        const src = /^(https?:)?\/\//i.test(videoUrl) ? videoUrl : `https://${videoUrl}`;
        return (
          <div className="flex flex-col gap-2">
            <video
              className="max-w-full rounded-md border border-border/60 bg-black/80"
              preload="metadata"
              onClick={(e) => {
                const v = e.currentTarget;
                if (v.paused) v.play(); else v.pause();
              }}
            >
              <source src={src} type={fileType} />
              Your browser does not support the video tag.
            </video>
            <span className="text-xs text-muted-foreground">Click video to play/pause</span>
          </div>
        );
      }

      if (key && text) {
        return (
          <div>
            <strong>{key}:</strong> {text}
          </div>
        )
      }

      // Fallback: pretty-print any other object
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  const getEventSummary = (event: EventTracking): string => {
    const payload = event.data;

    if (!payload) {
      return "No payload captured";
    }

    if (typeof payload === "string") {
      return payload.length > 80 ? `${payload.slice(0, 77)}…` : payload;
    }

    if (Array.isArray(payload)) {
      return `Array payload (${payload.length} item${payload.length === 1 ? "" : "s"
        })`;
    }

    if (typeof payload === "object" && payload !== null) {
      const recordPayload = payload as Record<string, unknown>;
      const importantKey = [
        "status",
        "action",
        "event",
        "message",
        "questionId",
        "step",
      ].find((key) => key in recordPayload);

      if (importantKey) {
        const value = recordPayload[importantKey];
        if (typeof value === "string") {
          return `${importantKey}: ${value.length > 60 ? `${value.slice(0, 57)}…` : value
            }`;
        }
        if (typeof value === "number" || typeof value === "boolean") {
          return `${importantKey}: ${String(value)}`;
        }
      }

      const keys = Object.keys(recordPayload);
      if (keys.length === 0) {
        return "Empty object payload";
      }

      return keys
        .slice(0, 3)
        .map((key) => {
          const value = recordPayload[key];
          if (value === null || value === undefined) {
            return `${key}: —`;
          }
          if (typeof value === "string") {
            return `${key}: ${value.length > 20 ? `${value.slice(0, 17)}…` : value
              }`;
          }
          if (typeof value === "number" || typeof value === "boolean") {
            return `${key}: ${String(value)}`;
          }
          return `${key}: ${Array.isArray(value) ? "array" : "object"}`;
        })
        .join(", ");
    }

    return "Unsupported payload type";
  };

  const getUserAgentMeta = (userAgent?: string) => {
    const normalized = userAgent?.toLowerCase?.() ?? "";
    let deviceLabel: "Desktop" | "Mobile" | "Tablet" | "Automated" | "Unknown" =
      "Unknown";
    let icon: "desktop" | "mobile" | "bot" = "desktop";

    if (!normalized) {
      deviceLabel = "Unknown";
      icon = "bot";
    } else if (/(bot|crawl|spider)/.test(normalized)) {
      deviceLabel = "Automated";
      icon = "bot";
    } else if (/(iphone|android|mobile)/.test(normalized)) {
      deviceLabel = "Mobile";
      icon = "mobile";
    } else if (/(ipad|tablet)/.test(normalized)) {
      deviceLabel = "Tablet";
      icon = "mobile";
    } else {
      deviceLabel = "Desktop";
      icon = "desktop";
    }

    let osLabel = "Unknown OS";
    if (normalized.includes("windows")) {
      osLabel = "Windows";
    } else if (
      normalized.includes("mac os") ||
      normalized.includes("macintosh")
    ) {
      osLabel = "macOS";
    } else if (normalized.includes("android")) {
      osLabel = "Android";
    } else if (normalized.includes("iphone") || normalized.includes("ios")) {
      osLabel = "iOS";
    } else if (normalized.includes("ipad")) {
      osLabel = "iPadOS";
    } else if (normalized.includes("linux")) {
      osLabel = "Linux";
    }

    const accentClass =
      icon === "mobile"
        ? "bg-emerald-500/10 text-emerald-500"
        : icon === "bot"
          ? "bg-amber-500/10 text-amber-500"
          : "bg-primary/10 text-primary";

    return {
      deviceLabel,
      osLabel,
      icon,
      accentClass,
      raw: userAgent ?? "—",
    };
  };

  const toggleQuestionExpansion = (index: number) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center py-24">
          <Card className="w-full max-w-xl border border-destructive/30 bg-destructive/10 text-destructive shadow-xl animate-in fade-in-50 zoom-in-95">
            <CardHeader className="items-center space-y-4 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
                <AlertCircle className="h-6 w-6" />
              </span>
              <CardTitle className="text-2xl">
                We couldn&apos;t load this attempt
              </CardTitle>
              <p className="text-sm text-destructive/80">
                Please check the link and try refreshing the page.
              </p>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="destructive" onClick={() => refetch()}>
                Retry loading
              </Button>
              <Button
                variant="ghost"
                className="text-destructive"
                onClick={() => navigate("/assessments/attempts")}
              >
                Back to attempts
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (showNotFound) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center py-24">
          <Card className="w-full max-w-xl border border-border/60 bg-muted/30 shadow-lg animate-in fade-in-50 slide-in-from-bottom-8">
            <CardHeader className="items-center space-y-4 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SearchX className="h-6 w-6" />
              </span>
              <CardTitle className="text-2xl">Attempt not found</CardTitle>
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t find an attempt that matches this link. It may
                have been removed or never existed.
              </p>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/assessments/attempts")}
              >
                View attempts
              </Button>
              <Button onClick={() => navigate("/assessments")}>
                Go to assessments
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (showSkeleton) {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-6 animate-in fade-in-50">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-40 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card
                key={`summary-skeleton-${idx}`}
                className="overflow-hidden border border-border/60 bg-muted/20 dark:bg-muted/10"
              >
                <div className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-[shimmer_2s_linear_infinite]" />
                <CardContent className="space-y-3 p-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card
                key={`info-skeleton-${idx}`}
                className="border border-border/60 bg-muted/20 dark:bg-muted/10"
              >
                <CardContent className="space-y-3 p-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border border-border/60 bg-muted/20 dark:bg-muted/10">
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!attempt) {
    return null;
  }

  const cardsToRender = attempt ? summaryCards : [];

  return (
    <DashboardLayout>
      <div className="relative">
        <div className="relative space-y-8 p-6 animate-in fade-in-50">
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-primary/5 to-background p-6 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  Attempt insights
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                    Attempt details
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Attempt ID:{" "}
                    <span className="font-mono text-foreground/80">
                      {attempt._id}
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit gap-2 rounded-full border-primary/30 bg-background/70 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10"
                    onClick={() => navigate("/assessments/attempts")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to attempts
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2 rounded-full"
                    onClick={downloadDocx}
                    disabled={!attempt}
                  >
                    <Download className="h-4 w-4" />
                    Download Answers (DOCX)
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-end">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={getStatusBadgeVariant(attempt.status)}
                    className="rounded-full border border-primary/30 px-3 py-1 text-xs uppercase tracking-widest"
                  >
                    {attempt.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 text-xs uppercase tracking-widest"
                  >
                    {attempt.state.isStarted ? "Started" : "Not started"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground/80 sm:text-right">
                  Stay close to the candidate journey with live signals.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {cardsToRender.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.key}
                  className="group relative overflow-hidden border border-border/50 bg-background/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg dark:bg-muted/20"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute -top-12 right-0 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
                  </div>
                  <CardContent className="relative flex items-start justify-between gap-4 p-5">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
                        {card.label}
                      </p>
                      <p className="text-xl font-semibold text-foreground">
                        {card.value}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="h-5 w-5" />
                    </span>
                  </CardContent>
                </Card>
              );
            })}

            {attempt.totals && (
              <>
                <Card className="group relative overflow-hidden border border-border/50 bg-background/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg dark:bg-muted/20">
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute -top-12 right-0 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl" />
                  </div>
                  <CardContent className="relative flex items-start justify-between gap-4 p-5">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
                        Overall Score
                      </p>
                      <p className="text-xl font-semibold text-foreground">
                        {attempt.totals.score} points
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {attempt.totals.correct} correct out of{" "}
                        {attempt.totals.totalQuestions} questions
                        {attempt.totals.totalQuestions > 0 && (
                          <>
                            {" "}
                            (
                            {Math.round(
                              (attempt.totals.correct ||
                                0 / attempt.totals.totalQuestions ||
                                0) * 10
                            )}
                            % correct )
                          </>
                        )}
                      </p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-emerald-500/10 text-emerald-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border border-border/60 bg-card shadow-sm dark:bg-muted/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Assessment
                </CardTitle>
                <Badge
                  variant="outline"
                  className="font-mono text-xs text-muted-foreground"
                >
                  {attempt.assessmentId._id.slice(0, 8)}...
                  {attempt.assessmentId._id.slice(-4)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Title
                  </p>
                  <p className="text-sm text-foreground">
                    {attempt.assessmentId.title}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Description
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {attempt.assessmentId.description ||
                      "No description provided."}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Time limit
                  </p>
                  <p className="flex items-center gap-2 text-sm text-foreground">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    {attempt.assessmentId.timeLimitSec} seconds
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 bg-card shadow-sm dark:bg-muted/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Candidate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Name
                  </p>
                  <p className="text-sm text-foreground">
                    {attempt.userId.firstName} {attempt.userId.lastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {attempt.userId.emailAddress}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {attempt.userId.mobileNumber || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Joined
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(attempt.userId.createdAt), "PPP p")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 bg-card shadow-sm dark:bg-muted/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Status & state</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(attempt.status)}>
                      {attempt.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {statusCopy[statusKey] ??
                        "Status information is unavailable."}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    State flags
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    {Object.entries(attempt.state).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-1 rounded-full border border-border/70 bg-muted/30 px-3 py-1 capitalize dark:bg-muted/20"
                      >
                        {getStateIcon(value)}
                        {key.replace(/([A-Z])/g, " $1")}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border/60 bg-card shadow-sm dark:bg-muted/10">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <TimelineItem label="Created" value={attempt.createdAt} />
                <TimelineItem label="Started" value={attempt.startedAt} />
                <TimelineItem label="Ended" value={attempt.endedAt} />
                <TimelineItem
                  label="Last heartbeat"
                  value={attempt.lastHeartbeatAt}
                />
                <TimelineItem
                  label="Server deadline"
                  value={attempt.serverDeadline}
                />
                <TimelineItem
                  label="Lease expires"
                  value={attempt.leaseExpiresAt}
                />
                <TimelineItem label="Updated" value={attempt.updatedAt} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card shadow-sm dark:bg-muted/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Answers ({attempt.answers.length})</CardTitle>
              <span className="text-xs text-muted-foreground">
                {attempt.answers.length > 0
                  ? "Review each response and its submission timestamp."
                  : "No answers have been submitted yet."}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              {attempt.answers.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                  No answers submitted yet.
                </div>
              ) : (
                attempt.answers.map((answer, index) => (
                  <Card
                    key={`${answer.questionId.prompt}-${index}`}
                    className={cn(
                      "border bg-background/70 shadow-sm transition-transform duration-200 hover:-translate-y-1 dark:bg-muted/10",
                      answer.isAnswerCorrect
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-border/60"
                    )}
                  >
                    <CardContent className="space-y-4 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className="rounded-full px-3 py-1 text-xs"
                          >
                            Question {index + 1}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(answer.answeredAt), "PPP p")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Weight {answer.questionId.weight}
                          </Badge>
                          {answer.isAnswerCorrect !== undefined && (
                            <Badge
                              variant={
                                answer.isAnswerCorrect
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {answer.isAnswerCorrect ? "Correct" : "Incorrect"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {(() => {
                          const questionText = answer.questionId.prompt.trim();
                          const isExpanded = expandedQuestions.has(index);
                          const maxLength = 200;
                          const shouldTruncate = questionText.length > maxLength;
                          const displayText = shouldTruncate && !isExpanded
                            ? questionText.slice(0, maxLength) + "..."
                            : questionText;

                          return (
                            <>
                              <p className="whitespace-pre-line leading-relaxed text-foreground">
                                {displayText}
                              </p>
                              {shouldTruncate && (
                                <button
                                  onClick={() => toggleQuestionExpansion(index)}
                                  className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                                >
                                  {isExpanded ? "Read less" : "Read more"}
                                </button>
                              )}
                            </>
                          );
                        })()}
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          <span className="uppercase tracking-widest">
                            Type: {answer.questionId.type}
                          </span>
                          {answer.scoreAwarded !== undefined && (
                            <span className="uppercase tracking-widest">
                              Score: {answer.scoreAwarded}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase text-muted-foreground">
                          Answer
                        </p>
                        <div className="rounded-md border border-border/70 bg-muted/20 p-3 font-mono text-sm text-foreground whitespace-pre-wrap dark:bg-muted/10">
                          {renderValue(answer.value)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border border-border/60 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-muted/10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/30 via-transparent to-primary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Event tracking ({events?.pagination?.totalItems || 0})
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {events?.results?.length
                  ? "Monitor candidate activity and system events."
                  : "No events recorded yet."}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={`event-skeleton-${idx}`}
                      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 p-3"
                    >
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              ) : eventsError ? (
                <div className="flex items-center justify-between gap-4 border-t border-border/60 px-6 py-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">
                        We couldn't load events.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Check your connection and refresh to try again.
                      </p>
                    </div>
                  </div>
                </div>
              ) : events?.results?.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                  No events recorded yet.
                </div>
              ) : (
                <>
                  {eventStats && (
                    <div className="grid gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground/80 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Sparkles className="h-4 w-4" />
                        </span>
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                            Unique types
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {eventStats.uniqueTypes}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                          <Activity className="h-4 w-4" />
                        </span>
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                            Most frequent
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {eventStats.mostFrequentType ?? "—"} ·{" "}
                            {eventStats.mostFrequentCount ?? 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                          <Clock className="h-4 w-4" />
                        </span>
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                            Latest event
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {eventStats.lastRelative ?? "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                          <CalendarClock className="h-4 w-4" />
                        </span>
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                            First event
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {eventStats.firstRelative ?? "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <TooltipProvider delayDuration={120}>
                    <div className="max-h-[26rem] overflow-x-hidden no-scrollbar rounded-2xl border border-border/60">
                      <Table className="relative">
                        <div className="relative">
                          {/* <div className="fixed right-5 overflow-hidden rounded-2xl left-5"> */}
                          <TableHeader className="">
                            <TableRow className="bg-muted/40">
                              <TableHead className="min-w-[160px]">
                                Timestamp
                              </TableHead>
                              <TableHead className="min-w-[130px]">
                                Type
                              </TableHead>
                              <TableHead className="min-w-[220px]">
                                Summary
                              </TableHead>
                              <TableHead className="min-w-[500px]">
                                Client
                              </TableHead>
                              <TableHead className="w-12 text-right">
                                Details
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          {/* </div> */}

                          {/* <div className="max-h-[26rem] overflow-y-scroll border border-border/60"> */}
                        </div>

                        <div className="mt-1">
                          <TableBody className="w-full">
                            {events?.results?.map((event) => {
                              const isExpanded = expandedEventId === event._id;
                              const summary = getEventSummary(event);
                              const relativeTs = formatDistanceToNow(
                                new Date(event.ts),
                                { addSuffix: true }
                              );
                              const meta = getUserAgentMeta(event.userAgent);
                              const DeviceIcon =
                                meta.icon === "mobile"
                                  ? Smartphone
                                  : meta.icon === "bot"
                                    ? Bot
                                    : Monitor;
                              return (
                                <Fragment key={event._id}>
                                  <TableRow
                                    onClick={() => toggleEventRow(event._id)}
                                    className={cn(
                                      "group cursor-pointer border-l-2 border-transparent transition-all duration-300",
                                      isExpanded
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "hover:border-primary/40 hover:bg-muted/40"
                                    )}
                                  >
                                    <TableCell className="align-top">
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium text-foreground">
                                          {format(
                                            new Date(event.ts),
                                            "MMM d, yyyy h:mm:ss a"
                                          )}
                                        </p>
                                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Clock className="h-3 w-3" />
                                          {relativeTs}
                                        </p>
                                      </div>
                                    </TableCell>
                                    <TableCell className="align-top">
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "rounded-full border border-border/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest",
                                          isExpanded
                                            ? "border-primary/50 text-primary"
                                            : "text-muted-foreground"
                                        )}
                                      >
                                        {event.type}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="align-top">
                                      <div className="space-y-1 text-sm text-foreground">
                                        <p>{summary}</p>
                                        <p className="text-xs text-muted-foreground">
                                          Tap to{" "}
                                          {isExpanded ? "collapse" : "expand"}{" "}
                                          full payload.
                                        </p>
                                      </div>
                                    </TableCell>
                                    <TableCell className="align-top">
                                      <div className="space-y-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2 text-foreground">
                                          <span
                                            className={cn(
                                              "flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-muted/40",
                                              meta.accentClass
                                            )}
                                          >
                                            <DeviceIcon className="h-4 w-4" />
                                          </span>
                                          <div>
                                            <p className="text-sm font-medium text-foreground">
                                              {meta.deviceLabel}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {meta.osLabel}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="break-words text-xs text-muted-foreground/80">
                                          {meta.raw}
                                        </p>
                                      </div>
                                    </TableCell>
                                    <TableCell className="align-top text-right">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-expanded={isExpanded}
                                        aria-label={
                                          isExpanded
                                            ? "Collapse event details"
                                            : "Expand event details"
                                        }
                                        onClick={(buttonEvent) => {
                                          buttonEvent.stopPropagation();
                                          toggleEventRow(event._id);
                                        }}
                                        className="rounded-full transition-transform duration-300 hover:bg-primary/10"
                                      >
                                        {isExpanded ? (
                                          <ChevronUp className="h-4 w-4" />
                                        ) : (
                                          <ChevronDown className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                  {isExpanded && (
                                    <TableRow className="bg-muted/30">
                                      <TableCell colSpan={5}>
                                        <div className="grid gap-6 md:grid-cols-2">
                                          <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                              Event payload
                                            </p>
                                            <ScrollArea className="max-h-48 rounded-2xl border border-border/60 bg-background/90">
                                              <pre className="whitespace-pre-wrap break-words p-4 text-xs font-mono leading-relaxed text-foreground">
                                                {JSON.stringify(
                                                  event.data,
                                                  null,
                                                  2
                                                )}
                                              </pre>
                                            </ScrollArea>
                                          </div>
                                          <div className="space-y-4">
                                            <div className="space-y-2">
                                              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                                Identifiers
                                              </p>
                                              <div className="grid gap-2 text-xs text-muted-foreground">
                                                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-3 py-2 font-mono text-[11px] text-foreground">
                                                  <span>Attempt</span>
                                                  <span className="truncate">
                                                    {event.attemptId}
                                                  </span>
                                                </div>
                                                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-3 py-2 font-mono text-[11px] text-foreground">
                                                  <span>Assessment</span>
                                                  <span className="truncate">
                                                    {event.assessmentId}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="space-y-2">
                                              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                                Client fingerprint
                                              </p>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <div className="cursor-help rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground transition hover:bg-muted/30">
                                                    Hover to view full user
                                                    agent
                                                  </div>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-sm whitespace-pre-wrap break-words text-xs leading-relaxed">
                                                  {meta.raw}
                                                </TooltipContent>
                                              </Tooltip>
                                            </div>
                                          </div>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </Fragment>
                              );
                            })}
                          </TableBody>
                        </div>

                        {/* </div> */}
                      </Table>
                    </div>
                  </TooltipProvider>
                  {events?.pagination && events.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Page {events.pagination.currentPage} of{" "}
                        {events.pagination.totalPages} (
                        {events.pagination.totalItems} total events)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEventsPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={eventsPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEventsPage((prev) =>
                              Math.min(events.pagination.totalPages, prev + 1)
                            )
                          }
                          disabled={eventsPage === events.pagination.totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {(attempt.lockId || attempt.leaseExpiresAt) && (
            <Card className="border border-border/60 bg-card shadow-sm dark:bg-muted/10">
              <CardHeader>
                <CardTitle>Technical details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {attempt.lockId && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Lock ID
                      </p>
                      <p className="rounded-md border border-border/70 bg-muted/20 p-2 font-mono text-xs text-muted-foreground dark:bg-muted/10">
                        {attempt.lockId.slice(0, 50)}...
                        {attempt.lockId.slice(-8)}
                      </p>
                    </div>
                  )}
                  {attempt.leaseExpiresAt && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Lease expires
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(attempt.leaseExpiresAt), "PPP p")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttemptDetail;
