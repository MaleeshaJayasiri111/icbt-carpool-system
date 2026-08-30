import React from "react";
import {
    Search,
    Car,
    Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PassengerDashboard = () => {

    const navigate = useNavigate();

    return (
        <div className="container-fluid p-4 p-md-5">

            <div className="mb-4">
                <h2 className="fw-bold">
                    Passenger Dashboard
                </h2>

                <p className="text-muted">
                    Find and manage your carpool rides.
                </p>
            </div>

            <div className="row g-4">

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">

                            <Search
                                size={35}
                                className="text-warning mb-3"
                            />

                            <h5 className="fw-bold">
                                Find a Ride
                            </h5>

                            <p className="text-muted">
                                Search for available rides
                                near your route.
                            </p>

                            <button
                                className="btn btn-warning"
                                onClick={() =>
                                    navigate(
                                        "/passenger/find-rides"
                                    )
                                }
                            >
                                Find Rides
                            </button>

                        </div>
                    </div>
                </div>


                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">

                            <Car
                                size={35}
                                className="text-warning mb-3"
                            />

                            <h5 className="fw-bold">
                                My Rides
                            </h5>

                            <p className="text-muted">
                                View requests, payments and
                                confirmed rides.
                            </p>

                            <button
                                className="btn btn-outline-dark"
                                onClick={() =>
                                    navigate(
                                        "/passenger/my-rides"
                                    )
                                }
                            >
                                View My Rides
                            </button>

                        </div>
                    </div>
                </div>


                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">

                            <Clock
                                size={35}
                                className="text-warning mb-3"
                            />

                            <h5 className="fw-bold">
                                Ride History
                            </h5>

                            <p className="text-muted">
                                View your previous and
                                cancelled rides.
                            </p>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default PassengerDashboard;