import React from "react";
import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import {
    LayoutDashboard,
    Search,
    Car,
    History,
    User,
    LogOut,
} from "lucide-react";

const PassengerSidebar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    const linkClass = ({ isActive }) =>
        `d-flex align-items-center gap-3 text-decoration-none px-3 py-3 rounded ${
            isActive
                ? "bg-warning text-dark fw-semibold"
                : "text-white"
        }`;

    return (
        <div
            className="bg-dark p-3"
            style={{
                width: "250px",
                minHeight: "100vh",
            }}
        >
            <div className="text-white mb-4 px-2">
                <h5 className="fw-bold mb-0">
                    Passenger
                </h5>

                <small className="text-secondary">
                    Carpool Dashboard
                </small>
            </div>

            <div className="d-flex flex-column gap-2">

                <NavLink
                    to="/passenger/dashboard"
                    className={linkClass}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/passenger/find-rides"
                    className={linkClass}
                >
                    <Search size={20} />
                    Find Rides
                </NavLink>

                <NavLink
                    to="/passenger/my-rides"
                    className={linkClass}
                >
                    <Car size={20} />
                    My Rides
                </NavLink>

                <NavLink
                    to="/passenger/history"
                    className={linkClass}
                >
                    <History size={20} />
                    Ride History
                </NavLink>

                <NavLink
                    to="/passenger/profile"
                    className={linkClass}
                >
                    <User size={20} />
                    Profile
                </NavLink>

                <button
                    className="btn text-white text-start d-flex align-items-center gap-3 px-3 py-3 mt-3"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    Logout
                </button>

            </div>
        </div>
    );
};

export default PassengerSidebar;