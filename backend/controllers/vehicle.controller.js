const vehicleService =
    require("../services/vehicle.service");


const createVehicle = async (req, res) => {
    try {
        const driverId = req.user.id;

        const {
            vehicleNumber,
            vehicleType,
            brand,
            model,
            color,
            seatCapacity,
        } = req.body;

        const vehicle =
            await vehicleService.addVehicle({
                driverId,
                vehicleNumber,
                vehicleType,
                brand,
                model,
                color,
                seatCapacity,
            });

        return res.status(201).json({
            success: true,
            message: "Vehicle registered successfully",
            data: vehicle,
        });

    } catch (error) {
        console.error(
            "Create vehicle error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to register vehicle",
        });
    }
};


const getmyVehicles = async (req, res) => {
    try {
        const vehicles =
            await vehicleService.getMyVehicles(
                req.user.id
            );

        console.log(vehicles);
        return res.status(200).json({
            success: true,
            message:
                "Vehicles retrieved successfully",
            count: vehicles.length,
            data: vehicles,
        });

    } catch (error) {
        console.error(error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};


const getVehicleById = async (req, res) => {
    try {
        const { vehicleId } = req.params;

        const vehicle =
            await vehicleService.getMyVehicleById(
                req.user.id,
                vehicleId
            );

        return res.status(200).json({
            success: true,
            data: vehicle,
        });

    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message,
        });
    }
};


const updateVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;

        const vehicle =
            await vehicleService.updateMyVehicle(
                req.user.id,
                vehicleId,
                req.body
            );

        return res.status(200).json({
            success: true,
            message:
                "Vehicle updated successfully",
            data: vehicle,
        });

    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message,
        });
    }
};


const deactivateVehicle = async (
    req,
    res
) => {
    try {
        const { vehicleId } = req.params;

        const vehicle =
            await vehicleService.deactivateMyVehicle(
                req.user.id,
                vehicleId
            );

        return res.status(200).json({
            success: true,
            message:
                "Vehicle deactivated successfully",
            data: vehicle,
        });

    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    createVehicle,
    getmyVehicles,
    getVehicleById,
    updateVehicle,
    deactivateVehicle,
};