const { supabase } = require("../config/supabase");
const { findUserById } = require("../models/user.model");

const authenticate = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }

        const token = authorizationHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }

        const {
            data: { user: authUser },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token",
            });
        }

        const userProfile = await findUserById(authUser.id);

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found",
            });
        }

        req.user = userProfile;
        req.accessToken = token;

        next();
    } catch (error) {
        console.error("Authentication middleware error:", error);

        return res.status(500).json({
            success: false,
            message: "Authentication failed",
        });
    }
};

module.exports = {
    authenticate,
};