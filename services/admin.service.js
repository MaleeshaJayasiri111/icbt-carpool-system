const {supabaseAdmin} = require("../config/supabase");

const {
    findAllUsers,
    findUserById,
    findUserByRole,
} = require("../models/user.model");

// Return all users

const getAllUsers= async ()=>{
    return await findAllUsers();
};

// return one user
const getUserById = async (id)=>{

    const user = await findUserById(id);

    if(!user){
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return user;
}

// delete one user

const deleteUser = async (id,adminId)=>{
    
    if (id === adminId) {
        const error = new Error(
            "Admin cannot delete their own account"
        );
        error.statusCode = 403;
        throw error;
    }

    const user = await findUserById(id);
    if(!user){
        const error = new Error("User not found");
        error.statusCode = 403;
        throw error;
    }

    const {error:deleteError} = await supabaseAdmin.auth.admin.deleteUser(id);
    if (deleteError) {
        const error = new Error(deleteError.message);
        error.statusCode = 500;
        throw error;
    }

    return true;
}

//get users by role
const getUserByRole= async (role)=>{
 return await findUserByRole(role);

}

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    getUserByRole
}