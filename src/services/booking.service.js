// In-memory data stores with initialized hotel data
import { hotels } from "../utils/seedHotels";

let bookings = [];
let nextBookingId = 1;

// Utility functions
const validateDates = (checkIn, checkOut) => {
  const now = new Date();
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    throw new Error("Invalid date format");
  }

  if (checkInDate < now.setHours(0, 0, 0, 0)) {
    throw new Error("Check-in date must be in the future");
  }

  if (checkOutDate <= checkInDate) {
    throw new Error("Check-out date must be after check-in date");
  }
  return true;
}
const calculateTotalPrice = (rooms, checkIn, checkOut) => {
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  return rooms.reduce((total, room) => total + room.pricePerNight * nights, 0);
};

const findActiveBookings = (hotelId, checkIn, checkOut) => {
  return bookings.filter(
    (booking) =>
      booking.hotelId === hotelId &&
      booking.status !== "cancelled" &&
      new Date(booking.checkIn) < new Date(checkOut) &&
      new Date(booking.checkOut) > new Date(checkIn)
  );
};

export const bookRoom = async (bookingData) => {
  try {
    const { hotelId, checkIn, checkOut, guestCount, guestDetails } = bookingData;
    validateDates(checkIn, checkOut);

    const hotel = hotels.find((h) => h._id === hotelId);
    if (!hotel) throw new Error("Hotel not found");

    const overlappingBookings = findActiveBookings(hotelId, checkIn, checkOut);

    const bookedRooms = new Map();
    overlappingBookings.forEach((booking) => {
      booking.allocatedRooms.forEach((room) => {
        if (!bookedRooms.has(room.roomType)) bookedRooms.set(room.roomType, new Set());
        bookedRooms.get(room.roomType).add(room.roomNumber);
      });
    });

    const allocatedRooms = [];
    let remainingGuests = guestCount;

    const availableRoomTypes = hotel.rooms
      .map((room) => ({
        ...room,
        availableNumbers: room.availableRoomNumbers.filter(
          (num) => !bookedRooms.has(room.roomType) || !bookedRooms.get(room.roomType).has(num)
        ),
      }))
      .filter((room) => room.availableNumbers.length > 0)
      .sort((a, b) => a.maxGuests - b.maxGuests);

    for (const roomType of availableRoomTypes) {
      while (remainingGuests > 0 && roomType.availableNumbers.length > 0) {
        const guestsInRoom = Math.min(remainingGuests, roomType.maxGuests);
        const roomNumber = roomType.availableNumbers.shift();

        allocatedRooms.push({
          roomType: roomType.roomType,
          roomNumber,
          guests: guestsInRoom,
          pricePerNight: roomType.pricePerNight,
        });

        remainingGuests -= guestsInRoom;
      }
      if (remainingGuests <= 0) break;
    }

    if (remainingGuests > 0) {
      throw new Error(`Could not accommodate all guests. Only ${guestCount - remainingGuests} of ${guestCount} guests could be booked.`);
    }

    const totalPrice = calculateTotalPrice(allocatedRooms, checkIn, checkOut);
    const booking = {
      _id: String(nextBookingId++),
      hotelId,
      checkIn,
      checkOut,
      guestCount,
      totalPrice,
      allocatedRooms,
      status: "confirmed",
      paymentStatus: "pending",
      ...guestDetails,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    bookings.push(booking);
    return {
      success: true,
      bookingId: booking._id,
      message: "Booking confirmed successfully",
      bookingDetails: booking,
    };
  } catch (error) {
    console.error("Booking failed:", error);
    throw new Error(`Booking failed: ${error.message}`);
  }
};

export const cancelBooking = async ({ bookingId, email }) => {
  try {
    const booking = bookings.find((b) => b._id === bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.email !== email) throw new Error("Email does not match booking record");
    if (booking.status === "cancelled") throw new Error("Booking is already cancelled");
    if (new Date() >= new Date(booking.checkIn)) throw new Error("Cannot cancel booking after check-in time");

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    booking.updatedAt = new Date();

    return { success: true, message: "Booking cancelled successfully", refundAmount: booking.totalPrice };
  } catch (error) {
    console.error("Cancellation failed:", error);
    throw new Error(`Cancellation failed: ${error.message}`);
  }
};

export const modifyBooking = async ({ bookingId, email }, changes) => {
  try {
    const booking = bookings.find((b) => b._id === bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.email !== email) throw new Error("Email does not match booking record");
    if (booking.status === "cancelled") throw new Error("Cannot modify cancelled booking");
    if (new Date() >= new Date(booking.checkIn)) throw new Error("Cannot modify booking after check-in time");

    const { newCheckIn, newCheckOut, guestCount } = changes;
    if (newCheckIn || newCheckOut) validateDates(newCheckIn || booking.checkIn, newCheckOut || booking.checkOut);
    if (guestCount && (guestCount < 1 || guestCount > 20)) throw new Error("Guest count must be between 1 and 20");

    const hotel = hotels.find((h) => h._id === booking.hotelId);
    if (!hotel) throw new Error("Associated hotel not found");

    const originalBooking = { ...booking };
    booking.allocatedRooms.forEach(({ roomNumber, roomType }) => {
      const room = hotel.rooms.find((r) => r.roomType === roomType);
      if (room && !room.availableRoomNumbers.includes(roomNumber)) {
        room.availableRoomNumbers.push(roomNumber);
      }
    });

    const finalCheckIn = newCheckIn ? new Date(newCheckIn) : booking.checkIn;
    const finalCheckOut = newCheckOut ? new Date(newCheckOut) : booking.checkOut;
    const finalGuestCount = guestCount || booking.guestCount;

    const overlappingBookings = bookings.filter(
      (b) =>
        b.hotelId === booking.hotelId &&
        b.status !== "cancelled" &&
        b._id !== bookingId &&
        new Date(b.checkIn) < finalCheckOut &&
        new Date(b.checkOut) > finalCheckIn
    );

    const bookedRooms = new Map();
    overlappingBookings.forEach((b) => {
      b.allocatedRooms.forEach((room) => {
        if (!bookedRooms.has(room.roomType)) bookedRooms.set(room.roomType, new Set());
        bookedRooms.get(room.roomType).add(room.roomNumber);
      });
    });

    const allocatedRooms = [];
    let remainingGuests = finalGuestCount;

    const availableRoomTypes = hotel.rooms
      .map((room) => ({
        ...room,
        availableNumbers: room.availableRoomNumbers.filter(
          (num) => !bookedRooms.has(room.roomType) || !bookedRooms.get(room.roomType).has(num)
        ),
      }))
      .filter((room) => room.availableNumbers.length > 0)
      .sort((a, b) => a.maxGuests - b.maxGuests);

    for (const roomType of availableRoomTypes) {
      while (remainingGuests > 0 && roomType.availableNumbers.length > 0) {
        const guestsInRoom = Math.min(remainingGuests, roomType.maxGuests);
        const roomNumber = roomType.availableNumbers.shift();
        allocatedRooms.push({ roomType: roomType.roomType, roomNumber, guests: guestsInRoom, pricePerNight: roomType.pricePerNight });
        remainingGuests -= guestsInRoom;
      }
      if (remainingGuests <= 0) break;
    }

    if (remainingGuests > 0) {
      Object.assign(booking, originalBooking);
      throw new Error(`Could not accommodate all guests. ${remainingGuests} guest(s) could not be booked.`);
    }

    const nights = Math.ceil((finalCheckOut - finalCheckIn) / (1000 * 60 * 60 * 24));
    booking.checkIn = finalCheckIn;
    booking.checkOut = finalCheckOut;
    booking.guestCount = finalGuestCount;
    booking.allocatedRooms = allocatedRooms;
    booking.totalPrice = allocatedRooms.reduce((total, room) => total + room.pricePerNight * nights, 0);
    booking.updatedAt = new Date();

    allocatedRooms.forEach(({ roomNumber, roomType }) => {
      const room = hotel.rooms.find((r) => r.roomType === roomType);
      if (room) {
        room.availableRoomNumbers = room.availableRoomNumbers.filter((num) => num !== roomNumber);
      }
    });

    return {
      success: true,
      message: "Booking modified successfully",
      bookingDetails: { ...booking },
    };
  } catch (error) {
    console.error("Booking modification error:", { error: error.message, bookingId, email, changes });
    throw new Error(`Booking modification failed: ${error.message}`);
  }
};  

export const viewAllCurrentGuests = async (hotelId) => {
  try {
    const now = new Date();

    const currentBookings = bookings.filter(
      (booking) =>
        booking.hotelId === hotelId &&
        ["confirmed", "checked-in"].includes(booking.status) &&
        new Date(booking.checkIn) <= now &&
        new Date(booking.checkOut) > now
    ).sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

    const hotel = hotels.find((h) => h._id === hotelId);
    
    return {
      hotel: hotel ? hotel.name : "Unknown Hotel",
      currentGuests: currentBookings.map((booking) => ({
        bookingId: booking._id,
        guestName: booking.guestName,
        email: booking.email,
        contact: booking.contact,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        status: booking.status,
        rooms: booking.allocatedRooms.map((room) => ({
          roomType: room.roomType,
          roomNumber: room.roomNumber,
          guests: room.guests,
        })),
      })),
    };
  } catch (error) {
    console.error("Error retrieving current guests:", error);
    throw new Error(`Could not retrieve current guests: ${error.message}`);
  }
};
