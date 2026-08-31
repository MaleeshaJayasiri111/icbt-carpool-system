import api from "./api";

export const getRideMessages= async (
    rideId
)=>{
    const response =
        await api.get(
            `/messages/ride/${rideId}`
        );

    return response.data;
}

export const sendRideMessage = async (
    rideId,
    message
) => {

    const response =
        await api.post(
            `/messages/ride/${rideId}`,
            {
                message,
            }
        );

    return response.data;
};