import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Award, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getFeaturedPackages } from '@/data/packages';
import { useCart } from '@/contexts/CartContext';

const HomePage = () => {
  const featuredPackages = getFeaturedPackages();
  const { addToCart } = useCart();

  const features = [
    {
      icon: CheckCircle,
      title: 'Certified Professionals',
      description: 'Our team consists of board-certified doctors and healthcare specialists'
    },
    {
      icon: Users,
      title: 'Personalized Care',
      description: 'Tailored health packages designed to meet your specific needs'
    },
    {
      icon: Award,
      title: 'Advanced Technology',
      description: 'State-of-the-art medical equipment for accurate diagnostics'
    },
    {
      icon: Clock,
      title: 'Quick Results',
      description: 'Get your health reports within 24-48 hours of your checkup'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 trust-gradient opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Your Health, Our{' '}
              <span className="text-primary">Priority</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Comprehensive health checkups and professional medical care. 
              Book your appointment today and take the first step towards a healthier you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="medical-button" asChild>
                <Link to="/packages">
                  Book Health Checkup
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/packages">View All Packages</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose WellHaven Health?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine medical expertise with compassionate care to provide you with the best healthcare experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="healthcare-card text-center medical-hover animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Health Packages
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our most popular health checkup packages designed by medical experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg, index) => (
              <Card 
                key={pkg.id} 
                className="healthcare-card medical-hover animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm ml-1">Featured</span>
                    </div>
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-primary">₹{pkg.price}</span>
                      {pkg.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{pkg.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Duration: {pkg.duration}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Key Inclusions:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {pkg.inclusions.slice(0, 3).map((inclusion, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-secondary mr-2 flex-shrink-0" />
                          {inclusion}
                        </li>
                      ))}
                      {pkg.inclusions.length > 3 && (
                        <li className="text-primary text-sm">
                          +{pkg.inclusions.length - 3} more inclusions
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-2">
                  <Button 
                    className="w-full medical-button"
                    onClick={() => addToCart(pkg)}
                  >
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/package/${pkg.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/packages">
                View All Packages
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-lg">Happy Patients</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg">Health Packages</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-lg">Specialist Doctors</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg">Emergency Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Contact Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get in touch with our healthcare team for any queries or assistance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="healthcare-card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Operating Hours</h3>
              <p className="text-muted-foreground">
                Mon - Fri: 8:00 AM - 8:00 PM<br />
                Sat - Sun: 9:00 AM - 6:00 PM
              </p>
            </div>
            
            <div className="healthcare-card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
              <p className="text-muted-foreground">
                Phone: +1 (555) 123-4567<br />
                Email: info@wellhaven.com
              </p>
            </div>
            
            <div className="healthcare-card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Emergency</h3>
              <p className="text-muted-foreground">
                24/7 Emergency: +1 (555) 911-HELP<br />
                Available round the clock
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;