// This file provides mock data for testing the analytics features
// In a real environment, these would be replaced with actual API calls

// Mock occupancy data for testing
export const mockOccupancyData = {
  week: [
    { day: 'Mon', occupancyRate: 72, availableRooms: 45 },
    { day: 'Tue', occupancyRate: 68, availableRooms: 48 },
    { day: 'Wed', occupancyRate: 75, availableRooms: 44 },
    { day: 'Thu', occupancyRate: 80, availableRooms: 42 },
    { day: 'Fri', occupancyRate: 90, availableRooms: 40 },
    { day: 'Sat', occupancyRate: 95, availableRooms: 38 },
    { day: 'Sun', occupancyRate: 88, availableRooms: 41 }
  ],
  month: [
    { month: 'Week 1', occupancyRate: 65, availableRooms: 120 },
    { month: 'Week 2', occupancyRate: 70, availableRooms: 122 },
    { month: 'Week 3', occupancyRate: 75, availableRooms: 125 },
    { month: 'Week 4', occupancyRate: 82, availableRooms: 118 }
  ],
  year: [
    { month: 'Jan', occupancyRate: 68, availableRooms: 120 },
    { month: 'Feb', occupancyRate: 72, availableRooms: 118 },
    { month: 'Mar', occupancyRate: 75, availableRooms: 125 },
    { month: 'Apr', occupancyRate: 80, availableRooms: 130 },
    { month: 'May', occupancyRate: 85, availableRooms: 132 },
    { month: 'Jun', occupancyRate: 90, availableRooms: 135 },
    { month: 'Jul', occupancyRate: 95, availableRooms: 140 },
    { month: 'Aug', occupancyRate: 92, availableRooms: 138 },
    { month: 'Sep', occupancyRate: 88, availableRooms: 136 },
    { month: 'Oct', occupancyRate: 82, availableRooms: 132 },
    { month: 'Nov', occupancyRate: 78, availableRooms: 128 },
    { month: 'Dec', occupancyRate: 85, availableRooms: 124 }
  ]
};

// Mock booking frequency data
export const mockBookingFrequencyData = {
  week: [
    { day: 'Mon', bookings: 15 },
    { day: 'Tue', bookings: 12 },
    { day: 'Wed', bookings: 18 },
    { day: 'Thu', bookings: 20 },
    { day: 'Fri', bookings: 25 },
    { day: 'Sat', bookings: 30 },
    { day: 'Sun', bookings: 22 }
  ],
  month: [
    { day: 'Week 1', bookings: 85 },
    { day: 'Week 2', bookings: 92 },
    { day: 'Week 3', bookings: 110 },
    { day: 'Week 4', bookings: 125 }
  ],
  year: [
    { day: 'Jan', bookings: 210 },
    { day: 'Feb', bookings: 240 },
    { day: 'Mar', bookings: 280 },
    { day: 'Apr', bookings: 300 },
    { day: 'May', bookings: 320 },
    { day: 'Jun', bookings: 350 },
    { day: 'Jul', bookings: 380 },
    { day: 'Aug', bookings: 400 },
    { day: 'Sep', bookings: 360 },
    { day: 'Oct', bookings: 330 },
    { day: 'Nov', bookings: 280 },
    { day: 'Dec', bookings: 320 }
  ]
};

// Mock top rated listings
export const mockTopRatedListings = [
  {
    id: 1,
    title: 'Luxury Apartment in Downtown',
    rating: 4.9,
    reviewCount: 42,
    location: 'Downtown',
    price: 1200,
    imageUrl: 'https://via.placeholder.com/100'
  },
  {
    id: 2,
    title: 'Cozy Studio near University',
    rating: 4.8,
    reviewCount: 38,
    location: 'University Area',
    price: 850,
    imageUrl: 'https://via.placeholder.com/100'
  },
  {
    id: 3,
    title: 'Modern Loft with City View',
    rating: 4.7,
    reviewCount: 56,
    location: 'West End',
    price: 1100,
    imageUrl: 'https://via.placeholder.com/100'
  },
  {
    id: 4,
    title: 'Spacious 2 Bedroom with Garden',
    rating: 4.7,
    reviewCount: 31,
    location: 'Suburbs',
    price: 950,
    imageUrl: 'https://via.placeholder.com/100'
  },
  {
    id: 5,
    title: 'Charming Victorian House',
    rating: 4.6,
    reviewCount: 27,
    location: 'Historic District',
    price: 1300,
    imageUrl: 'https://via.placeholder.com/100'
  },
  {
    id: 6,
    title: 'Riverside Apartment with Balcony',
    rating: 4.6,
    reviewCount: 24,
    location: 'Riverfront',
    price: 1150,
    imageUrl: 'https://via.placeholder.com/100'
  },
  {
    id: 7,
    title: 'Cozy Cottage in the Woods',
    rating: 4.5,
    reviewCount: 19,
    location: 'Outskirts',
    price: 800,
    imageUrl: 'https://via.placeholder.com/100'
  },
  {
    id: 8,
    title: 'Urban Studio with Workspace',
    rating: 4.5,
    reviewCount: 22,
    location: 'Business District',
    price: 920,
    imageUrl: 'https://via.placeholder.com/100'
  },
  {
    id: 9,
    title: 'Lakeside Cabin with Dock',
    rating: 4.4,
    reviewCount: 18,
    location: 'Lake Area',
    price: 1050,
    imageUrl: 'https://via.placeholder.com/100'
  },
  {
    id: 10,
    title: 'Renovated Basement Apartment',
    rating: 4.3,
    reviewCount: 14,
    location: 'Residential Area',
    price: 750,
    imageUrl: 'https://via.placeholder.com/100'
  }
];
