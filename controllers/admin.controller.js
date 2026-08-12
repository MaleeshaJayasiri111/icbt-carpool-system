const adminService= require("../services/admin.service");

//GET api/admin/users

const getAllUsers = async (req, res) => {
    try{
        const users= await adminService.getAllUsers();

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            count: users.length,
            data: users,
        });

    }catch (error) {
        console.error("Get users error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message || "Failed to retrieve users",
        });
    }
}

//GET /api/admin/user/:userId

const getUserById = async (req, res) => {
    try{
        const {id} =await req.params;

        console.log("id ",id)

        const user = await adminService.getUserById(id);
        return res.status(200).json({
            success: true,
            message: "User found successfully",
            count: user.length,
            data: user,
        })
    }catch (error) {
        console.error("Get user error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message || "Failed to retrieve user",
        });
    }
};

// DELETE /api/admin/users/:userId
const deleteUser = async (req, res) => {
    try{
        const {id}= req.params;

        const user = await adminService.deleteUser(id,req.user.id);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            count: user.length,


        })

    }catch (error) {
        console.error("Get user error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message:error.message || "Failed to retrieve user for delete",
        })
    }
};

//GET /api/admin/drivers
// GET /api/admin/passengers
// Controller
const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;

        console.log("Role received:", role);
        console.log("Role type:", typeof role);

        const users = await adminService.getUserByRole(role);

        return res.status(200).json({
            success: true,
            message: `${role} users retrieved successfully`,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error("Get users by role error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to retrieve users",
        });
    }
};




module.exports = {
    deleteUser,
    getAllUsers,
    getUserById,
    getUsersByRole,

}