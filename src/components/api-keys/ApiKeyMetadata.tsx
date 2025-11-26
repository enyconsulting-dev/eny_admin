import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ApiKey } from "@/types/apiKey";

interface ApiKeyMetadataProps {
    apiKey: ApiKey;
}

export const ApiKeyMetadata = ({ apiKey }: ApiKeyMetadataProps) => {
    return (
        <Card className="border border-border/60 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <Label className="text-xs text-muted-foreground">Created by</Label>
                        <p className="text-sm font-medium">
                            {apiKey.createdBy.firstName} {apiKey.createdBy.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {apiKey.createdBy.email}
                        </p>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Created at</Label>
                        <p className="text-sm font-medium">
                            {format(new Date(apiKey.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Last updated</Label>
                        <p className="text-sm font-medium">
                            {format(new Date(apiKey.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">API Key ID</Label>
                        <p className="text-sm font-medium font-mono">{apiKey._id}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};