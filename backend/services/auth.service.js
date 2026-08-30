const {
    supabase,
    supabaseAdmin} = require("../config/supabase");

const {createClient} = require("@supabase/supabase-js");

const {
    uploadProfileImage,
    deleteProfileImage,
} = require("../services/storage.service")

const {createUserProfile,
findUserByEmail,
findUserById,
} = require("../models/user.model");

//register a user

const registerUser = async ({
                                fullName,
                                email,
                                password,
                                phone,
                                role,
                                profileImage,
                            }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await findUserByEmail(
        normalizedEmail
    );

    if (existingUser) {
        const error = new Error(
            "An account already exists with this email"
        );
        error.statusCode = 409;
        throw error;
    }

    const { data: authData, error: authError } =
        await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role,
                },
            },
        });

    if (authError) {
        const error = new Error(authError.message);
        error.statusCode = 400;
        throw error;
    }

    if (!authData.user) {
        const error = new Error(
            "Unable to create user account"
        );
        error.statusCode = 500;
        throw error;
    }

    let uploadedImage = null;

    try {
        uploadedImage = await uploadProfileImage(
            authData.user.id,
            profileImage
        );

        console.log("Uploaded image object:", uploadedImage);
        console.log("URL sent to model:", uploadedImage.publicUrl);


        const userProfile = await createUserProfile({
            id: authData.user.id,
            fullName,
            email: normalizedEmail,
            phone,
            userProfile: uploadedImage.publicUrl,
            role,
        });

        return {
            user: userProfile,
            session: authData.session,
        };
    } catch (profileError) {
        console.error(
            "Registration profile error:",
            profileError
        );

        await supabaseAdmin.auth.admin.deleteUser(
            authData.user.id
        );

        const error = new Error(
            "Failed to create user profile"
        );

        error.statusCode = 500;
        throw error;
    }
};

/**
 * Login for both normal users and the single admin.
 */
const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
        });

    if (authError) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const userProfile = await findUserById(
        authData.user.id
    );

    if (!userProfile) {
        const error = new Error("User profile not found");
        error.statusCode = 404;
        throw error;
    }

    return {
        user: userProfile,
        session: authData.session,
    };
};

const forgotPassword =
    async (email) => {

        const normalizedEmail =
            email.trim().toLowerCase();

        const {
            data,
            error,
        } =
            await supabase.auth
                .resetPasswordForEmail(
                    normalizedEmail,
                    {
                        redirectTo:
                            `${process.env.CLIENT_URL}/update-password`,
                    }
                );

        if (error) {
            throw error;
        }

        return data;
    };

const resetPassword = async (
    accessToken,
    refreshToken,
    newPassword
) => {

    if (!accessToken || !refreshToken) {

        const error =
            new Error(
                "Password reset session is missing or invalid"
            );

        error.statusCode = 401;

        throw error;
    }


    if (!newPassword) {

        const error =
            new Error(
                "New password is required"
            );

        error.statusCode = 400;

        throw error;
    }


    if (newPassword.length < 6) {

        const error =
            new Error(
                "Password must be at least 6 characters long"
            );

        error.statusCode = 400;

        throw error;
    }


    // Create a temporary Supabase client
    // for the recovery session.

    const recoveryClient =
        createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY,
            {
                auth: {
                    persistSession:
                        false,

                    autoRefreshToken:
                        false,
                },
            }
        );


    // Establish the recovery session.

    const {
        data: sessionData,
        error: sessionError,
    } =
        await recoveryClient.auth
            .setSession({
                access_token:
                accessToken,

                refresh_token:
                refreshToken,
            });


    if (
        sessionError ||
        !sessionData?.session
    ) {

        console.error(
            "Recovery session error:",
            sessionError
        );

        const error =
            new Error(
                "Invalid or expired password reset link"
            );

        error.statusCode = 401;

        throw error;
    }


    // Now the client has a valid
    // authenticated recovery session.

    const {
        error: updateError,
    } =
        await recoveryClient.auth
            .updateUser({
                password:
                newPassword,
            });


    if (updateError) {

        console.error(
            "Password update error:",
            updateError
        );

        throw updateError;
    }


    return true;
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
resetPassword,
};