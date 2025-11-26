import { AlertCircle } from "lucide-react";
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

interface AssessmentErrorProps {
    refetchAssessment: () => void;
}

export const AssessmentError = ({ refetchAssessment }: AssessmentErrorProps) => {
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="flex h-full items-center justify-center py-24">
                <Card className="w-full max-w-xl border border-destructive/30 bg-destructive/10 text-destructive shadow-xl animate-in fade-in-50 zoom-in-95">
                    <CardHeader className="items-center space-y-4 text-center">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15">
                            <AlertCircle className="h-6 w-6" />
                        </span>
                        <CardTitle className="text-2xl">
                            We couldn&apos;t load this assessment
                        </CardTitle>
                        <CardDescription className="text-sm text-destructive/80">
                            Something prevented the workspace from loading. Try refreshing, or
                            head back to the assessments list.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-center gap-3">
                        <Button variant="destructive" onClick={() => refetchAssessment()}>
                            Retry loading
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => navigate("/assessments")}
                        >
                            Go to assessments
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};
