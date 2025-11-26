import { Copy, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyDisplayProps {
    apiKey: string;
}

export const ApiKeyDisplay = ({ apiKey }: ApiKeyDisplayProps) => {
    const { toast } = useToast();

    const handleCopyKey = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            toast({
                title: "Copied!",
                description: "API key copied to clipboard.",
            });
        }
    };

    return (
        <Card className="border border-border/60 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Key className="h-5 w-5" />
                    API key
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <Input value={apiKey} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={handleCopyKey}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Keep this key secure. Do not share it publicly.
                </p>
            </CardContent>
        </Card>
    );
};