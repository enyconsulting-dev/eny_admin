import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ArrowLeft, Search, Users, CreditCard, Clock, CheckCircle, Mail, Phone } from "lucide-react";

const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    registeredAt: "2024-06-01T10:30:00Z",
    paymentStatus: "paid",
    amount: 299,
    company: "Tech Corp",
    role: "Senior Developer",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1 (555) 234-5678",
    registeredAt: "2024-06-02T14:15:00Z",
    paymentStatus: "paid",
    amount: 299,
    company: "Innovation Labs",
    role: "Product Manager",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@startup.io",
    phone: "+1 (555) 345-6789",
    registeredAt: "2024-06-03T09:45:00Z",
    paymentStatus: "pending",
    amount: 299,
    company: "StartupCo",
    role: "CTO",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@enterprise.com",
    phone: "+1 (555) 456-7890",
    registeredAt: "2024-06-04T16:20:00Z",
    paymentStatus: "paid",
    amount: 299,
    company: "Enterprise Solutions",
    role: "Engineering Manager",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@freelance.com",
    phone: "+1 (555) 567-8901",
    registeredAt: "2024-06-05T11:10:00Z",
    paymentStatus: "pending",
    amount: 299,
    company: "Freelancer",
    role: "Full Stack Developer",
  },
];

const LocationUsers = () => {
  const { eventId, locationId } = useParams();
  const navigate = useNavigate();
  const [users] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const paidUsers = users.filter(u => u.paymentStatus === "paid").length;
  const pendingUsers = users.filter(u => u.paymentStatus === "pending").length;
  const totalRevenue = users.filter(u => u.paymentStatus === "paid").reduce((sum, u) => sum + u.amount, 0);

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-gradient-success text-success-foreground";
      case "pending":
        return "bg-gradient-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/event/${eventId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Event
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Location Attendees</h1>
            <p className="text-muted-foreground">Manage registered users for this location</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidUsers}</div>
              <p className="text-xs text-muted-foreground">
                {((paidUsers / totalUsers) * 100).toFixed(1)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingUsers}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From completed payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
            <CardDescription>List of all users registered for this location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users, emails, or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="shadow-card hover:shadow-elevated transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-gradient-primary rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.role} at {user.company}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {user.phone}
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm text-muted-foreground">
                          Registered: {new Date(user.registeredAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold">${user.amount}</div>
                          <Badge className={`${getPaymentStatusColor(user.paymentStatus)} gap-1 mt-1`}>
                            {getPaymentStatusIcon(user.paymentStatus)}
                            {user.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LocationUsers;