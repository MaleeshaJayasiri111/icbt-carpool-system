import React from "react";
import { Search, Car, Clock, ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DARK_CARD = { backgroundColor: '#0d1b5e', border: '2px solid rgba(59,130,246,0.5)' };

const PassengerDashboard = () => {
    const navigate = useNavigate();

    const cards = [
        {
            icon: Search,
            title: 'Find a Ride',
            desc: 'Browse available rides near your route and send a join request.',
            btn: 'Find Rides',
            route: '/passenger/find-rides',
            primary: true,
        },
        {
            icon: Car,
            title: 'My Rides',
            desc: 'View your pending requests, accepted rides, and driver contact.',
            btn: 'View My Rides',
            route: '/passenger/my-rides',
        },
        {
            icon: Clock,
            title: 'Ride History',
            desc: 'Review your previous and cancelled ride records.',
            btn: 'View History',
            route: '/passenger/ride-history',
        },
    ];

    return (
        <div
            className="d-flex flex-column"
            style={{
                minHeight: '85vh',
                background: 'radial-gradient(circle at 10% 20%, rgba(250, 204, 21, 0.05) 0%, rgba(15, 23, 42, 0.05) 90%)',
            }}>

            {/* Header */}
            <div className="pt-5 pb-3 px-2 px-md-4">
                <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center">
                    <MapPin size={14} className="me-1" /> Passenger Portal
                </span>
                <h2 className="display-6 fw-bold mb-1 premium-gradient-text" style={{ paddingBottom: '3px' }}>
                    Passenger Dashboard
                </h2>
                <p className="text-secondary mb-0">Find and manage your carpool rides from one place.</p>
            </div>

            <div className="px-2 px-md-4 py-3">
                {/* Action Cards */}
                <div className="row g-4 mb-4">
                    {cards.map(({ icon: Icon, title, desc, btn, route, primary }) => (
                        <div key={title} className="col-md-4">
                            <div className="card h-100 p-4 p-md-5 rounded-4 dark-card-hover"
                                style={DARK_CARD}>
                                <div className="mb-4 bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <Icon size={28} />
                                </div>
                                <h5 className="fw-bold text-white mb-2">{title}</h5>
                                <p className="text-white-50 small flex-grow-1 mb-4" style={{ lineHeight: '1.6' }}>{desc}</p>
                                <button
                                    className={`btn fw-bold d-flex align-items-center gap-2 ${primary ? 'btn-yb-yellow' : 'btn-outline-light'}`}
                                    onClick={() => navigate(route)}
                                >
                                    {btn} <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Tip */}
                <div className="card p-4 rounded-4" style={DARK_CARD}>
                    <div className="d-flex align-items-start gap-4 flex-wrap">
                        <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: '52px', height: '52px' }}>
                            💡
                        </div>
                        <div>
                            <h6 className="fw-bold text-white mb-1">How it works</h6>
                            <p className="text-white-50 small mb-0" style={{ lineHeight: '1.7' }}>
                                Search for rides on your route → Send a join request → Driver accepts → Coordinate via chat → Enjoy your ride!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassengerDashboard;