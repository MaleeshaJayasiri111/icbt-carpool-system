const express = require("express");

const {
    getUserById,
    getAllUsers,
    deleteUser,
    getUsersByRole,
} = require("../controllers/admin.controller");

const {
    authenticate,
} = require("../middleware/auth.middleware");

const {
    requireAdmin
} = require("../middleware/admin.middleware");
const {getUserByRole} = require("../services/admin.service");

const router= express.Router();

router.get("/users",authenticate,requireAdmin,getAllUsers);

router.get(
    "/user/:id",
    authenticate,
    requireAdmin,
    getUserById
);
router.get(
    "/:role",
    authenticate,
    requireAdmin,
    getUsersByRole
);



router.delete(
    "/user/:id",
    authenticate,
    requireAdmin,
    deleteUser
);

module.exports = router;
