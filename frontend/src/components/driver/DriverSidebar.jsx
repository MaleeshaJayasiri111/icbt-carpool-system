import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Car,
    PlusCircle,
    Route,
    LogOut,
    UserRoundCheck, User,
} from "lucide-react";

const DriverSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const linkClass = ({ isActive }) =>
        `d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none ${
            isActive
                ? "bg-warning text-dark fw-bold"
                : "text-white"
        }`;

    return (
        <nav
            className="text-white px-4 py-3 sticky-top"
            style={{
                background: "rgba(8, 20, 45, 0.92)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                zIndex: 1030,
            }}
        >
            <div className="container-fluid">

                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

                    {/* LOGO / TITLE */}

                    <div className="d-flex align-items-center">
                        <div>
                            <h5 className="fw-bold mb-0 text-warning">
                                ICBT Carpool
                            </h5>

                            <small className="text-white-50">
                                Driver Portal
                            </small>
                        </div>
                    </div>


                    {/* NAVIGATION */}

                    <div className="d-flex align-items-center gap-2 flex-wrap">

                        <NavLink
                            to="/driver/dashboard"
                            className={linkClass}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/driver/vehicles"
                            className={linkClass}
                        >
                            <Car size={18} />
                            My Vehicles
                        </NavLink>

                        <NavLink
                            to="/driver/ride/create"
                            className={linkClass}
                        >
                            <PlusCircle size={18} />
                            Create Ride
                        </NavLink>

                        <NavLink
                            to="/driver/rides"
                            className={linkClass}
                        >
                            <Route size={18} />
                            My Rides
                        </NavLink>

                        <NavLink
                            to="/driver/requests"
                            className={linkClass}
                        >
                            <UserRoundCheck size={18} />
                            Join Requests
                        </NavLink>

                        <NavLink
                            to="/driver/profile"
                            className={linkClass}
                        >
                            <User size={18} />
                            Profile
                        </NavLink>

                    </div>


                    {/* LOGOUT */}

                    <button
                        onClick={handleLogout}
                        className="btn btn-outline-warning d-flex align-items-center gap-2 px-3"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
};

export default DriverSidebar;