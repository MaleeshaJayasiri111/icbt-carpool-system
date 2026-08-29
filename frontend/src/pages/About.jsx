import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Leaf, Award, MapPin, Clock, ArrowRight, HeartHandshake, Car } from 'lucide-react';

const About = () => {
    return (
        <div
            className="d-flex flex-column"
            style={{
                minHeight: '85vh',
                background: 'radial-gradient(circle at 10% 20%, rgba(250, 204, 21, 0.05) 0%, rgba(15, 23, 42, 0.05) 90%)',
                marginTop: '-1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem', width: 'calc(100% + 3rem)'
            }}>

            {/* Hero Header */}
            <div className="text-center pt-5 pb-4 mt-4">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center shadow-sm">
                        <Car size={16} className="me-1" /> ICBT Campus Transport Initiative
                    </span>
                    <h1 className="display-4 fw-bold mb-3 premium-gradient-text" style={{ paddingBottom: '5px' }}>
                        About ICBT Carpool
                    </h1>
                    <p className="lead fw-semibold mb-0 mx-auto" style={{ maxWidth: '720px', lineHeight: '1.6', color: '#1e293b' }}>
                        Empowering students and faculty with a safe, convenient, and eco-friendly ride-sharing network tailored specifically for the ICBT community.
                    </p>
                </div>
            </div>

            <div className="container py-4" style={{ maxWidth: '1080px' }}>

                {/* Mission & Vision */}
                <div className="row g-4 mb-5">
                    <div className="col-md-6">
                        <div className="card h-100 p-4 p-md-5 text-center text-md-start shadow-sm dark-card-hover"
                            style={{ backgroundColor: '#0d1b5e', border: '2px solid rgba(59,130,246,0.5)', borderRadius: '1.5rem' }}>
                            <div className="d-flex flex-column flex-md-row align-items-center mb-3">
                                <div className="bg-warning bg-opacity-10 rounded-circle text-warning p-2 me-md-3 mb-3 mb-md-0 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                                    <HeartHandshake size={28} />
                                </div>
                                <h4 className="fw-bold mb-0 text-white">Our Mission</h4>
                            </div>
                            <p className="mb-0 text-white-50" style={{ lineHeight: '1.7' }}>
                                To mitigate commuting challenges faced by the university community during local fuel rationing and transport constraints. We connect drivers with spare seats to fellow students and staff traveling on shared routes.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card h-100 p-4 p-md-5 text-center text-md-start shadow-sm dark-card-hover"
                            style={{ backgroundColor: '#0d1b5e', border: '2px solid rgba(59,130,246,0.5)', borderRadius: '1.5rem' }}>
                            <div className="d-flex flex-column flex-md-row align-items-center mb-3">
                                <div className="bg-warning bg-opacity-10 rounded-circle text-warning p-2 me-md-3 mb-3 mb-md-0 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                                    <Leaf size={28} />
                                </div>
                                <h4 className="fw-bold mb-0 text-white">Our Vision</h4>
                            </div>
                            <p className="mb-0 text-white-50" style={{ lineHeight: '1.7' }}>
                                To foster an interconnected, sustainable campus ecosystem where commuting is cost-effective, environmentally conscious, and accessible to everyone across ICBT regional locations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="card p-4 p-md-5 w-100 mb-5 text-center shadow-sm rounded-4"
                    style={{ backgroundColor: '#0d1b5e', border: '2px solid rgba(59,130,246,0.5)' }}>
                    <div className="row g-4">
                        {[['500+', 'Rides Shared'], ['150+', 'Active Drivers'], ['1.2k+', 'Commuters'], ['100%', 'Verified']].map(([num, label]) => (
                            <div key={label} className="col-6 col-md-3">
                                <h2 className="fw-bold display-5 mb-1 premium-gradient-text" style={{ paddingBottom: '3px' }}>{num}</h2>
                                <span className="small text-uppercase fw-bold text-white-50">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why Choose */}
                <div className="mb-5">
                    <div className="text-center mb-5">
                        <h3 className="fw-bold text-dark mb-2">Why Choose ICBT Carpool?</h3>
                        <p className="text-secondary">Designed with student safety, simplicity, and convenience in mind.</p>
                    </div>
                    <div className="row g-4">
                        {[
                            { Icon: ShieldCheck, title: 'Safe & Verified', desc: 'Exclusive to verified ICBT campus members ensuring trust, security, and accountability.' },
                            { Icon: Users, title: 'Community Driven', desc: 'Build meaningful connections with peers while reducing traffic congestion around campus.' },
                            { Icon: Award, title: 'Cost Savings', desc: 'Share fuel costs fairly, making everyday commuting significantly cheaper for students.' },
                        ].map(({ Icon, title, desc }) => (
                            <div key={title} className="col-md-4">
                                <div className="card h-100 p-4 p-md-5 text-center rounded-4 shadow-sm dark-card-hover"
                                    style={{ backgroundColor: '#0d1b5e', border: '2px solid rgba(59,130,246,0.5)' }}>
                                    <div className="mx-auto mb-4 bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                                        <Icon size={32} />
                                    </div>
                                    <h5 className="fw-bold text-white">{title}</h5>
                                    <p className="small mb-0 mt-2 text-white-50" style={{ lineHeight: '1.6' }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Routes */}
                <div className="card p-4 p-md-5 rounded-4 shadow-sm mb-5 mt-4"
                    style={{ backgroundColor: '#0d1b5e', border: '2px solid rgba(59,130,246,0.5)' }}>
                    <div className="row align-items-center g-4">
                        <div className="col-md-7">
                            <h4 className="fw-bold mb-3 premium-gradient-text" style={{ paddingBottom: '3px' }}>Popular Daily Routes</h4>
                            <p className="mb-4 text-white-50">Our community serves major transportation lines covering the key branch nodes.</p>
                            <ul className="list-unstyled d-flex flex-column gap-3 mb-0 text-white-50">
                                {[
                                    ['Kandy Campus (Main)', 'Peradeniya • Pilimathalawa • Kadugannawa'],
                                    ['Katugastota Route', 'Katugastota • Madawala • Wattegama'],
                                    ['Digana / Kundasale Express', 'Digana • Kundasale • Tennekumbura'],
                                ].map(([name, sub]) => (
                                    <li key={name} className="d-flex align-items-center gap-3">
                                        <div className="bg-warning bg-opacity-10 p-2 rounded-circle flex-shrink-0">
                                            <MapPin size={20} style={{ color: '#fbbf24' }} />
                                        </div>
                                        <span><strong className="text-white">{name}</strong> &mdash; {sub}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-md-5 text-center text-md-end">
                            <div className="p-4 rounded-4 d-inline-block text-start shadow-sm"
                                style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', maxWidth: '340px' }}>
                                <div className="d-flex align-items-center gap-2 mb-3 fw-bold fs-5" style={{ color: '#fbbf24' }}>
                                    <Clock size={22} style={{ color: '#fbbf24' }} /> Flexible Scheduling
                                </div>
                                <p className="small mb-0 lh-lg text-white-50">
                                    Rides are constantly available for morning lectures, evening batches, and weekend sessions across all ICBT campuses dynamically generated by available students.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center p-5 shadow-sm mb-4 rounded-4"
                    style={{ backgroundColor: '#0d1b5e', border: '2px solid rgba(59,130,246,0.5)' }}>
                    <h3 className="fw-bold mb-2 text-white">Ready to Start Carpooling?</h3>
                    <p className="mb-4 text-white-50">Join hundreds of ICBT students and staff sharing rides today.</p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap mt-2">
                        <Link to="/search-rides" className="btn btn-yb-yellow btn-lg px-5 py-3 fw-bold d-flex align-items-center gap-2">
                            Find a Ride <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;
