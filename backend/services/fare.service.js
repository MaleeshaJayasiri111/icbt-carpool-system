const {
    findFareRateByVehicleType,
} = require("../models/fare.model");

const {
    findVehicleById,
} = require("../models/vehicle.model");

const calculateHaversineDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {

    const toRadians = (value) =>
        (value * Math.PI) / 180;


    const earthRadius = 6371;


    const dLat =
        toRadians(lat2 - lat1);

    const dLon =
        toRadians(lon2 - lon1);


    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(
            toRadians(lat1)
        ) *
        Math.cos(
            toRadians(lat2)
        ) *
        Math.sin(dLon / 2) ** 2;


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return earthRadius * c;
};

// ROUND TO NEAREST RS. 10

const roundToNearestTen = (
    amount
) => {

    return Math.round(
        amount / 10
    ) * 10;
};



// CALCULATE FARE

const calculateRideFare = async ({
                                     driverId,
                                     vehicleId,
                                     startLatitude,
                                     startLongitude,
                                     destinationLatitude,
                                     destinationLongitude,
                                 }) => {


    // =================================
    // FIND VEHICLE
    // =================================

    const vehicle =
        await findVehicleById(
            vehicleId
        );


    if (!vehicle) {

        const error =
            new Error(
                "Vehicle not found"
            );

        error.statusCode = 404;

        throw error;
    }


    // Driver can only calculate
    // using their own vehicle

    if (
        vehicle.driver_id !== driverId
    ) {

        const error =
            new Error(
                "You cannot use this vehicle"
            );

        error.statusCode = 403;

        throw error;
    }


    // =================================
    // VEHICLE CAPACITY
    // =================================

    const seatCapacity =
        Number(
            vehicle.seat_capacity
        );


    if (
        !seatCapacity ||
        seatCapacity <= 1
    ) {

        const error =
            new Error(
                "Invalid vehicle seat capacity"
            );

        error.statusCode = 400;

        throw error;
    }


    // =================================
    // GET VEHICLE FARE SETTINGS
    // =================================

    const fareRate =
        await findFareRateByVehicleType(
            vehicle.vehicle_type
        );


    if (!fareRate) {

        const error =
            new Error(
                "Fare rate not configured for this vehicle type"
            );

        error.statusCode = 400;

        throw error;
    }


    const ratePerKm =
        Number(
            fareRate.rate_per_km
        );

    const minimumContribution =
        Number(
            fareRate.minimum_contribution
        );

    const minIncentive =
        Number(
            fareRate.min_incentive_percent
        );

    const recommendedIncentive =
        Number(
            fareRate
                .recommended_incentive_percent
        );

    const maxIncentive =
        Number(
            fareRate.max_incentive_percent
        );


    // =================================
    // DISTANCE
    // =================================

    const straightDistance =
        calculateHaversineDistance(
            Number(startLatitude),
            Number(startLongitude),
            Number(
                destinationLatitude
            ),
            Number(
                destinationLongitude
            )
        );


    // Approximate road distance
    // for assignment purposes

    const estimatedDistance =
        straightDistance * 1.2;


    // =================================
    // WHOLE TRIP ESTIMATED COST
    // =================================

    const estimatedTripCost =
        estimatedDistance *
        ratePerKm;


    // =================================
    // BASE CONTRIBUTION
    //
    // IMPORTANT:
    // Uses registered vehicle capacity,
    // NOT number of seats offered.
    // =================================

    const baseContribution =
        estimatedTripCost /
        seatCapacity;


    // =================================
    // FARE RANGE
    // =================================

    let minimumFare =
        baseContribution *
        (
            1 +
            minIncentive / 100
        );


    let suggestedFare =
        baseContribution *
        (
            1 +
            recommendedIncentive / 100
        );


    let maximumFare =
        baseContribution *
        (
            1 +
            maxIncentive / 100
        );


    // =================================
    // APPLY MINIMUM CONTRIBUTION
    // =================================

    minimumFare =
        Math.max(
            minimumFare,
            minimumContribution
        );

    suggestedFare =
        Math.max(
            suggestedFare,
            minimumContribution
        );

    maximumFare =
        Math.max(
            maximumFare,
            minimumContribution
        );


    // =================================
    // ROUND VALUES
    // =================================

    minimumFare =
        roundToNearestTen(
            minimumFare
        );

    suggestedFare =
        roundToNearestTen(
            suggestedFare
        );

    maximumFare =
        roundToNearestTen(
            maximumFare
        );


    // =================================
    // RETURN RESULT
    // =================================

    return {

        vehicle: {
            id:
            vehicle.id,

            vehicleType:
            vehicle.vehicle_type,

            seatCapacity,

            maximumPassengerSeats:
                seatCapacity - 1,
        },


        distance: {
            straightDistanceKm:
                Number(
                    straightDistance
                        .toFixed(2)
                ),

            estimatedDistanceKm:
                Number(
                    estimatedDistance
                        .toFixed(2)
                ),
        },


        pricing: {

            ratePerKm,

            estimatedTripCost:
                roundToNearestTen(
                    estimatedTripCost
                ),

            baseContribution:
                roundToNearestTen(
                    baseContribution
                ),

            minimumFare,

            suggestedFare,

            maximumFare,

            minimumContribution,

            incentives: {
                minimum:
                minIncentive,

                recommended:
                recommendedIncentive,

                maximum:
                maxIncentive,
            },
        },
    };
};


module.exports = {
    calculateRideFare,
};