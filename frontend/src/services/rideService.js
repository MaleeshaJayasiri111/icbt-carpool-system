import api from "./api";

export const createRide = async (rideData) => {
    const response = await api.post(
        "/ride",
        rideData
    );

    return response.data;
};

export const getMyRides = async () => {
    const response = await api.get(
        "/ride/my-rides"
    );

    return response.data;
};

export const cancelRide = async (rideId) => {
    const response = await api.patch(
        `/ride/${rideId}/cancel`
    );

    return response.data;
};


export const completeRide = async (rideId) => {
    const response = await api.patch(
        `/ride/${rideId}/complete`
    );

    return response.data;
};

export const updateRide = async (
    rideId,
    rideData
) => {
    const response = await api.put(
        `/ride/${rideId}`,
        rideData
    );

    return response.data;
};


export const getRidePassengers = async (
    rideId
) => {
    const response = await api.get(
        `/ride/${rideId}/passengers`
    );

    return response.data;
};
export const searchRides = async (searchData) => {
    const response = await api.post(
        "/ride/search",
        searchData
    );

    return response.data;
};