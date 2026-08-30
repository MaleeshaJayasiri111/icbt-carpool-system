const {
    createMessage,
    findMessagesByRide,
} = require('../models/message.model');

const {
    findRideById,
} = require('../models/ride.model');

const {
    findConfirmedBookingByRideAndPassenger
} = require('../models/booking.model');


//check chat access
const checkChatAccess= async (
    userId,
    rideId
)=>{
    const ride = await findRideById(rideId);
    if (!ride) {

        const error =
            new Error(
                "Ride not found"
            );

        error.statusCode = 404;

        throw error;
    }

    //check if Driver owns this ride
    if (
        ride.driver_id === userId
    ) {

        return {
            ride,
            isDriver: true,
        };
    }

    const booking =
        await findConfirmedBookingByRideAndPassenger(
            rideId,
            userId
        );


    if (!booking) {

        const error =
            new Error(
                "You do not have access to this ride chat"
            );

        error.statusCode = 403;

        throw error;
    }


    return {
        ride,
        isDriver: false,
    };

}

const getRideMessages = async (userId, rideId) => {
    // Verify access first
    await checkChatAccess(
        userId,
        rideId
    );

    return await findMessagesByRide(
        rideId
    );
}

const sendRideMessage = async ({
    userId,
    rideId,
    message,
})=>{
    const {ride,} = await checkChatAccess(
        userId,
        rideId,
    );

    // Don't allow sending after ride ends
    if (
        ride.status === "cancelled" ||
        ride.status === "completed"
    ) {

        const error =
            new Error(
                "Messages cannot be sent for this ride"
            );

        error.statusCode = 400;

        throw error;
    }

    // Simple message validation
    if (
        !message ||
        !message.trim()
    ) {

        const error =
            new Error(
                "Message is required"
            );

        error.statusCode = 400;

        throw error;
    }

    return await createMessage({
        rideId,
        senderId: userId,
        message,
    });
}

module.exports={
    getRideMessages,
    sendRideMessage,
}