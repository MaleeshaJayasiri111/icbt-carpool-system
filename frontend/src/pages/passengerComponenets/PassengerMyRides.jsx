import React, { useEffect, useState } from "react";

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
    WalletCards,MessageCircle
} from "lucide-react";

import {
    getMyBookings,
    makePayment,
    cancelBooking,
} from "../../services/bookingService";
import {useNavigate} from "react-router-dom";


const PassengerMyRides = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] =
        useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [paymentBooking, setPaymentBooking] =
        useState(null);

    const [paymentForm, setPaymentForm] =
        useState({
            cardHolder: "",
            cardNumber: "",
            expiry: "",
            cvv: "",
        });

    const [paymentLoading, setPaymentLoading] =
        useState(false);

    const loadBookings = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getMyBookings();

            console.log(
                "Passenger bookings:",
                response
            );

            const allBookings =
                response.data || [];


            const activeBookings =
                allBookings.filter(
                    (booking) => {

                        const rideStatus =
                            booking.rides?.status;

                        return (
                            [
                                "requested",
                                "payment_pending",
                                "confirmed",
                            ].includes(
                                booking.status
                            ) &&
                            rideStatus !== "completed" &&
                            rideStatus !== "cancelled"
                        );
                    }
                );


            setBookings(activeBookings);

        } catch (err) {

            console.error(
                "Booking loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load your rides."
            );

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
            cardHolder: "",
            cardNumber: "",
            expiry: "",
            cvv: "",
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

        const { name, value } =
            e.target;

        setPaymentForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePayment = async (e) => {

        e.preventDefault();


        if (
            !paymentForm.cardHolder ||
            !paymentForm.cardNumber ||
            !paymentForm.expiry ||
            !paymentForm.cvv
        ) {

            setError(
                "Please complete all payment fields."
            );

            return;
        }


        try {

            setPaymentLoading(true);
            setError("");
            setSuccess("");


            await makePayment(
                paymentBooking.id
            );


            setPaymentBooking(null);


            setSuccess(
                "Payment successful. Your seat has been confirmed."
            );


            await loadBookings();


        } catch (err) {

            console.error(
                "Payment error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Payment failed."
            );

        } finally {

            setPaymentLoading(false);
        }
    };

    const handleCancel = async (
        bookingId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this booking?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(
                bookingId
            );

            setError("");
            setSuccess("");


            await cancelBooking(
                bookingId
            );


            setSuccess(
                "Booking cancelled successfully."
            );


            await loadBookings();


        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to cancel booking."
            );

        } finally {

            setActionLoading(null);
        }
    };

    const getStatusInfo = (status) => {

        switch (status) {

            case "requested":
                return {
                    text: "Waiting for Driver",
                    className:
                        "bg-warning-subtle text-warning-emphasis",
                    icon: <Hourglass size={15} />,
                };


            case "payment_pending":
                return {
                    text: "Payment Required",
                    className:
                        "bg-info-subtle text-info-emphasis",
                    icon: <CreditCard size={15} />,
                };


            case "confirmed":
                return {
                    text: "Ride Confirmed",
                    className:
                        "bg-success-subtle text-success-emphasis",
                    icon: <CheckCircle2 size={15} />,
                };


            case "rejected":
                return {
                    text: "Rejected",
                    className:
                        "bg-danger-subtle text-danger-emphasis",
                    icon: <XCircle size={15} />,
                };


            case "cancelled":
                return {
                    text: "Cancelled",
                    className:
                        "bg-secondary-subtle text-secondary-emphasis",
                    icon: <XCircle size={15} />,
                };


            default:
                return {
                    text: status,
                    className: "bg-light",
                    icon: null,
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
                className="rounded-4 p-4 p-md-5 mb-4 bg-dark text-white"
            >

                <div className="row align-items-center">

                    <div className="col-lg-8">

                        <small className="text-warning fw-semibold">
                            PASSENGER PORTAL
                        </small>

                        <h2 className="fw-bold mt-2 mb-2">
                            My Rides
                        </h2>

                        <p className="text-white-50 mb-0">
                            Track your ride requests,
                            complete payments and manage
                            confirmed bookings.
                        </p>

                    </div>


                    <div className="col-lg-4 d-none d-lg-flex justify-content-end">

                        <div
                            className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width: "80px",
                                height: "80px",
                            }}
                        >
                            <Car size={38} />
                        </div>

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


                    {bookings.map(
                        (booking) => {

                            const ride =
                                booking.rides;

                            const vehicle =
                                ride?.vehicles;

                            const status =
                                getStatusInfo(
                                    booking.status
                                );


                            return (

                                <div
                                    key={
                                        booking.id
                                    }
                                    className="col-xl-6"
                                >

                                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">


                                        {/* TOP */}

                                        <div className="card-body p-4">


                                            <div className="d-flex justify-content-between align-items-start gap-3 mb-4">

                                                <div>

                                                    <small className="text-muted">
                                                        YOUR ROUTE
                                                    </small>

                                                    <h4 className="fw-bold mt-1 mb-0">

                                                        {
                                                            ride?.start_location
                                                        }

                                                        <span className="text-warning mx-2">
                                                            →
                                                        </span>

                                                        {
                                                            ride?.destination
                                                        }

                                                    </h4>

                                                </div>


                                                <span
                                                    className={`badge rounded-pill d-flex align-items-center gap-1 px-3 py-2 ${status.className}`}
                                                >

                                                    {
                                                        status.icon
                                                    }

                                                    {
                                                        status.text
                                                    }

                                                </span>

                                            </div>


                                            {/* RIDE DETAILS */}

                                            <div className="row g-3 mb-4">


                                                <div className="col-6">

                                                    <div className="bg-light rounded-3 p-3 h-100">

                                                        <CalendarDays
                                                            size={18}
                                                            className="text-warning mb-2"
                                                        />

                                                        <small className="d-block text-muted">
                                                            Date
                                                        </small>

                                                        <strong>
                                                            {
                                                                ride?.ride_date
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>


                                                <div className="col-6">

                                                    <div className="bg-light rounded-3 p-3 h-100">

                                                        <Clock
                                                            size={18}
                                                            className="text-warning mb-2"
                                                        />

                                                        <small className="d-block text-muted">
                                                            Departure
                                                        </small>

                                                        <strong>
                                                            {
                                                                ride?.departure_time
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>


                                                <div className="col-6">

                                                    <div className="bg-light rounded-3 p-3 h-100">

                                                        <Users
                                                            size={18}
                                                            className="text-warning mb-2"
                                                        />

                                                        <small className="d-block text-muted">
                                                            Available Seats
                                                        </small>

                                                        <strong>
                                                            {
                                                                ride?.available_seats
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>


                                                <div className="col-6">

                                                    <div className="bg-light rounded-3 p-3 h-100">

                                                        <Banknote
                                                            size={18}
                                                            className="text-warning mb-2"
                                                        />

                                                        <small className="d-block text-muted">
                                                            Seat Price
                                                        </small>

                                                        <strong>
                                                            Rs.{" "}
                                                            {
                                                                ride?.fee_per_seat
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* VEHICLE */}

                                            {vehicle && (

                                                <div className="border rounded-3 p-3 mb-4">

                                                    <div className="d-flex align-items-center gap-3">

                                                        <div
                                                            className="bg-warning-subtle rounded-circle d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: "44px",
                                                                height: "44px",
                                                            }}
                                                        >

                                                            <Car size={20} />

                                                        </div>


                                                        <div>

                                                            <small className="text-muted d-block">
                                                                Vehicle
                                                            </small>

                                                            <strong>
                                                                {
                                                                    vehicle.brand
                                                                }{" "}
                                                                {
                                                                    vehicle.model
                                                                }
                                                            </strong>

                                                            <span className="text-muted ms-2">
                                                                {
                                                                    vehicle.vehicle_number
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            )}


                                            {/* ================= REQUESTED ================= */}

                                            {booking.status ===
                                                "requested" && (

                                                    <div className="border border-warning-subtle bg-warning-subtle rounded-3 p-3">

                                                        <div className="d-flex gap-3">

                                                            <Hourglass
                                                                size={22}
                                                            />

                                                            <div>

                                                                <strong>
                                                                    Waiting for driver approval
                                                                </strong>

                                                                <p className="small mb-0 mt-1">
                                                                    Your request has been sent.
                                                                    The driver needs to accept
                                                                    it before payment.
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>

                                                )}


                                            {/* ================= PAYMENT ================= */}

                                            {booking.status ===
                                                "payment_pending" && (

                                                    <div className="border border-info-subtle rounded-3 p-3">

                                                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                                                            <div>

                                                                <small className="text-muted">
                                                                    DRIVER ACCEPTED
                                                                </small>

                                                                <h5 className="fw-bold mb-1">
                                                                    Complete Your Payment
                                                                </h5>

                                                                <span className="text-muted">
                                                                Amount:
                                                            </span>

                                                                <strong className="ms-2">
                                                                    Rs.{" "}
                                                                    {
                                                                        ride?.fee_per_seat
                                                                    }
                                                                </strong>

                                                            </div>


                                                            <button
                                                                type="button"
                                                                className="btn btn-warning fw-bold px-4"
                                                                onClick={() =>
                                                                    openPayment(
                                                                        booking
                                                                    )
                                                                }
                                                            >

                                                                <WalletCards
                                                                    size={18}
                                                                    className="me-2"
                                                                />

                                                                Pay Now

                                                            </button>

                                                        </div>

                                                    </div>

                                                )}

                                            {/* CHAT */}

                                            {booking.status ===
                                                "confirmed" &&
                                                [
                                                    "available",
                                                    "full",
                                                ].includes(
                                                    ride?.status
                                                ) && (

                                                    <button
                                                        type="button"
                                                        className="btn btn-warning btn-sm fw-semibold"
                                                        onClick={() =>
                                                            navigate(
                                                                `/passenger/rides/${ride.id}/chat`
                                                            )
                                                        }
                                                    >
                                                        <MessageCircle
                                                            size={16}
                                                            className="me-1"
                                                        />

                                                        Chat
                                                    </button>

                                                )}


                                            {/* ================= CONFIRMED ================= */}

                                            {booking.status ===
                                                "confirmed" && (

                                                    <div className="bg-success-subtle rounded-3 p-3">

                                                        <div className="d-flex gap-3">

                                                            <CheckCircle2
                                                                size={23}
                                                                className="text-success"
                                                            />

                                                            <div>

                                                                <strong className="text-success">
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


                                            {/* REJECTED */}

                                            {booking.status ===
                                                "rejected" && (

                                                    <div className="bg-danger-subtle rounded-3 p-3">

                                                        <strong className="text-danger">
                                                            Request Rejected
                                                        </strong>

                                                        <p className="small mb-0 mt-1">
                                                            The driver did not accept
                                                            this ride request.
                                                        </p>

                                                    </div>

                                                )}


                                            {/* CANCEL BUTTON */}

                                            {[
                                                "requested",
                                                "payment_pending",
                                                "confirmed",
                                            ].includes(
                                                booking.status
                                            ) && (

                                                <div className="border-top mt-4 pt-3">

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        disabled={
                                                            actionLoading ===
                                                            booking.id
                                                        }
                                                        onClick={() =>
                                                            handleCancel(
                                                                booking.id
                                                            )
                                                        }
                                                    >

                                                        <XCircle
                                                            size={16}
                                                            className="me-1"
                                                        />

                                                        Cancel Booking

                                                    </button>

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            );
                        }
                    )}

                </div>

            )}


            {/* ==========================================
                DUMMY PAYMENT MODAL
            ========================================== */}

            {paymentBooking && (

                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
                    style={{
                        backgroundColor:
                            "rgba(0,0,0,0.65)",

                        zIndex: 2000,
                    }}
                >

                    <div
                        className="bg-white rounded-4 shadow-lg overflow-hidden"
                        style={{
                            width: "100%",
                            maxWidth: "520px",
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
                                    onClick={
                                        closePayment
                                    }
                                >

                                    <X size={20} />

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
                                    {
                                        paymentBooking
                                            .rides
                                            ?.fee_per_seat
                                    }
                                </h3>

                                <small className="text-muted">
                                    Amount cannot be changed
                                </small>

                            </div>


                            <form
                                onSubmit={
                                    handlePayment
                                }
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
                                        value={
                                            paymentForm.cardHolder
                                        }
                                        onChange={
                                            handlePaymentChange
                                        }
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
                                            value={
                                                paymentForm.cardNumber
                                            }
                                            onChange={
                                                handlePaymentChange
                                            }
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
                                            value={
                                                paymentForm.expiry
                                            }
                                            onChange={
                                                handlePaymentChange
                                            }
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
                                            value={
                                                paymentForm.cvv
                                            }
                                            onChange={
                                                handlePaymentChange
                                            }
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
                                    disabled={
                                        paymentLoading
                                    }
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
                                            {
                                                paymentBooking
                                                    .rides
                                                    ?.fee_per_seat
                                            }

                                        </>

                                    )}

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default PassengerMyRides;