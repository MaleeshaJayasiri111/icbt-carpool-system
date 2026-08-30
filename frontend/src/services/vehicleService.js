import api from "./api";

export const getMyVehicles = async () => {
    const response = await api.get("/vehicle");
    return response.data;
};

export const addVehicle = async (vehicleData) => {
    const response = await api.post(
        "/vehicle",
        vehicleData
    );

    return response.data;
};

export const updateVehicle = async (
    vehicleId,
    vehicleData
) => {
    const response = await api.put(
        `/vehicle/${vehicleId}`,
        vehicleData
    );

    return response.data;
};

export const deactivateVehicle = async (vehicleId) => {
    const response = await api.delete(
        `/vehicle/${vehicleId}`
    );

    return response.data;
};