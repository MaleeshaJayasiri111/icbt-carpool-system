const express = require(
    "express"
);

const {
    getMessages,
    sendMessage,
} = require(
    "../controllers/message.controller"
);

const {
    authenticate,
} = require(
    "../middleware/auth.middleware"
);


const router =
    express.Router();

router.use(
    authenticate
);

router.get(
    "/ride/:rideId",
    getMessages
);

router.post(
    "/ride/:rideId",
    sendMessage
);


module.exports =
    router;