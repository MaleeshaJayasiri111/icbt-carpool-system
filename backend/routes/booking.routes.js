const express = require("express");

const {
    requestBooking,
    makePayment,
    getMyBookings,
    cancelBooking,
    getMyRideHistory,

    getDriverBookingRequests,
    acceptBookingRequest,
    rejectBookingRequest,

} = require(
    "../controllers/booking.controller"
);


const {
    authenticate,
} = require(
    "../middleware/auth.middleware"
);


const {
    requirePassenger,
} = require(
    "../middleware/passenger.middleware"
);


const {
    requireDriver,
} = require(
    "../middleware/driver.middleware"
);


const router = express.Router();


// All routes require login
router.use(authenticate);


// Passenger requests to join ride
router.post(
    "/ride/:rideId",
    requirePassenger,
    requestBooking
);


// Dummy payment
router.post(
    "/:bookingId/pay",
    requirePassenger,
    makePayment
);


// Passenger ride history
router.get(
    "/history",
    requirePassenger,
    getMyRideHistory
);


// Passenger bookings
router.get(
    "/my-rides",
    requirePassenger,
    getMyBookings
);


// Passenger cancels booking
router.patch(
    "/:bookingId/cancel",
    requirePassenger,
    cancelBooking
);


// ==============================
// DRIVER ROUTES
// ==============================


// Driver sees join requests
router.get(
    "/driver/requests",
    requireDriver,
    getDriverBookingRequests
);


// Driver accepts request
router.patch(
    "/:bookingId/accept",
    requireDriver,
    acceptBookingRequest
);


// Driver rejects request
router.patch(
    "/:bookingId/reject",
    requireDriver,
    rejectBookingRequest
);


module.exports = router;