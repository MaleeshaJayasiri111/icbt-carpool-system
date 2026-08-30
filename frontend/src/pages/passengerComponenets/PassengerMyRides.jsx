import React, {useEffect, useState} from "react";

import {

    CalendarDays,
    Clock,
    Users,
    Banknote,
    Car,
    CreditCard,
    XCircle,
    Loader2,
    CheckCircle2,
    Hourglass,
    ShieldCheck,
    X,
    WalletCards,
    MessageCircle
} from "lucide-react";

import {
    getMyBookings, makePayment, cancelBooking,
} from "../../services/bookingService";
import {useNavigate} from "react-router-dom";


const PassengerMyRides = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [paymentBooking, setPaymentBooking] = useState(null);

    const [paymentForm, setPaymentForm] = useState({
        cardHolder: "", cardNumber: "", expiry: "", cvv: "",
    });

    const [paymentLoading, setPaymentLoading] = useState(false);

    const loadBookings = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getMyBookings();

            console.log("Passenger bookings:", response);

            const allBookings = response.data || [];


            const activeBookings = allBookings.filter((booking) => {

                const rideStatus = booking.rides?.status;

                return (["requested", "payment_pending", "confirmed",].includes(booking.status) && rideStatus !== "completed" && rideStatus !== "cancelled");
            });


            setBookings(activeBookings);

        } catch (err) {

            console.error("Booking loading error:", err);

            setError(err.response?.data?.message || "Unable to load your rides.");

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadBookings();

    }, []);

    const openPayment = (booking) => {

        setPaymentBooking(booking);

        setPaymentForm({
            cardHolder: "", cardNumber: "", expiry: "", cvv: "",
        });

        setError("");
        setSuccess("");
    };

    const closePayment = () => {

        if (paymentLoading) {
            return;
        }

        setPaymentBooking(null);
    };


    const handlePaymentChange = (e) => {

        const {name, value} = e.target;

        setPaymentForm((prev) => ({
            ...prev, [name]: value,
        }));
    };

    const handlePayment = async (e) => {

        e.preventDefault();


        if (!paymentForm.cardHolder || !paymentForm.cardNumber || !paymentForm.expiry || !paymentForm.cvv) {

            setError("Please complete all payment fields.");

            return;
        }


        try {

            setPaymentLoading(true);
            setError("");
            setSuccess("");


            await makePayment(paymentBooking.id);


            setPaymentBooking(null);


            setSuccess("Payment successful. Your seat has been confirmed.");


            await loadBookings();


        } catch (err) {

            console.error("Payment error:", err);

            setError(err.response?.data?.message || "Payment failed.");

        } finally {

            setPaymentLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {

        const confirmed = window.confirm("Are you sure you want to cancel this booking?");

        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(bookingId);

            setError("");
            setSuccess("");


            await cancelBooking(bookingId);


            setSuccess("Booking cancelled successfully.");


            await loadBookings();


        } catch (err) {

            setError(err.response?.data?.message || "Unable to cancel booking.");

        } finally {

            setActionLoading(null);
        }
    };

    const getStatusInfo = (status) => {

        switch (status) {

            case "requested":
                return {
                    text: "Waiting for Driver",
                    className: "bg-warning-subtle text-warning-emphasis",
                    icon: <Hourglass size={15}/>,
                };


            case "payment_pending":
                return {
                    text: "Payment Required",
                    className: "bg-info-subtle text-info-emphasis",
                    icon: <CreditCard size={15}/>,
                };


            case "confirmed":
                return {
                    text: "Ride Confirmed",
                    className: "bg-success-subtle text-success-emphasis",
                    icon: <CheckCircle2 size={15}/>,
                };


            case "rejected":
                return {
                    text: "Rejected", className: "bg-danger-subtle text-danger-emphasis", icon: <XCircle size={15}/>,
                };


            case "cancelled":
                return {
                    text: "Cancelled",
                    className: "bg-secondary-subtle text-secondary-emphasis",
                    icon: <XCircle size={15}/>,
                };


            default:
                return {
                    text: status, className: "bg-light", icon: null,
                };
        }
    };


    // =====================================
    // UI
    // =====================================

    return (

        <div className="container-fluid p-4 p-md-5">


            {/* HEADER */}

            <div
                className="rounded-4 p-4 mb-4"
                style={{
                    background:
                        "linear-gradient(135deg, #0f172a 0%, #172554 100%)",
                    boxShadow:
                        "0 6px 20px rgba(8, 20, 45, 0.12)",
                    border:
                        "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <div className="d-flex align-items-center justify-content-between">

                    {/* LEFT */}

                    <div>

                        <div className="d-flex align-items-center gap-2 mb-2">

                <span
                    className="rounded-pill px-3 py-1 fw-semibold"
                    style={{
                        background:
                            "rgba(250, 204, 21, 0.12)",
                        color: "#facc15",
                        fontSize: "0.75rem",
                        letterSpacing: "0.5px",
                    }}
                >
                    PASSENGER PORTAL
                </span>

                        </div>

                        <h2
                            className="fw-bold mb-1 text-white"
                            style={{
                                fontSize: "1.7rem",
                            }}
                        >
                            My Rides
                        </h2>

                        <p
                            className="mb-0"
                            style={{
                                color: "rgba(255,255,255,0.65)",
                                fontSize: "0.9rem",
                            }}
                        >
                            Track your ride requests, complete payments
                            and manage confirmed bookings.
                        </p>

                    </div>

                    {/* ICON */}

                    <div
                        className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                            width: "58px",
                            height: "58px",
                            background:
                                "rgba(250, 204, 21, 0.12)",
                            border:
                                "1px solid rgba(250, 204, 21, 0.25)",
                            color: "#facc15",
                        }}
                    >
                        <Car size={28} />
                    </div>

                </div>
            </div>




            {/* MESSAGES */}

            {error && (

                <div className="alert alert-danger shadow-sm">
                    {error}
                </div>

            )}


            {success && (

                <div className="alert alert-success shadow-sm">
                    <CheckCircle2
                        size={18}
                        className="me-2"
                    />

                    {success}
                </div>

            )}


            {/* LOADING */}

            {loading ? (

                <div className="text-center py-5">

                    <Loader2
                        size={40}
                        className="mb-3"
                    />

                    <h6>
                        Loading your rides...
                    </h6>

                </div>

            ) : bookings.length === 0 ? (

                <div className="card border-0 shadow-sm rounded-4">

                    <div className="card-body text-center py-5">

                        <Car
                            size={60}
                            className="text-warning mb-3"
                        />

                        <h4 className="fw-bold">
                            No Ride Requests Yet
                        </h4>

                        <p className="text-muted mb-0">
                            Find a ride and send your
                            first join request.
                        </p>

                    </div>

                </div>

            ) : (


                <div className="row g-4">

                    {bookings.map((booking) => {

                        const ride = booking.rides;

                        const vehicle = ride?.vehicles;

                        const status = getStatusInfo(booking.status);

                        return (

                            <div
                                key={booking.id}
                                className="col-xl-6"
                            >

                                <div
                                    className="card border-0 h-100 overflow-hidden"
                                    style={{
                                        borderRadius: "18px",
                                        background: "#ffffff",
                                        boxShadow: "0 6px 20px rgba(8, 20, 45, 0.10)",
                                        border: "1px solid rgba(8, 20, 45, 0.06)",
                                    }}
                                >

                                    <div className="card-body p-4">

                                        {/* ================= TOP ================= */}

                                        <div
                                            className="d-flex justify-content-between align-items-start gap-3 mb-3">

                                            <div className="flex-grow-1">

                                                <small
                                                    className="fw-semibold"
                                                    style={{
                                                        color: "#64748b", letterSpacing: "0.5px",
                                                    }}
                                                >
                                                    YOUR ROUTE
                                                </small>

                                                <h5
                                                    className="fw-bold mt-1 mb-0"
                                                    style={{
                                                        color: "#0f172a", lineHeight: "1.4",
                                                    }}
                                                >

                                                    {ride?.start_location}

                                                    <span
                                                        className="mx-2"
                                                        style={{
                                                            color: "#facc15",
                                                        }}
                                                    >
                                            →
                                        </span>

                                                    {ride?.destination}

                                                </h5>

                                            </div>


                                            {/* STATUS */}

                                            <span
                                                className={`badge rounded-pill d-flex align-items-center gap-1 px-3 py-2 ${status.className}`}
                                            >

                                    {status.icon}

                                                {status.text}

                                </span>

                                        </div>


                                        <div
                                            className="row g-2 mb-3"
                                        >

                                            <div className="col-6">

                                                <div
                                                    className="rounded-3 p-3 h-100"
                                                    style={{
                                                        background: "rgba(250, 204, 21, 0.08)",
                                                    }}
                                                >

                                                    <CalendarDays
                                                        size={17}
                                                        className="text-warning mb-1"
                                                    />

                                                    <small className="d-block text-muted">
                                                        Date
                                                    </small>

                                                    <strong
                                                        className="small"
                                                        style={{
                                                            color: "#0f172a",
                                                        }}
                                                    >
                                                        {ride?.ride_date}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="col-6">

                                                <div
                                                    className="rounded-3 p-3 h-100"
                                                    style={{
                                                        background: "rgba(250, 204, 21, 0.08)",
                                                    }}
                                                >

                                                    <Clock
                                                        size={17}
                                                        className="text-warning mb-1"
                                                    />

                                                    <small className="d-block text-muted">
                                                        Departure
                                                    </small>

                                                    <strong
                                                        className="small"
                                                        style={{
                                                            color: "#0f172a",
                                                        }}
                                                    >
                                                        {ride?.departure_time}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="col-6">

                                                <div
                                                    className="rounded-3 p-3 h-100"
                                                    style={{
                                                        background: "rgba(8, 20, 45, 0.04)",
                                                    }}
                                                >

                                                    <Users
                                                        size={17}
                                                        className="mb-1"
                                                        style={{
                                                            color: "#0d6efd",
                                                        }}
                                                    />

                                                    <small className="d-block text-muted">
                                                        Available Seats
                                                    </small>

                                                    <strong
                                                        className="small"
                                                        style={{
                                                            color: "#0f172a",
                                                        }}
                                                    >
                                                        {ride?.available_seats}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="col-6">

                                                <div
                                                    className="rounded-3 p-3 h-100"
                                                    style={{
                                                        background: "rgba(8, 20, 45, 0.04)",
                                                    }}
                                                >

                                                    <Banknote
                                                        size={17}
                                                        className="mb-1"
                                                        style={{
                                                            color: "#0d6efd",
                                                        }}
                                                    />

                                                    <small className="d-block text-muted">
                                                        Seat Price
                                                    </small>

                                                    <strong
                                                        className="small"
                                                        style={{
                                                            color: "#0f172a",
                                                        }}
                                                    >
                                                        Rs. {ride?.fee_per_seat}
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>


                                        {/* ================= VEHICLE ================= */}

                                        {vehicle && (

                                            <div
                                                className="d-flex align-items-center gap-3 p-3 mb-3 rounded-3"
                                                style={{
                                                    background: "rgba(8, 20, 45, 0.035)",
                                                    border: "1px solid rgba(8, 20, 45, 0.06)",
                                                }}
                                            >

                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                                    style={{
                                                        width: "42px",
                                                        height: "42px",
                                                        background: "rgba(250, 204, 21, 0.18)",
                                                        color: "#b77900",
                                                    }}
                                                >

                                                    <Car size={19}/>

                                                </div>


                                                <div className="flex-grow-1">

                                                    <small className="text-muted d-block">
                                                        Vehicle
                                                    </small>

                                                    <strong
                                                        className="small"
                                                        style={{
                                                            color: "#0f172a",
                                                        }}
                                                    >
                                                        {vehicle.brand}{" "}
                                                        {vehicle.model}
                                                    </strong>

                                                    <span
                                                        className="text-muted small ms-2"
                                                    >
                                            {vehicle.vehicle_number}
                                        </span>

                                                </div>

                                            </div>

                                        )}


                                        {/* ================= REQUESTED ================= */}

                                        {booking.status === "requested" && (

                                            <div
                                                className="rounded-3 p-3"
                                                style={{
                                                    background: "rgba(250, 204, 21, 0.10)",
                                                    border: "1px solid rgba(250, 204, 21, 0.25)",
                                                }}
                                            >

                                                <div className="d-flex gap-3">

                                                    <Hourglass
                                                        size={20}
                                                        className="text-warning flex-shrink-0"
                                                    />

                                                    <div>

                                                        <strong
                                                            className="small"
                                                            style={{
                                                                color: "#0f172a",
                                                            }}
                                                        >
                                                            Waiting for driver approval
                                                        </strong>

                                                        <p className="small mb-0 mt-1 text-muted">
                                                            Your request has been sent.
                                                            The driver needs to accept
                                                            it before payment.
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        )}


                                        {/* ================= PAYMENT ================= */}

                                        {booking.status === "payment_pending" && (

                                            <div
                                                className="rounded-3 p-3"
                                                style={{
                                                    background: "rgba(13, 110, 253, 0.05)",
                                                    border: "1px solid rgba(13, 110, 253, 0.15)",
                                                }}
                                            >

                                                <div
                                                    className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                                                    <div>

                                                        <small
                                                            className="fw-semibold text-primary"
                                                        >
                                                            DRIVER ACCEPTED
                                                        </small>

                                                        <h6 className="fw-bold mb-1 mt-1">
                                                            Complete Your Payment
                                                        </h6>

                                                        <span className="text-muted small">
                                                Amount:
                                            </span>

                                                        <strong className="ms-2 small">
                                                            Rs.{" "}
                                                            {ride?.fee_per_seat}
                                                        </strong>

                                                    </div>


                                                    <button
                                                        type="button"
                                                        className="btn btn-warning rounded-pill fw-bold px-4"
                                                        onClick={() => openPayment(booking)}
                                                    >

                                                        <WalletCards
                                                            size={17}
                                                            className="me-2"
                                                        />

                                                        Pay Now

                                                    </button>

                                                </div>

                                            </div>

                                        )}


                                        {/* ================= CONFIRMED ================= */}

                                        {booking.status === "confirmed" && (

                                            <div
                                                className="rounded-3 p-3"
                                                style={{
                                                    background: "rgba(25, 135, 84, 0.07)",
                                                    border: "1px solid rgba(25, 135, 84, 0.15)",
                                                }}
                                            >

                                                <div className="d-flex gap-3">

                                                    <CheckCircle2
                                                        size={21}
                                                        className="text-success flex-shrink-0"
                                                    />

                                                    <div>

                                                        <strong className="text-success small">
                                                            Your seat is confirmed
                                                        </strong>

                                                        <p className="small mb-0 mt-1 text-success-emphasis">
                                                            Payment was successful.
                                                            You are now part of
                                                            this ride.
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        )}


                                        {/* ================= REJECTED ================= */}

                                        {booking.status === "rejected" && (

                                            <div
                                                className="rounded-3 p-3"
                                                style={{
                                                    background: "rgba(220, 53, 69, 0.06)",
                                                    border: "1px solid rgba(220, 53, 69, 0.15)",
                                                }}
                                            >

                                                <strong className="text-danger small">
                                                    Request Rejected
                                                </strong>

                                                <p className="small mb-0 mt-1 text-muted">
                                                    The driver did not accept
                                                    this ride request.
                                                </p>

                                            </div>

                                        )}


                                        {/* ================= ACTIONS ================= */}

                                        <div
                                            className="d-flex justify-content-between align-items-center flex-wrap gap-2 border-top mt-3 pt-3">

                                            {/* CHAT */}

                                            {booking.status === "confirmed" && ["available", "full",].includes(ride?.status) && (

                                                <button
                                                    type="button"
                                                    className="btn btn-warning btn-sm rounded-pill fw-semibold px-3"
                                                    onClick={() => navigate(`/passenger/rides/${ride.id}/chat`)}
                                                >

                                                    <MessageCircle
                                                        size={16}
                                                        className="me-1"
                                                    />

                                                    Chat

                                                </button>

                                            )}


                                            {/* CANCEL */}

                                            {["requested", "payment_pending", "confirmed",].includes(booking.status) && (

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                                    disabled={actionLoading === booking.id}
                                                    onClick={() => handleCancel(booking.id)}
                                                >

                                                    <XCircle
                                                        size={16}
                                                        className="me-1"
                                                    />

                                                    Cancel Booking

                                                </button>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        );
                    })}


                </div>


            )}


            {/* ==========================================
                DUMMY PAYMENT MODAL
            ========================================== */}

            {paymentBooking && (

                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.65)",

                        zIndex: 2000,
                    }}
                >

                    <div
                        className="bg-white rounded-4 shadow-lg overflow-hidden"
                        style={{
                            width: "100%", maxWidth: "520px",
                        }}
                    >


                        {/* MODAL HEADER */}

                        <div className="bg-dark text-white p-4">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <small className="text-warning fw-semibold">
                                        DUMMY PAYMENT
                                    </small>

                                    <h4 className="fw-bold mb-0 mt-1">
                                        Complete Payment
                                    </h4>

                                </div>


                                <button
                                    type="button"
                                    className="btn btn-outline-light btn-sm"
                                    onClick={closePayment}
                                >

                                    <X size={20}/>

                                </button>

                            </div>

                        </div>


                        <div className="p-4">


                            {/* AMOUNT */}

                            <div className="bg-warning-subtle rounded-3 p-3 mb-4">

                                <small className="text-muted d-block">
                                    Amount to Pay
                                </small>

                                <h3 className="fw-bold mb-0">
                                    Rs.{" "}
                                    {paymentBooking.rides?.fee_per_seat}
                                </h3>

                                <small className="text-muted">
                                    Amount cannot be changed
                                </small>

                            </div>


                            <form
                                onSubmit={handlePayment}
                            >


                                {/* CARD HOLDER */}

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Cardholder Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="cardHolder"
                                        placeholder="Enter cardholder name"
                                        value={paymentForm.cardHolder}
                                        onChange={handlePaymentChange}
                                        required
                                    />

                                </div>


                                {/* CARD NUMBER */}

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Card Number
                                    </label>

                                    <div className="input-group">

                                        <span className="input-group-text">

                                            <CreditCard
                                                size={18}
                                            />

                                        </span>

                                        <input
                                            type="text"
                                            className="form-control"
                                            name="cardNumber"
                                            placeholder="1111 2222 3333 4444"
                                            maxLength="19"
                                            value={paymentForm.cardNumber}
                                            onChange={handlePaymentChange}
                                            required
                                        />

                                    </div>

                                </div>


                                <div className="row g-3">


                                    {/* EXPIRY */}

                                    <div className="col-6">

                                        <label className="form-label fw-semibold">
                                            Expiry Date
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            name="expiry"
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            value={paymentForm.expiry}
                                            onChange={handlePaymentChange}
                                            required
                                        />

                                    </div>


                                    {/* CVV */}

                                    <div className="col-6">

                                        <label className="form-label fw-semibold">
                                            CVV
                                        </label>

                                        <input
                                            type="password"
                                            className="form-control"
                                            name="cvv"
                                            placeholder="123"
                                            maxLength="3"
                                            value={paymentForm.cvv}
                                            onChange={handlePaymentChange}
                                            required
                                        />

                                    </div>

                                </div>


                                {/* SECURITY MESSAGE */}

                                <div className="d-flex gap-2 align-items-center text-muted small mt-4">

                                    <ShieldCheck
                                        size={18}
                                        className="text-success"
                                    />

                                    This is a dummy payment
                                    for demonstration purposes.

                                </div>


                                {/* BUTTON */}

                                <button
                                    type="submit"
                                    className="btn btn-warning fw-bold w-100 py-3 mt-4"
                                    disabled={paymentLoading}
                                >

                                    {paymentLoading ? (

                                        <>
                                            <Loader2
                                                size={18}
                                                className="me-2"
                                            />

                                            Processing Payment...
                                        </>

                                    ) : (

                                        <>
                                            <CreditCard
                                                size={18}
                                                className="me-2"
                                            />

                                            Complete Payment — Rs.{" "}
                                            {paymentBooking.rides?.fee_per_seat}

                                        </>

                                    )}

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            )}

        </div>);
};

export default PassengerMyRides;