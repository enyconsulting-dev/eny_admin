import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubscriptionFeaturesProps {
    features: string[];
}

export const SubscriptionFeatures = ({ features }: SubscriptionFeaturesProps) => {
    return (
        <Card className="border border-border/60 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {features.map((feature) => (
                            <div
                                key={feature}
                                className="flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-muted"
                            >
                                <span className="text-primary">✓</span>
                                <span>{feature.replace(/_/g, " ")}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};