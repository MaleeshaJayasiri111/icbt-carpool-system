import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Car,
    PlusCircle,
    Route,
    LogOut,
    UserRoundCheck,
} from "lucide-react";

const DriverSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const linkClass = ({ isActive }) =>
        `d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none ${
            isActive
                ? "bg-warning text-dark fw-bold"
                : "text-white"
        }`;

    return (
        <div
            className="bg-dark text-white d-flex flex-column p-3"
            style={{
                width: "260px",
                minHeight: "100vh",
            }}
        >
            {/* LOGO / TITLE */}

            <div className="mb-4 px-2">
                <h4 className="fw-bold mb-1 text-warning">
                    ICBT Carpool
                </h4>

                <small className="text-secondary">
                    Driver Portal
                </small>
            </div>

            {/* NAVIGATION */}

            <nav className="d-flex flex-column gap-2">

                <NavLink
                    to="/driver/dashboard"
                    className={linkClass}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/driver/vehicles"
                    className={linkClass}
                >
                    <Car size={20} />
                    My Vehicles
                </NavLink>

                <NavLink
                    to="/driver/rides/create"
                    className={linkClass}
                >
                    <PlusCircle size={20} />
                    Create Ride
                </NavLink>

                <NavLink
                    to="/driver/rides"
                    className={linkClass}
                >
                    <Route size={20} />
                    My Rides
                </NavLink>

                <NavLink
                    to="/driver/requests"
                    className={linkClass}
                >
                    <UserRoundCheck size={20} />

                    Join Requests
                </NavLink>

            </nav>

            {/* LOGOUT */}

            <div className="mt-auto pt-4">

                <button
                    onClick={handleLogout}
                    className="btn btn-outline-warning w-100 d-flex align-items-center justify-content-center gap-2"
                >
                    <LogOut size={18} />
                    Logout
                </button>

            </div>
        </div>
    );
};

export default DriverSidebar;