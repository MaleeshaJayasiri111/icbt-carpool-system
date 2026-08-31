import React from "react";

import {
    Banknote,
    Loader2,
    TrendingUp,
} from "lucide-react";


const FareCalculator = ({
                            formData,
                            fareEstimate,
                            fareLoading,
                            fareError,
                            handleCalculateFare,
                        }) => {

    const canCalculate =
        formData.vehicleId &&
        formData.startLatitude !== null &&
        formData.startLongitude !== null &&
        formData.destinationLatitude !== null &&
        formData.destinationLongitude !== null;


    return (

        <div className="card border-0 shadow-sm mb-4">

            <div
                style={{
                    height: "4px",
                    backgroundColor: "#0d6efd",
                }}
            />


            <div className="card-body p-4">

                <div className="d-flex align-items-center gap-2 mb-3">

                    <div
                        className="rounded-3 d-flex justify-content-center align-items-center"
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor:
                                "#fff3cd",
                        }}
                    >
                        <Banknote
                            size={20}
                            className="text-warning"
                        />
                    </div>


                    <div>

                        <h5
                            className="fw-bold mb-0"
                            style={{
                                color:
                                    "#0d6efd",
                            }}
                        >
                            Fare Suggestion
                        </h5>

                        <small className="text-muted">
                            Calculate a fair passenger
                            contribution.
                        </small>

                    </div>

                </div>


                <button
                    type="button"
                    className="btn btn-primary w-100 fw-semibold py-3"
                    onClick={
                        handleCalculateFare
                    }
                    disabled={
                        fareLoading ||
                        !canCalculate
                    }
                >

                    {fareLoading ? (

                        <>
                            <Loader2
                                size={18}
                                className="me-2"
                            />

                            Calculating...
                        </>

                    ) : (

                        <>
                            <TrendingUp
                                size={18}
                                className="me-2"
                            />

                            Calculate Suggested Fare
                        </>

                    )}

                </button>


                {fareError && (

                    <div className="alert alert-danger mt-3 mb-0">
                        {fareError}
                    </div>

                )}


                {fareEstimate && (

                    <div className="mt-4">

                        {/* RECOMMENDED */}

                        <div
                            className="rounded-4 p-4 text-center mb-3"
                            style={{
                                backgroundColor:
                                    "#fff8db",

                                border:
                                    "1px solid #ffe58f",
                            }}
                        >

                            <small
                                className="fw-bold"
                                style={{
                                    color:
                                        "#0d6efd",

                                    letterSpacing:
                                        "1px",
                                }}
                            >
                                RECOMMENDED CONTRIBUTION
                            </small>


                            <h2
                                className="fw-bold my-2"
                                style={{
                                    color:
                                        "#0d6efd",
                                }}
                            >

                                Rs.{" "}
                                {
                                    fareEstimate
                                        .pricing
                                        .suggestedFare
                                }

                            </h2>

                            <span className="text-muted">
                                per passenger
                            </span>

                        </div>


                        {/* DETAILS */}

                        <div className="row g-3">

                            <div className="col-6">

                                <div
                                    className="rounded-3 p-3 h-100"
                                    style={{
                                        backgroundColor:
                                            "#f5f9ff",
                                    }}
                                >

                                    <small className="text-muted d-block">
                                        Estimated Distance
                                    </small>

                                    <strong
                                        style={{
                                            color:
                                                "#0d6efd",
                                        }}
                                    >
                                        {
                                            fareEstimate
                                                .distance
                                                .estimatedDistanceKm
                                        } km
                                    </strong>

                                </div>

                            </div>


                            <div className="col-6">

                                <div
                                    className="rounded-3 p-3 h-100"
                                    style={{
                                        backgroundColor:
                                            "#f5f9ff",
                                    }}
                                >

                                    <small className="text-muted d-block">
                                        Rate Per Km
                                    </small>

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
                                                .ratePerKm
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="col-6">

                                <div
                                    className="rounded-3 p-3 h-100"
                                    style={{
                                        backgroundColor:
                                            "#f8f9fa",
                                    }}
                                >

                                    <small className="text-muted d-block">
                                        Trip Cost
                                    </small>

                                    <strong>
                                        Rs.{" "}
                                        {
                                            fareEstimate
                                                .pricing
                                                .estimatedTripCost
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="col-6">

                                <div
                                    className="rounded-3 p-3 h-100"
                                    style={{
                                        backgroundColor:
                                            "#f8f9fa",
                                    }}
                                >

                                    <small className="text-muted d-block">
                                        Base Share
                                    </small>

                                    <strong>
                                        Rs.{" "}
                                        {
                                            fareEstimate
                                                .pricing
                                                .baseContribution
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* RANGE */}

                        <div
                            className="rounded-4 p-3 mt-3"
                            style={{
                                border:
                                    "1px solid #dbeafe",
                            }}
                        >

                            <small className="text-muted fw-semibold">
                                Allowed Contribution Range
                            </small>


                            <div className="row text-center mt-3">

                                <div className="col-4">

                                    <small className="text-muted d-block">
                                        Minimum
                                    </small>

                                    <strong>
                                        Rs.{" "}
                                        {
                                            fareEstimate
                                                .pricing
                                                .minimumFare
                                        }
                                    </strong>

                                    <small className="text-muted d-block">
                                        +
                                        {
                                            fareEstimate
                                                .pricing
                                                .incentives
                                                .minimum
                                        }
                                        %
                                    </small>

                                </div>


                                <div className="col-4 border-start border-end">

                                    <small
                                        className="fw-bold d-block"
                                        style={{
                                            color:
                                                "#0d6efd",
                                        }}
                                    >
                                        Recommended
                                    </small>

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
                                                .suggestedFare
                                        }
                                    </strong>

                                    <small className="text-muted d-block">

                                        +
                                        {
                                            fareEstimate
                                                .pricing
                                                .incentives
                                                .recommended
                                        }
                                        %

                                    </small>

                                </div>


                                <div className="col-4">

                                    <small className="text-muted d-block">
                                        Maximum
                                    </small>

                                    <strong>
                                        Rs.{" "}
                                        {
                                            fareEstimate
                                                .pricing
                                                .maximumFare
                                        }
                                    </strong>

                                    <small className="text-muted d-block">

                                        +
                                        {
                                            fareEstimate
                                                .pricing
                                                .incentives
                                                .maximum
                                        }
                                        %

                                    </small>

                                </div>

                            </div>

                        </div>


                        <div
                            className="rounded-3 p-3 mt-3 small"
                            style={{
                                backgroundColor:
                                    "#f5f9ff",

                                borderLeft:
                                    "4px solid #ffc107",
                            }}
                        >

                            Fare uses the registered
                            vehicle capacity of{" "}

                            <strong>
                                {
                                    fareEstimate
                                        .vehicle
                                        .seatCapacity
                                } seats
                            </strong>

                            , including the driver.
                            Offering fewer passenger
                            seats does not increase
                            the suggested fare.

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
};


export default FareCalculator;