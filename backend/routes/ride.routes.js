const express = require("express");

const {
    createRide,
    getMyRides,
    getRideById,
    updateRide,
    cancelRide, completeRide,getAvailableRides,searchMatchingRides,getRidePassengers,calculateFare
} = require("../controllers/ride.controller");

const {
    authenticate,
} = require("../middleware/auth.middleware");

const {
    requireDriver,
} = require("../middleware/driver.middleware");

const {requirePassenger} = require("../middleware/passenger.middleware")

const router = express.Router();


router.post(
    "/",
    authenticate,
    requireDriver,
    createRide
);


router.get(
    "/my-rides",
    authenticate,
    requireDriver,
    getMyRides
);
router.get(
    "/available",
    authenticate,
    requirePassenger,
    getAvailableRides
);


router.post(
    "/search",
    authenticate,
    requirePassenger,
    searchMatchingRides
);

router.post(
    "/calculate-fare",
    authenticate,
    requireDriver,
    calculateFare
);


router.get(
    "/:rideId",
    authenticate,
    getRideById
);

router.put(
    "/:rideId",
    authenticate,
    requireDriver,
    updateRide
);

router.patch(
    "/:rideId/cancel",
    authenticate,
    requireDriver,
    cancelRide
);

router.patch(
    "/:rideId/complete",
    authenticate,
    requireDriver,
    completeRide
);

router.get(
    "/:rideId/passengers",
    authenticate,
    requireDriver,
    getRidePassengers
);


module.exports = router;