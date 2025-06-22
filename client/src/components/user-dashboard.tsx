import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/lib/booking-store";
import { Link } from "wouter";

export default function UserDashboard() {
  const { showUserDashboard, setShowUserDashboard } = useBookingStore();

  const handleClose = () => {
    setShowUserDashboard(false);
  };

  return (
    <Dialog open={showUserDashboard} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-forest text-center">
            Access Your Bookings
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            View and manage your reservations, extend your stay, and book additional activities.
          </p>
          
          <div className="space-y-3">
            <Link href="/dashboard">
              <Button 
                className="w-full bg-forest hover:bg-sage"
                onClick={handleClose}
              >
                Go to Dashboard
              </Button>
            </Link>
            
            <Button variant="outline" onClick={handleClose} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
