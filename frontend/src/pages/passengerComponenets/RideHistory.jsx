import React, {
    useEffect,
    useState,
} from "react";

import {
    CheckCircle2,
    XCircle,
    MapPin,
    Navigation,
    CalendarDays,
    Clock,
    Banknote,
    Car,
    Loader2,
    History,
} from "lucide-react";

import {
    getRideHistory,
} from "../../services/bookingService";


const RideHistory = () => {

    const [history, setHistory] = useState({
        completed: [],
        cancelled: [],
    });

    const [tab, setTab] =
        useState("completed");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================
    // LOAD HISTORY
    // =========================

    const loadHistory = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getRideHistory();

            console.log(
                "Ride history:",
                response
            );

            setHistory({
                completed:
                    response.data?.completed || [],

                cancelled:
                    response.data?.cancelled || [],
            });

        } catch (err) {

            console.error(
                "Ride history error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load ride history."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadHistory();
    }, []);


    const rides =
        tab === "completed"
            ? history.completed
            : history.cancelled;


    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    return (

        <div
            className="min-vh-100"
            style={{
                backgroundColor: "#f6f6f3",
            }}
        >

            <div className="container-fluid p-4 p-md-5">


                {/* =========================
                    HEADER
                ========================= */}

                <div
                    className="rounded-4 p-4 mb-4 position-relative overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(135deg, #0f172a 0%, #172554 100%)",
                        boxShadow:
                            "0 6px 20px rgba(8, 20, 45, 0.12)",
                        border:
                            "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    {/* DECORATIVE CIRCLE */}

                    <div
                        style={{
                            position: "absolute",
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            background:
                                "rgba(250, 204, 21, 0.10)",
                            right: "-35px",
                            top: "-55px",
                            border:
                                "1px solid rgba(250, 204, 21, 0.12)",
                        }}
                    />

                    {/* CONTENT */}

                    <div className="position-relative">

                        <div
                            className="d-flex align-items-center gap-2 mb-2"
                            style={{
                                color: "#facc15",
                            }}
                        >
                            <History size={17} />

                            <small
                                className="fw-bold"
                                style={{
                                    letterSpacing: "1.5px",
                                }}
                            >
                                JOURNEY ARCHIVE
                            </small>
                        </div>

                        <h2
                            className="text-white fw-bold mb-1"
                            style={{
                                fontSize: "1.7rem",
                            }}
                        >
                            Ride History
                        </h2>

                        <p
                            className="mb-0"
                            style={{
                                color: "rgba(255,255,255,0.65)",
                                fontSize: "0.9rem",
                            }}
                        >
                            Review your completed and cancelled journeys.
                        </p>

                    </div>
                </div>


                {/* ERROR */}

                {error && (

                    <div className="alert alert-danger">
                        {error}
                    </div>

                )}


                {/* =========================
                    TABS
                ========================= */}

                <div
                    className="d-flex flex-wrap gap-2 mb-4 p-2 rounded-4"
                    style={{
                        background: "rgba(15, 23, 42, 0.04)",
                        width: "fit-content",
                    }}
                >
                    <button
                        type="button"
                        className="d-flex align-items-center gap-2 border-0"
                        style={{
                            padding: "9px 16px",
                            borderRadius: "50px",
                            background:
                                tab === "completed"
                                    ? "#facc15"
                                    : "transparent",
                            color:
                                tab === "completed"
                                    ? "#0f172a"
                                    : "#475569",
                            fontWeight: "600",
                            boxShadow:
                                tab === "completed"
                                    ? "0 3px 10px rgba(250, 204, 21, 0.25)"
                                    : "none",
                            transition: "all 0.2s ease",
                        }}
                        onClick={() =>
                            setTab("completed")
                        }
                    >
                        <CheckCircle2 size={16} />

                        <span>Completed</span>

                        <span
                            className="rounded-pill px-2 py-1"
                            style={{
                                fontSize: "0.7rem",
                                background:
                                    tab === "completed"
                                        ? "rgba(15, 23, 42, 0.12)"
                                        : "rgba(250, 204, 21, 0.18)",
                                color: "#0f172a",
                            }}
                        >
            {history.completed.length}
        </span>
                    </button>


                    <button
                        type="button"
                        className="d-flex align-items-center gap-2 border-0"
                        style={{
                            padding: "9px 16px",
                            borderRadius: "50px",
                            background:
                                tab === "cancelled"
                                    ? "#facc15"
                                    : "transparent",
                            color:
                                tab === "cancelled"
                                    ? "#0f172a"
                                    : "#475569",
                            fontWeight: "600",
                            boxShadow:
                                tab === "cancelled"
                                    ? "0 3px 10px rgba(250, 204, 21, 0.25)"
                                    : "none",
                            transition: "all 0.2s ease",
                        }}
                        onClick={() =>
                            setTab("cancelled")
                        }
                    >
                        <XCircle size={16} />

                        <span>Cancelled</span>

                        <span
                            className="rounded-pill px-2 py-1"
                            style={{
                                fontSize: "0.7rem",
                                background:
                                    tab === "cancelled"
                                        ? "rgba(15, 23, 42, 0.12)"
                                        : "rgba(250, 204, 21, 0.18)",
                                color: "#0f172a",
                            }}
                        >
            {history.cancelled.length}
        </span>
                    </button>
                </div>


                {/* =========================
                    LOADING
                ========================= */}

                {loading ? (

                    <div className="text-center py-5">

                        <Loader2
                            size={34}
                            className="mb-2"
                        />

                        <p className="text-muted">
                            Loading history...
                        </p>

                    </div>

                ) : rides.length === 0 ? (


                    /* EMPTY */

                    <div
                        className="bg-white rounded-4 text-center py-5"
                    >

                        {tab === "completed" ? (

                            <CheckCircle2
                                size={42}
                                className="text-warning mb-3"
                            />

                        ) : (

                            <XCircle
                                size={42}
                                className="text-warning mb-3"
                            />

                        )}


                        <h5 className="fw-bold">
                            No {tab} rides
                        </h5>

                        <p className="text-muted mb-0">
                            Your {tab} rides will
                            appear here.
                        </p>

                    </div>

                ) : (


                    <div className="row g-3">

                        {rides.map((booking) => {

                            const ride =
                                booking.rides;

                            const vehicle =
                                ride?.vehicles;

                            // Supabase may return this as an array
                            // depending on the relationship
                            const payment =
                                Array.isArray(booking.payments)
                                    ? booking.payments[0]
                                    : booking.payments;

                            const isRefunded =
                                payment?.payment_status ===
                                "refunded";

                            const cancelledByDriver =
                                ride?.status === "cancelled";

                            return (

                                <div
                                    key={booking.id}
                                    className="col-md-6 col-xl-4"
                                >

                                    <div
                                        className="bg-white h-100 position-relative overflow-hidden"
                                        style={{
                                            borderRadius: "16px",
                                            boxShadow:
                                                "0 6px 20px rgba(0,0,0,0.05)",
                                        }}
                                    >

                                        {/* TOP COLOR */}

                                        <div
                                            style={{
                                                height: "4px",

                                                backgroundColor:
                                                    tab === "completed"
                                                        ? "#ffc107"
                                                        : "#212529",
                                            }}
                                        />


                                        <div className="p-3">


                                            {/* STATUS */}

                                            <div className="d-flex justify-content-between align-items-center mb-3">

                                                <small className="text-muted fw-semibold">

                                                    BOOKING #

                                                    {booking.id
                                                        ?.slice(0, 6)
                                                        .toUpperCase()}

                                                </small>


                                                <span
                                                    className={
                                                        tab === "completed"
                                                            ? "badge bg-success-subtle text-success-emphasis rounded-pill"
                                                            : "badge bg-danger-subtle text-danger-emphasis rounded-pill"
                                                    }
                                                >

                                                    {tab === "completed"
                                                        ? "Completed"
                                                        : cancelledByDriver
                                                            ? "Cancelled by Driver"
                                                            : "Cancelled"}

                                                </span>

                                            </div>


                                            {/* ROUTE */}

                                            <div className="mb-3">

                                                <div className="d-flex align-items-start gap-2 mb-2">

                                                    <MapPin
                                                        size={17}
                                                        className="text-warning mt-1"
                                                    />

                                                    <div>

                                                        <small className="text-muted d-block">
                                                            FROM
                                                        </small>

                                                        <strong>
                                                            {
                                                                ride?.start_location
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>


                                                <div className="d-flex align-items-start gap-2">

                                                    <Navigation
                                                        size={17}
                                                        className="mt-1"
                                                    />

                                                    <div>

                                                        <small className="text-muted d-block">
                                                            TO
                                                        </small>

                                                        <strong>
                                                            {
                                                                ride?.destination
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* DASHED LINE */}

                                            <div
                                                className="my-3"
                                                style={{
                                                    borderTop:
                                                        "1px dashed #d7d7d7",
                                                }}
                                            />


                                            {/* DETAILS */}

                                            <div className="row g-2 small">


                                                <div className="col-6">

                                                    <div
                                                        className="rounded-3 p-2"
                                                        style={{
                                                            backgroundColor:
                                                                "#f7f7f4",
                                                        }}
                                                    >

                                                        <CalendarDays
                                                            size={14}
                                                            className="text-warning me-1"
                                                        />

                                                        {formatDate(
                                                            ride?.ride_date
                                                        )}

                                                    </div>

                                                </div>


                                                <div className="col-6">

                                                    <div
                                                        className="rounded-3 p-2"
                                                        style={{
                                                            backgroundColor:
                                                                "#f7f7f4",
                                                        }}
                                                    >

                                                        <Clock
                                                            size={14}
                                                            className="text-warning me-1"
                                                        />

                                                        {
                                                            ride?.departure_time
                                                        }

                                                    </div>

                                                </div>


                                                <div className="col-6">

                                                    <div
                                                        className="rounded-3 p-2"
                                                        style={{
                                                            backgroundColor:
                                                                "#f7f7f4",
                                                        }}
                                                    >

                                                        <Banknote
                                                            size={14}
                                                            className="text-warning me-1"
                                                        />

                                                        Rs.{" "}

                                                        {
                                                            ride?.fee_per_seat
                                                        }

                                                    </div>

                                                </div>


                                                <div className="col-6">

                                                    <div
                                                        className="rounded-3 p-2 text-truncate"
                                                        style={{
                                                            backgroundColor:
                                                                "#f7f7f4",
                                                        }}
                                                    >

                                                        <Car
                                                            size={14}
                                                            className="text-warning me-1"
                                                        />

                                                        {vehicle
                                                            ? `${vehicle.brand} ${vehicle.model}`
                                                            : "Vehicle"}

                                                    </div>

                                                </div>

                                            </div>


                                            {/* VEHICLE NUMBER */}

                                            {vehicle && (

                                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">

                                                    <small className="text-muted">
                                                        Vehicle
                                                    </small>

                                                    <span className="fw-bold small">

                                                        {
                                                            vehicle.vehicle_number
                                                        }

                                                    </span>

                                                </div>

                                            )}
                                            {/* =========================
    PAYMENT / REFUND STATUS
========================= */}

                                            {tab === "cancelled" && (

                                                <div className="mt-3">

                                                    {payment ? (

                                                        isRefunded ? (

                                                            <div
                                                                className="rounded-3 p-3"
                                                                style={{
                                                                    backgroundColor:
                                                                        "#eaf7ee",
                                                                    border:
                                                                        "1px solid #b7dfc2",
                                                                }}
                                                            >

                                                                <div className="d-flex justify-content-between align-items-start gap-3">

                                                                    <div>

                                                                        <div className="d-flex align-items-center gap-2 mb-1">

                                                                            <CheckCircle2
                                                                                size={17}
                                                                                className="text-success"
                                                                            />

                                                                            <span className="fw-bold text-success">
                                    Payment Refunded
                                </span>

                                                                        </div>

                                                                        <small className="text-muted">
                                                                            Your payment has been
                                                                            refunded successfully.
                                                                        </small>

                                                                    </div>


                                                                    <div className="text-end">

                                                                        <small className="text-muted d-block">
                                                                            REFUND
                                                                        </small>

                                                                        <strong>
                                                                            Rs.{" "}
                                                                            {payment.amount ??
                                                                                ride?.fee_per_seat}
                                                                        </strong>

                                                                    </div>

                                                                </div>


                                                                {payment.refunded_at && (

                                                                    <div className="mt-2 pt-2 border-top">

                                                                        <small className="text-muted">

                                                                            Refunded on{" "}

                                                                            {new Date(
                                                                                payment.refunded_at
                                                                            ).toLocaleString(
                                                                                "en-GB",
                                                                                {
                                                                                    day: "2-digit",
                                                                                    month: "short",
                                                                                    year: "numeric",
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                }
                                                                            )}

                                                                        </small>

                                                                    </div>

                                                                )}

                                                            </div>

                                                        ) : (

                                                            <div
                                                                className="rounded-3 p-3"
                                                                style={{
                                                                    backgroundColor:
                                                                        "#fff8e1",
                                                                    border:
                                                                        "1px solid #ffe08a",
                                                                }}
                                                            >

                                                                <div className="d-flex align-items-center gap-2">

                                                                    <Banknote
                                                                        size={17}
                                                                        className="text-warning"
                                                                    />

                                                                    <div>

                                                                        <small className="text-muted d-block">
                                                                            PAYMENT STATUS
                                                                        </small>

                                                                        <strong>
                                                                            {payment.payment_status}
                                                                        </strong>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        )

                                                    ) : (

                                                        <div
                                                            className="rounded-3 p-3"
                                                            style={{
                                                                backgroundColor:
                                                                    "#f7f7f4",
                                                                border:
                                                                    "1px solid #eeeeea",
                                                            }}
                                                        >

                                                            <div className="d-flex align-items-center gap-2">

                                                                <Banknote
                                                                    size={17}
                                                                    className="text-muted"
                                                                />

                                                                <div>

                                                                    <small className="text-muted d-block">
                                                                        PAYMENT
                                                                    </small>

                                                                    <span className="fw-semibold">
                                                                        No payment was made
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    )}

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

        </div>
    );
};


export default RideHistory;