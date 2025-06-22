import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { useBookingStore } from "@/lib/booking-store";
import { useState } from "react";
import type { Activity } from "@shared/schema";

export default function ActivitiesSection() {
  const { data: activities, isLoading, error } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const { addActivity, selectedActivities } = useBookingStore();
  const [addedActivities, setAddedActivities] = useState<Set<number>>(new Set());

  const handleAddActivity = (activity: Activity) => {
    addActivity(activity);
    setAddedActivities(prev => new Set([...prev, activity.id]));
    
    // Reset the visual feedback after 2 seconds
    setTimeout(() => {
      setAddedActivities(prev => {
        const newSet = new Set(prev);
        newSet.delete(activity.id);
        return newSet;
      });
    }, 2000);
  };

  const isActivityAdded = (activityId: number) => addedActivities.has(activityId);
  const isActivitySelected = (activityId: number) => 
    selectedActivities.some(selected => selected.id === activityId);

  if (isLoading) {
    return (
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-forest mb-4">Adventure Activities</h2>
            <p className="text-xl text-gray-600">Create unforgettable memories with our exciting activities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                <div className="bg-gray-100 p-6 rounded-b-xl">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
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
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-forest mb-4">Adventure Activities</h2>
          <p className="text-red-600">Error loading activities. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="activities" className="py-20 bg-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-forest mb-4">Adventure Activities</h2>
          <p className="text-xl text-gray-600">Create unforgettable memories with our exciting activities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities?.map((activity) => (
            <Card key={activity.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src={activity.imageUrl} 
                alt={activity.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-forest mb-2">{activity.name}</h3>
                <p className="text-gray-600 mb-4">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-forest">${activity.price}/person</span>
                  <Button 
                    onClick={() => handleAddActivity(activity)}
                    className={`transition-colors ${
                      isActivityAdded(activity.id) 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-sunset hover:bg-orange-600'
                    }`}
                    disabled={isActivityAdded(activity.id)}
                  >
                    {isActivityAdded(activity.id) ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Added!
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        {isActivitySelected(activity.id) ? 'Add Another' : 'Add to Booking'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
