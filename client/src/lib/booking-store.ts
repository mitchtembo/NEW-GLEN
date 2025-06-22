import { create } from 'zustand';
import type { Accommodation, Activity } from '@shared/schema';

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface BookingStore {
  // UI State
  showBookingModal: boolean;
  showUserDashboard: boolean;
  
  // Booking Data
  selectedAccommodation: Accommodation | null;
  selectedActivities: Activity[];
  bookingData: BookingData;
  
  // Actions
  setShowBookingModal: (show: boolean) => void;
  setShowUserDashboard: (show: boolean) => void;
  selectAccommodation: (accommodation: Accommodation) => void;
  addActivity: (activity: Activity) => void;
  removeActivity: (activityId: number) => void;
  setBookingData: (data: Partial<BookingData>) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  // Initial State
  showBookingModal: false,
  showUserDashboard: false,
  selectedAccommodation: null,
  selectedActivities: [],
  bookingData: {
    checkIn: '',
    checkOut: '',
    guests: 1,
  },

  // Actions
  setShowBookingModal: (show) => set({ showBookingModal: show }),
  
  setShowUserDashboard: (show) => set({ showUserDashboard: show }),
  
  selectAccommodation: (accommodation) => {
    set({ 
      selectedAccommodation: accommodation,
      showBookingModal: true 
    });
  },
  
  addActivity: (activity) => {
    const { selectedActivities } = get();
    set({ 
      selectedActivities: [...selectedActivities, activity]
    });
  },
  
  removeActivity: (activityId) => {
    const { selectedActivities } = get();
    set({ 
      selectedActivities: selectedActivities.filter(activity => activity.id !== activityId)
    });
  },
  
  setBookingData: (data) => {
    const { bookingData } = get();
    set({ 
      bookingData: { ...bookingData, ...data }
    });
  },
  
  clearBooking: () => {
    set({
      selectedAccommodation: null,
      selectedActivities: [],
      bookingData: {
        checkIn: '',
        checkOut: '',
        guests: 1,
      },
      showBookingModal: false,
    });
  },
}));
