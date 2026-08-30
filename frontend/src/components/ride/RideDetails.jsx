import React from "react";

import {
    CalendarDays,
    Clock,
    Users,
    Banknote,
} from "lucide-react";


const RideDetails = ({
                         formData,
                         handleChange,
                         selectedVehicle,
                         fareEstimate,
                     }) => {

    const maximumPassengerSeats =
        fareEstimate
            ?.vehicle
            ?.maximumPassengerSeats ??
        (
            selectedVehicle
                ?.seat_capacity
                ? Math.max(
                    Number(
                        selectedVehicle
                            .seat_capacity
                    ) - 1,
                    1
                )
                : undefined
        );


    return (

        <div className="card border-0 shadow-sm mb-4">

            <div
                style={{
                    height: "4px",
                    backgroundColor: "#ffc107",
                }}
            />


            <div className="card-body p-4">

                <div className="mb-4">

                    <h5
                        className="fw-bold mb-1"
                        style={{
                            color: "#0d6efd",
                        }}
                    >
                        Ride Details
                    </h5>

                    <small className="text-muted">
                        Set your departure and
                        passenger availability.
                    </small>

                </div>


                <div className="row g-3">

                    {/* DATE */}

                    <div className="col-md-6">

                        <label className="form-label fw-semibold">
                            Ride Date
                        </label>


                        <div className="input-group">

                            <span className="input-group-text bg-white">

                                <CalendarDays
                                    size={17}
                                    className="text-primary"
                                />

                            </span>


                            <input
                                type="date"
                                className="form-control"
                                name="rideDate"
                                value={
                                    formData.rideDate
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                    </div>


                    {/* TIME */}

                    <div className="col-md-6">

                        <label className="form-label fw-semibold">
                            Departure Time
                        </label>


                        <div className="input-group">

                            <span className="input-group-text bg-white">

                                <Clock
                                    size={17}
                                    className="text-primary"
                                />

                            </span>


                            <input
                                type="time"
                                className="form-control"
                                name="departureTime"
                                value={
                                    formData
                                        .departureTime
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                    </div>


                    {/* SEATS */}

                    <div className="col-md-6">

                        <label className="form-label fw-semibold">
                            Seats Offered
                        </label>


                        <div className="input-group">

                            <span className="input-group-text bg-white">

                                <Users
                                    size={17}
                                    className="text-warning"
                                />

                            </span>


                            <input
                                type="number"
                                min="1"
                                max={
                                    maximumPassengerSeats
                                }
                                className="form-control"
                                name="totalSeats"
                                value={
                                    formData
                                        .totalSeats
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {selectedVehicle && (

                            <small className="text-muted d-block mt-1">

                                Maximum{" "}

                                <strong>
                                    {
                                        maximumPassengerSeats
                                    }
                                </strong>

                                {" "}passenger seats.

                            </small>

                        )}

                    </div>


                    {/* CONTRIBUTION */}

                    <div className="col-md-6">

                        <label className="form-label fw-semibold">
                            Passenger Contribution
                        </label>


                        <div className="input-group">

                            <span className="input-group-text bg-white">

                                <Banknote
                                    size={17}
                                    className="text-warning"
                                />

                            </span>


                            <input
                                type="number"
                                step="10"
                                className="form-control"
                                name="feePerSeat"
                                value={
                                    formData
                                        .feePerSeat
                                }
                                min={
                                    fareEstimate
                                        ?.pricing
                                        ?.minimumFare
                                }
                                max={
                                    fareEstimate
                                        ?.pricing
                                        ?.maximumFare
                                }
                                placeholder={
                                    fareEstimate
                                        ? `Recommended Rs. ${fareEstimate.pricing.suggestedFare}`
                                        : "Calculate fare first"
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    !fareEstimate
                                }
                                required
                            />

                        </div>


                        {!fareEstimate ? (

                            <small className="text-muted d-block mt-1">
                                Calculate the suggested
                                fare before choosing the
                                passenger contribution.
                            </small>

                        ) : (

                            <small className="text-muted d-block mt-1">

                                Allowed:{" "}

                                <strong
                                    style={{
                                        color:
                                            "#0d6efd",
                                    }}
                                >
                                    Rs.{" "}
                                    {
                                        fareEstimate
                                            .pricing
                                            .minimumFare
                                    }
                                </strong>

                                {" - "}

                                <strong
                                    style={{
                                        color:
                                            "#0d6efd",
                                    }}
                                >
                                    Rs.{" "}
                                    {
                                        fareEstimate
                                            .pricing
                                            .maximumFare
                                    }
                                </strong>

                            </small>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};


export default RideDetails;