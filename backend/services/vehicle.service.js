const {
    createVehicle,
    findVehiclesByDriver,
    findVehicleById,
    findVehicleByNumber,
    updateVehicleById,
    deactivateVehicleById,
} = require("../models/vehicle.model");


const addVehicle = async ({
                              driverId,
                              vehicleNumber,
                              vehicleType,
                              brand,
                              model,
                              color,
                              seatCapacity,
                          }) => {
    const allowedTypes = [
        "car",
        "van",
        "three_wheeler",
    ];

    if (
        !vehicleNumber ||
        !vehicleType ||
        !brand ||
        !model ||
        !seatCapacity
    ) {
        const error = new Error(
            "Vehicle number, type, brand, model and seat capacity are required"
        );

        error.statusCode = 400;
        throw error;
    }

    const normalizedVehicleNumber =
        vehicleNumber.trim().toUpperCase();

    if (!allowedTypes.includes(vehicleType)) {
        const error = new Error(
            "Invalid vehicle type"
        );

        error.statusCode = 400;
        throw error;
    }

    const capacity = Number(seatCapacity);

    if (
        !Number.isInteger(capacity) ||
        capacity <= 0
    ) {
        const error = new Error(
            "Seat capacity must be a positive whole number"
        );

        error.statusCode = 400;
        throw error;
    }

    const existingVehicle =
        await findVehicleByNumber(
            normalizedVehicleNumber
        );

    if (existingVehicle) {
        const error = new Error(
            "Vehicle number already registered"
        );

        error.statusCode = 409;
        throw error;
    }

    return await createVehicle({
        driverId,
        vehicleNumber: normalizedVehicleNumber,
        vehicleType,
        brand: brand.trim(),
        model: model.trim(),
        color: color?.trim() || null,
        seatCapacity: capacity,
    });
};


const getMyVehicles = async (driverId) => {
    return await findVehiclesByDriver(driverId);
};


const getMyVehicleById = async (
    driverId,
    vehicleId
) => {
    const vehicle =
        await findVehicleById(vehicleId);

    if (!vehicle) {
        const error = new Error(
            "Vehicle not found"
        );

        error.statusCode = 404;
        throw error;
    }

    if (vehicle.driver_id !== driverId) {
        const error = new Error(
            "You do not have access to this vehicle"
        );

        error.statusCode = 403;
        throw error;
    }

    return vehicle;
};


const updateMyVehicle = async (
    driverId,
    vehicleId,
    {
        vehicleNumber,
        vehicleType,
        brand,
        model,
        color,
        seatCapacity,
    }
) => {

    const vehicle =
        await getMyVehicleById(
            driverId,
            vehicleId
        );

    const updateData = {};


    // VEHICLE NUMBER
    if (vehicleNumber !== undefined) {

        const normalizedVehicleNumber =
            vehicleNumber.trim().toUpperCase();

        if (
            normalizedVehicleNumber !==
            vehicle.vehicle_number
        ) {

            const existingVehicle =
                await findVehicleByNumber(
                    normalizedVehicleNumber
                );

            if (existingVehicle) {
                const error = new Error(
                    "Vehicle number already registered"
                );

                error.statusCode = 409;
                throw error;
            }
        }

        updateData.vehicle_number =
            normalizedVehicleNumber;
    }


    // VEHICLE TYPE
    if (vehicleType !== undefined) {

        const allowedTypes = [
            "car",
            "van",
            "three_wheeler",
        ];

        if (
            !allowedTypes.includes(vehicleType)
        ) {
            const error = new Error(
                "Invalid vehicle type"
            );

            error.statusCode = 400;
            throw error;
        }

        updateData.vehicle_type =
            vehicleType;
    }


    // BRAND
    if (brand !== undefined) {
        updateData.brand =
            brand.trim();
    }


    // MODEL
    if (model !== undefined) {
        updateData.model =
            model.trim();
    }


    // COLOR
    if (color !== undefined) {
        updateData.color =
            color.trim();
    }


    // SEAT CAPACITY
    if (seatCapacity !== undefined) {

        const capacity =
            Number(seatCapacity);

        if (
            !Number.isInteger(capacity) ||
            capacity <= 0
        ) {
            const error = new Error(
                "Invalid seat capacity"
            );

            error.statusCode = 400;
            throw error;
        }

        updateData.seat_capacity =
            capacity;
    }


    return await updateVehicleById(
        vehicle.id,
        updateData
    );
};

const deactivateMyVehicle = async (
    driverId,
    vehicleId
) => {
    const vehicle =
        await getMyVehicleById(
            driverId,
            vehicleId
        );

    return await deactivateVehicleById(
        vehicle.id
    );
};


module.exports = {
    addVehicle,
    getMyVehicles,
    getMyVehicleById,
    updateMyVehicle,
    deactivateMyVehicle,
};