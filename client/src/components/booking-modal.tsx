import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useBookingStore } from "@/lib/booking-store";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
// import type { InsertBooking } from "@shared/schema"; // Removed

// Using 'any' for InsertBooking for now, as the actual backend submission is removed.
// If specific structure is needed for other client logic, define it here.
type InsertBooking = any;

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function BookingModal() {
  const { 
    showBookingModal, 
    setShowBookingModal, 
    selectedAccommodation,
    selectedActivities,
    bookingData,
    clearBooking
  } = useBookingStore();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const calculateTotal = () => {
    if (!selectedAccommodation || !bookingData.checkIn || !bookingData.checkOut) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    const accommodationTotal = parseFloat(selectedAccommodation.pricePerNight) * nights;
    const activitiesTotal = selectedActivities.reduce((sum, activity) => 
      sum + parseFloat(activity.price), 0
    );
    
    return accommodationTotal + activitiesTotal;
  };

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: InsertBooking) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your reservation has been successfully created. You will receive a confirmation email shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      clearBooking();
      setShowBookingModal(false);
      setGuestInfo({ firstName: "", lastName: "", email: "", phone: "" });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
      console.error("Booking error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccommodation || !bookingData.checkIn || !bookingData.checkOut) {
      toast({
        title: "Missing Information",
        description: "Please ensure all required fields are filled.",
        variant: "destructive",
      });
      return;
    }

    const bookingPayload: InsertBooking = {
      guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
      guestEmail: guestInfo.email,
      guestPhone: guestInfo.phone,
      accommodationId: selectedAccommodation.id,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      totalPrice: calculateTotal().toFixed(2),
      activities: selectedActivities.map(activity => ({
        activityId: activity.id,
        quantity: 1,
      })),
    };

    createBookingMutation.mutate(bookingPayload);
  };

  const handleClose = () => {
    setShowBookingModal(false);
  };

  const getNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Dialog open={showBookingModal} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-forest">Confirm Your Booking</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-warm-gray rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Booking Summary</h3>
            <div className="space-y-2">
              {selectedAccommodation && (
                <div className="flex justify-between">
                  <span>{selectedAccommodation.name}</span>
                  <span>{getNights()} nights × ${selectedAccommodation.pricePerNight}</span>
                  <span className="font-semibold">
                    ${(parseFloat(selectedAccommodation.pricePerNight) * getNights()).toFixed(2)}
                  </span>
                </div>
              )}
              
              {selectedActivities.map((activity) => (
                <div key={activity.id} className="flex justify-between text-gray-600">
                  <span>{activity.name}</span>
                  <span>1 person</span>
                  <span>${activity.price}</span>
                </div>
              ))}
              
              <Separator className="my-3" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-forest">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={guestInfo.firstName}
                  onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={guestInfo.lastName}
                  onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button type="button" onClick={handleClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-forest hover:bg-sage"
              disabled={createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? "Confirming..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
