import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";

export const AssessmentNotFound = () => {
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="flex h-full items-center justify-center py-24">
                <Card className="w-full max-w-xl border border-border/60 bg-muted/30 shadow-lg animate-in fade-in-50 slide-in-from-bottom-8">
                    <CardHeader className="items-center space-y-4 text-center">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <SearchX className="h-6 w-6" />
                        </span>
                        <CardTitle className="text-2xl">Assessment not found</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            We couldn&apos;t find an assessment that matches this link. It may
                            have been deleted or moved.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-center gap-3">
                        <Button variant="outline" onClick={() => navigate("/assessments")}>
                            Browse assessments
                        </Button>
                        <Button onClick={() => navigate("/assessments/create")}>
                            Create new assessment
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};
