import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ArrowLeft, MapPin, Users, Calendar, Clock, CheckCircle, AlertTriangle, PlayCircle, Eye, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import eventHeroImage from "@/assets/event-hero.jpg";
import venue1Image from "@/assets/venue-1.jpg";
import venue2Image from "@/assets/venue-2.jpg";
import venue3Image from "@/assets/venue-3.jpg";

const mockEventDetails = {
  1: {
    id: 1,
    title: "Tech Innovation Summit 2024",
    description: "Annual technology conference featuring latest innovations in AI, blockchain, and cloud computing. Join industry leaders, startups, and tech enthusiasts for three days of inspiring talks, workshops, and networking opportunities.",
    image: eventHeroImage,
    status: "active",
    totalAttendees: 1250,
    date: "2024-07-15",
    locations: [
      {
        id: 1,
        name: "Main Convention Center",
        address: "123 Tech Avenue, Silicon Valley",
        image: venue1Image,
        date: "2024-07-15",
        time: "09:00 AM",
        status: "active",
        attendees: 850,
      },
      {
        id: 2,
        name: "Innovation Hub",
        address: "456 Startup Street, Tech District",
        image: venue2Image,
        date: "2024-07-16",
        time: "10:00 AM",
        status: "upcoming",
        attendees: 300,
      },
      {
        id: 3,
        name: "Future Center",
        address: "789 Innovation Boulevard, Downtown",
        image: venue3Image,
        date: "2024-07-17",
        time: "11:00 AM",
        status: "upcoming",
        attendees: 100,
      },
    ],
  },
};

// Dummy pricing data
const dummyPricing = [
  {
    id: 1,
    name: "VIP Package",
    price: 299,
    currency: "USD",
    locationId: 1,
    locationName: "Main Convention Center",
    benefits: ["Premium seating", "Meet & greet with speakers", "Exclusive lunch", "Gift bag", "Priority access", "VIP lounge access"]
  },
  {
    id: 2,
    name: "Standard Ticket",
    price: 99,
    currency: "USD", 
    locationId: 1,
    locationName: "Main Convention Center",
    benefits: ["General admission", "Conference materials", "Coffee breaks", "Networking sessions"]
  },
  {
    id: 3,
    name: "Workshop Access",
    price: 149,
    currency: "USD",
    locationId: 2,
    locationName: "Innovation Hub",
    benefits: ["All workshop sessions", "Hands-on materials", "Certificate of completion", "Take-home resources"]
  },
  {
    id: 4,
    name: "Networking Pass",
    price: 49,
    currency: "USD",
    locationId: 3,
    locationName: "Future Center", 
    benefits: ["Access to networking events", "Welcome drink", "Business card exchange", "Light refreshments"]
  }
];

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event] = useState(mockEventDetails[Number(eventId) as keyof typeof mockEventDetails]);
  const [showPricingDialog, setShowPricingDialog] = useState(false);

  if (!event) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const activeLocations = event.locations.filter(l => l.status === "active").length;
  const upcomingLocations = event.locations.filter(l => l.status === "upcoming").length;
  const endedLocations = event.locations.filter(l => l.status === "ended").length;
  const totalLocations = event.locations.length;

  const handleLocationClick = (locationId: number) => {
    navigate(`/event/${eventId}/location/${locationId}`);
  };

  const getLocationStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-success text-success-foreground";
      case "upcoming":
        return "bg-gradient-warning text-warning-foreground";
      case "ended":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getLocationStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <PlayCircle className="h-4 w-4" />;
      case "upcoming":
        return <Clock className="h-4 w-4" />;
      case "ended":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Event Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-success text-success-foreground">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {event.status}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{event.title}</CardTitle>
                <CardDescription className="text-base">{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {event.totalAttendees} total attendees
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {totalLocations} locations
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link to={`/events/edit/${eventId}`}>
                    <Button variant="outline" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Event
                    </Button>
                  </Link>
                  <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View Pricing
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Event Pricing Options</DialogTitle>
                        <DialogDescription>
                          Manage pricing packages for {event.title}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {dummyPricing.map((pricing) => (
                          <Card key={pricing.id}>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{pricing.name}</CardTitle>
                                  <CardDescription>{pricing.locationName}</CardDescription>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-primary">
                                    {pricing.currency} {pricing.price}
                                  </div>
                                  <Button size="sm" className="mt-2">
                                    Edit Price
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div>
                                <h4 className="font-medium mb-2">Included Benefits:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {pricing.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                      {benefit}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <Separator />
                        
                        <div className="flex justify-between items-center pt-4">
                          <span className="text-sm text-muted-foreground">
                            {dummyPricing.length} pricing options available
                          </span>
                          <Button>
                            Add New Pricing
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button>Manage Registration</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Stats */}
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLocations}</div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{activeLocations}</div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Upcoming Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{upcomingLocations}</div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{event.totalAttendees}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location Cards */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Event Locations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {event.locations.map((location) => (
              <Card
                key={location.id}
                className="shadow-card hover:shadow-elevated transition-smooth cursor-pointer group"
                onClick={() => handleLocationClick(location.id)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getLocationStatusColor(location.status)} gap-1`}>
                      {getLocationStatusIcon(location.status)}
                      {location.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{location.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{location.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(location.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {location.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {location.attendees} registered attendees
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

export default EventDetail;