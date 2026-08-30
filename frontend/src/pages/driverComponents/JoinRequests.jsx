import React, { useEffect, useState } from "react";

import {
    Users,
    MapPin,
    CalendarDays,
    Clock,
    Banknote,
    Check,
    X,
    Loader2,
} from "lucide-react";

import {
    getDriverRequests,
    acceptBookingRequest,
    rejectBookingRequest,
} from "../../services/bookingService";


const JoinRequests = () => {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const loadRequests = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getDriverRequests();

            console.log(
                "Driver requests:",
                response
            );

            setRequests(
                response.data || []
            );

        } catch (err) {

            console.error(
                "Request loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load join requests."
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadRequests();
    }, []);


    const handleAccept = async (bookingId) => {

        try {

            setActionLoading(bookingId);
            setError("");
            setSuccess("");

            await acceptBookingRequest(
                bookingId
            );

            setSuccess(
                "Passenger request accepted."
            );

            await loadRequests();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to accept request."
            );

        } finally {
            setActionLoading(null);
        }
    };


    const handleReject = async (bookingId) => {

        const confirmed =
            window.confirm(
                "Reject this passenger request?"
            );

        if (!confirmed) return;


        try {

            setActionLoading(bookingId);
            setError("");
            setSuccess("");

            await rejectBookingRequest(
                bookingId
            );

            setSuccess(
                "Passenger request rejected."
            );

            await loadRequests();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to reject request."
            );

        } finally {
            setActionLoading(null);
        }
    };


    return (

        <div className="container-fluid p-4 p-md-5">

            <div className="mb-4">

                <h2 className="fw-bold mb-1">
                    Join Requests
                </h2>

                <p className="text-muted">
                    Manage passenger requests
                    for your rides.
                </p>

            </div>


            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}


            {loading ? (

                <div className="text-center py-5">

                    <Loader2 size={35} />

                    <p className="text-muted mt-2">
                        Loading requests...
                    </p>

                </div>

            ) : requests.length === 0 ? (

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <Users
                            size={50}
                            className="text-warning mb-3"
                        />

                        <h5 className="fw-bold">
                            No Join Requests
                        </h5>

                        <p className="text-muted mb-0">
                            You currently have no passenger requests.
                        </p>

                    </div>

                </div>

            ) : (

                <div className="row g-4">

                    {requests.map((request) => {

                        const passenger = request.users;
                        const ride = request.rides;

                        return (

                            <div
                                key={request.id}
                                className="col-lg-6"
                            >

                                <div
                                    className="card border-0 h-100 rounded-4 overflow-hidden"
                                    style={{
                                        backgroundColor: "#ffffff",
                                        boxShadow:
                                            "0 6px 20px rgba(8, 20, 45, 0.08)",
                                    }}
                                >

                                    <div className="card-body p-4">


                                        {/* PASSENGER HEADER */}

                                        <div className="d-flex align-items-center gap-3 mb-4">

                                            {/* PROFILE IMAGE */}

                                            {passenger?.user_profile ? (

                                                <img
                                                    src={passenger.user_profile}
                                                    alt="Passenger"
                                                    className="flex-shrink-0"
                                                    style={{
                                                        width: "58px",
                                                        height: "58px",
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                        border:
                                                            "3px solid rgba(250, 204, 21, 0.35)",
                                                    }}
                                                />

                                            ) : (

                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                                    style={{
                                                        width: "58px",
                                                        height: "58px",
                                                        backgroundColor:
                                                            "rgba(250, 204, 21, 0.12)",
                                                    }}
                                                >
                                                    <Users
                                                        size={24}
                                                        className="text-warning"
                                                    />
                                                </div>

                                            )}


                                            {/* PASSENGER DETAILS */}

                                            <div className="flex-grow-1">

                                                <h6
                                                    className="fw-bold mb-1"
                                                    style={{
                                                        color: "#0f172a",
                                                    }}
                                                >
                                                    {passenger?.full_name ||
                                                        "Passenger"}
                                                </h6>

                                                <div className="small text-muted">
                                                    {passenger?.email}
                                                </div>

                                                <div className="small text-muted">
                                                    {passenger?.phone}
                                                </div>

                                            </div>


                                            {/* STATUS */}

                                            <span
                                                className={`badge rounded-pill px-3 py-2 ${
                                                    request.status === "requested"
                                                        ? "bg-warning text-dark"
                                                        : "bg-info text-dark"
                                                }`}
                                            >
                                {request.status === "requested"
                                    ? "Requested"
                                    : "Payment Pending"}
                            </span>

                                        </div>


                                        {/* DIVIDER */}

                                        <div
                                            className="mb-4"
                                            style={{
                                                borderTop:
                                                    "1px solid rgba(8, 20, 45, 0.08)",
                                            }}
                                        />


                                        {/* RIDE INFORMATION */}

                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                backgroundColor:
                                                    "rgba(8, 20, 45, 0.04)",
                                                border:
                                                    "1px solid rgba(8, 20, 45, 0.06)",
                                            }}
                                        >

                                            {/* ROUTE */}

                                            <div className="d-flex align-items-start gap-3 mb-3">

                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                                    style={{
                                                        width: "38px",
                                                        height: "38px",
                                                        backgroundColor:
                                                            "rgba(250, 204, 21, 0.15)",
                                                    }}
                                                >
                                                    <MapPin
                                                        size={18}
                                                        className="text-warning"
                                                    />
                                                </div>

                                                <div>

                                                    <small className="text-muted d-block mb-1">
                                                        Requested Ride
                                                    </small>

                                                    <span
                                                        className="fw-bold"
                                                        style={{
                                                            color: "#0f172a",
                                                        }}
                                                    >
                                        {ride?.start_location}
                                                        {" → "}
                                                        {ride?.destination}
                                    </span>

                                                </div>

                                            </div>


                                            {/* RIDE DETAILS */}

                                            <div className="row g-3 small">

                                                <div className="col-md-4">

                                                    <div className="d-flex align-items-center gap-2">

                                                        <CalendarDays
                                                            size={16}
                                                            className="text-warning flex-shrink-0"
                                                        />

                                                        <div>

                                                            <small className="text-muted d-block">
                                                                Date
                                                            </small>

                                                            <span className="fw-semibold">
                                                {ride?.ride_date}
                                            </span>

                                                        </div>

                                                    </div>

                                                </div>


                                                <div className="col-md-4">

                                                    <div className="d-flex align-items-center gap-2">

                                                        <Clock
                                                            size={16}
                                                            className="text-warning flex-shrink-0"
                                                        />

                                                        <div>

                                                            <small className="text-muted d-block">
                                                                Departure
                                                            </small>

                                                            <span className="fw-semibold">
                                                {ride?.departure_time}
                                            </span>

                                                        </div>

                                                    </div>

                                                </div>


                                                <div className="col-md-4">

                                                    <div className="d-flex align-items-center gap-2">

                                                        <Banknote
                                                            size={16}
                                                            className="text-warning flex-shrink-0"
                                                        />

                                                        <div>

                                                            <small className="text-muted d-block">
                                                                Fee
                                                            </small>

                                                            <span className="fw-semibold">
                                                Rs. {ride?.fee_per_seat}
                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>


                                        {/* ACTIONS */}

                                        {request.status === "requested" && (

                                            <div className="d-flex gap-2 mt-4">

                                                <button
                                                    className="btn btn-success rounded-pill px-4 fw-semibold d-flex align-items-center justify-content-center gap-1"
                                                    disabled={
                                                        actionLoading === request.id
                                                    }
                                                    onClick={() =>
                                                        handleAccept(request.id)
                                                    }
                                                >

                                                    <Check size={17} />

                                                    Accept

                                                </button>


                                                <button
                                                    className="btn btn-outline-danger rounded-pill px-4 fw-semibold d-flex align-items-center justify-content-center gap-1"
                                                    disabled={
                                                        actionLoading === request.id
                                                    }
                                                    onClick={() =>
                                                        handleReject(request.id)
                                                    }
                                                >

                                                    <X size={17} />

                                                    Reject

                                                </button>


                                                {actionLoading === request.id && (

                                                    <Loader2
                                                        size={18}
                                                        className="align-self-center"
                                                    />

                                                )}

                                            </div>

                                        )}


                                        {/* PAYMENT PENDING */}

                                        {request.status === "payment_pending" && (

                                            <div
                                                className="d-flex align-items-center gap-2 rounded-3 mt-4 mb-0 px-3 py-3"
                                                style={{
                                                    backgroundColor:
                                                        "rgba(13, 202, 240, 0.08)",
                                                    border:
                                                        "1px solid rgba(13, 202, 240, 0.15)",
                                                    color: "#087990",
                                                }}
                                            >

                                                <Clock size={18} />

                                                <span className="small fw-semibold">
                                    Request accepted. Waiting for
                                    passenger payment.
                                </span>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        );
                    })}

                </div>
            )}

        </div>
    );
};

export default JoinRequests;