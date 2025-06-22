import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mountain, Menu, X, User } from "lucide-react";
import { useBookingStore } from "@/lib/booking-store";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setShowUserDashboard } = useBookingStore();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  const openUserDashboard = () => {
    setShowUserDashboard(true);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-forest flex items-center">
              <Mountain className="text-sage mr-2 h-6 w-6" />
              Glencity Resort
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#accommodations" className="text-gray-700 hover:text-forest transition-colors">
              Accommodations
            </a>
            <a href="#activities" className="text-gray-700 hover:text-forest transition-colors">
              Activities
            </a>
            <a href="#about" className="text-gray-700 hover:text-forest transition-colors">
              About
            </a>
            <Link href="/dashboard">
              <Button className="bg-forest text-white hover:bg-sage transition-colors">
                <User className="w-4 h-4 mr-2" />
                My Bookings
              </Button>
            </Link>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-gray-700"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            <a href="#accommodations" className="block py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
              Accommodations
            </a>
            <a href="#activities" className="block py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
              Activities
            </a>
            <a href="#about" className="block py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
              About
            </a>
            <Link href="/dashboard">
              <button className="w-full text-left py-2 text-forest font-medium" onClick={() => setMobileMenuOpen(false)}>
                My Bookings
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
