import { bookRoom, cancelBooking, modifyBooking, viewAllCurrentGuests, viewBooking } from "../services/booking.service";
import { errorResponse, successResponse } from "../utils/responseHandler";

export const book = async (req, res) => {
  try {
    const booking = await bookRoom(req.body);
    return successResponse(res, 'Room booked successfully', booking, 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const viewBookings = async (req, res) => {
  try {
    const booking = await viewBooking(req.query);
    if (!booking) return errorResponse(res, 'No booking found', 404);
    return successResponse(res, 'Booking retrieved successfully', booking);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const viewAllGuest = async (req, res) => {
  try {
    const guests = await viewAllCurrentGuests(req.query.hotelId);
    return successResponse(res, 'Guests retrieved successfully', guests);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const bookingCancellation = async (req, res) => {
  try {
    const result = await cancelBooking(req.body);
    return successResponse(res, 'Booking cancelled successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await modifyBooking(req.query,req.body);
    if (!updatedBooking) return errorResponse(res, 'No booking found', 404);
    return successResponse(res, 'Booking modified successfully', updatedBooking);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
