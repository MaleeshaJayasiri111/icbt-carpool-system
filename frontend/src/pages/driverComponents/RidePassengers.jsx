import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, Loader2 } from "lucide-react";
import { getRidePassengers } from "../../services/rideService";

const RidePassengers = () => {
    const { rideId } = useParams();
    const navigate = useNavigate();

    const [passengers, setPassengers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPassengers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getRidePassengers(rideId);

            console.log("Passengers:", response);

            setPassengers(response.data || []);
        } catch (err) {
            console.error("Passenger loading error:", err);

            console.log("Backend response:", err.response?.data);

            setError(
                err.response?.data?.message || "Unable to load passengers."
            );
        } finally {
            setLoading(false);
        }
    }, [rideId]);

    useEffect(() => {
        loadPassengers();
    }, [loadPassengers]);

    return (
        <div className="container-fluid p-4 p-md-5">
            {/* HEADER */}
            <div className="d-flex align-items-center gap-3 mb-4">
                <button
                    className="btn btn-light"
                    onClick={() => navigate("/driver/rides")}
                >
                    <ArrowLeft size={18} />
                </button>

                <div>
                    <h2 className="fw-bold mb-1">Ride Passengers</h2>
                    <p className="text-muted mb-0">
                        View confirmed passengers for this ride.
                    </p>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <Loader2 size={35} className="animate-spin mb-2" />
                    <p className="text-muted mt-2">Loading passengers...</p>
                </div>
            ) : passengers.length === 0 ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <Users size={50} className="text-warning mb-3" />
                        <h5 className="fw-bold">No Passengers Yet</h5>
                        <p className="text-muted mb-0">
                            No confirmed passengers have joined this ride.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {passengers.map((booking) => {
                        const passenger = booking.users;

                        return (
                            <div key={booking.id} className="col-md-6 col-lg-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center gap-3">
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
                                                        passenger?.fullName ||
                                                        "Passenger"}
                                                </h6>

                                                <div className="small text-muted">
                                                    {passenger?.email}
                                                </div>

                                                <div className="small text-muted">
                                                    {passenger?.phone}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <span className="badge bg-success">
                                                Confirmed
                                            </span>
                                        </div>
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

export default RidePassengers;