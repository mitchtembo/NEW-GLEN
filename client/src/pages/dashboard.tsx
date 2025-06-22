import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Clock, DollarSign, Plus, Edit, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import type { BookingWithDetails } from "@shared/schema";

export default function Dashboard() {
  const [guestEmail, setGuestEmail] = useState("");
  
  const { data: bookings, isLoading, error } = useQuery<BookingWithDetails[]>({
    queryKey: ["/api/bookings", guestEmail],
    enabled: !!guestEmail,
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Email is automatically used in the query when set
  };

  if (!guestEmail) {
    return (
      <div className="min-h-screen bg-warm-gray flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-forest text-center">Access Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-forest hover:bg-sage">
                View Bookings
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-warm-gray flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">Error loading bookings</p>
            <Button onClick={() => setGuestEmail("")} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentBookings = bookings?.filter(booking => 
    new Date(booking.checkOut) >= new Date() && booking.status !== 'cancelled'
  ) || [];
  
  const pastBookings = bookings?.filter(booking => 
    new Date(booking.checkOut) < new Date() || booking.status === 'cancelled'
  ) || [];

  return (
    <div className="min-h-screen bg-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-forest">My Bookings Dashboard</h1>
            <p className="text-gray-600">Welcome back, {guestEmail}</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setGuestEmail("")} variant="outline">
              Switch Account
            </Button>
            <Link href="/">
              <Button className="bg-forest hover:bg-sage">
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Button>
            </Link>
          </div>
        </div>

        {/* Current Bookings */}
        {currentBookings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-forest mb-6">Current Reservations</h2>
            <div className="grid gap-6">
              {currentBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-forest to-sage text-white p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm opacity-75">Accommodation</p>
                        <p className="font-semibold text-lg">{booking.accommodation.name}</p>
                        <Badge variant="secondary" className="mt-1 bg-white/20 text-white">
                          {booking.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm opacity-75">Check-in / Check-out</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-semibold">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.guests} guests</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm opacity-75">Total Cost</p>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-xl">${booking.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-6">
                      <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Extend Stay
                      </Button>
                      <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                        <Edit className="w-4 h-4 mr-2" />
                        Modify Booking
                      </Button>
                      <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                  
                  {/* Activities */}
                  {booking.activityBookings.length > 0 && (
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-forest mb-4">Your Activities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {booking.activityBookings.map((activityBooking) => (
                          <div key={activityBooking.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-800">{activityBooking.activity.name}</h4>
                                <p className="text-gray-600 text-sm">
                                  {activityBooking.scheduledDate 
                                    ? new Date(activityBooking.scheduledDate).toLocaleDateString()
                                    : 'Date TBD'
                                  }
                                </p>
                                {activityBooking.quantity > 1 && (
                                  <p className="text-gray-600 text-sm">Qty: {activityBooking.quantity}</p>
                                )}
                              </div>
                              <span className="text-forest font-semibold">${activityBooking.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-forest mb-6">Booking History</h2>
            <div className="grid gap-4">
              {pastBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{booking.accommodation.name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.guests} guests</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={booking.status === 'cancelled' ? 'destructive' : 'secondary'}>
                          {booking.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                        </Badge>
                        <p className="text-gray-600 mt-1">${booking.totalPrice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Bookings */}
        {bookings && bookings.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">No bookings found</h3>
              <p className="text-gray-600 mb-6">You haven't made any bookings with this email address yet.</p>
              <Link href="/">
                <Button className="bg-forest hover:bg-sage">
                  Make Your First Booking
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
