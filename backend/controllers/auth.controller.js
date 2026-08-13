const authService = require("../services/auth.service");
const {registerUser} = require("../services/auth.service");

// POST api/auth/register

const register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            phone,
            role,
        } = req.body;

        if (
            !fullName ||
            !email ||
            !password ||
            !phone ||
            !role
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Full name, email, password, contact number and role are required",
            });
        }

        if (!["driver", "passenger"].includes(role)) {
            return res.status(400).json({
                success: false,
                message:
                    "Registration role must be driver or passenger",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile image is required",
            });
        }

        const result = await authService.registerUser({
            fullName: fullName.trim(),
            email,
            password,
            phone:phone.trim(),
            role,
            profileImage: req.file,
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: result,
        });
    } catch (error) {
        console.error("Registration error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message || "Registration failed",
        });
    }
};

// POST /api/auth/login

const login = async (req,res)=>{
  try{
      const {email, password} = req.body;
      if(!email || !password){
          return res.status(400).json({
              success: false,
              message:"Email and password required"
          })
      }

      const result = await authService.loginUser({
          email,
          password,
      });
      return res.status(200).json({
          success: true,
          message: "Login successful",
          data: result,
      });
  }catch (e) {
      return res.status(500).json({
          success: false,
          message:  "Login failed",
      });
  }
}

const getCurrentUser = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Current user retrieved successfully",
        data: {
            user: req.user,
        },
    });
};

module.exports = {
    register,
    login,
    getCurrentUser,
}