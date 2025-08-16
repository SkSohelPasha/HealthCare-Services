import { useState } from 'react';
import { ShoppingCart, X, Trash2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';  
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, removeFromCart, getTotalPrice, getCartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const handleBookNow = () => {
    setIsOpen(false);
    navigate('/login'); // Navigate to login for booking
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative"
        >
          <ShoppingCart className="w-5 h-5" />
          {getCartCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
              {getCartCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Cart ({getCartCount()} items)
          </SheetTitle>
          <SheetDescription>
            Review your selected health packages and proceed to booking.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-medium text-foreground">Your cart is empty</h3>
                  <p className="text-muted-foreground">Add some health packages to get started</p>
                </div>
                <Button onClick={() => {
                  setIsOpen(false);
                  navigate('/packages');
                }}>
                  Browse Packages
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.package.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{item.package.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.package.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{item.package.category}</Badge>
                          <span className="text-sm text-muted-foreground">{item.package.duration}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.package.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {item.selectedDate && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{item.selectedDate}</span>
                        </div>
                        {item.selectedTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{item.selectedTime}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Quantity:</span>
                        <Badge variant="outline">{item.quantity}</Badge>
                      </div>
                      <div className="text-right">
                        {item.package.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{(item.package.originalPrice * item.quantity).toLocaleString()}
                          </span>
                        )}
                        <div className="text-lg font-semibold text-primary">
                          ₹{(item.package.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-primary">₹{getTotalPrice().toLocaleString()}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={clearCart}
                    disabled={cartItems.length === 0}
                  >
                    Clear Cart
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleBookNow}
                    disabled={cartItems.length === 0}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};