import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import BookingModal from "@/components/booking-modal";
import UserDashboard from "@/components/user-dashboard";
import { useBookingStore } from "@/lib/booking-store";

export default function Home() {
  const { showBookingModal, showUserDashboard } = useBookingStore();

  return (
    <div className="min-h-screen bg-warm-gray">
      <Navigation />
      <HeroSection />
      
      {showBookingModal && <BookingModal />}
      {showUserDashboard && <UserDashboard />}
      
      <footer className="bg-forest text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-inter font-semibold mb-4">Glencity Resort</h3>
              <p className="text-gray-300">Your gateway to nature's finest adventures and comfortable accommodations.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="/" className="block text-gray-300 hover:text-white transition-colors">Home</a>
                <a href="/accommodations" className="block text-gray-300 hover:text-white transition-colors">Accommodations</a>
                <a href="/activities" className="block text-gray-300 hover:text-white transition-colors">Activities</a>
                <a href="/dashboard" className="block text-gray-300 hover:text-white transition-colors">My Bookings</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-300">
                <p><i className="fas fa-map-marker-alt mr-2"></i>123 Mountain View Rd, Glencity</p>
                <p><i className="fas fa-phone mr-2"></i>+1 (555) 123-4567</p>
                <p><i className="fas fa-envelope mr-2"></i>info@glencityresort.com</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Glencity Camping Resort. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
