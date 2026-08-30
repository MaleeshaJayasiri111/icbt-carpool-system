import React, {
    useEffect,
    useState,
} from "react";

import {
    MapPin,
    Navigation,
    CalendarDays,
    Clock,
    Users,
    Banknote,
    Car,
    XCircle,
    CheckCircle2,
    Loader2,
    Route,
    Pencil,
    Eye,
    X,
} from "lucide-react";

import {
    getMyRides,
    cancelRide,
    completeRide,
    updateRide,
    getRidePassengers,
} from "../../services/rideService";
import {useNavigate} from "react-router-dom";

const MyRides = () => {

    const navigate = useNavigate();
    const [rides, setRides] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(null);

    const [editingRide, setEditingRide] =
        useState(null);

    const [editForm, setEditForm] =
        useState({
            rideDate: "",
            departureTime: "",
            totalSeats: "",
            feePerSeat: "",
        });

    const [editSaving, setEditSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [filter, setFilter] =
        useState("all");

    const [showPassengers, setShowPassengers] =
        useState(false);

    const [passengers, setPassengers] =
        useState([]);

    const [passengersLoading, setPassengersLoading] =
        useState(false);

    const [selectedRide, setSelectedRide] =
        useState(null);


    // ==========================
    // LOAD RIDES
    // ==========================

    const loadRides = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getMyRides();

            console.log(
                "My rides:",
                response
            );

            setRides(
                response.data || []
            );

        } catch (err) {

            console.error(
                "Ride loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load rides."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadRides();

    }, []);

    const handleCancelRide =
        async (rideId) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to cancel this ride?"
                );

            if (!confirmed) {
                return;
            }


            try {

                setActionLoading(rideId);

                setError("");
                setSuccess("");

                await cancelRide(rideId);

                setSuccess(
                    "Ride cancelled successfully."
                );

                await loadRides();

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Unable to cancel ride."
                );

            } finally {

                setActionLoading(null);
            }
        };


    // ==========================
    // COMPLETE RIDE
    // ==========================

    const handleCompleteRide =
        async (rideId) => {

            const confirmed =
                window.confirm(
                    "Mark this ride as completed?"
                );

            if (!confirmed) {
                return;
            }


            try {

                setActionLoading(rideId);

                setError("");
                setSuccess("");

                await completeRide(rideId);

                setSuccess(
                    "Ride completed successfully."
                );

                await loadRides();

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Unable to complete ride."
                );

            } finally {

                setActionLoading(null);
            }
        };

    const handleOpenEdit = (ride) => {

        setEditingRide(ride);

        setEditForm({
            rideDate:
                ride.ride_date || "",

            departureTime:
                ride.departure_time?.slice(0, 5) || "",

            totalSeats:
                ride.total_seats || "",

            feePerSeat:
                ride.fee_per_seat || "",
        });

        setError("");
        setSuccess("");
    };

    const handleEditChange = (e) => {

        const { name, value } =
            e.target;

        setEditForm({
            ...editForm,
            [name]: value,
        });
    };

    const handleUpdateRide = async (e) => {

        e.preventDefault();

        if (!editingRide) {
            return;
        }

        try {

            setEditSaving(true);
            setError("");
            setSuccess("");


            const payload = {

                rideDate:
                editForm.rideDate,

                departureTime:
                editForm.departureTime,

                totalSeats:
                    Number(
                        editForm.totalSeats
                    ),

                feePerSeat:
                    Number(
                        editForm.feePerSeat
                    ),
            };


            await updateRide(
                editingRide.id,
                payload
            );


            setSuccess(
                "Ride updated successfully."
            );

            setEditingRide(null);

            await loadRides();


        } catch (err) {

            console.error(
                "Ride update error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to update ride."
            );

        } finally {

            setEditSaving(false);
        }
    };

    //--------------
    // view passengers
    const handleViewPassengers = async (
        ride
    ) => {

        try {

            setSelectedRide(ride);

            setShowPassengers(true);

            setPassengersLoading(true);

            setPassengers([]);

            setError("");


            const response =
                await getRidePassengers(
                    ride.id
                );


            console.log(
                "Ride passengers:",
                response
            );


            setPassengers(
                response.data || []
            );


        } catch (err) {

            console.error(
                "Passenger loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load passengers."
            );

        } finally {

            setPassengersLoading(false);
        }
    };

    // ==========================
    // FILTER
    // ==========================

    const filteredRides =
        filter === "all"
            ? rides
            : rides.filter(
                (ride) =>
                    ride.status === filter
            );


    // ==========================
    // STATUS STYLE
    // ==========================

    const getStatusBadge =
        (status) => {

            switch (status) {

                case "available":
                    return "bg-success";

                case "full":
                    return "bg-warning text-dark";

                case "completed":
                    return "bg-primary";

                case "cancelled":
                    return "bg-danger";

                default:
                    return "bg-secondary";
            }
        };


    // ==========================
    // DATE FORMAT
    // ==========================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString();
    };


    return (

        <div className="container-fluid p-4 p-md-5">


            {/* HEADER */}

            <div className="mb-4">

                <h2 className="fw-bold mb-1">
                    My Rides
                </h2>

                <p className="text-muted mb-0">
                    View and manage the rides
                    you have created.
                </p>

            </div>


            {/* MESSAGES */}

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


            {/* FILTERS */}

            <div className="d-flex flex-wrap gap-2 mb-4">

                {[
                    "all",
                    "available",
                    "full",
                    "completed",
                    "cancelled",
                ].map((status) => (

                    <button
                        key={status}
                        type="button"
                        className={
                            filter === status
                                ? "btn btn-warning fw-semibold"
                                : "btn btn-outline-dark"
                        }
                        onClick={() =>
                            setFilter(status)
                        }
                    >

                        {status
                                .charAt(0)
                                .toUpperCase() +
                            status.slice(1)}

                    </button>

                ))}

            </div>


            {/* LOADING */}

            {loading ? (

                <div className="text-center py-5">

                    <Loader2
                        size={35}
                        className="mb-2"
                    />

                    <p className="text-muted">
                        Loading rides...
                    </p>

                </div>

            ) : filteredRides.length === 0 ? (

                // EMPTY

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <Route
                            size={55}
                            className="text-warning mb-3"
                        />

                        <h5 className="fw-bold">
                            No Rides Found
                        </h5>

                        <p className="text-muted mb-0">

                            {filter === "all"
                                ? "You have not created any rides yet."
                                : `You don't have any ${filter} rides.`}

                        </p>

                    </div>

                </div>

            ) : (

                // RIDES

                <div className="row g-4">

                    {filteredRides.map(
                        (ride) => (

                            <div
                                key={ride.id}
                                className="col-xl-6"
                            >

                                <div className="card border-0 shadow-sm h-100">

                                    <div className="card-body p-4">


                                        {/* TOP */}

                                        <div className="d-flex justify-content-between align-items-start mb-4">

                                            <div>

                                                <h5 className="fw-bold mb-1">

                                                    {
                                                        ride.start_location
                                                    }

                                                    {" → "}

                                                    {
                                                        ride.destination
                                                    }

                                                </h5>

                                                <small className="text-muted">

                                                    Ride ID:{" "}

                                                    {ride.id?.slice(
                                                        0,
                                                        8
                                                    )}

                                                </small>

                                            </div>


                                            <span
                                                className={`badge ${getStatusBadge(
                                                    ride.status
                                                )}`}
                                            >

                                                {
                                                    ride.status
                                                }

                                            </span>

                                        </div>


                                        {/* ROUTE */}

                                        <div className="bg-light rounded-3 p-3 mb-3">

                                            <div className="d-flex align-items-center gap-3 mb-3">

                                                <MapPin
                                                    size={20}
                                                    className="text-success"
                                                />

                                                <div>

                                                    <small className="text-muted d-block">
                                                        Start
                                                    </small>

                                                    <strong>
                                                        {
                                                            ride.start_location
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="d-flex align-items-center gap-3">

                                                <Navigation
                                                    size={20}
                                                    className="text-danger"
                                                />

                                                <div>

                                                    <small className="text-muted d-block">
                                                        Destination
                                                    </small>

                                                    <strong>
                                                        {
                                                            ride.destination
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>


                                        {/* DETAILS */}

                                        <div className="row g-3 small">


                                            <div className="col-md-6">

                                                <div className="d-flex align-items-center gap-2">

                                                    <CalendarDays
                                                        size={17}
                                                        className="text-warning"
                                                    />

                                                    <span>

                                                        {formatDate(
                                                            ride.ride_date
                                                        )}

                                                    </span>

                                                </div>

                                            </div>


                                            <div className="col-md-6">

                                                <div className="d-flex align-items-center gap-2">

                                                    <Clock
                                                        size={17}
                                                        className="text-warning"
                                                    />

                                                    <span>

                                                        {
                                                            ride.departure_time
                                                        }

                                                    </span>

                                                </div>

                                            </div>


                                            <div className="col-md-6">

                                                <div className="d-flex align-items-center gap-2">

                                                    <Users
                                                        size={17}
                                                        className="text-warning"
                                                    />

                                                    <span>

                                                        {
                                                            ride.available_seats
                                                        }

                                                        {" / "}

                                                        {
                                                            ride.total_seats
                                                        }

                                                        {" seats available"}

                                                    </span>

                                                </div>

                                            </div>


                                            <div className="col-md-6">

                                                <div className="d-flex align-items-center gap-2">

                                                    <Banknote
                                                        size={17}
                                                        className="text-warning"
                                                    />

                                                    <span>

                                                        Rs.{" "}

                                                        {
                                                            ride.fee_per_seat
                                                        }

                                                        {" / seat"}

                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        {/* VEHICLE */}

                                        {ride.vehicles && (

                                            <div className="border-top mt-4 pt-3">

                                                <div className="d-flex align-items-center gap-2">

                                                    <Car
                                                        size={18}
                                                        className="text-warning"
                                                    />

                                                    <span className="fw-semibold">

                                                        {
                                                            ride.vehicles.brand
                                                        }

                                                        {" "}

                                                        {
                                                            ride.vehicles.model
                                                        }

                                                        {" - "}

                                                        {
                                                            ride.vehicles.vehicle_number
                                                        }

                                                    </span>

                                                </div>

                                            </div>

                                        )}


                                        {/* ACTIONS */}

                                        {[
                                            "available",
                                            "full",
                                        ].includes(
                                            ride.status
                                        ) && (

                                            <div className="d-flex flex-wrap gap-2 border-top mt-4 pt-3">

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark btn-sm"
                                                    onClick={() =>
                                                        handleOpenEdit(ride)
                                                    }
                                                >
                                                    <Pencil
                                                        size={16}
                                                        className="me-1"
                                                    />

                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() =>
                                                        navigate(
                                                            `/driver/rides/${ride.id}/passengers`
                                                        )
                                                    }
                                                >
                                                    Passengers
                                                </button>


                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    disabled={
                                                        actionLoading ===
                                                        ride.id
                                                    }
                                                    onClick={() =>
                                                        handleCancelRide(
                                                            ride.id
                                                        )
                                                    }
                                                >

                                                    <XCircle
                                                        size={16}
                                                        className="me-1"
                                                    />

                                                    Cancel

                                                </button>


                                                <button
                                                    type="button"
                                                    className="btn btn-outline-success btn-sm"
                                                    disabled={
                                                        actionLoading ===
                                                        ride.id
                                                    }
                                                    onClick={() =>
                                                        handleCompleteRide(
                                                            ride.id
                                                        )
                                                    }
                                                >

                                                    <CheckCircle2
                                                        size={16}
                                                        className="me-1"
                                                    />

                                                    Complete

                                                </button>


                                                {actionLoading ===
                                                    ride.id && (

                                                        <Loader2
                                                            size={18}
                                                        />

                                                    )}

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

            {editingRide && (

                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                        backgroundColor:
                            "rgba(0,0,0,0.5)",

                        zIndex: 1050,
                    }}
                >

                    <div
                        className="card border-0 shadow-lg"
                        style={{
                            width: "90%",
                            maxWidth: "550px",
                        }}
                    >

                        <div className="card-body p-4">


                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <div>

                                    <h5 className="fw-bold mb-1">
                                        Edit Ride
                                    </h5>

                                    <small className="text-muted">

                                        {
                                            editingRide.start_location
                                        }

                                        {" → "}

                                        {
                                            editingRide.destination
                                        }

                                    </small>

                                </div>


                                <button
                                    type="button"
                                    className="btn btn-light btn-sm"
                                    onClick={() =>
                                        setEditingRide(null)
                                    }
                                >
                                    <X size={20} />
                                </button>

                            </div>


                            <form
                                onSubmit={
                                    handleUpdateRide
                                }
                            >

                                <div className="row g-3">


                                    <div className="col-md-6">

                                        <label className="form-label fw-semibold">
                                            Ride Date
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            name="rideDate"
                                            value={
                                                editForm.rideDate
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="col-md-6">

                                        <label className="form-label fw-semibold">
                                            Departure Time
                                        </label>

                                        <input
                                            type="time"
                                            className="form-control"
                                            name="departureTime"
                                            value={
                                                editForm.departureTime
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="col-md-6">

                                        <label className="form-label fw-semibold">
                                            Total Seats
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control"
                                            name="totalSeats"
                                            value={
                                                editForm.totalSeats
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="col-md-6">

                                        <label className="form-label fw-semibold">
                                            Fee Per Seat
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="form-control"
                                            name="feePerSeat"
                                            value={
                                                editForm.feePerSeat
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />

                                    </div>

                                </div>


                                <div className="d-flex justify-content-end gap-2 mt-4">

                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() =>
                                            setEditingRide(null)
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="btn btn-warning fw-semibold"
                                        disabled={
                                            editSaving
                                        }
                                    >

                                        {editSaving
                                            ? "Updating..."
                                            : "Update Ride"}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default MyRides;