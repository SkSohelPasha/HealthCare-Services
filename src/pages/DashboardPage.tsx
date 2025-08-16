import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, FileText, Clock, Package, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface Booking {
  id: string;
  packageId: string;
  packageName: string;
  userId: string;
  date: string;
  time: string;
  notes?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  bookedAt: string;
}

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { cartItems, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load user bookings
    const storedBookings = JSON.parse(localStorage.getItem('wellhaven_bookings') || '[]');
    const userBookings = storedBookings.filter((booking: Booking) => booking.userId === user.id);
    setBookings(userBookings);
  }, [user, navigate]);

  // Update current date every day
  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(new Date());
    };

    // Update immediately
    updateDate();

    // Update every hour to ensure we catch date changes
    const interval = setInterval(updateDate, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return null;
  }

  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const today = new Date(currentDate.toDateString()); // Use current date state
    return bookingDate >= today && booking.status === 'confirmed';
  });

  const pastBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const today = new Date(currentDate.toDateString()); // Use current date state
    return bookingDate < today || booking.status === 'completed';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-secondary text-secondary-foreground';
      case 'completed':
        return 'bg-primary text-primary-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBookingUpdate = (bookingId: string, newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
    
    // Update localStorage
    const allBookings = JSON.parse(localStorage.getItem('wellhaven_bookings') || '[]');
    const updatedAllBookings = allBookings.map((booking: Booking) => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    );
    localStorage.setItem('wellhaven_bookings', JSON.stringify(updatedAllBookings));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your health appointments and track your wellness journey.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Today is {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-secondary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-healthcare-teal" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Cart Items</p>
                  <p className="text-2xl font-bold">{cartItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-healthcare-green" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Cart Total</p>
                  <p className="text-2xl font-bold">₹{getTotalPrice()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="cart">Cart</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>
                  Your scheduled health checkups and appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming appointments</h3>
                    <p className="text-muted-foreground mb-4">Book a health checkup to get started</p>
                    <Button onClick={() => navigate('/packages')}>
                      Browse Health Packages
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="healthcare-card">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{booking.packageName}</h4>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(booking.date)} at {booking.time}
                            </div>
                            {booking.notes && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Notes: {booking.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                            {booking.status === 'confirmed' && (
                              <div className="flex space-x-1">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleBookingUpdate(booking.id, 'completed')}
                                >
                                  Complete
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleBookingUpdate(booking.id, 'cancelled')}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Past Appointments
                </CardTitle>
                <CardDescription>
                  Your appointment history and completed checkups
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pastBookings.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No past appointments yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <div key={booking.id} className="healthcare-card opacity-75">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{booking.packageName}</h4>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(booking.date)} at {booking.time}
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your personal information and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground font-medium">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <p className="text-foreground font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Patient ID</label>
                    <p className="text-foreground font-medium">WH-{user.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <p className="text-foreground font-medium">2024</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex space-x-4">
                    <Button variant="outline" disabled>
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Your Cart
                </CardTitle>
                <CardDescription>
                  Health packages ready for booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground mb-4">Add some health packages to get started</p>
                    <Button onClick={() => navigate('/packages')}>
                      Browse Packages
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.package.id} className="healthcare-card">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{item.package.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.package.description}</p>
                            <div className="flex items-center mt-2">
                              <span className="text-lg font-bold text-primary">₹{item.package.price}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                Quantity: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate(`/package/${item.package.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total: ₹{getTotalPrice()}</span>
                        <Button className="medical-button">
                          Proceed to Checkout
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;