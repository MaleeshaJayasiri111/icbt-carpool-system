const userService = require("../services/user.service");


//GET /api/users/profile

const getProfile = async (req, res) => {
    try {
        const user = await userService.getUserProfile(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: user,
        });
    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message || "Failed to retrieve profile",
        });
    }
};

//PUT /api/users/profile

const updateProfile = async (req, res) => {
    try {
        const {fullName,phone} = req.body;

        const updateUser= await userService.updateuserProfile(
            req.user.id,
            {fullName:
                    fullName !== undefined ? fullName.trim() : undefined
                ,phone:
                    phone !== undefined
                        ? phone.trim()
                        : undefined,},
        );
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updateUser,
        });
    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message || "Failed to update profile",
        });
    }
}

/**
 * DELETE /api/users/profile
 */

const deleteProfile = async (req, res) => {
    try {
        await userService.deleteUserProfile(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error("Delete profile error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message || "Failed to delete account",
        });
    }
};

module.exports = {
    updateProfile,
    getProfile,
    deleteProfile,
}