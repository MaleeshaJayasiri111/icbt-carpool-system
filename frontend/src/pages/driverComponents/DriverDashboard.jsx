import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Car, PlusCircle, MapPin, ClipboardList,
    ArrowRight,
} from "lucide-react";

const DARK_CARD = { backgroundColor: '#0d1b5e', border: '2px solid rgba(59,130,246,0.5)' };

const DriverDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser) { navigate("/login"); return; }
            if (storedUser.role !== "driver") { navigate("/dashboard"); return; }
            setUser(storedUser);
        } catch (error) {
            console.error("Unable to load user:", error);
            navigate("/login");
        }
    }, [navigate]);

    if (!user) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-warning mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-secondary">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const dashboardItems = [
        { title: "Manage Vehicles", desc: "Register your vehicles and manage the vehicles you use for rides.", icon: Car, btn: "Manage Vehicles", route: "/driver/vehicles" },
        { title: "Post a Ride", desc: "Create a new ride by selecting your vehicle, locations and ride details.", icon: PlusCircle, btn: "Post New Ride", route: "/driver/ride/create", primary: true },
        { title: "My Rides", desc: "View all rides you have posted and check their current status.", icon: MapPin, btn: "View My Rides", route: "/driver/rides" },
        { title: "Ride Requests", desc: "View passengers who have requested to join your rides.", icon: ClipboardList, btn: "View Requests", route: "/driver/requests" },

    ];

    const steps = [
        { num: '1', title: 'Add Vehicle', desc: 'Register at least one vehicle before posting rides.' },
        { num: '2', title: 'Post Ride', desc: 'Select your vehicle and provide ride information on the map.' },
        { num: '3', title: 'Manage Passengers', desc: 'Check ride requests and communicate with confirmed passengers.' },
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
                    <Car size={14} className="me-1" /> Driver Portal
                </span>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div>
                        <h2 className="display-6 fw-bold mb-1 premium-gradient-text" style={{ paddingBottom: '3px' }}>
                            Welcome, {user.full_name}
                        </h2>
                        <p className="text-secondary mb-0">Manage your vehicles, post rides, and handle passenger requests.</p>
                    </div>
                    <button
                        className="btn btn-yb-yellow fw-bold d-flex align-items-center gap-2 px-4"
                        onClick={() => navigate("/driver/post-ride")}
                    >
                        <PlusCircle size={18} /> Post a Ride
                    </button>
                </div>
            </div>

            <div className="px-2 px-md-4 py-3">
                {/* Dashboard Nav Cards */}
                <div className="d-flex flex-column gap-3 mb-4">
                    {dashboardItems.map(({ title, desc, icon: Icon, btn, route }) => (
                        <div key={title}>
                            <div
                                className="card border-0 rounded-4 p-5 dark-card-hover"
                                style={DARK_CARD}
                            >
                                <div className="d-flex align-items-center">

                                    {/* Icon */}
                                    <div
                                        className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3"
                                        style={{ width: '52px', height: '52px' }}
                                    >
                                        <Icon size={24} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow-1">
                                        <h5 className="fw-bold text-white mb-1">
                                            {title}
                                        </h5>

                                        <p
                                            className="text-white-50 small mb-0"
                                            style={{ lineHeight: '1.4' }}
                                        >
                                            {desc}
                                        </p>
                                    </div>

                                    {/* Button */}
                                    <button
                                        className="btn btn-yb-yellow fw-bold d-flex align-items-center gap-2 ms-3 flex-shrink-0"
                                        onClick={() => navigate(route)}
                                    >
                                        {btn}
                                        <ArrowRight size={16} />
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Getting Started */}
                <div className="card p-4 p-md-5 rounded-4" style={DARK_CARD}>
                    <h5 className="fw-bold text-white mb-4">🚀 Getting Started</h5>
                    <div className="row g-4">
                        {steps.map(({ num, title, desc }) => (
                            <div key={num} className="col-md-4">
                                <div className="d-flex gap-3">
                                    <div className="rounded-circle bg-warning fw-bold d-flex align-items-center justify-content-center text-dark flex-shrink-0"
                                        style={{ minWidth: '42px', height: '42px', fontSize: '1rem' }}>
                                        {num}
                                    </div>
                                    <div>
                                        <h6 className="fw-bold text-white mb-1">{title}</h6>
                                        <p className="small text-white-50 mb-0" style={{ lineHeight: '1.6' }}>{desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;