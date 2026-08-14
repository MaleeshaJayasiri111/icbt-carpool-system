import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Search, LayoutDashboard, HelpCircle, LogIn, UserPlus, Info, Mail, LogOut, User } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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

    const isActive = (path) => location.pathname === path ? 'active bg-light rounded text-primary' : 'text-secondary';

    return (
        <div className="sidebar d-flex flex-column p-3 bg-white border-end shadow-sm" style={{ width: '280px', height: '100vh', position: 'sticky', top: 0 }}>
            {/* Logo Section */}
            <Link to="/" className="d-flex align-items-center justify-content-center mb-3 text-decoration-none w-100 p-2 rounded hover-bg-light">
                <img src="/logo.png" alt="ICBT Carpool Logo" width="100%" style={{ maxWidth: '200px', objectFit: 'contain' }} />
            </Link>

            <hr className="text-muted my-2" />

            {/* Requested Order: Home -> About Us -> Search Rides -> Dashboard -> Help & Manual -> Contact Us */}
            <ul className="nav nav-pills flex-column mb-auto gap-1">
                <li className="nav-item">
                    <Link to="/" className={`nav-link d-flex align-items-center gap-3 p-3 ${isActive('/')}`}>
                        <HomeIcon size={20} />
                        <span className="fs-6 fw-medium">Home</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/about" className={`nav-link d-flex align-items-center gap-3 p-3 ${isActive('/about')}`}>
                        <Info size={20} />
                        <span className="fs-6 fw-medium">About Us</span>
                    </Link>
                </li>
                <li>
                    <Link to="/search-rides" className={`nav-link d-flex align-items-center gap-3 p-3 ${isActive('/search-rides')}`}>
                        <Search size={20} />
                        <span className="fs-6 fw-medium">Search Rides</span>
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard" className={`nav-link d-flex align-items-center gap-3 p-3 ${isActive('/dashboard')}`}>
                        <LayoutDashboard size={20} />
                        <span className="fs-6 fw-medium">Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to="/help" className={`nav-link d-flex align-items-center gap-3 p-3 ${isActive('/help')}`}>
                        <HelpCircle size={20} />
                        <span className="fs-6 fw-medium">Help & Manual</span>
                    </Link>
                </li>
                <li>
                    <Link to="/contact" className={`nav-link d-flex align-items-center gap-3 p-3 ${isActive('/contact')}`}>
                        <Mail size={20} />
                        <span className="fs-6 fw-medium">Contact Us</span>
                    </Link>
                </li>
            </ul>

            <hr className="text-muted my-2" />

            {/* Auth Section / Logout Button */}
            <div className="d-flex flex-column gap-2 mt-2">
                {user ? (
                    <>
                        <div className="badge bg-primary-subtle text-primary border border-primary-subtle d-flex align-items-center justify-content-center gap-2 p-2 text-capitalize fs-6">
                            <User size={18} /> {user.name || user.role}
                        </div>
                        <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2">
                            <LogOut size={18} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2">
                            <LogIn size={18} />
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2">
                            <UserPlus size={18} />
                            Register
                        </Link>
                        <button onClick={handleLogout} className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-2">
                            <LogOut size={18} />
                            Logout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
