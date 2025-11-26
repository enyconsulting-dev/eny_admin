import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QUESTION_FILTERS, FILTER_ICONS, type Question } from "@/types/assessment";

interface AssessmentFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedFilter: "all" | Question["type"];
    onFilterChange: (value: "all" | Question["type"]) => void;
}

export const AssessmentFilters = ({
    searchTerm,
    onSearchChange,
    selectedFilter,
    onFilterChange,
}: AssessmentFiltersProps) => {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 shadow-sm dark:bg-muted/10 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search prompts or option text…"
                    className="pl-9"
                />
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {QUESTION_FILTERS.map((filter) => {
                    const Icon = FILTER_ICONS[filter.value];
                    return (
                        <Button
                            key={filter.value}
                            variant={selectedFilter === filter.value ? "default" : "outline"}
                            size="sm"
                            className="gap-2"
                            onClick={() => onFilterChange(filter.value)}
                        >
                            <Icon className="h-4 w-4" />
                            {filter.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};