const express=require("express");

const {uploadProfileImage} = require("../middleware/upload.middleware");

const {
    login,
    register, getCurrentUser,
} = require("../controllers/auth.controller");
const {registerUser, loginUser} = require("../services/auth.service");
const {authenticate} = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/register",uploadProfileImage.single("profileImage"),register);
router.post("/login",login);

router.get("/me",authenticate, getCurrentUser);

module.exports = router;