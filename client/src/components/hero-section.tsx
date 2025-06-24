import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Mountain, Trees, Waves, Star } from "lucide-react";
import { useBookingStore } from "@/lib/booking-store";
import { Link } from "wouter";

export default function HeroSection() {
  const [searchData, setSearchData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1"
  });

  const { setBookingData } = useBookingStore();

  const handleSearch = () => {
    setBookingData({
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: parseInt(searchData.guests)
    });
    
    // Navigate to accommodations page
    window.location.href = '/accommodations';
  };

  return (
    <>
      {/* Hero Banner */}
      <section 
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(45, 80, 22, 0.3), rgba(45, 80, 22, 0.3)), url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1000')`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Escape to Nature</h1>
            <p className="text-xl md:text-2xl mb-12 opacity-90">
              Experience the perfect blend of adventure and comfort at Glencity Camping Resort
            </p>
            
            {/* Booking Widget */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-gray-800 max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-forest">Book Your Stay</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="checkin" className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </Label>
                  <Input
                    id="checkin"
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="checkout" className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </Label>
                  <Input
                    id="checkout"
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                    min={searchData.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </Label>
                  <Select value={searchData.guests} onValueChange={(value) => setSearchData({ ...searchData, guests: value })}>
                    <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent">
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                      <SelectItem value="5">5 Guests</SelectItem>
                      <SelectItem value="6">6+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSearch}
                    className="w-full bg-sunset text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                    disabled={!searchData.checkIn || !searchData.checkOut}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-forest mb-4">Why Choose Glencity Resort?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what makes our camping resort the perfect destination for your next adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-forest mb-3">Stunning Location</h3>
              <p className="text-gray-600">
                Nestled in the heart of pristine wilderness with breathtaking mountain views and crystal-clear lakes.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-earth rounded-full flex items-center justify-center mx-auto mb-4">
                <Trees className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-forest mb-3">Adventure Activities</h3>
              <p className="text-gray-600">
                From horse riding to quad biking, team building to peaceful kayaking - adventure awaits at every turn.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sunset rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-forest mb-3">Comfort Options</h3>
              <p className="text-gray-600">
                Choose from luxury chalets, budget-friendly dorms, or authentic camping experiences to suit your style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-forest to-sage text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for Your Adventure?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of happy guests who have discovered the magic of Glencity Resort. 
            Book your stay today and create memories that will last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/accommodations">
              <Button size="lg" className="bg-white text-forest hover:bg-gray-100 px-8 py-3">
                Explore Accommodations
              </Button>
            </Link>
            <Link href="/activities">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-forest px-8 py-3">
                View Activities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
