import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Calendar, Users, MapPin, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import eventHeroImage from "@/assets/event-hero.jpg";
import venue1Image from "@/assets/venue-1.jpg";
import venue2Image from "@/assets/venue-2.jpg";
import venue3Image from "@/assets/venue-3.jpg";

const chartData = [
  { month: "Jan", events: 12 },
  { month: "Feb", events: 15 },
  { month: "Mar", events: 18 },
  { month: "Apr", events: 22 },
  { month: "May", events: 28 },
  { month: "Jun", events: 35 },
];

const monthlyTrend = [
  { month: "Jan", created: 12, completed: 10 },
  { month: "Feb", created: 15, completed: 13 },
  { month: "Mar", created: 18, completed: 16 },
  { month: "Apr", created: 22, completed: 19 },
  { month: "May", created: 28, completed: 24 },
  { month: "Jun", created: 35, completed: 30 },
];

const mockEvents = [
  {
    id: 1,
    title: "Tech Innovation Summit 2024",
    description: "Annual technology conference featuring latest innovations in AI, blockchain, and cloud computing.",
    image: eventHeroImage,
    status: "active",
    attendees: 1250,
    locations: 3,
    date: "2024-07-15",
  },
  {
    id: 2,
    title: "Digital Marketing Masterclass",
    description: "Comprehensive workshop on modern digital marketing strategies and tools.",
    image: venue1Image,
    status: "upcoming",
    attendees: 450,
    locations: 1,
    date: "2024-08-02",
  },
  {
    id: 3,
    title: "Startup Networking Event",
    description: "Connect with fellow entrepreneurs, investors, and industry experts in a casual setting.",
    image: venue2Image,
    status: "completed",
    attendees: 320,
    locations: 2,
    date: "2024-06-20",
  },
  {
    id: 4,
    title: "Leadership Excellence Workshop",
    description: "Intensive leadership development program for mid to senior-level executives.",
    image: venue3Image,
    status: "active",
    attendees: 180,
    locations: 1,
    date: "2024-07-30",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [events] = useState(mockEvents);

  const totalEvents = events.length;
  const openEvents = events.filter(e => e.status === "active" || e.status === "upcoming").length;
  const closedEvents = events.filter(e => e.status === "completed").length;
  const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0);

  const handleEventClick = (eventId: number) => {
    navigate(`/event/${eventId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-success text-success-foreground";
      case "upcoming":
        return "bg-gradient-warning text-warning-foreground";
      case "completed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "upcoming":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card hover:shadow-elevated transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +20% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openEvents}</div>
              <p className="text-xs text-muted-foreground">
                Currently running or upcoming
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{closedEvents}</div>
              <p className="text-xs text-muted-foreground">
                Successfully finished
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAttendees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all events
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Events Created This Year</CardTitle>
              <CardDescription>Monthly event creation statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="events" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Event Completion Trend</CardTitle>
              <CardDescription>Created vs completed events over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="created" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="completed" stroke="hsl(var(--success))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Events Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="shadow-card hover:shadow-elevated transition-smooth cursor-pointer group"
                onClick={() => handleEventClick(event.id)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getStatusColor(event.status)} gap-1`}>
                      {getStatusIcon(event.status)}
                      {event.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees} attendees
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.locations} location{event.locations > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;