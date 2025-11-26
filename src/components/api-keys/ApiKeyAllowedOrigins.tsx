import { Globe, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ApiKeyAllowedOriginsProps {
    allowedOrigins: string[];
    onChange: (index: number, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    isEditing: boolean;
}

export const ApiKeyAllowedOrigins = ({
    allowedOrigins,
    onChange,
    onAdd,
    onRemove,
    isEditing,
}: ApiKeyAllowedOriginsProps) => {
    return (
        <Card className="border border-border/60 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5" />
                    Allowed origins
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {allowedOrigins.map((origin, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            type="url"
                            value={origin}
                            onChange={(e) => onChange(index, e.target.value)}
                            placeholder="https://example.com"
                            disabled={!isEditing}
                        />
                        {isEditing && allowedOrigins.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemove(index)}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
                {isEditing && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onAdd}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add origin
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};