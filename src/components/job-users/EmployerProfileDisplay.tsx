import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmployerProfile {
    name: string;
    legalName?: string;
    registrationNumber?: string;
    industry?: string;
    companySize?: string;
    foundedYear?: number;
    website?: string;
    about?: string;
    mission?: string;
    values?: string[];
    logoUrl?: string;
    socials?: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
    };
    primaryContact?: {
        fullName: string;
        role: string;
        email: string;
        phone?: string;
    };
    addresses?: {
        label: string;
        country: string;
        state: string;
        city: string;
        addressLine: string;
        postalCode: string;
        geo?: {
            lat: number;
            lng: number;
        };
    }[];
    billing?: {
        billingEmail: string;
        billingAddress: string;
        taxId?: string;
        currency: string;
    };
    verification?: {
        domainVerified: boolean;
        businessDocsUrl?: string;
    };
    hiringPreferences?: {
        defaultWorkModes: string[];
        visaSponsorship: boolean;
        equalOpportunityStatement?: string;
    };
    consents?: {
        termsAccepted: boolean;
        emailNotifications: boolean;
        dataProcessingAgreementAccepted: boolean;
    };
}

interface EmployerProfileDisplayProps {
    profile: EmployerProfile;
}

export const EmployerProfileDisplay = ({
    profile,
}: EmployerProfileDisplayProps) => {
    return (
        <div className="space-y-6">
            {/* Company Information */}
            <Card className="border border-border/60 bg-background/80 shadow-sm">
                <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>
                        Basic company details and registration information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Company name
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                {profile.name || "Not provided"}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Legal name
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                {profile.legalName || "Not provided"}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Registration number
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                {profile.registrationNumber || "Not provided"}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Industry
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                {profile.industry || "Not provided"}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Company size
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                {profile.companySize || "Not provided"}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Founded year
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                {profile.foundedYear || "Not provided"}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Website
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {profile.website ? (
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    {profile.website}
                                </a>
                            ) : (
                                "Not provided"
                            )}
                        </div>
                    </div>
                    {profile.about && (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                About
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground whitespace-pre-wrap">
                                {profile.about}
                            </div>
                        </div>
                    )}
                    {profile.mission && (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Mission
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground whitespace-pre-wrap">
                                {profile.mission}
                            </div>
                        </div>
                    )}
                    {profile.values && profile.values.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Values
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {profile.values.map((value, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {value}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Primary Contact */}
            {profile.primaryContact && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                        <CardTitle>Primary Contact</CardTitle>
                        <CardDescription>
                            Main point of contact for the company.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Full name
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.primaryContact.fullName || "Not provided"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Role
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.primaryContact.role || "Not provided"}
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Email
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.primaryContact.email || "Not provided"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Phone
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.primaryContact.phone || "Not provided"}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Addresses */}
            {profile.addresses && profile.addresses.length > 0 && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                        <CardTitle>Company Addresses</CardTitle>
                        <CardDescription>
                            Registered office and branch locations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {profile.addresses.map((address, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-border/60 bg-muted/30 p-4"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <h4 className="font-semibold text-foreground">
                                                {address.label}
                                            </h4>
                                            {address.geo && (
                                                <span className="text-xs text-muted-foreground">
                                                    {address.geo.lat}, {address.geo.lng}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p>{address.addressLine}</p>
                                            <p>
                                                {address.city}, {address.state} {address.postalCode}
                                            </p>
                                            <p>{address.country}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Billing Information */}
            {profile.billing && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                        <CardTitle>Billing Information</CardTitle>
                        <CardDescription>
                            Billing contact and tax information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Billing email
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.billing.billingEmail || "Not provided"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Tax ID
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.billing.taxId || "Not provided"}
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Currency
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.billing.currency || "Not provided"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Billing address
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.billing.billingAddress || "Not provided"}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Verification & Hiring Preferences */}
            <div className="grid gap-6 md:grid-cols-2">
                {profile.verification && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                        <CardHeader>
                            <CardTitle>Verification</CardTitle>
                            <CardDescription>
                                Company verification status and documents.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-3 h-3 rounded-full ${profile.verification.domainVerified
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        }`}
                                ></div>
                                <span className="text-sm">Domain Verified</span>
                            </div>
                            {profile.verification.businessDocsUrl && (
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        Business documents
                                    </label>
                                    <a
                                        href={profile.verification.businessDocsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                    >
                                        <span>📄</span>
                                        View Documents
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {profile.hiringPreferences && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                        <CardHeader>
                            <CardTitle>Hiring Preferences</CardTitle>
                            <CardDescription>
                                Company's hiring policies and preferences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Default work modes
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.hiringPreferences.defaultWorkModes?.join(", ") ||
                                        "Not specified"}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-3 h-3 rounded-full ${profile.hiringPreferences.visaSponsorship
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        }`}
                                ></div>
                                <span className="text-sm">Visa Sponsorship Available</span>
                            </div>
                            {profile.hiringPreferences.equalOpportunityStatement && (
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        Equal opportunity statement
                                    </label>
                                    <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground whitespace-pre-wrap">
                                        {profile.hiringPreferences.equalOpportunityStatement}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Social Media */}
            {profile.socials && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                        <CardTitle>Social Media</CardTitle>
                        <CardDescription>Company social media profiles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(profile.socials).map(
                                ([platform, url]) =>
                                    url && (
                                        <div
                                            key={platform}
                                            className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2"
                                        >
                                            <span className="text-sm font-medium capitalize">
                                                {platform}:
                                            </span>
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline truncate"
                                            >
                                                {url}
                                            </a>
                                        </div>
                                    )
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Logo */}
            {profile.logoUrl && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                        <CardTitle>Company Logo</CardTitle>
                        <CardDescription>
                            Company branding and visual identity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <img
                                src={profile.logoUrl}
                                alt="Company logo"
                                className="w-16 h-16 object-contain rounded-lg border border-border/60"
                            />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Company logo image
                                </p>
                                <a
                                    href={profile.logoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                >
                                    View full size
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Consents */}
            {profile.consents && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                        <CardTitle>Privacy & Consents</CardTitle>
                        <CardDescription>
                            Company privacy preferences and consents.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-3 h-3 rounded-full ${profile.consents.termsAccepted
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        }`}
                                ></div>
                                <span className="text-sm">Terms Accepted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-3 h-3 rounded-full ${profile.consents.emailNotifications
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        }`}
                                ></div>
                                <span className="text-sm">Email Notifications</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-3 h-3 rounded-full ${profile.consents.dataProcessingAgreementAccepted
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        }`}
                                ></div>
                                <span className="text-sm">Data Processing Accepted</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
