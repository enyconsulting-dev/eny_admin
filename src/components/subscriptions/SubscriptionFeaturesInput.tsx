import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobSeekerFeature, EmployerFeature } from "@/types/subscription";

interface SubscriptionFeaturesInputProps {
    accountType: "job_seeker" | "employer";
    selectedFeatures: string[];
    onFeatureToggle: (feature: string) => void;
}

export const SubscriptionFeaturesInput = ({
    accountType,
    selectedFeatures,
    onFeatureToggle,
}: SubscriptionFeaturesInputProps) => {
    const availableFeatures =
        accountType === "job_seeker"
            ? Object.values(JobSeekerFeature)
            : Object.values(EmployerFeature);

    return (
        <Card className="border border-border/60 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">
                    Features <span className="text-destructive">*</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Select the features included in this plan (at least one required):
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 max-h-96 overflow-y-auto border rounded-md p-4">
                        {availableFeatures.map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`feature-${feature}`}
                                    checked={selectedFeatures.includes(feature)}
                                    onChange={() => onFeatureToggle(feature)}
                                    className="rounded"
                                />
                                <label
                                    htmlFor={`feature-${feature}`}
                                    className="text-sm cursor-pointer"
                                >
                                    {feature.replace(/_/g, " ")}
                                </label>
                            </div>
                        ))}
                    </div>
                    {selectedFeatures.length === 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-500">
                            Warning: No features selected. Please select at least one feature.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};