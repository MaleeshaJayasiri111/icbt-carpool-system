import api from "./api";

// GET MY PROFILE

export const getMyProfile =
    async () => {

        const response =
            await api.get(
                "/user/profile"
            );

        return response.data;
    };

// UPDATE MY PROFILE

export const updateMyProfile =
    async (profileData) => {

        const response =
            await api.put(
                "/user/profile",
                profileData
            );

        return response.data;
    };

// DELETE MY ACCOUNT
export const deleteMyProfile =
    async () => {

        const response =
            await api.delete(
                "/user/profile"
            );

        return response.data;
    };