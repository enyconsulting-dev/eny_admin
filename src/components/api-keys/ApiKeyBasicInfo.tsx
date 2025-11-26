import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ApiKeyBasicInfoProps {
    formData: {
        name: string;
        description: string;
        expiresAt: string;
        rateLimit: string;
    };
    setFormData: (data: any) => void;
    isEditing: boolean;
}

export const ApiKeyBasicInfo = ({
    formData,
    setFormData,
    isEditing,
}: ApiKeyBasicInfoProps) => {
    return (
        <Card className="border border-border/60 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Basic information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        disabled={!isEditing}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        disabled={!isEditing}
                        rows={3}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="expiresAt">Expiration date</Label>
                        <Input
                            id="expiresAt"
                            type="datetime-local"
                            value={formData.expiresAt}
                            onChange={(e) =>
                                setFormData({ ...formData, expiresAt: e.target.value })
                            }
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rateLimit">Rate limit (requests/hour)</Label>
                        <Input
                            id="rateLimit"
                            type="number"
                            value={formData.rateLimit}
                            onChange={(e) =>
                                setFormData({ ...formData, rateLimit: e.target.value })
                            }
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};