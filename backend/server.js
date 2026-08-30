require("dotenv").config();
const express= require("express");
const helmet=require("helmet");
const cors=require("cors");
const morgan=require("morgan");
const authRoutes= require("./routes/auth.routes");
const userRoutes= require("./routes/user.routes");
const adminRoutes=require("./routes/admin.route");
const vehicleRoutes=require("./routes/vehicle.route");
const rideRoutes=require("./routes/ride.routes");
const bookingRoutes=require("./routes/booking.routes");
const messagesRoutes=require("./routes/message.routes");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

// Allow frontend requests
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Show request logs
if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
}

app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/vehicle",vehicleRoutes);
app.use("/api/ride",rideRoutes);
app.use("/api/bookings",bookingRoutes);
app.use(
    "/api/messages",
    messagesRoutes
);
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Ride Sharing API is running",
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})