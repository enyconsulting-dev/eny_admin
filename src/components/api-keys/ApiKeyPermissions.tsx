import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AVAILABLE_PERMISSIONS } from "@/types/apiKey";

interface ApiKeyPermissionsProps {
    permissions: string[];
    onToggle: (permission: string) => void;
    isEditing: boolean;
}

export const ApiKeyPermissions = ({
    permissions,
    onToggle,
    isEditing,
}: ApiKeyPermissionsProps) => {
    return (
        <Card className="border border-border/60 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5" />
                    Permissions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {AVAILABLE_PERMISSIONS.map((permission) => (
                            <div key={permission.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`edit-${permission.value}`}
                                    checked={permissions.includes(permission.value)}
                                    onCheckedChange={() => onToggle(permission.value)}
                                    disabled={!isEditing}
                                />
                                <Label
                                    htmlFor={`edit-${permission.value}`}
                                    className={`text-sm font-normal ${isEditing ? "cursor-pointer" : "cursor-default"
                                        }`}
                                >
                                    {permission.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};