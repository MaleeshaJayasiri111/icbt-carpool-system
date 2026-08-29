import api from "./api";

export const getAdminAnalytics = async () => {
    const response = await api.get("/api/admin/analytics");
    return response.data;
};

export const getAdminLogs = async () => {
    const response = await api.get("/api/admin/logs");
    return response.data;
};

export const getAdminUsers = async () => {
    const response = await api.get("/api/admin/users");
    return response.data;
};

export const getAdminUsersByRole = async (role) => {
    const response = await api.get(`/api/admin/role/${role}`);
    return response.data;
};

export const updateAdminUserVerification = async (userId, isVerified) => {
    const response = await api.patch(`/api/admin/user/${userId}/verify`, { isVerified });
    return response.data;
};

export const deleteAdminUser = async (userId) => {
    const response = await api.delete(`/api/admin/user/${userId}`);
    return response.data;
};

export const getAdminRides = async () => {
    const response = await api.get("/api/admin/rides");
    return response.data;
};

export const deleteAdminRide = async (rideId) => {
    const response = await api.delete(`/api/admin/ride/${rideId}`);
    return response.data;
};
