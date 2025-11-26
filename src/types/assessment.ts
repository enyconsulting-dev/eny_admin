import {
  AlignLeft,
  CheckSquare,
  Code2,
  Filter,
  ListChecks,
  Video,
  type LucideIcon,
} from "lucide-react";

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id?: string;
  assessmentId: string;
  type: "mcq" | "multi" | "text" | "code" | "video";
  prompt: string;
  options?: QuestionOption[];
  correct?: string[];
  weight?: number;
  order: number;
  metadata?: Record<string, unknown>;
}

export interface AssessmentSummary {
  id: string;
  title: string;
  description: string;
  timeLimitSec: number;
  questionOrder: "fixed" | "random";
  assessmentType: "text-based" | "video-based";
  isActive: boolean;
}

export const QUESTION_FILTERS: Array<{
  value: "all" | Question["type"];
  label: string;
}> = [
  { value: "all", label: "All types" },
  { value: "mcq", label: "Single choice" },
  { value: "multi", label: "Multi select" },
  { value: "text", label: "Written" },
  { value: "code", label: "Code" },
  { value: "video", label: "Video" },
];

export const TYPE_LABEL_MAP: Record<Question["type"], string> = {
  mcq: "single choice",
  multi: "multi select",
  text: "written",
  code: "code",
  video: "video recording",
};

export const FILTER_ICONS: Record<"all" | Question["type"], LucideIcon> = {
  all: Filter,
  mcq: ListChecks,
  multi: CheckSquare,
  text: AlignLeft,
  code: Code2,
  video: Video,
};

export const formatDuration = (seconds: number) => {
  if (!seconds) return "No limit";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (parts.length === 0) parts.push("<1m");
  return parts.join(" ");
};
