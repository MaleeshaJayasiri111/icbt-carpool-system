import api from "./api";

export const getDriverRequests = async () => {
    const response = await api.get(
        "/bookings/driver/requests"
    );

    return response.data;
};


export const acceptBookingRequest = async (bookingId) => {
    const response = await api.patch(
        `/bookings/${bookingId}/accept`
    );

    return response.data;
};


export const rejectBookingRequest = async (bookingId) => {
    const response = await api.patch(
        `/bookings/${bookingId}/reject`
    );

    return response.data;
};

export const requestRide = async (rideId) => {
    const response = await api.post(
        `/bookings/ride/${rideId}`
    );

    return response.data;
};

export const getMyBookings = async () => {
    const response = await api.get(
        "/bookings/my-rides"
    );

    return response.data;
};

export const makePayment = async (bookingId) => {
    const response = await api.post(
        `/bookings/${bookingId}/pay`
    );

    return response.data;
};

export const cancelBooking = async (bookingId) => {
    const response = await api.patch(
        `/bookings/${bookingId}/cancel`
    );

    return response.data;
};
export const getRideHistory = async () => {

    const response =
        await api.get(
            "/bookings/history"
        );

    return response.data;
};