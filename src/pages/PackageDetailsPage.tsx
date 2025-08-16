import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Calendar, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getPackageById } from '@/data/packages';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const PackageDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  
  const pkg = id ? getPackageById(id) : undefined;

  if (!pkg) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Package Not Found</h1>
          <p className="text-muted-foreground mb-8">The health package you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/packages')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Packages
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleAddToCart = () => {
    addToCart(pkg);
    toast({
      title: "Added to Cart",
      description: `${pkg.name} has been added to your cart.`,
    });
  };

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book an appointment.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Incomplete Information",
        description: "Please select both date and time for your appointment.",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);
    
    // Simulate booking process
    setTimeout(() => {
      const booking = {
        id: Date.now().toString(),
        packageId: pkg.id,
        packageName: pkg.name,
        userId: user.id,
        date: selectedDate,
        time: selectedTime,
        notes,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      };

      // Store booking
      const existingBookings = JSON.parse(localStorage.getItem('wellhaven_bookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('wellhaven_bookings', JSON.stringify(existingBookings));

      setIsBooking(false);
      toast({
        title: "Booking Confirmed!",
        description: `Your appointment for ${pkg.name} on ${selectedDate} at ${selectedTime} has been confirmed.`,
      });
      
      navigate('/dashboard');
    }, 2000);
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/packages')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Packages
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="healthcare-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{pkg.name}</h1>
                  <div className="flex items-center space-x-3">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {pkg.category}
                    </span>
                    {pkg.featured && (
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        <span className="text-sm">Featured Package</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-primary">₹{pkg.price}</span>
                    {pkg.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{pkg.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {pkg.duration}
                  </div>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">{pkg.description}</p>
            </div>

            {/* Inclusions */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pkg.inclusions.map((inclusion, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{inclusion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Preparation Instructions:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Fast for 12 hours before blood tests (water is allowed)</li>
                    <li>• Wear comfortable, loose-fitting clothing</li>
                    <li>• Bring a valid ID and insurance card if applicable</li>
                    <li>• Arrive 15 minutes before your scheduled time</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What to Expect:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Registration and initial assessment</li>
                    <li>• Various tests as per package inclusions</li>
                    <li>• Doctor consultation and report review</li>
                    <li>• Health recommendations and follow-up plan</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full medical-button"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full">
                  Share Package
                </Button>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={minDate}
                    max={maxDateStr}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Preferred Time</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="text-xs"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Special Requirements (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific requirements or health conditions we should know about..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button 
                  className="w-full medical-button"
                  onClick={handleBookNow}
                  disabled={isBooking || !selectedDate || !selectedTime}
                >
                  {isBooking ? 'Booking...' : 'Book Now'}
                </Button>

                {!user && (
                  <p className="text-xs text-muted-foreground text-center">
                    You need to login to book an appointment
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Call us at: <strong>+1 (555) 123-4567</strong></p>
                <p>Email: <strong>info@wellhaven.com</strong></p>
                <p className="text-muted-foreground">
                  Our healthcare advisors are available Monday to Friday, 8 AM to 6 PM
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PackageDetailsPage;