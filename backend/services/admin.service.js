const { supabaseAdmin } = require("../config/supabase");

const {
    findAllUsers,
    findUserById,
    findUserByRole,
    updateUserVerification,
} = require("../models/user.model");

// Return all users
const getAllUsers = async () => {
    return await findAllUsers();
};

// Return one user
const getUserById = async (id) => {
    const user = await findUserById(id);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return user;
};

// Delete one user (also cleanup user record in public.users)
const deleteUser = async (id, adminId) => {
    if (id === adminId) {
        const error = new Error("Admin cannot delete their own account");
        error.statusCode = 403;
        throw error;
    }

    const user = await findUserById(id);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    // Delete user from auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (deleteError) {
        // Fallback: delete from public.users table directly
        const { error: tableError } = await supabaseAdmin.from("users").delete().eq("id", id);
        if (tableError) {
            const error = new Error(tableError.message || deleteError.message);
            error.statusCode = 500;
            throw error;
        }
    } else {
        // Ensure user row is deleted from public.users
        await supabaseAdmin.from("users").delete().eq("id", id);
    }

    return true;
};

// Get users by role
const getUserByRole = async (role) => {
    return await findUserByRole(role);
};

// Toggle or update student/staff verification
const setUserVerification = async (userId, isVerified) => {
    const user = await findUserById(userId);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return await updateUserVerification(userId, isVerified);
};

// Admin: Get all rides across the platform with driver & vehicle info
const getAllRidesAdmin = async () => {
    const { data: rides, error } = await supabaseAdmin
        .from("rides")
        .select(`
            *,
            users:driver_id (
                id,
                full_name,
                email,
                phone,
                role
            ),
            vehicles (
                id,
                vehicle_number,
                vehicle_type,
                brand,
                model
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return rides || [];
};

// Admin: Delete/Cancel inappropriate ride
const deleteRideAdmin = async (rideId) => {
    // Delete associated bookings & ride messages first if needed
    await supabaseAdmin.from("ride_bookings").delete().eq("ride_id", rideId);
    await supabaseAdmin.from("ride_messages").delete().eq("ride_id", rideId);

    const { error } = await supabaseAdmin
        .from("rides")
        .delete()
        .eq("id", rideId);

    if (error) {
        // If hard delete fails due to foreign key constraints, set status to cancelled
        const { error: cancelError } = await supabaseAdmin
            .from("rides")
            .update({ status: "cancelled", updated_at: new Date().toISOString() })
            .eq("id", rideId);

        if (cancelError) {
            throw cancelError;
        }
    }

    return true;
};

// Admin: System Analytics (User breakdown, completed rides, Sri Lanka fuel/quota savings)
const getSystemAnalytics = async () => {
    const { data: users, error: userErr } = await supabaseAdmin.from("users").select("id, role, created_at, user_profile, is_verified");
    const { data: rides, error: rideErr } = await supabaseAdmin.from("rides").select("id, status, total_seats, available_seats, created_at, fee_per_seat");
    const { data: bookings, error: bookingErr } = await supabaseAdmin.from("ride_bookings").select("id, status");

    const totalUsers = users ? users.length : 0;
    const driversCount = users ? users.filter(u => u.role === "driver").length : 0;
    const passengersCount = users ? users.filter(u => u.role === "passenger").length : 0;
    const verifiedUsersCount = users ? users.filter(u => u.is_verified === true || u.user_profile === "verified").length : 0;

    const totalRides = rides ? rides.length : 0;
    const completedRides = rides ? rides.filter(r => r.status === "completed").length : 0;
    const activeRides = rides ? rides.filter(r => r.status === "available" || r.status === "full").length : 0;
    const cancelledRides = rides ? rides.filter(r => r.status === "cancelled").length : 0;

    const confirmedBookings = bookings ? bookings.filter(b => b.status === "confirmed").length : 0;

    // Fuel Shortage & Quota Savings Metrics (Sri Lanka Context)
    // Assumptions for ICBT Carpooling context:
    // Avg 1 shared carpool ride saves ~2.5 Liters of petrol / diesel
    // Fuel Cost in Sri Lanka ~ LKR 370 per Liter
    // Avg 1 Liter petrol = ~2.31 kg CO2 emissions
    const totalSharedPassengerRides = confirmedBookings + (completedRides * 2);
    const totalFuelSavedLiters = Math.round(totalSharedPassengerRides * 2.5) + (completedRides * 4);
    const totalMoneySavedLkr = totalFuelSavedLiters * 370;
    const totalCo2ReducedKg = Math.round(totalFuelSavedLiters * 2.31);

    return {
        users: {
            total: totalUsers,
            drivers: driversCount,
            passengers: passengersCount,
            verified: verifiedUsersCount,
        },
        rides: {
            total: totalRides,
            completed: completedRides,
            active: activeRides,
            cancelled: cancelledRides,
        },
        bookings: {
            total: bookings ? bookings.length : 0,
            confirmed: confirmedBookings,
        },
        quotaSavings: {
            fuelSavedLiters: totalFuelSavedLiters,
            moneySavedLkr: totalMoneySavedLkr,
            co2ReducedKg: totalCo2ReducedKg,
        }
    };
};

// Admin: System Activity Audit Logs
const getSystemLogs = async () => {
    // Collect user registrations, ride postings, and bookings as log entries
    const { data: recentUsers } = await supabaseAdmin
        .from("users")
        .select("id, full_name, email, role, created_at")
        .order("created_at", { ascending: false })
        .limit(20);

    const { data: recentRides } = await supabaseAdmin
        .from("rides")
        .select("id, start_location, destination, status, created_at, users:driver_id(full_name)")
        .order("created_at", { ascending: false })
        .limit(20);

    const logs = [];

    if (recentUsers) {
        recentUsers.forEach(u => {
            logs.push({
                id: `usr-${u.id}`,
                type: "USER_REGISTERED",
                description: `New ${u.role || 'user'} registered: ${u.full_name} (${u.email})`,
                timestamp: u.created_at,
                category: "User Management"
            });
        });
    }

    if (recentRides) {
        recentRides.forEach(r => {
            const driverName = r.users ? r.users.full_name : 'Driver';
            logs.push({
                id: `ride-${r.id}`,
                type: "RIDE_POSTED",
                description: `${driverName} posted ride from ${r.start_location} to ${r.destination} [Status: ${r.status}]`,
                timestamp: r.created_at,
                category: "Ride Management"
            });
        });
    }

    // Sort logs descending by timestamp
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return logs;
};

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    getUserByRole,
    setUserVerification,
    getAllRidesAdmin,
    deleteRideAdmin,
    getSystemAnalytics,
    getSystemLogs,
};