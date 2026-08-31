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
                borderBottom:
                    "1px solid rgba(255,255,255,0.1)",
                boxShadow:
                    "0 4px 15px rgba(8, 20, 45, 0.15)",
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
                                Passenger Portal
                            </small>

                        </div>

                    </div>


                    {/* NAVIGATION */}

                    <div className="d-flex align-items-center gap-2 flex-wrap">

                        <NavLink
                            to="/passenger/dashboard"
                            end
                            className={linkClass}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </NavLink>


                        <NavLink
                            to="/passenger/find-rides"
                            className={linkClass}
                        >
                            <Search size={18} />
                            Find Rides
                        </NavLink>


                        <NavLink
                            to="/passenger/my-rides"
                            className={linkClass}
                        >
                            <Car size={18} />
                            My Rides
                        </NavLink>


                        <NavLink
                            to="/passenger/history"
                            className={linkClass}
                        >
                            <History size={18} />
                            Ride History
                        </NavLink>


                        <NavLink
                            to="/passenger/profile"
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

export default PassengerSidebar;