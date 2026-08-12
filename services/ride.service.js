const {
    createRide,
    findRidesByDriver,
    findRideById,
    updateRideById,
    updateRideStatus,
    findAvailableRides,
} = require("../models/ride.model");

const {findConfirmedPassengerByRide} = require("../models/booking.model");

const {
    findVehicleById,
} = require("../models/vehicle.model");

const {calculateDistance} = require("../utils/distance")


const addRide = async ({
                           driverId,
                           vehicleId,

                           startLocation,
                           startLatitude,
                           startLongitude,

                           destination,
                           destinationLatitude,
                           destinationLongitude,

                           rideDate,
                           departureTime,

                           totalSeats,
                           feePerSeat,
                       }) => {

    if (!vehicleId) {
        const error =
            new Error("Vehicle is required");

        error.statusCode = 400;
        throw error;
    }


    // Check vehicle

    const vehicle =
        await findVehicleById(vehicleId);

    if (!vehicle) {
        const error =
            new Error("Vehicle not found");

        error.statusCode = 404;
        throw error;
    }


    // Very important:
    // driver can only use their own vehicle

    if (vehicle.driver_id !== driverId) {
        const error = new Error(
            "You cannot create a ride using another driver's vehicle"
        );

        error.statusCode = 403;
        throw error;
    }


    if (!vehicle.is_active) {
        const error = new Error(
            "Selected vehicle is inactive"
        );

        error.statusCode = 400;
        throw error;
    }


    // Location validation

    if (!startLocation || !destination) {
        const error = new Error(
            "Start location and destination are required"
        );

        error.statusCode = 400;
        throw error;
    }


    const startLat = Number(startLatitude);
    const startLng = Number(startLongitude);

    const destinationLat =
        Number(destinationLatitude);

    const destinationLng =
        Number(destinationLongitude);


    if (
        Number.isNaN(startLat) ||
        startLat < -90 ||
        startLat > 90
    ) {
        const error =
            new Error("Invalid start latitude");

        error.statusCode = 400;
        throw error;
    }


    if (
        Number.isNaN(startLng) ||
        startLng < -180 ||
        startLng > 180
    ) {
        const error =
            new Error("Invalid start longitude");

        error.statusCode = 400;
        throw error;
    }


    if (
        Number.isNaN(destinationLat) ||
        destinationLat < -90 ||
        destinationLat > 90
    ) {
        const error =
            new Error("Invalid destination latitude");

        error.statusCode = 400;
        throw error;
    }


    if (
        Number.isNaN(destinationLng) ||
        destinationLng < -180 ||
        destinationLng > 180
    ) {
        const error =
            new Error("Invalid destination longitude");

        error.statusCode = 400;
        throw error;
    }


    // Seat validation

    const seats = Number(totalSeats);

    if (
        !Number.isInteger(seats) ||
        seats <= 0
    ) {
        const error = new Error(
            "Total seats must be a positive whole number"
        );

        error.statusCode = 400;
        throw error;
    }


    if (seats > vehicle.seat_capacity) {
        const error = new Error(
            `Available seats cannot exceed vehicle capacity of ${vehicle.seat_capacity}`
        );

        error.statusCode = 400;
        throw error;
    }


    // Fee

    const fee = Number(feePerSeat);

    if (
        Number.isNaN(fee) ||
        fee < 0
    ) {
        const error = new Error(
            "Fee per seat must be zero or greater"
        );

        error.statusCode = 400;
        throw error;
    }


    if (!rideDate || !departureTime) {
        const error = new Error(
            "Ride date and departure time are required"
        );

        error.statusCode = 400;
        throw error;
    }


    return await createRide({
        driverId,
        vehicleId,

        startLocation:
            startLocation.trim(),

        startLatitude: startLat,
        startLongitude: startLng,

        destination:
            destination.trim(),

        destinationLatitude:
        destinationLat,

        destinationLongitude:
        destinationLng,

        rideDate,
        departureTime,

        totalSeats: seats,
        feePerSeat: fee,
    });
};


const getMyRides = async (driverId) => {
    return await findRidesByDriver(
        driverId
    );
};


const getRideById = async (rideId) => {
    const ride =
        await findRideById(rideId);

    if (!ride) {
        const error =
            new Error("Ride not found");

        error.statusCode = 404;
        throw error;
    }

    return ride;
};

// UPDATE RIDE
const updateMyRide = async (
    driverId,
    rideId,
    body
) => {

    const ride = await findRideById(rideId);

    if (!ride) {
        const error = new Error("Ride not found");
        error.statusCode = 404;
        throw error;
    }

    if (ride.driver_id !== driverId) {
        const error = new Error(
            "You cannot update another driver's ride"
        );
        error.statusCode = 403;
        throw error;
    }

    if (
        ride.status === "cancelled" ||
        ride.status === "completed"
    ) {
        const error = new Error(
            "This ride cannot be updated"
        );
        error.statusCode = 400;
        throw error;
    }

    const updateData = {};


    // Vehicle
    if (body.vehicleId !== undefined) {

        const vehicle =
            await findVehicleById(body.vehicleId);

        if (!vehicle) {
            const error =
                new Error("Vehicle not found");
            error.statusCode = 404;
            throw error;
        }

        if (vehicle.driver_id !== driverId) {
            const error = new Error(
                "You cannot use another driver's vehicle"
            );
            error.statusCode = 403;
            throw error;
        }

        if (!vehicle.is_active) {
            const error =
                new Error("Vehicle is inactive");
            error.statusCode = 400;
            throw error;
        }

        updateData.vehicle_id = body.vehicleId;
    }


    // Location
    if (body.startLocation !== undefined) {
        updateData.start_location =
            body.startLocation;
    }

    if (body.startLatitude !== undefined) {
        updateData.start_latitude =
            body.startLatitude;
    }

    if (body.startLongitude !== undefined) {
        updateData.start_longitude =
            body.startLongitude;
    }


    // Destination
    if (body.destination !== undefined) {
        updateData.destination =
            body.destination;
    }

    if (
        body.destinationLatitude !== undefined
    ) {
        updateData.destination_latitude =
            body.destinationLatitude;
    }

    if (
        body.destinationLongitude !== undefined
    ) {
        updateData.destination_longitude =
            body.destinationLongitude;
    }


    // Date and time
    if (body.rideDate !== undefined) {
        updateData.ride_date =
            body.rideDate;
    }

    if (body.departureTime !== undefined) {
        updateData.departure_time =
            body.departureTime;
    }


    // Fee
    if (body.feePerSeat !== undefined) {
        updateData.fee_per_seat =
            body.feePerSeat;
    }


    // Seats
    if (body.totalSeats !== undefined) {

        const vehicleId =
            body.vehicleId || ride.vehicle_id;

        const vehicle =
            await findVehicleById(vehicleId);

        if (
            Number(body.totalSeats) >
            vehicle.seat_capacity
        ) {
            const error = new Error(
                "Seat count exceeds vehicle capacity"
            );
            error.statusCode = 400;
            throw error;
        }

        updateData.total_seats =
            body.totalSeats;

        // No passengers yet,
        // so available seats can also change
        updateData.available_seats =
            body.totalSeats;
    }


    return await updateRideById(
        rideId,
        updateData
    );
};


// CANCEL RIDE
const cancelMyRide = async (
    driverId,
    rideId
) => {

    const ride = await findRideById(rideId);

    if (!ride) {
        const error = new Error("Ride not found");
        error.statusCode = 404;
        throw error;
    }

    if (ride.driver_id !== driverId) {
        const error = new Error(
            "You cannot cancel another driver's ride"
        );
        error.statusCode = 403;
        throw error;
    }

    if (ride.status === "completed") {
        const error = new Error(
            "Completed ride cannot be cancelled"
        );
        error.statusCode = 400;
        throw error;
    }

    return await updateRideStatus(
        rideId,
        "cancelled"
    );
};


// COMPLETE RIDE
const completeMyRide = async (
    driverId,
    rideId
) => {

    const ride = await findRideById(rideId);

    if (!ride) {
        const error = new Error("Ride not found");
        error.statusCode = 404;
        throw error;
    }

    if (ride.driver_id !== driverId) {
        const error = new Error(
            "You cannot complete another driver's ride"
        );
        error.statusCode = 403;
        throw error;
    }

    if (ride.status === "cancelled") {
        const error = new Error(
            "Cancelled ride cannot be completed"
        );
        error.statusCode = 400;
        throw error;
    }

    return await updateRideStatus(
        rideId,
        "completed"
    );
};

const getAvailableRides = async ({
    startLocation,
    destination,
    rideDate,
})=>{
  return await findAvailableRides({
      startLocation,
      destination,
      rideDate,
  });
};

const searchMatchingRides = async ({
                                       startLatitude,
                                       startLongitude,
                                       destinationLatitude,
                                       destinationLongitude,
                                       rideDate,
                                       preferredTime,
                                   }) => {

    const rides = await findAvailableRides({
        rideDate,
    });

    const matchingRides = rides
        .map((ride) => {

            const startDistance =
                calculateDistance(
                    Number(startLatitude),
                    Number(startLongitude),
                    ride.start_latitude,
                    ride.start_longitude
                );

            const destinationDistance =
                calculateDistance(
                    Number(destinationLatitude),
                    Number(destinationLongitude),
                    ride.destination_latitude,
                    ride.destination_longitude
                );


            const passengerTime =
                timeToMinutes(preferredTime);

            const rideTime =
                timeToMinutes(
                    ride.departure_time
                );

            const timeDifference =
                Math.abs(
                    passengerTime - rideTime
                );


            return {
                ...ride,

                start_distance_km:
                    Number(
                        startDistance.toFixed(2)
                    ),

                destination_distance_km:
                    Number(
                        destinationDistance.toFixed(2)
                    ),

                time_difference_minutes:
                timeDifference,
            };
        })

        .filter((ride) => {

            return (
                ride.start_distance_km <= 5 &&
                ride.destination_distance_km <= 5 &&
                ride.time_difference_minutes <= 60
            );
        });


    return matchingRides;
};

const getRidePassengers = async (
    driverId,
    rideId,
)=>{
 const ride= await findRideById(rideId);
 if (!ride) {
     const error = new Error("Ride not found");
     error.statusCode = 404;
     throw error;
 }
 return await findConfirmedPassengerByRide(rideId);
};

const timeToMinutes = (time)=>{
    const [hours, minutes] = time
        .split(":")
        .map(Number);

    return hours * 60 + minutes;
}

module.exports = {
    addRide,
    getMyRides,
    getRideById,
    updateMyRide,
    cancelMyRide,
    completeMyRide,

    getAvailableRides,
    searchMatchingRides,
    getRidePassengers,
};