import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, ClipboardList, LucideIcon, Plus, UserPlus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

type NavCardAction = {
  label: string;
  route: string;
  icon: LucideIcon;
  variant?: "default" | "secondary";
};

type NavCard = {
  key: string;
  title: string;
  badge: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
  route: string;
  primaryAction: NavCardAction;
  secondaryAction?: NavCardAction;
  status?: "available" | "comingSoon";
};

const NAVIGATION_CARDS: NavCard[] = [
  {
    key: "assessments",
    title: "Assessment workspace",
    badge: "Plan & launch",
    description:
      "Design rich assessments, control scoring rules, and get instant visibility over live sessions.",
    highlights: [
      "Spin up a new assessment with templates and smart defaults.",
      "Monitor draft, live, and closed states without leaving the page.",
      "Preview the candidate journey before you hit publish.",
    ],
    icon: ClipboardList,
    route: "/assessments/list",
    primaryAction: {
      label: "Open workspace",
      route: "/assessments/list",
      icon: ArrowRight,
    },
    secondaryAction: {
      label: "Create assessment",
      route: "/assessments/create",
      icon: Plus,
      variant: "secondary",
    },
  },
  {
    key: "users",
    title: "Candidate directory",
    badge: "People & invites",
    description:
      "Invite cohorts, manage bulk uploads, and keep an eye on individual progress in real time.",
    highlights: [
      "Send invitations or reminders to specific groups in seconds.",
      "Review eligibility, status, and last seen details at a glance.",
      "Bulk import CSVs with validation feedback before you commit.",
    ],
    icon: Users,
    route: "/assessments/users",
    primaryAction: {
      label: "Manage candidates",
      route: "/assessments/users",
      icon: ArrowRight,
    },
    secondaryAction: {
      label: "Invite people",
      route: "/assessments/users",
      icon: UserPlus,
      variant: "secondary",
    },
  },
  {
    key: "attempts",
    title: "Performance insights",
    badge: "Attempts",
    description:
      "Soon you'll be able to track candidate attempts, flag anomalies, and surface completion analytics.",
    highlights: [
      "Understand per-question performance and completion funnels.",
      "Spot at-risk cohorts with automated alerts and tagging.",
      "Export attempt data to your BI tools in a single click.",
    ],
    icon: BarChart3,
    route: "/assessments/attempts",
    primaryAction: {
      label: "Preview roadmap",
      route: "/assessments/attempts",
      icon: ArrowRight,
    },
  },
];

const Assessments = () => {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => navigate(path);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight">Assessments hub</h1>
          <p className="mt-2 text-muted-foreground">
            Plan, launch, and monitor assessment programs with dedicated workspaces for your team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {NAVIGATION_CARDS.map((card) => {
            const Icon = card.icon;
            const PrimaryIcon = card.primaryAction.icon;
            const SecondaryIcon = card.secondaryAction?.icon;
            const isComingSoon = card.status === "comingSoon";

            return (
              <Card
                key={card.key}
                onClick={() => {
                  if (!isComingSoon) {
                    handleNavigate(card.route);
                  }
                }}
                className={[
                  "group relative flex h-full flex-col overflow-hidden border border-border/60 shadow-sm transition-all",
                  isComingSoon
                    ? "cursor-default opacity-90"
                    : "cursor-pointer hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 via-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <Badge
                        variant={card.status === "comingSoon" ? "outline" : "secondary"}
                        className="w-fit border-primary/30 text-xs uppercase tracking-wide"
                      >
                        {card.badge}
                      </Badge>
                      <div>
                        <CardTitle className="text-xl font-semibold capitalize">{card.title}</CardTitle>
                        <CardDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {card.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div
                      className={[
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                        "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
                        isComingSoon ? "group-hover:bg-primary/10 group-hover:text-primary" : "",
                      ].join(" ")}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {card.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2">
                        <span className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="relative mt-auto flex flex-wrap gap-3 pt-4">
                  {card.secondaryAction && (
                    <Button
                      variant={card.secondaryAction.variant ?? "secondary"}
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleNavigate(card.secondaryAction!.route);
                      }}
                      className="flex items-center gap-2 transition-transform hover:-translate-y-0.5"
                    >
                      {SecondaryIcon && <SecondaryIcon className="h-4 w-4" />}
                      {card.secondaryAction.label}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={isComingSoon}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleNavigate(card.primaryAction.route);
                    }}
                    className="flex items-center gap-2 transition-transform hover:translate-x-0.5"
                  >
                    <PrimaryIcon className="h-4 w-4" />
                    {card.primaryAction.label}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assessments;
