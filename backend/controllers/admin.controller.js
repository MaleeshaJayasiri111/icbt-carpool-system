const adminService = require("../services/admin.service");

// GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error("Get users error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to retrieve users",
        });
    }
};

// GET /api/admin/user/:id
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await adminService.getUserById(id);
        return res.status(200).json({
            success: true,
            message: "User found successfully",
            data: user,
        });
    } catch (error) {
        console.error("Get user error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to retrieve user",
        });
    }
};

// DELETE /api/admin/user/:id
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await adminService.deleteUser(id, req.user.id);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Delete user error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to delete user",
        });
    }
};

// GET /api/admin/role/:role
const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const users = await adminService.getUserByRole(role);
        return res.status(200).json({
            success: true,
            message: `${role} users retrieved successfully`,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error("Get users by role error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to retrieve users",
        });
    }
};

// PATCH /api/admin/user/:id/verify
const updateUserVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;
        const updatedUser = await adminService.setUserVerification(id, isVerified);
        return res.status(200).json({
            success: true,
            message: "User verification status updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Update verification error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to update user verification",
        });
    }
};

// GET /api/admin/rides
const getAllRides = async (req, res) => {
    try {
        const rides = await adminService.getAllRidesAdmin();
        return res.status(200).json({
            success: true,
            message: "All rides retrieved successfully",
            count: rides.length,
            data: rides,
        });
    } catch (error) {
        console.error("Get all rides error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to retrieve rides",
        });
    }
};

// DELETE /api/admin/ride/:id
const deleteRide = async (req, res) => {
    try {
        const { id } = req.params;
        await adminService.deleteRideAdmin(id);
        return res.status(200).json({
            success: true,
            message: "Ride deleted/cancelled successfully",
        });
    } catch (error) {
        console.error("Delete ride error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to delete ride",
        });
    }
};

// GET /api/admin/analytics
const getAnalytics = async (req, res) => {
    try {
        const analytics = await adminService.getSystemAnalytics();
        return res.status(200).json({
            success: true,
            message: "Analytics retrieved successfully",
            data: analytics,
        });
    } catch (error) {
        console.error("Get analytics error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to retrieve analytics",
        });
    }
};

// GET /api/admin/logs
const getLogs = async (req, res) => {
    try {
        const logs = await adminService.getSystemLogs();
        return res.status(200).json({
            success: true,
            message: "System logs retrieved successfully",
            count: logs.length,
            data: logs,
        });
    } catch (error) {
        console.error("Get logs error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to retrieve logs",
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    getUsersByRole,
    updateUserVerification,
    getAllRides,
    deleteRide,
    getAnalytics,
    getLogs,
};