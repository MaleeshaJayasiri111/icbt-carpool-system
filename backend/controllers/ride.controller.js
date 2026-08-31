const rideService =
    require("../services/ride.service");

const {calculateRideFare} = require("../services/fare.service");


const createRide = async (req, res) => {
    try {

        const driverId = req.user.id;

        const {
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
        } = req.body;


        const ride =
            await rideService.addRide({

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
            });


        return res.status(201).json({
            success: true,
            message:
                "Ride created successfully",
            data: ride,
        });

    } catch (error) {

        console.error(
            "Create ride error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to create ride",
        });
    }
};


const getMyRides = async (req, res) => {
    try {

        const rides =
            await rideService.getMyRides(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            count: rides.length,
            data: rides,
        });

    } catch (error) {

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message,
        });
    }
};


const getRideById = async (req, res) => {
    try {

        const { rideId } = req.params;

        const ride =
            await rideService.getRideById(
                rideId
            );

        return res.status(200).json({
            success: true,
            data: ride,
        });

    } catch (error) {

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message,
        });
    }
};

// UPDATE RIDE
const updateRide = async (req, res) => {
    try {
        const { rideId } = req.params;

        const ride = await rideService.updateMyRide(
            req.user.id,
            rideId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Ride updated successfully",
            data: ride,
        });

    } catch (error) {
        console.error("Update ride error:", error);

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to update ride",
        });
    }
};


// CANCEL RIDE
const cancelRide = async (req, res) => {
    try {
        const { rideId } = req.params;

        const ride = await rideService.cancelMyRide(
            req.user.id,
            rideId
        );

        return res.status(200).json({
            success: true,
            message: "Ride cancelled successfully",
            data: ride,
        });

    } catch (error) {
        console.error("Cancel ride error:", error);

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to cancel ride",
        });
    }
};


// COMPLETE RIDE
const completeRide = async (req, res) => {
    try {
        const { rideId } = req.params;

        const ride = await rideService.completeMyRide(
            req.user.id,
            rideId
        );

        return res.status(200).json({
            success: true,
            message: "Ride completed successfully",
            data: ride,
        });

    } catch (error) {
        console.error("Complete ride error:", error);

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to complete ride",
        });
    }
};

const getAvailableRides = async (
    req,
    res
) => {

    try {

        const {
            startLocation,
            destination,
            rideDate,
        } = req.query;


        const rides =
            await rideService.getAvailableRides({
                startLocation,
                destination,
                rideDate,
            });


        return res.status(200).json({
            success: true,
            message:
                "Available rides retrieved successfully",
            count: rides.length,
            data: rides,
        });

    } catch (error) {

        console.error(
            "Available rides error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message,
        });
    }
};

const searchMatchingRides = async (
    req,
    res
) => {

    try {

        const {
            startLatitude,
            startLongitude,
            destinationLatitude,
            destinationLongitude,
            rideDate,
            preferredTime,
        } = req.body;

        const rides =
            await rideService.searchMatchingRides({
                startLatitude,
                startLongitude,
                destinationLatitude,
                destinationLongitude,
                rideDate,
                preferredTime,
            });





        return res.status(200).json({
            success: true,
            message:
                "Matching rides retrieved successfully",
            count: rides.length,
            data: rides,
        });

    } catch (error) {

        console.error(
            "Ride search error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message,

        });
    }
};
const getRidePassengers= async (req,res)=>{
    try{
        const {rideId}= req.params;

        const passengers =await rideService.getRidePassengers(
            req.user.id,
            rideId
        );
        return res.status(200).json({
            success: true,
            count: passengers.length,
            data: passengers,
        });

    }catch(error){
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

//calculate suggested fare
const calculateFare = async (
    req,
    res
) => {

    try {

        const {
            vehicleId,
            startLatitude,
            startLongitude,
            destinationLatitude,
            destinationLongitude,
        } = req.body;


        if (
            !vehicleId ||
            startLatitude === undefined ||
            startLongitude === undefined ||
            destinationLatitude === undefined ||
            destinationLongitude === undefined
        ) {

            return res
                .status(400)
                .json({
                    success: false,
                    message:
                        "Vehicle and locations are required",
                });
        }


        const fare =
            await calculateRideFare({
                driverId:
                req.user.id,

                vehicleId,

                startLatitude,
                startLongitude,
                destinationLatitude,
                destinationLongitude,
            });


        return res
            .status(200)
            .json({
                success: true,
                data: fare,
            });

    } catch (error) {

        console.error(
            "Calculate fare error:",
            error
        );


        return res
            .status(
                error.statusCode || 500
            )
            .json({
                success: false,
                message:
                    error.message ||
                    "Unable to calculate fare",
            });
    }
};

module.exports = {
    createRide,
    getMyRides,
    getRideById,
    updateRide,
    cancelRide,
    completeRide,

    getAvailableRides,
    searchMatchingRides,
    getRidePassengers,
    calculateFare
};