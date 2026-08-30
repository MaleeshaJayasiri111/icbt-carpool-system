import React from 'react';
import { Search, MapPin, Clock } from 'lucide-react';

const Home = () => {
    return (
        <div style={{ marginTop: '-1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem', width: 'calc(100% + 3rem)' }}>
            {/* Full-Width Edge-to-Edge Hero Section with Background Image */}
            <div
                className="w-100 text-white position-relative overflow-hidden shadow-sm"
                style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.72)), url('/carpool-hero.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '440px',
                    padding: '4rem 1.5rem 6rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}
            >
                <div className="container" style={{ maxWidth: '960px' }}>
                    <h1 className="display-4 fw-bold mb-3 text-white">Share The Ride</h1>
                    <p className="lead mb-4 text-light text-opacity-90 mx-auto" style={{ maxWidth: '650px' }}>
                        Connect with students and staff for shared transport to and from ICBT campus. Secure, efficient, and reliable carpooling designed specifically for our community's needs.
                    </p>


                </div>
            </div>

            {/* Overlapping Feature Cards Section */}
            <div className="container py-4" style={{ maxWidth: '960px' }}>
                <div className="row w-100 mx-auto position-relative text-start g-4" style={{ marginTop: '-70px', zIndex: 2 }}>
                    <div className="col-md-4">
                        <div className="card h-100 p-4 border-0 bg-white shadow-lg rounded-4">
                            <MapPin className="text-primary mb-3" size={32} />
                            <h5 className="fw-semibold">Convenient Routes</h5>
                            <p className="text-muted small mb-0">Discover rides available on daily routes including Kegalle, Colombo, and Kandy dynamically curated.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 p-4 border-0 bg-white shadow-lg rounded-4">
                            <Clock className="text-primary mb-3" size={32} />
                            <h5 className="fw-semibold">Coordinate Time</h5>
                            <p className="text-muted small mb-0">Match ride timings accurately without hassles utilizing real-time active rosters of drivers.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 p-4 border-0 bg-white shadow-lg rounded-4">
                            <Search className="text-primary mb-3" size={32} />
                            <h5 className="fw-semibold">Smart Matching</h5>
                            <p className="text-muted small mb-0">Instantly query available seats and connect synchronously with drivers via our web platform.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
