import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Car,
    PlusCircle,
    MapPin,
    ClipboardList,
    CheckCircle2,
    MessageCircle,
    User,
    LogOut,
} from "lucide-react";


const DriverDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (!storedUser) {
                navigate("/login");
                return;
            }

            // Only drivers should access this dashboard
            if (storedUser.role !== "driver") {
                navigate("/dashboard");
                return;
            }

            setUser(storedUser);
        } catch (error) {
            console.error("Unable to load user:", error);
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");

        navigate("/login");
    };

    if (!user) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading dashboard...</p>
            </div>
        );
    }

    const dashboardItems = [
        {
            title: "Manage Vehicles",
            description:
                "Register your vehicles and manage the vehicles you use for rides.",
            icon: <Car size={32} />,
            buttonText: "Manage Vehicles",
            route: "/driver/vehicles",
        },
        {
            title: "Post a Ride",
            description:
                "Create a new ride by selecting your vehicle, locations and ride details.",
            icon: <PlusCircle size={32} />,
            buttonText: "Post New Ride",
            route: "/driver/post-ride",
        },
        {
            title: "My Rides",
            description:
                "View all rides you have posted and check their current status.",
            icon: <MapPin size={32} />,
            buttonText: "View My Rides",
            route: "/driver/my-rides",
        },
        {
            title: "Ride Requests",
            description:
                "View passengers who have requested to join your rides.",
            icon: <ClipboardList size={32} />,
            buttonText: "View Requests",
            route: "/driver/ride-requests",
        },
        {
            title: "Approved Rides",
            description:
                "View confirmed rides and passengers who have joined your rides.",
            icon: <CheckCircle2 size={32} />,
            buttonText: "View Approved Rides",
            route: "/driver/approved-rides",
        },
        {
            title: "Ride Chats",
            description:
                "Communicate with passengers for your confirmed rides.",
            icon: <MessageCircle size={32} />,
            buttonText: "Open Chats",
            route: "/driver/approved-rides",
        },
    ];

    return (
        <div className="min-vh-100 bg-light">
            {/* Hero Section */}
            <section
                className="text-white position-relative overflow-hidden"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(15, 23, 42, 0.70), rgba(15, 23, 42, 0.78)), url('/driver-hero.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "330px",
                }}
            >
                <div className="container py-5">
                    {/* Top Bar */}
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-2">
                            <Car size={28} className="text-warning" />

                            <span className="fw-bold fs-5">
                                Driver Portal
                            </span>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
                                onClick={() => navigate("/profile")}
                            >
                                <User size={16} />
                                Profile
                            </button>

                            <button
                                className="btn btn-warning btn-sm d-flex align-items-center gap-2"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div
                        className="mx-auto"
                        style={{
                            maxWidth: "900px",
                        }}
                    >
                        <span className="badge bg-warning text-dark rounded-pill px-3 py-2 mb-3">
                            Driver Dashboard
                        </span>

                        <h1 className="display-5 fw-bold mb-3">
                            Welcome, {user.full_name}
                        </h1>

                        <p
                            className="lead text-light mb-0"
                            style={{
                                maxWidth: "650px",
                                lineHeight: "1.7",
                            }}
                        >
                            Manage your vehicles, publish rides, review
                            passenger requests and communicate with passengers
                            from one place.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Dashboard */}
            <main
                className="container pb-5"
                style={{
                    marginTop: "-55px",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                {/* Welcome / Summary Card */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <h4 className="fw-bold mb-2">
                                    Driver Control Center
                                </h4>

                                <p className="text-muted mb-0">
                                    Choose an option below to manage your ride
                                    sharing activities.
                                </p>
                            </div>

                            <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={() =>
                                        navigate("/driver/post-ride")
                                    }
                                >
                                    <PlusCircle size={18} className="me-2" />
                                    Post Ride
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Navigation Cards */}
                <div className="row g-4">
                    {dashboardItems.map((item, index) => (
                        <div
                            key={index}
                            className="col-md-6 col-lg-4"
                        >
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-4 d-flex flex-column">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary mb-3"
                                        style={{
                                            width: "62px",
                                            height: "62px",
                                        }}
                                    >
                                        {item.icon}
                                    </div>

                                    <h5 className="fw-bold mb-2">
                                        {item.title}
                                    </h5>

                                    <p className="text-muted small flex-grow-1">
                                        {item.description}
                                    </p>

                                    <button
                                        className="btn btn-outline-primary w-100 mt-3"
                                        onClick={() =>
                                            navigate(item.route)
                                        }
                                    >
                                        {item.buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Suggested Flow */}
                <div className="card border-0 shadow-sm mt-5">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4">
                            Getting Started
                        </h5>

                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="d-flex gap-3">
                                    <div
                                        className="rounded-circle bg-warning d-flex align-items-center justify-content-center fw-bold"
                                        style={{
                                            minWidth: "42px",
                                            height: "42px",
                                        }}
                                    >
                                        1
                                    </div>

                                    <div>
                                        <h6 className="fw-bold mb-1">
                                            Add Vehicle
                                        </h6>

                                        <p className="small text-muted mb-0">
                                            Register at least one vehicle before
                                            posting rides.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="d-flex gap-3">
                                    <div
                                        className="rounded-circle bg-warning d-flex align-items-center justify-content-center fw-bold"
                                        style={{
                                            minWidth: "42px",
                                            height: "42px",
                                        }}
                                    >
                                        2
                                    </div>

                                    <div>
                                        <h6 className="fw-bold mb-1">
                                            Post Ride
                                        </h6>

                                        <p className="small text-muted mb-0">
                                            Select your vehicle and provide the
                                            ride information.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="d-flex gap-3">
                                    <div
                                        className="rounded-circle bg-warning d-flex align-items-center justify-content-center fw-bold"
                                        style={{
                                            minWidth: "42px",
                                            height: "42px",
                                        }}
                                    >
                                        3
                                    </div>

                                    <div>
                                        <h6 className="fw-bold mb-1">
                                            Manage Passengers
                                        </h6>

                                        <p className="small text-muted mb-0">
                                            Check ride requests and communicate
                                            with confirmed passengers.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DriverDashboard;