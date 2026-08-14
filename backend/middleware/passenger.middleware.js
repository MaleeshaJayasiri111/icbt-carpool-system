const requirePassenger = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    if (req.user.role !== "passenger") {
        return res.status(403).json({
            success: false,
            message: "Passenger access required",
        });
    }

    next();
};

module.exports = {
    requirePassenger,
};