const bookingService= require("../services/booking.service");

const requestBooking = async (req,res)=>{
    try{
        const {rideId} = req.params;
        const booking = await bookingService.requestBooking(
            req.user.id,
            rideId
        );

        return res.status(201).json({
            success: true,
            message:
                "Booking created. Complete payment to join the ride.",
            data: booking,
        });
    }catch(error){
        console.error("Booking Request Error ",error);

        res.status(400).json({message: "Booking Request Error"});
    }
};

const makePayment = async (req, res) => {

    try {

        const { bookingId } =
            req.params;


        const result =
            await bookingService.makeDummyPayment(
                req.user.id,
                bookingId
            );


        return res.status(200).json({
            success: true,
            message:
                "Payment successful. You have joined the ride.",
            data: result,
        });

    } catch (error) {

        console.error(
            "Payment error:",
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

const getMyBookings = async (
    req,
    res
) => {

    try {

        const bookings =
            await bookingService.getMyBookings(
                req.user.id
            );


        return res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
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

const cancelBooking = async (req, res) => {
    try{
        const {bookingId} = req.params;
        const booking= await bookingService.cancelMyBooking(
            req.user.id,
            bookingId);

        return res.status(200).json({
            success: true,
            message:
                "Booking cancelled successfully",
            data: booking,
        });

    }catch(error){
        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message,
        });
    }
}

const getMyRideHistory= async (req,res)=>{
    try{
        const result = await bookingService.getMyRideHistory(req.user.id);

        return res.status(200).json({
            success: true,
            data: result,
        });
    }catch(error){
        console.error("getMyRideHistory:",error);
    }
}

const getDriverBookingRequests = async (
    req,
    res
) => {

    try {

        const requests =
            await bookingService
                .getDriverBookingRequests(
                    req.user.id
                );

        return res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });

    } catch (error) {

        console.error(
            "Get booking requests error:",
            error
        );

        return res
            .status(
                error.statusCode || 500
            )
            .json({
                success: false,
                message: error.message,
            });
    }
};

const acceptBookingRequest = async (req, res) => {
    try {

        const { bookingId } = req.params;

        const booking =
            await bookingService.acceptBookingRequest(
                req.user.id,
                bookingId
            );

        return res.status(200).json({
            success: true,
            message:
                "Passenger request accepted. Waiting for payment.",
            data: booking,
        });

    } catch (error) {

        console.error(
            "Accept booking request error:",
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


const rejectBookingRequest = async (req, res) => {
    try {

        const { bookingId } = req.params;

        const booking =
            await bookingService.rejectBookingRequest(
                req.user.id,
                bookingId
            );

        return res.status(200).json({
            success: true,
            message:
                "Passenger request rejected.",
            data: booking,
        });

    } catch (error) {

        console.error(
            "Reject booking request error:",
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

module.exports = {
    requestBooking,
    makePayment,
    getMyBookings,
    cancelBooking,
    getMyRideHistory,

    acceptBookingRequest,
    rejectBookingRequest,
    getDriverBookingRequests,
};