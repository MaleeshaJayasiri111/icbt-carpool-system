const express = require("express");

const {
    getProfile,
    updateProfile,
    deleteProfile,
} = require("../controllers/user.controller");

const {
    authenticate,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/profile", authenticate, getProfile);

router.put("/profile", authenticate, updateProfile);

router.delete(
    "/profile",
    authenticate,
    deleteProfile
);

module.exports = router;