import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';


const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const handleDashboardClick = () => {

        const token =
            localStorage.getItem("token");

        const storedUser =
            localStorage.getItem("user");


        if (!token || !storedUser) {
            navigate("/login");
            return;
        }


        const user =
            JSON.parse(storedUser);


        if (user.role === "driver") {

            navigate("/driver/dashboard");

        } else if (user.role === "passenger") {

            navigate("/passenger/dashboard");

        } else {

            navigate("/login");
        }
    };

    // Sync logged in user state on route change or storage updates
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-lg">
            <div className="container">
                {/* Logo on the left */}
                <Link to="/" className="navbar-brand d-flex align-items-center me-4">
                    <img src="/logo-transparent.svg" alt="ICBT Carpool Logo" style={{ maxHeight: '45px' }} />
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* Requested Order: Home -> About Us -> Search Rides -> Dashboard -> Help & Manual -> Contact Us */}
                    <ul className="navbar-nav me-auto gap-1 gap-lg-2">
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/')}`} to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/about')}`} to="/about">About Us</Link>
                        </li>

                        <li className="nav-item">
                            <button
                                type="button"
                                onClick={handleDashboardClick}
                                className="nav-link btn btn-link"
                            >
                                Dashboard
                            </button>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/help')}`} to="/help">Help & Manual</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/contact')}`} to="/contact">Contact Us</Link>
                        </li>
                    </ul>

                    {/* Auth Section / Logout Button */}
                    <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
                        {user ? (
                            <>
                                <span className="badge badge-yb-user d-flex align-items-center gap-1 px-3 py-2 text-capitalize fs-6">
                                    <User size={16} /> {user.name || user.role}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-yb-logout"
                                    title="Logout of your account"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-yb-black">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-yb-yellow">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
