import React, {
    useEffect,
} from "react";

import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
} from "react-leaflet";

import {
    MapPin,
    Navigation,
    Loader2,
} from "lucide-react";


// ==============================
// MAP CONTROLLER
// ==============================

const MapController = ({
                           start,
                           destination,
                       }) => {

    const map =
        useMap();


    useEffect(() => {

        if (
            start &&
            destination
        ) {

            map.fitBounds(
                [
                    [
                        start.latitude,
                        start.longitude,
                    ],

                    [
                        destination.latitude,
                        destination.longitude,
                    ],
                ],
                {
                    padding:
                        [50, 50],
                }
            );

            return;
        }


        if (start) {

            map.setView(
                [
                    start.latitude,
                    start.longitude,
                ],
                14
            );
        }


        if (destination) {

            map.setView(
                [
                    destination.latitude,
                    destination.longitude,
                ],
                14
            );
        }

    }, [
        start,
        destination,
        map,
    ]);


    return null;
};


// ==============================
// ROUTE PREVIEW
// ==============================

const RoutePreview = ({
                          formData,
                          saving,
                          vehiclesLength,
                          fareEstimate,
                      }) => {

    return (

        <div className="card border-0 shadow-sm">

            <div
                style={{
                    height: "4px",
                    backgroundColor: "#ffc107",
                }}
            />


            <div className="card-body p-4">

                <div className="mb-3">

                    <h5
                        className="fw-bold mb-1"
                        style={{
                            color:
                                "#0d6efd",
                        }}
                    >
                        Route Preview
                    </h5>

                    <p className="text-muted small mb-0">

                        Preview the selected start
                        and destination on the map.

                    </p>

                </div>


                <div
                    style={{
                        height: "500px",
                        borderRadius:
                            "14px",
                        overflow:
                            "hidden",

                        border:
                            "1px solid #e6e6e6",
                    }}
                >

                    <MapContainer
                        center={[
                            7.8731,
                            80.7718,
                        ]}
                        zoom={8}
                        style={{
                            height:
                                "100%",

                            width:
                                "100%",
                        }}
                    >

                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />


                        <MapController
                            start={
                                formData
                                    .startLatitude !==
                                null
                                    ? {
                                        latitude:
                                        formData
                                            .startLatitude,

                                        longitude:
                                        formData
                                            .startLongitude,
                                    }
                                    : null
                            }
                            destination={
                                formData
                                    .destinationLatitude !==
                                null
                                    ? {
                                        latitude:
                                        formData
                                            .destinationLatitude,

                                        longitude:
                                        formData
                                            .destinationLongitude,
                                    }
                                    : null
                            }
                        />


                        {formData.startLatitude !==
                            null && (

                                <Marker
                                    position={[
                                        formData
                                            .startLatitude,

                                        formData
                                            .startLongitude,
                                    ]}
                                />

                            )}


                        {formData
                                .destinationLatitude !==
                            null && (

                                <Marker
                                    position={[
                                        formData
                                            .destinationLatitude,

                                        formData
                                            .destinationLongitude,
                                    ]}
                                />

                            )}

                    </MapContainer>

                </div>


                {/* COORDINATES */}

                <div className="row g-3 mt-2">

                    <div className="col-md-6">

                        <div
                            className="p-3 rounded-3 h-100"
                            style={{
                                backgroundColor:
                                    "#fff8db",
                            }}
                        >

                            <div className="d-flex align-items-center gap-2">

                                <MapPin
                                    size={16}
                                    className="text-warning"
                                />

                                <strong>
                                    Start
                                </strong>

                            </div>


                            <div className="small text-muted mt-2">

                                {formData.startLatitude !==
                                null
                                    ? `${formData.startLatitude.toFixed(
                                        6
                                    )}, ${formData.startLongitude.toFixed(
                                        6
                                    )}`
                                    : "Not selected"}

                            </div>

                        </div>

                    </div>


                    <div className="col-md-6">

                        <div
                            className="p-3 rounded-3 h-100"
                            style={{
                                backgroundColor:
                                    "#f5f9ff",
                            }}
                        >

                            <div className="d-flex align-items-center gap-2">

                                <Navigation
                                    size={16}
                                    className="text-primary"
                                />

                                <strong>
                                    Destination
                                </strong>

                            </div>


                            <div className="small text-muted mt-2">

                                {formData
                                    .destinationLatitude !==
                                null
                                    ? `${formData.destinationLatitude.toFixed(
                                        6
                                    )}, ${formData.destinationLongitude.toFixed(
                                        6
                                    )}`
                                    : "Not selected"}

                            </div>

                        </div>

                    </div>

                </div>


                {/* CREATE */}

                <button
                    type="submit"
                    className="btn btn-warning w-100 fw-bold py-3 mt-4"
                    disabled={
                        saving ||
                        vehiclesLength === 0 ||
                        !fareEstimate
                    }
                >

                    {saving ? (

                        <>
                            <Loader2
                                size={18}
                                className="me-2"
                            />

                            Creating Ride...
                        </>

                    ) : (

                        "Create Ride"

                    )}

                </button>


                {!fareEstimate && (

                    <small className="text-muted d-block text-center mt-2">

                        Calculate the suggested
                        fare before creating the
                        ride.

                    </small>

                )}

            </div>

        </div>
    );
};


export default RoutePreview;