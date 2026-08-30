const express = require("express");

const {
    getUserById,
    getAllUsers,
    deleteUser,
    getUsersByRole,
    updateUserVerification,
    getAllRides,
    deleteRide,
    getAnalytics,
    getLogs,
} = require("../controllers/admin.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/admin.middleware");

const router = express.Router();

// Analytics & Activity Audit Logs
router.get("/analytics", authenticate, requireAdmin, getAnalytics);
router.get("/logs", authenticate, requireAdmin, getLogs);

// User Management
router.get("/users", authenticate, requireAdmin, getAllUsers);
router.get("/user/:id", authenticate, requireAdmin, getUserById);
router.get("/role/:role", authenticate, requireAdmin, getUsersByRole);
router.patch("/user/:id/verify", authenticate, requireAdmin, updateUserVerification);
router.delete("/user/:id", authenticate, requireAdmin, deleteUser);

// Ride Management
router.get("/rides", authenticate, requireAdmin, getAllRides);
router.delete("/ride/:id", authenticate, requireAdmin, deleteRide);

module.exports = router;
