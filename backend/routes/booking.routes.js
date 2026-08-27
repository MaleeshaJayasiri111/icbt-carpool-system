const express = require("express");

const {
    requestBooking,
    makePayment,
    getMyBookings,
    cancelBooking,
    getMyRideHistory
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


const router = express.Router();


router.use(authenticate);
router.use(requirePassenger);


// Passenger selects a ride
router.post(
    "/ride/:rideId",
    requestBooking
);


// Dummy payment
router.post(
    "/:bookingId/pay",
    makePayment
);

router.get("/history", getMyRideHistory);


// Passenger's to find their rides
router.get(
    "/my-rides",
    getMyBookings
);

router.patch(
    "/:bookingId/cancel",
    cancelBooking
);


module.exports = router;