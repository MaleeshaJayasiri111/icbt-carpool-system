import api from "./api";

export const registerUser = async (data) => {
    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await api.post(
        "/auth/login",
        loginData
    );

    return response.data;
};

export const forgotPassword =
    async (email) => {

        const response =
            await api.post(
                "/auth/forgot-password",
                {
                    email,
                }
            );

        return response.data;
    };

export const resetPassword =
    async (
        accessToken,
        refreshToken,
        newPassword
    ) => {

        const response =
            await api.post(
                "/auth/reset-password",
                {
                    accessToken,
                    refreshToken,
                    newPassword,
                }
            );

        return response.data;
    };