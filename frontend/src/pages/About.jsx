import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Leaf, Award, MapPin, Clock, ArrowRight, HeartHandshake, Car } from 'lucide-react';

const About = () => {
    return (
        <div style={{ marginTop: '-1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem', width: 'calc(100% + 3rem)' }}>
            {/* Full-Width Edge-to-Edge Hero Banner Section with Background Image */}
            <div
                className="w-100 text-white position-relative overflow-hidden shadow-sm"
                style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.80)), url('/about-hero.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '380px',
                    padding: '4rem 1.5rem 6rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <div className="container text-start" style={{ maxWidth: '960px' }}>
                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center">
                        <Car size={16} className="me-1" /> ICBT Campus Transport Initiative
                    </span>
                    <h1 className="display-4 fw-bold mb-3" style={{ color: '#f59e0b' }}>
                        About ICBT Carpool
                    </h1>
                    <p className="lead text-light text-opacity-90 mb-0" style={{ maxWidth: '720px', lineHeight: '1.6' }}>
                        Empowering students and faculty with a safe, convenient, and eco-friendly ride-sharing network tailored specifically for the ICBT community.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container py-4" style={{ maxWidth: '960px' }}>
                {/* Overlapping Mission & Vision Cards */}
                <div className="row g-4 mb-5 position-relative" style={{ marginTop: '-70px', zIndex: 2 }}>
                    <div className="col-md-6">
                        <div className="card h-100 p-4 border-0 shadow-lg bg-white rounded-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-primary text-white rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                    <HeartHandshake size={24} />
                                </div>
                                <h4 className="fw-bold mb-0">Our Mission</h4>
                            </div>
                            <p className="text-secondary mb-0">
                                To mitigate commuting challenges faced by the university community during local fuel rationing and transport constraints. We connect drivers with spare seats to fellow students and staff traveling on shared routes.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card h-100 p-4 border-0 shadow-lg bg-white rounded-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-success text-white rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                    <Leaf size={24} />
                                </div>
                                <h4 className="fw-bold mb-0">Our Vision</h4>
                            </div>
                            <p className="text-secondary mb-0">
                                To foster an interconnected, sustainable campus ecosystem where commuting is cost-effective, environmentally conscious, and accessible to everyone across ICBT regional locations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Banner */}
                <div
                    className="card border-0 p-4 p-md-5 rounded-4 shadow-sm mb-5"
                    style={{
                        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                        border: '1px solid #fde68a'
                    }}
                >
                    <div className="row text-center g-4">
                        <div className="col-6 col-md-3">
                            <h2 className="fw-bold display-6 mb-1" style={{ color: '#b45309' }}>500+</h2>
                            <span className="text-dark text-opacity-75 small text-uppercase fw-semibold">Rides Shared</span>
                        </div>
                        <div className="col-6 col-md-3">
                            <h2 className="fw-bold display-6 mb-1" style={{ color: '#b45309' }}>150+</h2>
                            <span className="text-dark text-opacity-75 small text-uppercase fw-semibold">Active Drivers</span>
                        </div>
                        <div className="col-6 col-md-3">
                            <h2 className="fw-bold display-6 mb-1" style={{ color: '#b45309' }}>1,200+</h2>
                            <span className="text-dark text-opacity-75 small text-uppercase fw-semibold">Commuters Connected</span>
                        </div>
                        <div className="col-6 col-md-3">
                            <h2 className="fw-bold display-6 mb-1" style={{ color: '#b45309' }}>100%</h2>
                            <span className="text-dark text-opacity-75 small text-uppercase fw-semibold">Verified ICBT Members</span>
                        </div>
                    </div>
                </div>

                {/* Core Features Grid */}
                <div className="mb-5">
                    <div className="text-center mb-4">
                        <h3 className="fw-bold">Why Choose ICBT Carpool?</h3>
                        <p className="text-secondary">Designed with student safety, simplicity, and convenience in mind.</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border-0 shadow-sm bg-white rounded-4 text-center">
                                <div className="mx-auto mb-3 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                                    <ShieldCheck size={28} />
                                </div>
                                <h5 className="fw-bold">Safe & Verified</h5>
                                <p className="text-secondary small mb-0">Exclusive to verified ICBT campus members ensuring trust, security, and accountability.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border-0 shadow-sm bg-white rounded-4 text-center">
                                <div className="mx-auto mb-3 bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                                    <Users size={28} />
                                </div>
                                <h5 className="fw-bold">Community Driven</h5>
                                <p className="text-secondary small mb-0">Build meaningful connections with peers while reducing traffic congestion around campus.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border-0 shadow-sm bg-white rounded-4 text-center">
                                <div className="mx-auto mb-3 bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                                    <Award size={28} />
                                </div>
                                <h5 className="fw-bold">Cost Savings</h5>
                                <p className="text-secondary small mb-0">Share fuel costs fairly, making everyday commuting significantly cheaper for students.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Routes & Coverage */}
                <div className="card border-0 bg-white p-4 rounded-4 shadow-sm mb-5">
                    <div className="row align-items-center g-4">
                        <div className="col-md-6">
                            <h4 className="fw-bold mb-3">Popular Daily Routes</h4>
                            <ul className="list-unstyled d-flex flex-column gap-2 mb-0 text-secondary">
                                <li className="d-flex align-items-center gap-2">
                                    <MapPin size={18} className="text-primary" />
                                    <span><strong>Colombo 04 Main Campus</strong> &mdash; Nugegoda &bull; Dehiwala &bull; Wellawatte</span>
                                </li>
                                <li className="d-flex align-items-center gap-2">
                                    <MapPin size={18} className="text-primary" />
                                    <span><strong>Kandy Campus Route</strong> &mdash; Peradeniya &bull; Katugastota &bull; Town</span>
                                </li>
                                <li className="d-flex align-items-center gap-2">
                                    <MapPin size={18} className="text-primary" />
                                    <span><strong>Kegalle / Kurunegala Express</strong> &mdash; Daily Morning & Evening Commutes</span>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <div className="p-3 bg-light rounded-4 d-inline-block text-start" style={{ maxWidth: '320px' }}>
                                <div className="d-flex align-items-center gap-2 mb-2 text-primary fw-semibold">
                                    <Clock size={18} /> Ride Scheduling
                                </div>
                                <p className="small text-secondary mb-0">
                                    Rides are available for morning lectures, evening batches, and weekend sessions across all ICBT campuses.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-light p-5 rounded-4 shadow-sm">
                    <h3 className="fw-bold mb-2">Ready to Start Carpooling?</h3>
                    <p className="text-secondary mb-4">Join hundreds of ICBT students and staff sharing rides today.</p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <Link to="/search-rides" className="btn btn-primary btn-lg px-4 d-flex align-items-center gap-2 shadow-sm">
                            Find a Ride <ArrowRight size={18} />
                        </Link>
                        <Link to="/contact" className="btn btn-outline-primary btn-lg px-4">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
