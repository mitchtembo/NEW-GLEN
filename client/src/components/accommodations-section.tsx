import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, ShowerHead, Flame, Car, Lock, UtensilsCrossed, Mountain } from "lucide-react";
import { useBookingStore } from "@/lib/booking-store";
import type { Accommodation } from "@shared/schema";

export default function AccommodationsSection() {
  const { data: accommodations, isLoading, error } = useQuery<Accommodation[]>({
    queryKey: ["/api/accommodations"],
  });

  const { selectAccommodation } = useBookingStore();

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      'WiFi': Wifi,
      'Private Bath': ShowerHead,
      'Shared Bath': ShowerHead,
      'Fireplace': Flame,
      'Fire Pit': Flame,
      'Parking': Car,
      'Lockers': Lock,
      'Kitchen': UtensilsCrossed,
      'Mountain View': Mountain,
    };
    
    const IconComponent = iconMap[amenity];
    return IconComponent ? <IconComponent className="w-3 h-3 mr-1" /> : null;
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'chalet':
        return 'bg-sage text-white';
      case 'dorm':
        return 'bg-sky text-white';
      case 'camping':
        return 'bg-earth text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getBadgeText = (type: string) => {
    switch (type) {
      case 'chalet':
        return 'Popular';
      case 'dorm':
        return 'Budget';
      case 'camping':
        return 'Adventure';
      default:
        return 'Available';
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-forest mb-4">Choose Your Adventure</h2>
            <p className="text-xl text-gray-600">From luxury chalets to camping under the stars</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-t-2xl"></div>
                <div className="bg-gray-100 p-6 rounded-b-2xl">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-forest mb-4">Choose Your Adventure</h2>
          <p className="text-red-600">Error loading accommodations. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="accommodations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-forest mb-4">Choose Your Adventure</h2>
          <p className="text-xl text-gray-600">From luxury chalets to camping under the stars</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {accommodations?.map((accommodation) => (
            <Card key={accommodation.id} className="overflow-hidden hover:shadow-2xl transition-shadow">
              <img 
                src={accommodation.imageUrl} 
                alt={accommodation.name}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-forest">{accommodation.name}</h3>
                  <Badge className={getBadgeColor(accommodation.type)}>
                    {getBadgeText(accommodation.type)}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{accommodation.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Up to {accommodation.maxGuests} guests</span>
                  </div>
                  <div className="text-2xl font-bold text-forest">${accommodation.pricePerNight}/night</div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {accommodation.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100 text-sm flex items-center">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <Button 
                  onClick={() => selectAccommodation(accommodation)}
                  className="w-full bg-forest text-white hover:bg-sage transition-colors font-semibold"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
