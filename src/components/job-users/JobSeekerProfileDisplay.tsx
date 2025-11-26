import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JobSeekerProfile {
    fullName: string;
    phone?: string;
    addressLine?: string;
    bio?: string;
    primaryRole?: string;
    experienceLevel?: string;
    yearsOfExperience?: number;
    workPreferences?: {
        employmentTypes: string[];
        workModes: string[];
        relocation: boolean;
        preferredLocations: string[];
        salaryCurrency?: string;
        salaryExpectation?: {
            min: number;
            max: number;
            period: string;
        };
        availableFrom?: string;
    };
    skills?: {
        name: string;
        level: string;
        years: number;
    }[];
    languages?: {
        name: string;
        proficiency: string;
    }[];
    experience?: {
        company: string;
        title: string;
        employmentType: string;
        location: string;
        workMode: string;
        startDate: string;
        endDate?: string;
        currentlyWorking: boolean;
        achievements: string[];
        skillsUsed: string[];
    }[];
    education?: {
        institution: string;
        degree: string;
        fieldOfStudy: string;
        startDate: string;
        endDate?: string;
        grade?: string;
    }[];
    certifications?: {
        name: string;
        issuer: string;
        issueDate: string;
        expiryDate?: string;
        credentialId?: string;
        credentialUrl?: string;
    }[];
    projects?: {
        name: string;
        summary: string;
        url?: string;
        skills: string[];
    }[];
    portfolioLinks?: string[];
    socials?: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
    };
    resume?: {
        fileUrl: string;
        fileName: string;
        mimeType: string;
        lastUpdated: string;
    };
    consents?: {
        shareProfileWithEmployers: boolean;
        emailNotifications: boolean;
        gdprAcknowledgement: boolean;
    };
}

interface JobSeekerProfileDisplayProps {
    profile: JobSeekerProfile;
}

export const JobSeekerProfileDisplay = ({
    profile,
}: JobSeekerProfileDisplayProps) => {
    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <Card className="border border-border/60 bg-background/80 shadow-sm">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                        Basic profile details and contact information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Full name
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                {profile.fullName || "Not provided"}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Phone
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                {profile.phone || "Not provided"}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Address
                        </label>
                        <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                            {profile.addressLine || "Not provided"}
                        </div>
                    </div>
                    {profile.bio && (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Bio
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground whitespace-pre-wrap">
                                {profile.bio}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="border border-border/60 bg-background/80 shadow-sm">
                <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>
                        Role, experience, and career preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Primary role
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                {profile.primaryRole || "Not specified"}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Experience level
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                {profile.experienceLevel || "Not specified"}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Years of experience
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                {profile.yearsOfExperience || "Not specified"}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Available from
                            </label>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                {profile.workPreferences?.availableFrom || "Not specified"}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Work Preferences */}
            {profile.workPreferences && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                        <CardTitle>Work Preferences</CardTitle>
                        <CardDescription>
                            Preferred work arrangements and salary expectations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Employment types
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.workPreferences.employmentTypes?.join(", ") ||
                                        "Not specified"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Work modes
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.workPreferences.workModes?.join(", ") ||
                                        "Not specified"}
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Relocation
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.workPreferences.relocation
                                        ? "Open to relocation"
                                        : "Not open to relocation"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Preferred locations
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.workPreferences.preferredLocations?.join(", ") ||
                                        "Not specified"}
                                </div>
                            </div>
                        </div>
                        {profile.workPreferences.salaryExpectation && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Salary expectation
                                </label>
                                <div className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground">
                                    {profile.workPreferences.salaryCurrency}{" "}
                                    {profile.workPreferences.salaryExpectation.min} -{" "}
                                    {profile.workPreferences.salaryExpectation.max} per{" "}
                                    {profile.workPreferences.salaryExpectation.period}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Skills & Languages */}
            <div className="grid gap-6 md:grid-cols-2">
                {profile.skills && profile.skills.length > 0 && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                        <CardHeader>
                            <CardTitle>Skills</CardTitle>
                            <CardDescription>
                                Technical and professional skills.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {profile.skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-3 py-2"
                                    >
                                        <span className="text-sm font-medium">{skill.name}</span>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {skill.level}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {skill.years} years
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {profile.languages && profile.languages.length > 0 && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                        <CardHeader>
                            <CardTitle>Languages</CardTitle>
                            <CardDescription>Language proficiency levels.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {profile.languages.map((language, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-3 py-2"
                                    >
                                        <span className="text-sm font-medium">{language.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {language.proficiency}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Experience */}
            {profile.experience && profile.experience.length > 0 && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                        <CardTitle>Work Experience</CardTitle>
                        <CardDescription>
                            Professional work history and achievements.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {profile.experience.map((exp, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-border/60 bg-muted/30 p-4"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-foreground">
                                                    {exp.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {exp.company}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {exp.currentlyWorking
                                                    ? "Current"
                                                    : `${exp.startDate} - ${exp.endDate || "Present"}`}
                                            </Badge>
                                        </div>
                                        <div className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                                            <span>Type: {exp.employmentType}</span>
                                            <span>Location: {exp.location}</span>
                                            <span>Mode: {exp.workMode}</span>
                                        </div>
                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                                                    Achievements
                                                </p>
                                                <ul className="text-sm text-foreground space-y-1">
                                                    {exp.achievements.map((achievement, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-primary mt-1">•</span>
                                                            <span>{achievement}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                                                    Skills Used
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {exp.skillsUsed.map((skill, i) => (
                                                        <Badge
                                                            key={i}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                        <CardTitle>Education</CardTitle>
                        <CardDescription>
                            Academic background and qualifications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {profile.education.map((edu, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-border/60 bg-muted/30 p-4"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-foreground">
                                                    {edu.degree} in {edu.fieldOfStudy}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {edu.institution}
                                                </p>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {edu.startDate} - {edu.endDate}
                                            </span>
                                        </div>
                                        {edu.grade && (
                                            <p className="text-sm text-muted-foreground">
                                                Grade: {edu.grade}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                        <CardTitle>Certifications</CardTitle>
                        <CardDescription>
                            Professional certifications and credentials.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {profile.certifications.map((cert, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-border/60 bg-muted/30 p-4"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-foreground">
                                                    {cert.name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Issued by {cert.issuer}
                                                </p>
                                            </div>
                                            <div className="text-right text-sm text-muted-foreground">
                                                <p>Issued: {cert.issueDate}</p>
                                                {cert.expiryDate && <p>Expires: {cert.expiryDate}</p>}
                                            </div>
                                        </div>
                                        {cert.credentialId && (
                                            <p className="text-sm text-muted-foreground">
                                                ID: {cert.credentialId}
                                            </p>
                                        )}
                                        {cert.credentialUrl && (
                                            <a
                                                href={cert.credentialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                View Credential
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Projects & Portfolio */}
            <div className="grid gap-6 md:grid-cols-2">
                {profile.projects && profile.projects.length > 0 && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                        <CardHeader>
                            <CardTitle>Projects</CardTitle>
                            <CardDescription>
                                Personal and professional projects.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {profile.projects.map((project, index) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-border/60 bg-muted/30 p-4"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-foreground">
                                                        {project.name}
                                                    </h4>
                                                    {project.url && (
                                                        <a
                                                            href={project.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-primary hover:underline"
                                                        >
                                                            View Project
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {project.summary}
                                            </p>
                                            {project.skills && project.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {project.skills.map((skill, i) => (
                                                        <Badge
                                                            key={i}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {profile.portfolioLinks && profile.portfolioLinks.length > 0 && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                        <CardHeader>
                            <CardTitle>Portfolio Links</CardTitle>
                            <CardDescription>
                                External portfolio and work samples.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {profile.portfolioLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-primary hover:bg-muted/50 transition-colors"
                                    >
                                        <span>🔗</span>
                                        <span className="truncate">{link}</span>
                                    </a>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Social Media & Resume */}
            <div className="grid gap-6 md:grid-cols-2">
                {profile.socials && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                        <CardHeader>
                            <CardTitle>Social Media</CardTitle>
                            <CardDescription>
                                Professional social media profiles.
                            </CardDescription>
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

                {profile.resume && (
                    <Card className="border border-border/60 bg-background/80 shadow-sm">
                        <CardHeader>
                            <CardTitle>Resume</CardTitle>
                            <CardDescription>Resume document information.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">
                                            {profile.resume.fileName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Type: {profile.resume.mimeType}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Last updated:{" "}
                                            {new Date(profile.resume.lastUpdated).toLocaleDateString()}
                                        </p>
                                        {profile.resume.fileUrl && (
                                            <a
                                                href={profile.resume.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                            >
                                                <span>📄</span>
                                                View Resume
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Consents */}
            {profile.consents && (
                <Card className="border border-border/60 bg-background/80 shadow-sm">
                    <CardHeader>
                        <CardTitle>Privacy & Consents</CardTitle>
                        <CardDescription>
                            User privacy preferences and consents.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-3 h-3 rounded-full ${profile.consents.shareProfileWithEmployers
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        }`}
                                ></div>
                                <span className="text-sm">Share Profile</span>
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
                                    className={`w-3 h-3 rounded-full ${profile.consents.gdprAcknowledgement
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        }`}
                                ></div>
                                <span className="text-sm">GDPR Acknowledged</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
