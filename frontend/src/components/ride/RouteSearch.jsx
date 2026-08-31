import React from "react";

import {
    MapPin,
    Navigation,
    Search,
    Loader2,
} from "lucide-react";


const RouteSearch = ({
                         formData,
                         setFormData,

                         startSearch,
                         setStartSearch,

                         destinationSearch,
                         setDestinationSearch,

                         startResults,
                         destinationResults,

                         searchingLocation,

                         searchLocation,
                         selectLocation,
                     }) => {

    return (

        <div className="card border-0 shadow-sm mb-4">

            <div
                style={{
                    height: "4px",
                    backgroundColor: "#0d6efd",
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
                        Route Details
                    </h5>

                    <small className="text-muted">
                        Search and select the exact
                        start and destination.
                    </small>

                </div>


                {/* START */}

                <div className="mb-4">

                    <label className="form-label fw-semibold">

                        <MapPin
                            size={17}
                            className="me-2 text-warning"
                        />

                        Start Location

                    </label>


                    <div className="input-group">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search start location..."
                            value={
                                startSearch
                            }
                            onChange={(e) => {

                                setStartSearch(
                                    e.target.value
                                );

                                setFormData(
                                    (prev) => ({
                                        ...prev,

                                        startLocation:
                                            "",

                                        startLatitude:
                                            null,

                                        startLongitude:
                                            null,
                                    })
                                );
                            }}
                            onKeyDown={(e) => {

                                if (
                                    e.key ===
                                    "Enter"
                                ) {

                                    e.preventDefault();

                                    searchLocation(
                                        "start"
                                    );
                                }
                            }}
                        />


                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() =>
                                searchLocation(
                                    "start"
                                )
                            }
                            disabled={
                                searchingLocation ===
                                "start"
                            }
                        >

                            {searchingLocation ===
                            "start" ? (

                                <Loader2
                                    size={17}
                                />

                            ) : (

                                <Search
                                    size={17}
                                />

                            )}

                        </button>

                    </div>


                    {startResults.length >
                        0 && (

                            <div
                                className="list-group mt-2 shadow-sm"
                                style={{
                                    maxHeight:
                                        "220px",

                                    overflowY:
                                        "auto",
                                }}
                            >

                                {startResults.map(
                                    (location) => (

                                        <button
                                            type="button"
                                            key={
                                                location.place_id
                                            }
                                            className="list-group-item list-group-item-action text-start"
                                            onClick={() =>
                                                selectLocation(
                                                    "start",
                                                    location
                                                )
                                            }
                                        >

                                            <MapPin
                                                size={14}
                                                className="me-2 text-warning"
                                            />

                                            {
                                                location
                                                    .display_name
                                            }

                                        </button>

                                    )
                                )}

                            </div>

                        )}


                    {formData.startLatitude !==
                        null && (

                            <div
                                className="small fw-semibold mt-2"
                                style={{
                                    color:
                                        "#0d6efd",
                                }}
                            >
                                ✓ Start location selected
                            </div>

                        )}

                </div>


                {/* DESTINATION */}

                <div>

                    <label className="form-label fw-semibold">

                        <Navigation
                            size={17}
                            className="me-2 text-primary"
                        />

                        Destination

                    </label>


                    <div className="input-group">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search destination..."
                            value={
                                destinationSearch
                            }
                            onChange={(e) => {

                                setDestinationSearch(
                                    e.target.value
                                );

                                setFormData(
                                    (prev) => ({
                                        ...prev,

                                        destination:
                                            "",

                                        destinationLatitude:
                                            null,

                                        destinationLongitude:
                                            null,
                                    })
                                );
                            }}
                            onKeyDown={(e) => {

                                if (
                                    e.key ===
                                    "Enter"
                                ) {

                                    e.preventDefault();

                                    searchLocation(
                                        "destination"
                                    );
                                }
                            }}
                        />


                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                                searchLocation(
                                    "destination"
                                )
                            }
                            disabled={
                                searchingLocation ===
                                "destination"
                            }
                        >

                            {searchingLocation ===
                            "destination" ? (

                                <Loader2
                                    size={17}
                                />

                            ) : (

                                <Search
                                    size={17}
                                />

                            )}

                        </button>

                    </div>


                    {destinationResults.length >
                        0 && (

                            <div
                                className="list-group mt-2 shadow-sm"
                                style={{
                                    maxHeight:
                                        "220px",

                                    overflowY:
                                        "auto",
                                }}
                            >

                                {destinationResults.map(
                                    (location) => (

                                        <button
                                            type="button"
                                            key={
                                                location.place_id
                                            }
                                            className="list-group-item list-group-item-action text-start"
                                            onClick={() =>
                                                selectLocation(
                                                    "destination",
                                                    location
                                                )
                                            }
                                        >

                                            <Navigation
                                                size={14}
                                                className="me-2 text-primary"
                                            />

                                            {
                                                location
                                                    .display_name
                                            }

                                        </button>

                                    )
                                )}

                            </div>

                        )}


                    {formData
                            .destinationLatitude !==
                        null && (

                            <div
                                className="small fw-semibold mt-2"
                                style={{
                                    color:
                                        "#0d6efd",
                                }}
                            >
                                ✓ Destination selected
                            </div>

                        )}

                </div>

            </div>

        </div>
    );
};


export default RouteSearch;