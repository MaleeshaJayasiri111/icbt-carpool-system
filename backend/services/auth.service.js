const {
    supabase,
    supabaseAdmin} = require("../config/supabase");

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

module.exports = {
    registerUser,
    loginUser,
};