const {supabaseAdmin} = require("../config/supabase");

const {
    findUserById,
    updateUserProfile, findUserByEmail,

} = require("../models/user.model");

const getUserProfile = async (userId) => {
    const user= await findUserById(userId);


    if (!user) {
        const error = new Error("User profile not found");
        error.statusCode = 404;
        throw error;
    }
    return user;
}

const updateuserProfile = async (
    useraId,
    {fullName,phone}
)=>{
    const existingUser = await findUserById(useraId);
    if (!existingUser) {
        const error = new Error("User profile not found");
        error.statusCode = 404;
        throw error;
    }

    return await updateUserProfile(useraId, {
        fullName,
        phone,
    });

}

const deleteUserProfile = async (userId) => {
    const existingUser = await findUserById(userId);
    if (!existingUser) {
        const error = new Error("User profile not found");
        error.statusCode = 404;
        throw error;
    }

    if (existingUser.role === "admin") {
        const error = new Error(
            "The admin account cannot be deleted"
        );
        error.statusCode = 403;
        throw error;
    }

    const {error} = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
        const err = new Error(error.message);
        err.statusCode = 500;
        throw err;
    }

    return true;
}

module.exports = {
    getUserProfile,
    updateuserProfile,
    deleteUserProfile,
}