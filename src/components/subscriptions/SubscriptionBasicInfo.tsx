import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SubscriptionFormData } from "@/types/subscription";

interface SubscriptionBasicInfoProps {
    formData: SubscriptionFormData;
    isEditing: boolean;
    onFormChange: (data: SubscriptionFormData) => void;
    showTypeAndInterval?: boolean;
}

export const SubscriptionBasicInfo = ({
    formData,
    isEditing,
    onFormChange,
    showTypeAndInterval = false,
}: SubscriptionBasicInfoProps) => {
    const handleIsFreeChange = (checked: boolean) => {
        onFormChange({
            ...formData,
            isFree: checked,
            price: checked ? "0" : formData.price,
        });
    };

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
                            onFormChange({ ...formData, name: e.target.value })
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
                            onFormChange({ ...formData, description: e.target.value })
                        }
                        disabled={!isEditing}
                        rows={3}
                    />
                </div>

                {/* Boolean flags */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive ?? true}
                            onCheckedChange={(checked) =>
                                onFormChange({ ...formData, isActive: checked as boolean })
                            }
                            disabled={!isEditing}
                        />
                        <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                            Active
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isCustom"
                            checked={formData.isCustom ?? false}
                            onCheckedChange={(checked) =>
                                onFormChange({ ...formData, isCustom: checked as boolean })
                            }
                            disabled={!isEditing}
                        />
                        <Label htmlFor="isCustom" className="text-sm font-normal cursor-pointer">
                            Custom Plan
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isFree"
                            checked={formData.isFree ?? false}
                            onCheckedChange={handleIsFreeChange}
                            disabled={!isEditing}
                        />
                        <Label htmlFor="isFree" className="text-sm font-normal cursor-pointer">
                            Free Plan
                        </Label>
                    </div>
                </div>

                {showTypeAndInterval && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="accountType">
                                Account type <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.accountType}
                                onValueChange={(value: "job_seeker" | "employer") =>
                                    onFormChange({ ...formData, accountType: value, features: [], limits: {} })
                                }
                                disabled={!isEditing}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="job_seeker">Job Seeker</SelectItem>
                                    <SelectItem value="employer">Employer</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Who this plan is for
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interval">
                                Billing interval <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.interval}
                                onValueChange={(
                                    value: "month" | "3month" | "6month" | "year" | "enterprise"
                                ) => onFormChange({ ...formData, interval: value })}
                                disabled={!isEditing}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="month">Monthly</SelectItem>
                                    <SelectItem value="3month">Quarterly</SelectItem>
                                    <SelectItem value="6month">Semi-annual</SelectItem>
                                    <SelectItem value="year">Annual</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="price">
                            Price {formData.isCustom && "(Not required for custom plans)"}
                            {formData.isFree && "(Automatically set to 0)"}
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.isFree ? "0" : formData.price}
                            onChange={(e) =>
                                onFormChange({ ...formData, price: e.target.value })
                            }
                            disabled={!isEditing || formData.isFree || formData.isCustom}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Input
                            id="currency"
                            value={formData.currency}
                            onChange={(e) =>
                                onFormChange({ ...formData, currency: e.target.value.toUpperCase() })
                            }
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stripePriceId">Stripe Price ID (optional)</Label>
                    <Input
                        id="stripePriceId"
                        value={formData.stripePriceId}
                        onChange={(e) =>
                            onFormChange({ ...formData, stripePriceId: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="price_1234567890"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="discountPercentage">Discount % (optional)</Label>
                        <Input
                            id="discountPercentage"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discountPercentage}
                            onChange={(e) =>
                                onFormChange({ ...formData, discountPercentage: e.target.value })
                            }
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="discountValidUntil">
                            Discount valid until (optional)
                        </Label>
                        <Input
                            id="discountValidUntil"
                            type="datetime-local"
                            value={formData.discountValidUntil}
                            onChange={(e) =>
                                onFormChange({ ...formData, discountValidUntil: e.target.value })
                            }
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};