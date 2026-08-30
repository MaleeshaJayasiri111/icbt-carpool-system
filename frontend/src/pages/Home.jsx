import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock } from 'lucide-react';

const Home = () => {
    return (
        <div style={{ marginTop: '-1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem', width: 'calc(100% + 3rem)', overflowX: 'hidden' }}>

            {/* Inline Hover Style Sheet */}
            <style>
                {`
                    .custom-hover-btn {
                        transition: all 0.3s ease-in-out !important;
                    }
                    .custom-hover-btn:hover {
                        transform: translateY(-4px) !important;
                        box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4) !important;
                    }
                    .custom-hover-card {
                        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    }
                    .custom-hover-card:hover {
                        transform: translateY(-8px) !important;
                        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6) !important;
                    }
                `}
            </style>

            {/* Main Wrapper With Full Background Image covering Hero + Cards */}
            <div
                className="w-100 text-white position-relative shadow-sm"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%), url('/carpool-hero.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    paddingTop: '5rem',     /* Text එක Navbar එකෙන් පැහැදිලිව පහළට ගැනීම */
                    paddingBottom: '4rem',  /* Seamless Full View එක සඳහා Padding සකස් කිරීම */
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    textAlign: 'center'
                }}
            >
                {/* Hero Section Content */}
                <div className="container position-relative mb-4" style={{ maxWidth: '960px', zIndex: 10 }}>
                    <h1 className="display-3 fw-bold mb-3" style={{ color: '#f59e0b', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
                        Share The Ride
                    </h1>

                    <p className="lead mb-4 text-light mx-auto fs-5" style={{ maxWidth: '720px', lineHeight: '1.65', color: '#f8fafc', textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
                        Connect with students and staff for shared transport to and from ICBT campus. Secure, efficient, and reliable carpooling designed specifically for our community's needs.
                    </p>

                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        <Link to="/register" className="btn custom-hover-btn px-5 py-3 fs-5 fw-semibold border-0 shadow" style={{ backgroundColor: '#f59e0b', color: '#0f172a', borderRadius: '12px' }}>
                            Get Started
                        </Link>
                        <Link to="/about" className="btn custom-hover-btn px-5 py-3 fs-5 fw-semibold shadow" style={{ color: '#ffffff', border: '2px solid #ffffff', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: '12px' }}>
                            Learn More
                        </Link>
                    </div>
                </div>

                {/* Feature Cards Section Inside Full Background */}
                <div className="container position-relative" style={{ maxWidth: '1100px', zIndex: 20, marginTop: '-0.5rem' }}>
                    <div className="row w-100 mx-auto text-start g-4">

                        {/* Card 1 — Royal Blue */}
                        <div className="col-md-4">
                            <div className="card custom-hover-card h-100 p-4 border-0 shadow-lg d-flex flex-column align-items-start"
                                style={{
                                    background: 'linear-gradient(135deg, #0f2167 0%, #1e40af 100%)',
                                    border: '1px solid rgba(96,165,250,0.4)',
                                    borderRadius: '1.25rem',
                                    boxShadow: '0 20px 40px rgba(15,33,103,0.4)',
                                    overflow: 'hidden'
                                }}>
                                <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(250,204,21,0.15)' }}>
                                    <MapPin style={{ color: '#f59e0b' }} size={28} />
                                </div>
                                <h4 className="fw-bold text-white mb-2">Convenient Routes</h4>
                                <p className="mb-0" style={{ color: '#e5e7eb', lineHeight: '1.65', fontSize: '0.95rem' }}>
                                    Discover rides available on daily routes including Kegalle, Colombo, and Kandy dynamically curated.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 — Deep Indigo */}
                        <div className="col-md-4">
                            <div className="card custom-hover-card h-100 p-4 border-0 shadow-lg d-flex flex-column align-items-start"
                                style={{
                                    background: 'linear-gradient(135deg, #1e1254 0%, #4338ca 100%)',
                                    border: '1px solid rgba(165,180,252,0.4)',
                                    borderRadius: '1.25rem',
                                    boxShadow: '0 20px 40px rgba(30,18,84,0.4)',
                                    overflow: 'hidden'
                                }}>
                                <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(250,204,21,0.15)' }}>
                                    <Clock style={{ color: '#f59e0b' }} size={28} />
                                </div>
                                <h4 className="fw-bold text-white mb-2">Coordinate Time</h4>
                                <p className="mb-0" style={{ color: '#e5e7eb', lineHeight: '1.65', fontSize: '0.95rem' }}>
                                    Match ride timings accurately without hassles utilizing real-time active rosters of drivers.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 — Ocean Teal */}
                        <div className="col-md-4">
                            <div className="card custom-hover-card h-100 p-4 border-0 shadow-lg d-flex flex-column align-items-start"
                                style={{
                                    background: 'linear-gradient(135deg, #0c2a4a 0%, #0369a1 100%)',
                                    border: '1px solid rgba(56,189,248,0.4)',
                                    borderRadius: '1.25rem',
                                    boxShadow: '0 20px 40px rgba(12,42,74,0.4)',
                                    overflow: 'hidden'
                                }}>
                                <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(250,204,21,0.15)' }}>
                                    <Search style={{ color: '#f59e0b' }} size={28} />
                                </div>
                                <h4 className="fw-bold text-white mb-2">Smart Matching</h4>
                                <p className="mb-0" style={{ color: '#e5e7eb', lineHeight: '1.65', fontSize: '0.95rem' }}>
                                    Instantly query available seats and connect synchronously with drivers via our web platform.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Decorative Accent */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-30%',
                        left: '-10%',
                        width: '50%',
                        height: '130%',
                        background: 'radial-gradient(circle, rgba(250, 204, 21, 0.12) 0%, transparent 70%)',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}>
                </div>
            </div>
        </div>
    );
};

export default Home;