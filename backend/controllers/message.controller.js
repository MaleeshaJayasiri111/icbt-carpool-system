const {
    getRideMessages,
    sendRideMessage,
} = require(
    "../services/message.service"
);

// GET RIDE MESSAGES
const getMessages = async (
    req,
    res
) => {

    try {

        const {
            rideId,
        } = req.params;


        const messages =
            await getRideMessages(
                req.user.id,
                rideId
            );


        return res
            .status(200)
            .json({
                success: true,
                data: messages,
            });

    } catch (error) {

        console.error(
            "Get ride messages error:",
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
                    "Unable to get messages",
            });
    }
};

// SEND RIDE MESSAGE

const sendMessage = async (
    req,
    res
) => {

    try {

        const {
            rideId,
        } = req.params;


        const {
            message,
        } = req.body;


        const newMessage =
            await sendRideMessage({
                userId:
                req.user.id,

                rideId,

                message,
            });


        return res
            .status(201)
            .json({
                success: true,
                message:
                    "Message sent successfully",
                data:
                newMessage,
            });

    } catch (error) {

        console.error(
            "Send ride message error:",
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
                    "Unable to send message",
            });
    }
};


module.exports = {
    getMessages,
    sendMessage,
};