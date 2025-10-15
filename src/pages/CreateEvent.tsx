import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, MapPin, DollarSign, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Dummy data
const dummyEvent = {
  id: 1,
  title: "Tech Conference 2024",
  description: "The biggest tech conference of the year featuring industry leaders and cutting-edge innovations.",
  date: "2024-03-15",
  image: "/api/placeholder/600/300"
};

const dummyLocations = [
  { 
    id: 1, 
    address: "123 Tech Street, Silicon Valley", 
    venue: "Main Conference Hall",
    availableSit: 500,
    state: "California",
    country: "USA",
    startDate: "2024-03-15",
    percentageOff: 10,
    endDate: "2024-03-16",
    startTime: "09:00",
    endTime: "18:00",
    eventId: 1 
  },
  { 
    id: 2, 
    address: "456 Innovation Ave, Tech City", 
    venue: "Workshop Room A",
    availableSit: 100,
    state: "California",
    country: "USA",
    startDate: "2024-03-15",
    percentageOff: 5,
    endDate: "2024-03-15",
    startTime: "10:00",
    endTime: "16:00",
    eventId: 1 
  },
  { 
    id: 3, 
    address: "789 Business Blvd, Startup District", 
    venue: "Networking Lounge",
    availableSit: 200,
    state: "California",
    country: "USA",
    startDate: "2024-03-16",
    percentageOff: 0,
    endDate: "2024-03-16",
    startTime: "14:00",
    endTime: "20:00",
    eventId: 1 
  }
];

const dummyPricing = [
  {
    id: 1,
    tableName: "VIP Table",
    price: 299,
    currency: "USD",
    locationId: 1,
    benefits: ["Premium seating", "Meet & greet", "Exclusive lunch", "Gift bag", "Priority access"]
  },
  {
    id: 2,
    tableName: "Standard Table",
    price: 99,
    currency: "USD", 
    locationId: 1,
    benefits: ["General admission", "Conference materials", "Coffee breaks"]
  }
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [eventId, setEventId] = useState(id ? parseInt(id) : null);
  
  const [formData, setFormData] = useState({
    title: isEdit ? dummyEvent.title : "",
    description: isEdit ? dummyEvent.description : "",
    date: isEdit ? dummyEvent.date : "",
    image: isEdit ? dummyEvent.image : ""
  });

  const [locations, setLocations] = useState(isEdit ? dummyLocations : []);
  const [pricing, setPricing] = useState(isEdit ? dummyPricing : []);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [newLocation, setNewLocation] = useState({ 
    address: "",
    venue: "",
    availableSit: "",
    state: "",
    country: "",
    startDate: "",
    percentageOff: "",
    endDate: "",
    startTime: "",
    endTime: ""
  });
  const [newPricing, setNewPricing] = useState({
    tableName: "",
    price: "",
    currency: "USD",
    locationId: "",
    benefits: [""]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would save to database
    console.log("Saving event:", formData);
    
    // Create event and move to next step
    const newEventId = Date.now();
    setEventId(newEventId);
    setCurrentStep(2);
  };

  const handleFinish = () => {
    navigate("/events");
  };

  const handleAddLocation = () => {
    const location = {
      id: Date.now(),
      address: newLocation.address,
      venue: newLocation.venue,
      availableSit: parseInt(newLocation.availableSit),
      state: newLocation.state,
      country: newLocation.country,
      startDate: newLocation.startDate,
      percentageOff: parseFloat(newLocation.percentageOff) || 0,
      endDate: newLocation.endDate,
      startTime: newLocation.startTime,
      endTime: newLocation.endTime,
      eventId: eventId!
    };
    setLocations([...locations, location]);
    setNewLocation({ 
      address: "",
      venue: "",
      availableSit: "",
      state: "",
      country: "",
      startDate: "",
      percentageOff: "",
      endDate: "",
      startTime: "",
      endTime: ""
    });
    setShowLocationDialog(false);
  };

  const handleAddPricing = () => {
    const pricingItem = {
      id: Date.now(),
      tableName: newPricing.tableName,
      price: parseFloat(newPricing.price),
      currency: newPricing.currency,
      locationId: parseInt(newPricing.locationId),
      benefits: newPricing.benefits.filter(b => b.trim() !== "")
    };
    setPricing([...pricing, pricingItem]);
    setNewPricing({ tableName: "", price: "", currency: "USD", locationId: "", benefits: [""] });
    setShowPricingDialog(false);
  };

  const addBenefit = () => {
    setNewPricing({ ...newPricing, benefits: [...newPricing.benefits, ""] });
  };

  const updateBenefit = (index: number, value: string) => {
    const updatedBenefits = [...newPricing.benefits];
    updatedBenefits[index] = value;
    setNewPricing({ ...newPricing, benefits: updatedBenefits });
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = newPricing.benefits.filter((_, i) => i !== index);
    setNewPricing({ ...newPricing, benefits: updatedBenefits });
  };

  const steps = [
    { number: 1, title: "Event Details", description: "Basic event information" },
    { number: 2, title: "Locations", description: "Add event locations" },
    { number: 3, title: "Pricing", description: "Set up pricing options" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/events">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create New Event</h1>
            <p className="text-muted-foreground">Follow the steps to set up your event</p>
          </div>
        </div>

        {/* Stepper */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= step.number 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-muted-foreground text-muted-foreground"
                    }`}>
                      {step.number}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 ${
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Event Details */}
        {currentStep === 1 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter event title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter event description"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Event Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    Continue to Locations
                  </Button>
                  <Link to="/events">
                    <Button type="button" variant="outline">Cancel</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Locations */}
        {currentStep === 2 && (
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Event Locations
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add at least one location to continue
                  </p>
                </div>
                <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Location
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Location</DialogTitle>
                      <DialogDescription>
                        Add a new location for this event
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-2">
                        <Label htmlFor="venue">Venue Name</Label>
                        <Input
                          id="venue"
                          value={newLocation.venue}
                          onChange={(e) => setNewLocation({ ...newLocation, venue: e.target.value })}
                          placeholder="e.g. Main Conference Hall"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={newLocation.address}
                          onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                          placeholder="Enter full address"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={newLocation.state}
                            onChange={(e) => setNewLocation({ ...newLocation, state: e.target.value })}
                            placeholder="State"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={newLocation.country}
                            onChange={(e) => setNewLocation({ ...newLocation, country: e.target.value })}
                            placeholder="Country"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="availableSit">Available Seats</Label>
                        <Input
                          id="availableSit"
                          type="number"
                          value={newLocation.availableSit}
                          onChange={(e) => setNewLocation({ ...newLocation, availableSit: e.target.value })}
                          placeholder="Number of available seats"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={newLocation.startDate}
                            onChange={(e) => setNewLocation({ ...newLocation, startDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">End Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={newLocation.endDate}
                            onChange={(e) => setNewLocation({ ...newLocation, endDate: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={newLocation.startTime}
                            onChange={(e) => setNewLocation({ ...newLocation, startTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={newLocation.endTime}
                            onChange={(e) => setNewLocation({ ...newLocation, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="percentageOff">Discount Percentage</Label>
                        <Input
                          id="percentageOff"
                          type="number"
                          min="0"
                          max="100"
                          value={newLocation.percentageOff}
                          onChange={(e) => setNewLocation({ ...newLocation, percentageOff: e.target.value })}
                          placeholder="0-100"
                        />
                      </div>
                      
                      <Button onClick={handleAddLocation} className="w-full">
                        Add Location
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 mb-6">
                {locations.map((location) => (
                  <div key={location.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{location.venue}</h4>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                    <p className="text-sm text-muted-foreground">{location.state}, {location.country}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {location.availableSit} seats
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {location.startDate} - {location.endDate}
                      </div>
                      {location.percentageOff > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {location.percentageOff}% off
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {locations.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No locations added yet. Add at least one location to continue.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)}
                  disabled={locations.length === 0}
                >
                  Continue to Pricing
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Pricing */}
        {currentStep === 3 && (
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing Options
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add pricing options for your event (optional)
                  </p>
                </div>
                <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Pricing
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Pricing</DialogTitle>
                      <DialogDescription>
                        Create a new pricing option for this event
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="tableName">Table Name</Label>
                        <Input
                          id="tableName"
                          value={newPricing.tableName}
                          onChange={(e) => setNewPricing({ ...newPricing, tableName: e.target.value })}
                          placeholder="e.g. VIP Table"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            value={newPricing.price}
                            onChange={(e) => setNewPricing({ ...newPricing, price: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <Select value={newPricing.currency} onValueChange={(value) => setNewPricing({ ...newPricing, currency: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Select value={newPricing.locationId} onValueChange={(value) => setNewPricing({ ...newPricing, locationId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.id} value={location.id.toString()}>
                                {location.venue}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Benefits</Label>
                        {newPricing.benefits.map((benefit, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={benefit}
                              onChange={(e) => updateBenefit(index, e.target.value)}
                              placeholder="Enter benefit"
                            />
                            {newPricing.benefits.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeBenefit(index)}
                              >
                                ×
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addBenefit} className="w-full">
                          Add Benefit
                        </Button>
                      </div>
                      
                      <Button onClick={handleAddPricing} className="w-full">
                        Add Pricing
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {pricing.map((price) => (
                  <div key={price.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{price.tableName}</h4>
                      <span className="font-bold text-primary">
                        {price.currency} {price.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {locations.find(l => l.id === price.locationId)?.venue}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {price.benefits.slice(0, 2).map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                      {price.benefits.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{price.benefits.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {pricing.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No pricing options added yet. Add pricing to complete your event setup.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  Back
                </Button>
                <Button onClick={handleFinish}>
                  Finish & View Events
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateEvent;