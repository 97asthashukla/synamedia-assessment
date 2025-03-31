import express from "express";
import { validateBooking, validateCancellation, validateModification } from "../middlewares/validations/bookingValidation.js";
import { book, bookingCancellation, updateBooking, viewAllGuest, viewBookings } from "../controllers/hotel.controller.js";

const hotelRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Hotel Bookings
 *   description: Hotel booking management
 */

/**
 * @swagger
 * /hotel/bookings:
 *   post:
 *     summary: Create a new hotel booking
 *     description: Creates a booking with automatic room assignment based on availability
 *     tags: [Hotel Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingRequest'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 *       400:
 *         description: Invalid input or no rooms available
 *       500:
 *         description: Internal server error
 */
hotelRoutes.post("/bookings",validateBooking, book);

/**
 * @swagger
 * /hotel/bookings:
 *   get:
 *     summary: Get booking details
 *     description: Retrieve booking details by email or booking ID
 *     tags: [Hotel Bookings]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: Guest's email address
 *       - in: query
 *         name: bookingId
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingDetails'
 *       404:
 *         description: Booking not found
 *       400:
 *         description: Missing required parameters
 */
hotelRoutes.get("/bookings", viewBookings);

/**
 * @swagger
 * /hotel/guests:
 *   get:
 *     summary: Get current hotel guests
 *     description: Retrieve list of all guests with active bookings (checked-in or confirmed)
 *     tags: [Hotel Bookings]
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *         description: Filter by specific hotel ID
 *     responses:
 *       200:
 *         description: List of current guests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GuestDetails'
 *       500:
 *         description: Internal server error
 */
hotelRoutes.get("/guests", viewAllGuest);

/**
 * @swagger
 * /hotel/bookings/cancel:
 *   delete:
 *     summary: Cancel a booking
 *     description: Cancel an existing booking before check-in time
 *     tags: [Hotel Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - email
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: The booking ID to cancel
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Guest's email for verification
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 refundAmount:
 *                   type: number
 *       400:
 *         description: Invalid cancellation request
 *       404:
 *         description: Booking not found
 */
hotelRoutes.delete("/bookings/cancel",validateCancellation, bookingCancellation);

/**
 * @swagger
 * /hotel/bookings/modify:
 *   put:
 *     summary: Modify booking details
 *     description: Update booking details (dates, guest count) for an existing reservation
 *     tags: [Hotel Bookings]
 *     parameters:
 *       - in: query
 *         name: bookingId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the booking to modify
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         required: true
 *         description: The email associated with the booking (for verification)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newCheckIn:
 *                 type: string
 *                 format: date
 *                 description: New check-in date (YYYY-MM-DD)
 *                 example: "2025-06-15"
 *               newCheckOut:
 *                 type: string
 *                 format: date
 *                 description: New check-out date (YYYY-MM-DD)
 *                 example: "2025-06-20"
 *               guestCount:
 *                 type: integer
 *                 minimum: 1
 *                 description: Updated number of guests
 *                 example: 3
 *     responses:
 *       200:
 *         description: Booking modified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 *             example:
 *               success: true
 *               message: "Booking modified successfully"
 *               bookingDetails:
 *                 bookingId: "65f12b34e89f0a1234567890"
 *                 guestName: "John Doe"
 *                 email: "john@example.com"
 *                 hotelId: "64f2a8c12d4b7a001c3d9f10"
 *                 checkIn: "2025-06-15"
 *                 checkOut: "2025-06-20"
 *                 stayDuration: 5
 *                 guestCount: 3
 *                 totalPrice: 750
 *                 status: "confirmed"
 *                 rooms:
 *                   - roomType: "Double"
 *                     roomNumber: 201
 *                     guests: 2
 *                     pricePerNight: 150
 *                   - roomType: "Single"
 *                     roomNumber: 102
 *                     guests: 1
 *                     pricePerNight: 100
 *                 modifiedAt: "2025-03-15T14:30:00Z"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             example:
 *               error: "Validation failed"
 *               details:
 *                 - "New check-in date must be in the future"
 *                 - "Guest count must be at least 1"
 *       401:
 *         description: Unauthorized (email doesn't match booking)
 *       404:
 *         description: Booking not found
 *       409:
 *         description: Conflict (no rooms available for new dates)
 *         content:
 *           application/json:
 *             example:
 *               error: "No available rooms"
 *               message: "Could not accommodate all guests for the selected dates"
 */
hotelRoutes.put("/bookings/modify",validateModification, updateBooking);

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingRequest:
 *       type: object
 *       required:
 *         - hotelId
 *         - checkIn
 *         - checkOut
 *         - guestCount
 *         - guestDetails
 *       properties:
 *         hotelId:
 *           type: string
 *         checkIn:
 *           type: string
 *           format: date
 *         checkOut:
 *           type: string
 *           format: date
 *         guestCount:
 *           type: integer
 *           minimum: 1
 *         guestDetails:
 *           type: object
 *           required:
 *             - guestName
 *             - email
 *             - contact
 *           properties:
 *             guestName:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *             contact:
 *               type: string
 *             specialRequests:
 *               type: string
 *               maxLength: 500
 * 
 *     BookingResponse:
 *       type: object
 *       properties:
 *         bookingId:
 *           type: string
 *         guestName:
 *           type: string
 *         hotel:
 *           type: string
 *         checkIn:
 *           type: string
 *           format: date
 *         checkOut:
 *           type: string
 *           format: date
 *         stayDuration:
 *           type: integer
 *         totalPrice:
 *           type: number
 *         rooms:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               roomType:
 *                 type: string
 *               roomNumber:
 *                 type: integer
 *               pricePerNight:
 *                 type: number
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 * 
 *     BookingDetails:
 *       type: object
 *       properties:
 *         bookingId:
 *           type: string
 *         hotel:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             location:
 *               type: string
 *         guestName:
 *           type: string
 *         email:
 *           type: string
 *         contact:
 *           type: string
 *         checkIn:
 *           type: string
 *           format: date
 *         checkOut:
 *           type: string
 *           format: date
 *         stayDuration:
 *           type: integer
 *         guestCount:
 *           type: integer
 *         status:
 *           type: string
 *         paymentStatus:
 *           type: string
 *         totalPrice:
 *           type: number
 *         rooms:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               roomType:
 *                 type: string
 *               roomNumber:
 *                 type: integer
 *               guests:
 *                 type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     GuestDetails:
 *       type: object
 *       properties:
 *         bookingId:
 *           type: string
 *         guestName:
 *           type: string
 *         email:
 *           type: string
 *         contact:
 *           type: string
 *         checkIn:
 *           type: string
 *           format: date
 *         checkOut:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *         rooms:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               roomType:
 *                 type: string
 *               roomNumber:
 *                 type: integer
 *               guests:
 *                 type: integer
 */

export default hotelRoutes;