import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#0f172a' }} className="mt-auto py-5">
            <div className="container">
                <div className="row g-4 mb-4">
                    {/* Brand Info */}
                    <div className="col-lg-4 col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <img src="/logo-transparent.svg" alt="ICBT Carpool Logo" style={{ maxHeight: '42px' }} />
                        </div>
                        <p className="small mb-3" style={{ color: '#94a3b8' }}>
                            Connecting students and staff for safe, reliable, and cost-effective carpooling across ICBT campuses.
                        </p>
                        <div className="d-flex gap-3" style={{ color: '#94a3b8' }}>
                            <span className="small"><MapPin size={16} className="text-warning me-1" /> Kandy</span>
                            <span className="small"><Mail size={16} className="text-warning me-1" /> support@icbtcarpool.lk</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6 col-6">
                        <h6 className="fw-bold text-white mb-3">Navigation</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/" className="text-decoration-none footer-link">Home</Link></li>
                            <li><Link to="/about" className="text-decoration-none footer-link">About Us</Link></li>
                            <li><Link to="/search-rides" className="text-decoration-none footer-link">Search Rides</Link></li>
                            <li><Link to="/dashboard" className="text-decoration-none footer-link">Dashboard</Link></li>
                            <li><Link to="/help" className="text-decoration-none footer-link">Help & Manual</Link></li>
                            <li><Link to="/contact" className="text-decoration-none footer-link">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="col-lg-3 col-md-6 col-6">
                        <h6 className="fw-bold text-white mb-3">Help & Account</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/help" className="text-decoration-none footer-link">User Manual & FAQ</Link></li>
                            <li><Link to="/privacy-policy" className="text-decoration-none footer-link">Privacy Policy</Link></li>
                            <li><Link to="/login" className="text-decoration-none footer-link">Login</Link></li>
                            <li><Link to="/register" className="text-decoration-none footer-link">Register</Link></li>
                        </ul>
                    </div>

                    {/* Campus Hours */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="fw-bold text-white mb-3">Campus Hours</h6>
                        <p className="small mb-2" style={{ color: '#94a3b8' }}>
                            <strong className="text-white">Support Desk:</strong><br />
                            Mon - Fri: 8:00 AM - 6:00 PM<br />
                            Sat: 8:30 AM - 1:30 PM
                        </p>
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded small">
                            System Operational
                        </span>
                    </div>
                </div>

                <hr className="my-4" style={{ borderColor: '#334155' }} />

                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small gap-2" style={{ color: '#64748b' }}>
                    <div>
                        &copy; {new Date().getFullYear()} ICBT Carpool System. All rights reserved.
                    </div>
                    <div>
                        Designed for ICBT Undergraduate Project
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
