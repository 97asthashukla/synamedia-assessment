import request from "supertest";
import app from "../../app";

let hotels = [];
let bookings = [];
let testHotelId;
let testBookingId;
let email;



describe("Hotel Booking Routes", () => {
  beforeAll(() => {
    hotels = [];
    bookings = [];
    testHotelId = 1;
  });

  afterEach(() => {
    bookings = [];
  });


  it("should successfully book a room", async () => {
    const response = await request(app).post("/api/v1/hotel/bookings").send({
        hotelId: "1",
      checkIn: "2025-04-01",
      checkOut: "2025-04-05",
      guestCount: 1,
      guestDetails: {
        guestName: "John Doe",
        email: "john@yopmail.com",
        contact: "123456789",
        specialRequests: "None",
      },
    });
    expect(response.status).toBe(201);
    testBookingId = response.body.data.bookingId;
    bookings.push({
      _id: testBookingId,
      hotelId: testHotelId,
      guestName: "John Doe",
      email: "john@yopmail.com",
      contact: "123456789",
      checkIn: "2025-04-01",
      checkOut: "2025-04-05",
      status: "confirmed",
    });
    email = "john@yopmail.com";
  });

  it("should fail to book a room with invalid hotelId", async () => {
    const response = await request(app).post("/api/v1/hotel/bookings").send({
      hotelId: "invalidHotel123",
      checkIn: "2025-04-01",
      checkOut: "2025-04-05",
      guestCount: 1,
      guestDetails: {
        guestName: "Jane Doe",
        email: "jane@yopmail.com",
        contact: "987654321",
      },
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Booking failed: Hotel not found");
  });


  it("should return 404 for non-existing booking", async () => {
    const response = await request(app).get(`/api/v1/hotel/bookings?bookingId=000000000000000000000000`);
    expect(response.status).toBe(400);
  });

  it("should retrieve the list of current guests", async () => {
    const response = await request(app).get(`/api/v1/hotel/guests?hotelId=${testHotelId}`);
    expect(response.status).toBe(200);
  });

  it("should successfully cancel a booking", async () => {
    const response = await request(app).delete("/api/v1/hotel/bookings/cancel").send({
      bookingId: testBookingId,
      email: "john@yopmail.com",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Booking cancelled successfully");
  });

  it("should fail to cancel with incorrect email", async () => {
    const response = await request(app).delete("/api/v1/hotel/bookings/cancel").send({
      bookingId: testBookingId,
      email: "wrong@yopmail.com",
    });
    expect(response.status).toBe(400);
  });

  it("should fail to modify a booking with past dates", async () => {
    const response = await request(app).put("/api/v1/hotel/bookings/modify").query({
      bookingId: testBookingId,
      email: "john@yopmail.com",
    }).send({
      newCheckIn: "2023-04-10", // Past date
      newCheckOut: "2023-04-15",
      guestCount: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Booking modification failed: Cannot modify cancelled booking");
  });

  it("should fail to modify a non-existing booking", async () => {
    const response = await request(app).put("/api/v1/hotel/bookings/modify").query({
      bookingId: "000000000000000000000000",
      email: "john@yopmail.com",
    }).send({
      newCheckIn: "2025-06-10",
      newCheckOut: "2025-06-15",
      guestCount: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Booking modification failed: Booking not found");
  });
});
