export
const hotels = [
  {
    _id: "1",
    name: "Grand Palace Hotel",
    location: "New York",
    description: "Luxurious accommodations in the heart of Manhattan with stunning city views.",
    rating: 4.8,
    contact: {
      phone: "+1 212-555-1000",
      email: "info@grandpalace.com"
    },
    policies: {
      cancellation: "Free cancellation up to 48 hours before check-in",
      checkInTime: "3:00 PM",
      checkOutTime: "11:00 AM"
    },
    images: [
      "https://example.com/hotels/grand-palace-hotel-1.jpg",
      "https://example.com/hotels/grand-palace-hotel-2.jpg",
      "https://example.com/hotels/grand-palace-hotel-3.jpg"
    ],
    rooms: [
      { 
        roomType: "Single", 
        maxGuests: 1, 
        totalRooms: 5, 
        pricePerNight: 100,
        amenities: ["TV", "WiFi", "Air Conditioning", "Coffee Maker"],
        description: "Single room with TV, WiFi, Air Conditioning, Coffee Maker",
        availableRoomNumbers: [1, 2, 3, 4, 5]
      },
      { 
        roomType: "Double", 
        maxGuests: 2, 
        totalRooms: 3, 
        pricePerNight: 150,
        amenities: ["TV", "WiFi", "Air Conditioning", "Mini Bar"],
        description: "Double room with TV, WiFi, Air Conditioning, Mini Bar",
        availableRoomNumbers: [1, 2, 3]
      },
      { 
        roomType: "Suite", 
        maxGuests: 4, 
        totalRooms: 2, 
        pricePerNight: 250,
        amenities: ["TV", "WiFi", "Air Conditioning", "Mini Bar", "Jacuzzi"],
        description: "Suite with TV, WiFi, Air Conditioning, Mini Bar, Jacuzzi",
        availableRoomNumbers: [1, 2]
      },
    ],
  },
  {
    _id: "2",
    name: "Ocean View Resort",
    location: "Los Angeles",
    description: "Beachfront property with panoramic ocean views and premium amenities.",
    rating: 4.7,
    contact: {
      phone: "+1 310-555-2000",
      email: "reservations@oceanview.com"
    },
    policies: {
      cancellation: "Free cancellation up to 72 hours before check-in",
      checkInTime: "4:00 PM",
      checkOutTime: "12:00 PM"
    },
    images: [
      "https://example.com/hotels/ocean-view-resort-1.jpg",
      "https://example.com/hotels/ocean-view-resort-2.jpg",
      "https://example.com/hotels/ocean-view-resort-3.jpg"
    ],
    rooms: [
      { 
        roomType: "Single", 
        maxGuests: 1, 
        totalRooms: 4, 
        pricePerNight: 120,
        amenities: ["TV", "WiFi", "Air Conditioning", "Balcony"],
        description: "Single room with TV, WiFi, Air Conditioning, Balcony",
        availableRoomNumbers: [1, 2, 3, 4]
      },
      { 
        roomType: "Double", 
        maxGuests: 2, 
        totalRooms: 4, 
        pricePerNight: 180,
        amenities: ["TV", "WiFi", "Air Conditioning", "Balcony", "Mini Bar"],
        description: "Double room with TV, WiFi, Air Conditioning, Balcony, Mini Bar",
        availableRoomNumbers: [1, 2, 3, 4]
      },
      { 
        roomType: "Suite", 
        maxGuests: 4, 
        totalRooms: 2, 
        pricePerNight: 280,
        amenities: ["TV", "WiFi", "Air Conditioning", "Balcony", "Mini Bar", "Kitchenette"],
        description: "Suite with TV, WiFi, Air Conditioning, Balcony, Mini Bar, Kitchenette",
        availableRoomNumbers: [1, 2]
      },
    ],
  },
  {
    _id: "3",
    name: "Mountain Escape Lodge",
    location: "Denver",
    description: "Rustic luxury in the Rocky Mountains with outdoor activities and spa services.",
    rating: 4.9,
    contact: {
      phone: "+1 303-555-3000",
      email: "stay@mountainescapelodge.com"
    },
    policies: {
      cancellation: "Free cancellation up to 7 days before check-in",
      checkInTime: "2:00 PM",
      checkOutTime: "10:00 AM"
    },
    images: [
      "https://example.com/hotels/mountain-escape-lodge-1.jpg",
      "https://example.com/hotels/mountain-escape-lodge-2.jpg",
      "https://example.com/hotels/mountain-escape-lodge-3.jpg"
    ],
    rooms: [
      { 
        roomType: "Single", 
        maxGuests: 1, 
        totalRooms: 6, 
        pricePerNight: 90,
        amenities: ["TV", "WiFi", "Heating", "Coffee Maker"],
        description: "Single room with TV, WiFi, Heating, Coffee Maker",
        availableRoomNumbers: [1, 2, 3, 4, 5, 6]
      },
      { 
        roomType: "Double", 
        maxGuests: 2, 
        totalRooms: 5, 
        pricePerNight: 140,
        amenities: ["TV", "WiFi", "Heating", "Fireplace"],
        description: "Double room with TV, WiFi, Heating, Fireplace",
        availableRoomNumbers: [1, 2, 3, 4, 5]
      },
      { 
        roomType: "Suite", 
        maxGuests: 4, 
        totalRooms: 3, 
        pricePerNight: 220,
        amenities: ["TV", "WiFi", "Heating", "Fireplace", "Kitchenette", "Hot Tub"],
        description: "Suite with TV, WiFi, Heating, Fireplace, Kitchenette, Hot Tub",
        availableRoomNumbers: [1, 2, 3]
      },
    ],
  },
];