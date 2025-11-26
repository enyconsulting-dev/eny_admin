import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobSeekerFeature, EmployerFeature } from "@/types/subscription";

interface SubscriptionLimitsInputProps {
    accountType: "job_seeker" | "employer";
    selectedFeatures: string[];
    limits: any;
    onLimitsChange: (limits: any) => void;
}

export const SubscriptionLimitsInput = ({
    accountType,
    selectedFeatures,
    limits,
    onLimitsChange,
}: SubscriptionLimitsInputProps) => {
    const hasAnyRelevantLimitFields = () => {
        if (accountType === "job_seeker") {
            return (
                selectedFeatures.includes(JobSeekerFeature.AI_LINKEDIN_OPTIMIZATION) ||
                selectedFeatures.includes(JobSeekerFeature.AI_RESUME_BUILDER_PDF) ||
                selectedFeatures.includes(JobSeekerFeature.RESUME_BUILDER) ||
                selectedFeatures.includes(JobSeekerFeature.MULTI_TENANT_CV_STORAGE) ||
                selectedFeatures.includes(JobSeekerFeature.JOB_APPLICATION) ||
                selectedFeatures.includes(JobSeekerFeature.AI_COVER_LETTER_GENERATION) ||
                selectedFeatures.includes(JobSeekerFeature.CREATE_JOB_ALERT)
            );
        } else {
            return (
                selectedFeatures.includes(EmployerFeature.POST_JOB_ADS) ||
                selectedFeatures.includes(EmployerFeature.POST_JOB_ADS_LIMIT) ||
                selectedFeatures.includes(EmployerFeature.CREATE_ASSESSMENT) ||
                selectedFeatures.includes(EmployerFeature.CREATE_ASSESSMENT_LIMIT) ||
                selectedFeatures.includes(EmployerFeature.SEND_ASSESSMENT) ||
                selectedFeatures.includes(EmployerFeature.APPLICATION_RECEIVED_MONTHLY)
            );
        }
    };

    const updateLimit = (key: string, value: string) => {
        onLimitsChange({
            ...limits,
            [key]: value ? parseInt(value) : undefined,
        });
    };

    return (
        <Card className="border border-border/60 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Feature limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Configure limits for features. Limits are based on the selected features above.
                </p>

                {selectedFeatures.length === 0 ? (
                    <div className="p-4 bg-muted/50 rounded-md">
                        <p className="text-sm text-muted-foreground text-center">
                            Select features above to configure their limits
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Job Seeker Limits */}
                        {accountType === "job_seeker" && (
                            <>
                                {selectedFeatures.includes(JobSeekerFeature.AI_LINKEDIN_OPTIMIZATION) && (
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin_optimization_limit">
                                            LinkedIn optimization limit
                                        </Label>
                                        <Input
                                            id="linkedin_optimization_limit"
                                            type="number"
                                            value={limits.linkedin_optimization_limit || ""}
                                            onChange={(e) => updateLimit("linkedin_optimization_limit", e.target.value)}
                                            placeholder="e.g., 10"
                                            min="0"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Number of LinkedIn optimizations per billing period (-1 for unlimited)
                                        </p>
                                    </div>
                                )}

                                {(selectedFeatures.includes(JobSeekerFeature.AI_RESUME_BUILDER_PDF) ||
                                    selectedFeatures.includes(JobSeekerFeature.RESUME_BUILDER)) && (
                                        <div className="space-y-2">
                                            <Label htmlFor="ai_resume_builder_limit">
                                                AI resume builder limit
                                            </Label>
                                            <Input
                                                id="ai_resume_builder_limit"
                                                type="number"
                                                value={limits.ai_resume_builder_limit || ""}
                                                onChange={(e) => updateLimit("ai_resume_builder_limit", e.target.value)}
                                                placeholder="e.g., 5"
                                                min="0"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Number of AI-generated resumes per billing period (-1 for unlimited)
                                            </p>
                                        </div>
                                    )}

                                {selectedFeatures.includes(JobSeekerFeature.MULTI_TENANT_CV_STORAGE) && (
                                    <div className="space-y-2">
                                        <Label htmlFor="cv_storage_limit">
                                            CV storage limit
                                        </Label>
                                        <Input
                                            id="cv_storage_limit"
                                            type="number"
                                            value={limits.cv_storage_limit || ""}
                                            onChange={(e) => updateLimit("cv_storage_limit", e.target.value)}
                                            placeholder="e.g., 3"
                                            min="0"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Number of CVs that can be stored (-1 for unlimited)
                                        </p>
                                    </div>
                                )}

                                {selectedFeatures.includes(JobSeekerFeature.JOB_APPLICATION) && (
                                    <div className="space-y-2">
                                        <Label htmlFor="job_application_limit">
                                            Job application limit
                                        </Label>
                                        <Input
                                            id="job_application_limit"
                                            type="number"
                                            value={limits.job_application_limit || ""}
                                            onChange={(e) => updateLimit("job_application_limit", e.target.value)}
                                            placeholder="e.g., 50"
                                            min="0"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Number of job applications per billing period (-1 for unlimited)
                                        </p>
                                    </div>
                                )}

                                {selectedFeatures.includes(JobSeekerFeature.AI_COVER_LETTER_GENERATION) && (
                                    <div className="space-y-2">
                                        <Label htmlFor="cover_letter_generation_limit">
                                            Cover letter generation limit
                                        </Label>
                                        <Input
                                            id="cover_letter_generation_limit"
                                            type="number"
                                            value={limits.cover_letter_generation_limit || ""}
                                            onChange={(e) => updateLimit("cover_letter_generation_limit", e.target.value)}
                                            placeholder="e.g., 20"
                                            min="0"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Number of AI-generated cover letters per billing period (-1 for unlimited)
                                        </p>
                                    </div>
                                )}

                                {selectedFeatures.includes(JobSeekerFeature.CREATE_JOB_ALERT) && (
                                    <div className="space-y-2">
                                        <Label htmlFor="job_alert_limit">
                                            Job alert limit
                                        </Label>
                                        <Input
                                            id="job_alert_limit"
                                            type="number"
                                            value={limits.job_alert_limit || ""}
                                            onChange={(e) => updateLimit("job_alert_limit", e.target.value)}
                                            placeholder="e.g., 10"
                                            min="0"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Number of active job alerts allowed (-1 for unlimited)
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Employer Limits */}
                        {accountType === "employer" && (
                            <>
                                {(selectedFeatures.includes(EmployerFeature.POST_JOB_ADS) ||
                                    selectedFeatures.includes(EmployerFeature.POST_JOB_ADS_LIMIT)) && (
                                        <div className="space-y-2">
                                            <Label htmlFor="post_job_ads_limit">
                                                Post job ads limit
                                            </Label>
                                            <Input
                                                id="post_job_ads_limit"
                                                type="number"
                                                value={limits.post_job_ads_limit || ""}
                                                onChange={(e) => updateLimit("post_job_ads_limit", e.target.value)}
                                                placeholder="e.g., 25"
                                                min="0"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Number of job ads that can be posted per billing period (-1 for unlimited)
                                            </p>
                                        </div>
                                    )}

                                {(selectedFeatures.includes(EmployerFeature.CREATE_ASSESSMENT) ||
                                    selectedFeatures.includes(EmployerFeature.CREATE_ASSESSMENT_LIMIT)) && (
                                        <div className="space-y-2">
                                            <Label htmlFor="create_assessment_limit">
                                                Create assessment limit
                                            </Label>
                                            <Input
                                                id="create_assessment_limit"
                                                type="number"
                                                value={limits.create_assessment_limit || ""}
                                                onChange={(e) => updateLimit("create_assessment_limit", e.target.value)}
                                                placeholder="e.g., 15"
                                                min="0"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Number of assessments that can be created per billing period (-1 for unlimited)
                                            </p>
                                        </div>
                                    )}

                                {selectedFeatures.includes(EmployerFeature.SEND_ASSESSMENT) && (
                                    <div className="space-y-2">
                                        <Label htmlFor="send_assessment_limit">
                                            Send assessment limit
                                        </Label>
                                        <Input
                                            id="send_assessment_limit"
                                            type="number"
                                            value={limits.send_assessment_limit || ""}
                                            onChange={(e) => updateLimit("send_assessment_limit", e.target.value)}
                                            placeholder="e.g., 100"
                                            min="0"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Number of assessments that can be sent per billing period (-1 for unlimited)
                                        </p>
                                    </div>
                                )}

                                {selectedFeatures.includes(EmployerFeature.APPLICATION_RECEIVED_MONTHLY) && (
                                    <div className="space-y-2">
                                        <Label htmlFor="application_received_monthly_limit">
                                            Application received monthly limit
                                        </Label>
                                        <Input
                                            id="application_received_monthly_limit"
                                            type="number"
                                            value={limits.application_received_monthly_limit || ""}
                                            onChange={(e) => updateLimit("application_received_monthly_limit", e.target.value)}
                                            placeholder="e.g., 200"
                                            min="0"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Number of applications that can be received monthly (-1 for unlimited)
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {selectedFeatures.length > 0 && !hasAnyRelevantLimitFields() && (
                            <div className="p-4 bg-muted/50 rounded-md">
                                <p className="text-sm text-muted-foreground text-center">
                                    Selected features do not require limit configuration
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};