import { body, param, query, validationResult } from "express-validator";

export const validateBooking = [
  body("hotelId").isString().notEmpty().withMessage("Hotel ID is required"),
  body("checkIn").isISO8601().withMessage("Check-in date must be a valid date"),
  body("checkOut").isISO8601().withMessage("Check-out date must be a valid date"),
  body("guestCount").isInt({ min: 1, max: 20 }).withMessage("Guest count must be between 1 and 20"),
  body("guestDetails.guestName").isString().notEmpty().withMessage("Guest name is required"),
  body("guestDetails.email").isEmail().withMessage("Valid email is required"),
  body("guestDetails.contact").isString().notEmpty().withMessage("Contact is required"),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateModification = [
  query("bookingId").isString().notEmpty().withMessage("Booking ID is required"),
  query("email").isEmail().withMessage("Valid email is required"),
  body("newCheckIn").optional().isISO8601().withMessage("New check-in date must be a valid date"),
  body("newCheckOut").optional().isISO8601().withMessage("New check-out date must be a valid date"),
  body("guestCount").optional().isInt({ min: 1, max: 20 }).withMessage("Guest count must be between 1 and 20"),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateCancellation = [
  body("bookingId").isString().notEmpty().withMessage("Booking ID is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];