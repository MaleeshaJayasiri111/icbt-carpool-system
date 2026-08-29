const {
    createBooking,
    findBookingById,
    findBookingByRideAndPassenger,
    findBookingsByPassenger,
    updateBookingStatus,
    findBookingRequestsByDriver,
} = require("../models/booking.model");

const {
    findRideById,
    updateRideSeats,
} = require("../models/ride.model");

const {createPayment} = require("../models/payment.model");


const getDriverBookingRequests = async (driverId) => {

    return await findBookingRequestsByDriver(
        driverId
    );
};

const requestBooking = async (
    passengerId,
    rideId
) => {

    const ride = await findRideById(rideId);

    if (!ride) {
        const error = new Error("Ride not found");
        error.statusCode = 404;
        throw error;
    }

    if (ride.status !== "available") {
        const error = new Error(
            "Ride is not available"
        );
        error.statusCode = 400;
        throw error;
    }

    if (ride.available_seats <= 0) {
        const error = new Error(
            "No seats available"
        );
        error.statusCode = 400;
        throw error;
    }

    const existingBooking =
        await findBookingByRideAndPassenger(
            rideId,
            passengerId
        );

    if (existingBooking) {
        const error = new Error(
            "You already requested this ride"
        );
        error.statusCode = 409;
        throw error;
    }

    return await createBooking({
        rideId,
        passengerId,
    });
};

const makeDummyPayment = async (
    passengerId,
    bookingId,
)=>{
    const booking = await findBookingById(bookingId);

    if (!booking) {
        const error =
            new Error("Booking not found");
        error.statusCode = 404;
        throw error;
    }
    if (
        booking.passenger_id !== passengerId
    ) {
        const error = new Error(
            "You cannot pay for another passenger's booking"
        );

        error.statusCode = 403;
        throw error;
    }
    if(booking.status !=="payment_pending"){
        const error = new Error("Booking is not waiting for the payment");
        error.statusCode = 400;
        throw error;
    }

    const ride= await findRideById(booking.ride_id);

    if (
        !ride ||
        ride.status === "cancelled" ||
        ride.status === "completed"
    ) {
        const error = new Error(
            "Ride is no longer available"
        );

        error.statusCode = 400;
        throw error;
    }

    // Dummy successful payment
    const payment =
        await createPayment({
            bookingId,
            passengerId,
            amount: ride.fee_per_seat,
            paymentStatus: "successful",
        });

    const confirmedBooking =
        await updateBookingStatus(
            bookingId,
            "confirmed"
        );


    return {
        booking: confirmedBooking,
        payment,
    };

};

const getMyBookings = async (
    passengerId
) => {

    return await findBookingsByPassenger(
        passengerId
    );
};

const cancelMyBooking= async (
    passengerId,
    bookingId
)=>{
    const booking = await findBookingById(bookingId);

    if (!booking) {
        const error = new Error("Booking not found");
        error.statusCode = 404;
        throw error;
    }

    if(booking.passenger_id !== passengerId){
        const error = new Error(
            "You cannot cancel another passenger's booking"

        );
        error.statusCode = 403;
        throw error;
    }

    const ride =
        await findRideById(booking.ride_id);

    if (!ride) {
        const error = new Error("Ride not found");
        error.statusCode = 404;
        throw error;
    }

    if (
        ride.status === "completed" ||
        ride.status === "in_progress"
    ) {
        const error = new Error(
            "This booking cannot be cancelled now"
        );
        error.statusCode = 400;
        throw error;
    }
    // If payment was already completed,
    // passenger had occupied one seat.
    if (booking.status === "confirmed" ||
        booking.status === "payment_pending") {

        const newAvailableSeats =
            ride.available_seats + 1;

        let newRideStatus = ride.status;

        if (ride.status === "full") {
            newRideStatus = "available";
        }

        await updateRideSeats(
            ride.id,
            newAvailableSeats,
            newRideStatus
        );
    }

    return await updateBookingStatus(
        bookingId,
        "cancelled"
    );
}

const getMyRideHistory = async (passengerId,)=>{
    const bookings = await findBookingsByPassenger(passengerId);

    const upcoming = [];
    const completed = [];
    const cancelled = [];

    bookings.forEach((booking) => {

        if (
            booking.status === "cancelled" ||
            booking.rides?.status === "cancelled"
        ) {

            cancelled.push(booking);

            return;
        }

        if (
            booking.status === "confirmed" &&
            booking.rides?.status === "completed"
        ) {

            completed.push(booking);

            return;
        }

        if (
            booking.status === "confirmed" &&
            [
                "available",
                "full",
                "in_progress",
            ].includes(
                booking.rides?.status
            )
        ) {
            upcoming.push(booking);
        }
    });

    return {
        upcoming,
        completed,
        cancelled,
    };
}

const acceptBookingRequest = async (
    driverId,
    bookingId
) => {

    const booking =
        await findBookingById(bookingId);

    if (!booking) {
        const error = new Error(
            "Booking request not found"
        );
        error.statusCode = 404;
        throw error;
    }

    if (booking.status !== "requested") {
        const error = new Error(
            "This booking cannot be accepted"
        );
        error.statusCode = 400;
        throw error;
    }

    const ride =
        await findRideById(
            booking.ride_id
        );

    if (!ride) {
        const error =
            new Error("Ride not found");

        error.statusCode = 404;
        throw error;
    }

    if (ride.driver_id !== driverId) {
        const error = new Error(
            "You cannot manage this ride request"
        );

        error.statusCode = 403;
        throw error;
    }

    if (ride.available_seats <= 0) {
        const error =
            new Error("No seats available");

        error.statusCode = 400;
        throw error;
    }


    const remainingSeats =
        ride.available_seats - 1;

    const rideStatus =
        remainingSeats === 0
            ? "full"
            : "available";


    await updateRideSeats(
        ride.id,
        remainingSeats,
        rideStatus
    );


    return await updateBookingStatus(
        bookingId,
        "payment_pending"
    );
};

const rejectBookingRequest = async (
    driverId,
    bookingId
) => {

    const booking =
        await findBookingById(bookingId);

    if (!booking) {
        const error =
            new Error(
                "Booking request not found"
            );

        error.statusCode = 404;
        throw error;
    }


    const ride =
        await findRideById(
            booking.ride_id
        );


    if (
        !ride ||
        ride.driver_id !== driverId
    ) {
        const error = new Error(
            "You cannot manage this ride request"
        );

        error.statusCode = 403;
        throw error;
    }


    if (booking.status !== "requested") {
        const error = new Error(
            "This booking cannot be rejected"
        );

        error.statusCode = 400;
        throw error;
    }


    return await updateBookingStatus(
        bookingId,
        "rejected"
    );
};

module.exports = {
    requestBooking,
    makeDummyPayment,
    getMyBookings,
    cancelMyBooking,
    getMyRideHistory,

    getDriverBookingRequests,
    acceptBookingRequest,
    rejectBookingRequest,
}