const express=require("express");

const {uploadProfileImage} = require("../middleware/upload.middleware");

const {
    login,
    register, getCurrentUser,forgotPassword,resetPassword,
} = require("../controllers/auth.controller");
const {registerUser, loginUser} = require("../services/auth.service");
const {authenticate} = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/register",uploadProfileImage.single("profileImage"),register);
router.post("/login",login);

router.post(
    "/forgot-password",
    forgotPassword
);
router.post(
    "/reset-password",
    resetPassword
);

router.get("/me",authenticate, getCurrentUser);

module.exports = router;