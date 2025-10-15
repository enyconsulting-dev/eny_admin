import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MapPin, Users, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import eventHero from "@/assets/event-hero.jpg";
import venue1 from "@/assets/venue-1.jpg";
import venue2 from "@/assets/venue-2.jpg";
import venue3 from "@/assets/venue-3.jpg";

// Dummy data for events
const dummyEvents = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description: "The biggest tech conference of the year featuring industry leaders and cutting-edge innovations.",
    image: eventHero,
    date: "2024-03-15",
    status: "open",
    totalLocations: 3,
    totalRegistered: 1250
  },
  {
    id: 2,
    title: "Business Summit",
    description: "A premier business networking event bringing together entrepreneurs and investors.",
    image: venue1,
    date: "2024-04-20",
    status: "open",
    totalLocations: 2,
    totalRegistered: 800
  },
  {
    id: 3,
    title: "Design Workshop",
    description: "Hands-on design workshop for creative professionals and aspiring designers.",
    image: venue2,
    date: "2024-02-10",
    status: "closed",
    totalLocations: 1,
    totalRegistered: 150
  }
];

const Events = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">Manage all your events</p>
          </div>
          <Link to="/events/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyEvents.map((event) => (
            <Card key={event.id} className="shadow-card hover:shadow-elevated transition-all duration-300 group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'open' 
                      ? 'bg-success/20 text-success-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {event.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.totalLocations} locations
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {event.totalRegistered} registered
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Link to={`/event/${event.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/events/edit/${event.id}`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Events;