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

                        const passenger =
                            request.users;

                        const ride =
                            request.rides;

                        return (

                            <div
                                key={request.id}
                                className="col-lg-6"
                            >

                                <div className="card border-0 shadow-sm h-100">

                                    <div className="card-body p-4">


                                        {/* Passenger */}

                                        <div className="d-flex align-items-center gap-3 mb-4">

                                            {passenger?.user_profile ? (

                                                <img
                                                    src={passenger.user_profile}
                                                    alt="Passenger"
                                                    style={{
                                                        width: "55px",
                                                        height: "55px",
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                    }}
                                                />

                                            ) : (

                                                <div
                                                    className="bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: "55px",
                                                        height: "55px",
                                                    }}
                                                >
                                                    <Users size={23} />
                                                </div>

                                            )}


                                            <div>

                                                <h6 className="fw-bold mb-1">
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


                                            <span
                                                className={
                                                    request.status === "requested"
                                                        ? "badge bg-warning text-dark ms-auto"
                                                        : "badge bg-info text-dark ms-auto"
                                                }
                                            >

                                                {request.status === "requested"
                                                    ? "Requested"
                                                    : "Waiting for Payment"}

                                            </span>

                                        </div>


                                        {/* Ride */}

                                        <div className="bg-light rounded-3 p-3">

                                            <div className="d-flex gap-2 mb-2">

                                                <MapPin size={17} />

                                                <strong>
                                                    {ride?.start_location}
                                                    {" → "}
                                                    {ride?.destination}
                                                </strong>

                                            </div>


                                            <div className="row g-2 small text-muted">

                                                <div className="col-md-6">
                                                    <CalendarDays
                                                        size={15}
                                                        className="me-2"
                                                    />

                                                    {ride?.ride_date}
                                                </div>


                                                <div className="col-md-6">
                                                    <Clock
                                                        size={15}
                                                        className="me-2"
                                                    />

                                                    {ride?.departure_time}
                                                </div>


                                                <div className="col-md-6">
                                                    <Banknote
                                                        size={15}
                                                        className="me-2"
                                                    />

                                                    Rs. {ride?.fee_per_seat}
                                                </div>

                                            </div>

                                        </div>


                                        {/* Actions */}

                                        {request.status === "requested" && (

                                            <div className="d-flex gap-2 mt-4">

                                                <button
                                                    className="btn btn-success"
                                                    disabled={
                                                        actionLoading === request.id
                                                    }
                                                    onClick={() =>
                                                        handleAccept(request.id)
                                                    }
                                                >

                                                    <Check
                                                        size={17}
                                                        className="me-1"
                                                    />

                                                    Accept

                                                </button>


                                                <button
                                                    className="btn btn-outline-danger"
                                                    disabled={
                                                        actionLoading === request.id
                                                    }
                                                    onClick={() =>
                                                        handleReject(request.id)
                                                    }
                                                >

                                                    <X
                                                        size={17}
                                                        className="me-1"
                                                    />

                                                    Reject

                                                </button>

                                            </div>

                                        )}


                                        {request.status === "payment_pending" && (

                                            <div className="alert alert-info mt-4 mb-0">

                                                Request accepted.
                                                Waiting for passenger payment.

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