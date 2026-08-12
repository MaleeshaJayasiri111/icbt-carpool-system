const express = require("express");

const {
    createVehicle,
    getmyVehicles,
    getVehicleById,
    updateVehicle,
    deactivateVehicle,
} = require("../controllers/vehicle.controller");

const {
    authenticate,
} = require("../middleware/auth.middleware");

const {
    requireDriver,
} = require("../middleware/driver.middleware");

const router = express.Router();

router.use(authenticate);
router.use(requireDriver);

router.post("/", createVehicle);

router.get("/", getmyVehicles);

router.get(
    "/:vehicleId",
    getVehicleById
);

router.put(
    "/:vehicleId",
    updateVehicle
);

router.delete(
    "/:vehicleId",
    deactivateVehicle
);

module.exports = router;