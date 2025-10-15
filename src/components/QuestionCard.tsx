import React, { useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlignLeft,
  Check,
  Code2,
  Edit,
  ListChecks,
  Plus,
  Sparkles,
  Trash2,
  Type,
} from "lucide-react";

interface QuestionOption {
  key: string;
  text: string;
}

interface Question {
  id?: string;
  assessmentId?: string;
  type: "mcq" | "multi" | "text" | "code";
  prompt: string;
  options?: QuestionOption[];
  correct?: string[];
  weight?: number;
  order: number;
  metadata?: Record<string, unknown>;
}

type Props = {
  question: Question;
  index: number;
  onCreate: (payload: any) => void;
  onUpdate: (id: string, payload: any) => void;
  onDelete: (id?: string) => void;
  onClose?: (value: boolean) => void;
};

type QuestionTypeInfo = {
  label: string;
  helper: string;
  accent: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const TYPE_META: Record<Question["type"], QuestionTypeInfo> = {
  mcq: {
    label: "Single choice",
    helper: "Candidates select exactly one answer. Perfect for concept checks.",
    accent: "bg-primary/10 text-primary border border-primary/30",
    icon: ListChecks,
  },
  multi: {
    label: "Multi select",
    helper: "Allow multiple correct answers for scenario-based questions.",
    accent: "bg-blue-500/10 text-blue-600 border border-blue-500/30 dark:text-blue-200",
    icon: Check,
  },
  text: {
    label: "Written response",
    helper: "Capture open responses for deeper insight or reflection.",
    accent: "bg-amber-500/10 text-amber-600 border border-amber-500/30 dark:text-amber-200",
    icon: AlignLeft,
  },
  code: {
    label: "Coding task",
    helper: "Collect code snippets or structured answers for grading.",
    accent: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 dark:text-emerald-200",
    icon: Code2,
  },
};

const buildMetadataEntries = (metadata: Question["metadata"]) => {
  if (!metadata || typeof metadata !== "object") return [];
  return Object.entries(metadata).map(([key, value]) => ({
    key,
    value: String(value ?? ""),
  }));
};

const deriveOptionIdentifier = (option: QuestionOption, index: number) =>
  option.key?.trim() !== "" ? option.key.trim() : String(index);

export default function QuestionCard({
  question,
  index,
  onCreate,
  onUpdate,
  onDelete,
  onClose,
}: Props) {
  const isNew = !question.id || String(question.id).startsWith("new-");
  const [editing, setEditing] = useState<boolean>(isNew);
  const [local, setLocal] = useState<Question>({ ...question });
  const [metadataEntries, setMetadataEntries] = useState<Array<{ key: string; value: string }>>(
    buildMetadataEntries(question.metadata),
  );

  useEffect(() => {
    setLocal({ ...question });
    setMetadataEntries(buildMetadataEntries(question.metadata));
  }, [question]);

  const typeInfo = TYPE_META[local.type ?? "mcq"];

  const correctIdentifiers = useMemo(
    () =>
      Array.isArray(local.correct)
        ? local.correct.map((identifier) => String(identifier).toLowerCase())
        : [],
    [local.correct],
  );

  const handleAddOption = () => {
    setLocal((prev) => ({
      ...prev,
      options: [...(prev.options || []), { key: "", text: "" }],
    }));
  };

  const handleOptionChange = (optionIndex: number, field: keyof QuestionOption, value: string) => {
    setLocal((prev) => {
      const nextOptions = [...(prev.options || [])];
      if (!nextOptions[optionIndex]) return prev;
      nextOptions[optionIndex] = { ...nextOptions[optionIndex], [field]: value };
      return { ...prev, options: nextOptions };
    });
  };

  const handleRemoveOption = (optionIndex: number) => {
    setLocal((prev) => ({
      ...prev,
      options: prev.options?.filter((_, idx) => idx !== optionIndex),
      correct: Array.isArray(prev.correct)
        ? prev.correct.filter((identifier) => {
            const derived = deriveOptionIdentifier(prev.options?.[optionIndex] ?? { key: "", text: "" }, optionIndex);
            return String(identifier).toLowerCase() !== derived.toLowerCase();
          })
        : prev.correct,
    }));
  };

  const toggleCorrect = (identifier: string) => {
    setLocal((prev) => {
      const normalizedIdentifier = String(identifier).toLowerCase();
      const current = Array.isArray(prev.correct) ? [...prev.correct] : [];

      if (prev.type === "mcq") {
        return { ...prev, correct: [identifier] };
      }

      const idx = current.findIndex((value) => String(value).toLowerCase() === normalizedIdentifier);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(identifier);
      }
      return { ...prev, correct: current };
    });
  };

  const handleSave = () => {
    const trimmedPrompt = local.prompt?.trim();
    if (!trimmedPrompt) return;

    if ((local.type === "mcq" || local.type === "multi") && (!local.options || local.options.length === 0)) {
      return;
    }

    const metadata =
      metadataEntries.length > 0
        ? metadataEntries.reduce<Record<string, string>>((acc, entry) => {
            if (entry.key.trim() !== "") {
              acc[entry.key.trim()] = entry.value;
            }
            return acc;
          }, {})
        : local.metadata;

    const payload = {
      type: local.type,
      prompt: trimmedPrompt,
      options: local.options || [],
      correct: local.correct || [],
      weight: local.weight ?? 1,
      order: local.order,
      metadata,
    };

    if (isNew) {
      onCreate({ ...payload, assessmentId: local.assessmentId });
    } else if (local.id) {
      onUpdate(local.id, payload);
    }

    setEditing(false);
    onClose?.(false);
  };

  const handleCancel = () => {
    if (isNew && question.id) {
      onDelete(question.id);
      return;
    }

    setLocal({ ...question });
    setMetadataEntries(buildMetadataEntries(question.metadata));
    setEditing(false);
    onClose?.(false);
  };

  return (
    <Card
      id={`question-${question.id ?? `new-${index}`}`}
      className={cn(
        "group relative overflow-hidden border border-border/60 bg-background/95 shadow-sm transition-all duration-200",
        editing
          ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
          : "hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg",
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <CardHeader className="relative space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider">
              <Badge variant="secondary" className="rounded-full bg-muted/70 px-3 py-1 text-muted-foreground">
                Q{index + 1}
              </Badge>
              <Badge className={cn("rounded-full px-3 py-1", typeInfo.accent)}>
                <typeInfo.icon className="mr-1.5 h-3.5 w-3.5" />
                {typeInfo.label}
              </Badge>
              {typeof local.weight === "number" && (
                <Badge variant="outline" className="rounded-full border-dashed px-3 py-1">
                  Weight {local.weight}
                </Badge>
              )}
              {isNew && (
                <Badge variant="outline" className="rounded-full border-dashed px-3 py-1 text-muted-foreground">
                  Draft
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold leading-tight text-foreground">
                {local.prompt?.trim() ? local.prompt.trim() : "Draft question"}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{typeInfo.helper}</CardDescription>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!editing && (
              <Button size="sm" variant="outline" className="gap-2" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4" />
                Refine
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(question.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {editing ? (
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`type-${question.id ?? `new-${index}`}`}>Question type</Label>
              <Select
                value={local.type}
                onValueChange={(value: Question["type"]) => setLocal({ ...local, type: value })}
              >
                <SelectTrigger id={`type-${question.id ?? `new-${index}`}`}>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">Multiple choice (single answer)</SelectItem>
                  <SelectItem value="multi">Multiple choice (multiple answers)</SelectItem>
                  <SelectItem value="text">Text response</SelectItem>
                  <SelectItem value="code">Code response</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`order-${question.id ?? `new-${index}`}`}>Display order</Label>
              <Input
                id={`order-${question.id ?? `new-${index}`}`}
                type="number"
                min={1}
                value={local.order}
                onChange={(event) =>
                  setLocal({ ...local, order: Number.parseInt(event.target.value || "1", 10) || 1 })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`prompt-${question.id ?? `new-${index}`}`}>Prompt</Label>
            <Textarea
              id={`prompt-${question.id ?? `new-${index}`}`}
              value={local.prompt}
              onChange={(event) => setLocal({ ...local, prompt: event.target.value })}
              placeholder="Describe what you want candidates to answer..."
              rows={4}
              className="resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Use markdown-friendly hints to highlight key phrases or special instructions.
            </p>
          </div>

          {(local.type === "mcq" || local.type === "multi") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label>Answer options</Label>
                <Button size="sm" variant="outline" className="gap-2" onClick={handleAddOption}>
                  <Plus className="h-4 w-4" />
                  Add option
                </Button>
              </div>
              <div className="space-y-2">
                {local.options?.map((option, optionIndex) => {
                  const identifier = deriveOptionIdentifier(option, optionIndex);
                  const isCorrect = correctIdentifiers.includes(identifier.toLowerCase());
                  return (
                    <div
                      key={`${identifier}-${optionIndex}`}
                      className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 sm:flex-row sm:items-start"
                    >
                      <Button
                        type="button"
                        size="icon"
                        variant={isCorrect ? "default" : "ghost"}
                        className={cn(
                          "mt-0 h-10 w-10 shrink-0 rounded-full border transition-all",
                          isCorrect ? "border-primary/60 bg-primary text-primary-foreground" : "border-border/70",
                        )}
                        onClick={() => toggleCorrect(identifier)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <div className="grid flex-1 gap-2 sm:grid-cols-2">
                        <Input
                          placeholder="Option key (e.g. A)"
                          value={option.key}
                          onChange={(event) => handleOptionChange(optionIndex, "key", event.target.value)}
                        />
                        <Input
                          placeholder="Option text"
                          value={option.text}
                          onChange={(event) => handleOptionChange(optionIndex, "text", event.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveOption(optionIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
                {(!local.options || local.options.length === 0) && (
                  <div className="rounded-lg border border-dashed border-border/70 bg-muted/10 p-4 text-sm text-muted-foreground">
                    Add at least two options and mark the correct answer(s) using the check button.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`weight-${question.id ?? `new-${index}`}`}>Question weight</Label>
              <Input
                id={`weight-${question.id ?? `new-${index}`}`}
                type="number"
                min={0}
                step={0.1}
                value={local.weight ?? 1}
                onChange={(event) =>
                  setLocal({ ...local, weight: Number.parseFloat(event.target.value || "0") || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Metadata (optional)</Label>
              <div className="space-y-2">
                {metadataEntries.map((entry, entryIndex) => (
                  <div key={entryIndex} className="flex items-center gap-2">
                    <Input
                      placeholder="Key"
                      value={entry.key}
                      onChange={(event) => {
                        const copy = [...metadataEntries];
                        copy[entryIndex] = { ...copy[entryIndex], key: event.target.value };
                        setMetadataEntries(copy);
                      }}
                    />
                    <Input
                      placeholder="Value"
                      value={entry.value}
                      onChange={(event) => {
                        const copy = [...metadataEntries];
                        copy[entryIndex] = { ...copy[entryIndex], value: event.target.value };
                        setMetadataEntries(copy);
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setMetadataEntries(metadataEntries.filter((_, idx) => idx !== entryIndex))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setMetadataEntries([...metadataEntries, { key: "", value: "" }])}
                >
                  <Plus className="h-4 w-4" />
                  Add metadata field
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Sparkles className="h-4 w-4" />
              {isNew ? "Create question" : "Save changes"}
            </Button>
          </div>
        </CardContent>
      ) : (
        <CardContent className="space-y-5">
          <div className="rounded-lg border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
            {local.prompt?.trim() ? (
              <p className="whitespace-pre-line leading-relaxed text-foreground">{local.prompt.trim()}</p>
            ) : (
              <span>Prompt to be defined.</span>
            )}
          </div>

          {(local.type === "mcq" || local.type === "multi") && local.options && local.options.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">Configured answers</Label>
              <div className="space-y-2">
                {local.options.map((option, optionIndex) => {
                  const identifier = deriveOptionIdentifier(option, optionIndex);
                  const isCorrect = correctIdentifiers.includes(identifier.toLowerCase());
                  return (
                    <div
                      key={`${identifier}-${optionIndex}`}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors",
                        isCorrect
                          ? "border-primary/40 bg-primary/5 text-primary dark:text-primary-foreground/90"
                          : "border-border/60 bg-background/60 text-foreground",
                      )}
                    >
                      <Badge variant="outline" className="min-w-[2.5rem] justify-center rounded-full px-3 py-1 text-xs">
                        {option.key || String.fromCharCode(65 + optionIndex)}
                      </Badge>
                      <span className="flex-1 text-left leading-relaxed">{option.text || "Option text pending"}</span>
                      {isCorrect && <Badge variant="secondary">Correct</Badge>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(local.type === "text" || local.type === "code") && (
            <div className="rounded-lg border border-dashed border-border/70 bg-muted/10 p-4 text-sm text-muted-foreground">
              {local.type === "text" ? (
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-muted-foreground" />
                  <span>Candidate will provide a written response.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-muted-foreground" />
                  <span>Candidate will supply a code snippet or solution.</span>
                </div>
              )}
            </div>
          )}

          {metadataEntries.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">Metadata</Label>
              <div className="flex flex-wrap gap-2">
                {metadataEntries.map((entry, entryIndex) => (
                  <Badge key={`${entry.key}-${entryIndex}`} variant="outline" className="rounded-full px-3 py-1 text-xs">
                    {entry.key}: {entry.value || "—"}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
