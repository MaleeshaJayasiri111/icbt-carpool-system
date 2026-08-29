import React, {
    useEffect,
    useState,
} from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
} from "react-leaflet";

import {
    MapPin,
    Navigation,
    Search,
    CalendarDays,
    Clock,
    Users,
    Banknote,
    Loader2,
    Car,
} from "lucide-react";

import {
    searchRides,
} from "../../services/rideService";

import {
    requestRide,
} from "../../services/bookingService";


// =====================================================
// MAP CONTROLLER
// Automatically moves map when locations are selected
// =====================================================

const MapController = ({
                           start,
                           destination,
                       }) => {

    const map = useMap();

    useEffect(() => {

        // If both locations are selected,
        // show both markers
        if (start && destination) {

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
                    padding: [50, 50],
                }
            );

            return;
        }


        // Only start selected
        if (start) {

            map.setView(
                [
                    start.latitude,
                    start.longitude,
                ],
                14
            );
        }


        // Only destination selected
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


// =====================================================
// MAIN PAGE
// =====================================================

const FindRides = () => {

    // -----------------------------
    // Search input text
    // -----------------------------

    const [
        startSearch,
        setStartSearch,
    ] = useState("");

    const [
        destinationSearch,
        setDestinationSearch,
    ] = useState("");


    // -----------------------------
    // Location suggestion results
    // -----------------------------

    const [
        startResults,
        setStartResults,
    ] = useState([]);

    const [
        destinationResults,
        setDestinationResults,
    ] = useState([]);


    // -----------------------------
    // Location search loading
    // -----------------------------

    const [
        searchingLocation,
        setSearchingLocation,
    ] = useState("");


    // -----------------------------
    // Actual data sent to backend
    // -----------------------------

    const [
        formData,
        setFormData,
    ] = useState({

        startLatitude: null,
        startLongitude: null,

        destinationLatitude: null,
        destinationLongitude: null,

        rideDate: "",
        preferredTime: "",
    });


    // -----------------------------
    // Matching rides
    // -----------------------------

    const [
        rides,
        setRides,
    ] = useState([]);

    const [
        searched,
        setSearched,
    ] = useState(false);


    // -----------------------------
    // Loading / messages
    // -----------------------------

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        requestingRide,
        setRequestingRide,
    ] = useState(null);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");


    // =====================================================
    // SEARCH LOCATION USING OPENSTREETMAP
    // =====================================================

    const searchLocation = async (type) => {

        const query =
            type === "start"
                ? startSearch
                : destinationSearch;


        if (!query.trim()) {

            setError(
                "Please enter a location to search."
            );

            return;
        }


        try {

            setError("");
            setSearchingLocation(type);


            const response =
                await fetch(
                    `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
                        query
                    )}&countrycodes=lk&limit=5`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Location search failed."
                );
            }


            const data =
                await response.json();


            if (type === "start") {

                setStartResults(data);

            } else {

                setDestinationResults(data);
            }


            if (data.length === 0) {

                setError(
                    "No locations found. Try another search."
                );
            }


        } catch (err) {

            console.error(
                "Location search error:",
                err
            );

            setError(
                "Unable to search location."
            );

        } finally {

            setSearchingLocation("");
        }
    };


    // =====================================================
    // SELECT LOCATION FROM SUGGESTIONS
    // =====================================================

    const selectLocation = (
        type,
        location
    ) => {

        const latitude =
            Number(location.lat);

        const longitude =
            Number(location.lon);


        if (type === "start") {

            setStartSearch(
                location.display_name
            );

            setFormData(
                (prev) => ({
                    ...prev,

                    startLatitude:
                    latitude,

                    startLongitude:
                    longitude,
                })
            );

            setStartResults([]);

        } else {

            setDestinationSearch(
                location.display_name
            );

            setFormData(
                (prev) => ({
                    ...prev,

                    destinationLatitude:
                    latitude,

                    destinationLongitude:
                    longitude,
                })
            );

            setDestinationResults([]);
        }


        setError("");
    };


    // =====================================================
    // SEARCH MATCHING RIDES
    // =====================================================

    const handleSearch = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // Start validation
        if (
            formData.startLatitude === null ||
            formData.startLongitude === null
        ) {

            setError(
                "Please search and select your start location."
            );

            return;
        }


        // Destination validation
        if (
            formData.destinationLatitude === null ||
            formData.destinationLongitude === null
        ) {

            setError(
                "Please search and select your destination."
            );

            return;
        }


        if (!formData.rideDate) {

            setError(
                "Please select a ride date."
            );

            return;
        }


        try {

            setLoading(true);
            setSearched(false);


            const payload = {

                startLatitude:
                formData.startLatitude,

                startLongitude:
                formData.startLongitude,

                destinationLatitude:
                formData.destinationLatitude,

                destinationLongitude:
                formData.destinationLongitude,

                rideDate:
                formData.rideDate,

                preferredTime:
                formData.preferredTime,
            };


            console.log(
                "Search payload:",
                payload
            );


            const response =
                await searchRides(
                    payload
                );


            console.log(
                "Matching rides:",
                response
            );


            setRides(
                response.data || []
            );

            setSearched(true);


        } catch (err) {

            console.error(
                "Ride search error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to search rides."
            );

            setRides([]);
            setSearched(true);

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // REQUEST TO JOIN
    // =====================================================

    const handleRequestRide = async (
        rideId
    ) => {

        try {

            setError("");
            setSuccess("");

            setRequestingRide(
                rideId
            );


            const response =
                await requestRide(
                    rideId
                );


            console.log(
                "Join request:",
                response
            );


            setSuccess(
                "Join request sent successfully. Waiting for driver approval."
            );


        } catch (err) {

            console.error(
                "Join request error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to request this ride."
            );

        } finally {

            setRequestingRide(null);
        }
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="container-fluid p-4 p-md-5">


            {/* ================= HEADER ================= */}

            <div className="mb-4">

                <h2 className="fw-bold mb-1">
                    Find Rides
                </h2>

                <p className="text-muted mb-0">
                    Search your start and destination
                    locations to find matching rides.
                </p>

            </div>


            {/* ================= MESSAGES ================= */}

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


            {/* ================= SEARCH CARD ================= */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body p-4">


                    <h5 className="fw-bold mb-4">
                        Where do you want to go?
                    </h5>


                    {/* ================= LOCATION INPUTS ================= */}

                    <div className="row g-4">


                        {/* START LOCATION */}

                        <div className="col-lg-6">

                            <label className="form-label fw-semibold">

                                <MapPin
                                    size={17}
                                    className="me-2 text-success"
                                />

                                Start Location

                            </label>


                            <div className="input-group">

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Colombo Fort"
                                    value={
                                        startSearch
                                    }
                                    onChange={(e) => {

                                        setStartSearch(
                                            e.target.value
                                        );

                                        // User changed search text,
                                        // old coordinates should no longer
                                        // be considered selected
                                        setFormData(
                                            (prev) => ({
                                                ...prev,

                                                startLatitude:
                                                    null,

                                                startLongitude:
                                                    null,
                                            })
                                        );

                                    }}
                                    onKeyDown={(e) => {

                                        if (
                                            e.key === "Enter"
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


                            {/* START RESULTS */}

                            {startResults.length >
                                0 && (

                                    <div
                                        className="list-group mt-2 shadow-sm"
                                        style={{
                                            maxHeight:
                                                "230px",

                                            overflowY:
                                                "auto",
                                        }}
                                    >

                                        {startResults.map(
                                            (
                                                location
                                            ) => (

                                                <button
                                                    key={
                                                        location.place_id
                                                    }
                                                    type="button"
                                                    className="list-group-item list-group-item-action text-start"
                                                    onClick={() =>
                                                        selectLocation(
                                                            "start",
                                                            location
                                                        )
                                                    }
                                                >

                                                    <MapPin
                                                        size={
                                                            15
                                                        }
                                                        className="me-2 text-success"
                                                    />

                                                    {
                                                        location.display_name
                                                    }

                                                </button>

                                            )
                                        )}

                                    </div>

                                )}


                            {/* SELECTED START */}

                            {formData.startLatitude !==
                                null && (

                                    <div className="small text-success mt-2">

                                        ✓ Start location selected

                                    </div>

                                )}

                        </div>


                        {/* DESTINATION */}

                        <div className="col-lg-6">

                            <label className="form-label fw-semibold">

                                <Navigation
                                    size={17}
                                    className="me-2 text-danger"
                                />

                                Destination

                            </label>


                            <div className="input-group">

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. ICBT Campus"
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

                                                destinationLatitude:
                                                    null,

                                                destinationLongitude:
                                                    null,
                                            })
                                        );

                                    }}
                                    onKeyDown={(e) => {

                                        if (
                                            e.key === "Enter"
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
                                    className="btn btn-warning"
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


                            {/* DESTINATION RESULTS */}

                            {destinationResults.length >
                                0 && (

                                    <div
                                        className="list-group mt-2 shadow-sm"
                                        style={{
                                            maxHeight:
                                                "230px",

                                            overflowY:
                                                "auto",
                                        }}
                                    >

                                        {destinationResults.map(
                                            (
                                                location
                                            ) => (

                                                <button
                                                    key={
                                                        location.place_id
                                                    }
                                                    type="button"
                                                    className="list-group-item list-group-item-action text-start"
                                                    onClick={() =>
                                                        selectLocation(
                                                            "destination",
                                                            location
                                                        )
                                                    }
                                                >

                                                    <Navigation
                                                        size={
                                                            15
                                                        }
                                                        className="me-2 text-danger"
                                                    />

                                                    {
                                                        location.display_name
                                                    }

                                                </button>

                                            )
                                        )}

                                    </div>

                                )}


                            {/* SELECTED DESTINATION */}

                            {formData.destinationLatitude !==
                                null && (

                                    <div className="small text-success mt-2">

                                        ✓ Destination selected

                                    </div>

                                )}

                        </div>

                    </div>


                    {/* ================= MAP ================= */}

                    <div className="mt-4">

                        <h6 className="fw-semibold mb-3">
                            Route Preview
                        </h6>


                        <div
                            style={{
                                height: "380px",
                                borderRadius:
                                    "12px",
                                overflow:
                                    "hidden",
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
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; OpenStreetMap contributors"
                                />


                                <MapController
                                    start={
                                        formData.startLatitude !==
                                        null
                                            ? {
                                                latitude:
                                                formData.startLatitude,

                                                longitude:
                                                formData.startLongitude,
                                            }
                                            : null
                                    }
                                    destination={
                                        formData.destinationLatitude !==
                                        null
                                            ? {
                                                latitude:
                                                formData.destinationLatitude,

                                                longitude:
                                                formData.destinationLongitude,
                                            }
                                            : null
                                    }
                                />


                                {/* START MARKER */}

                                {formData.startLatitude !==
                                    null && (

                                        <Marker
                                            position={[
                                                formData.startLatitude,
                                                formData.startLongitude,
                                            ]}
                                        />

                                    )}


                                {/* DESTINATION MARKER */}

                                {formData.destinationLatitude !==
                                    null && (

                                        <Marker
                                            position={[
                                                formData.destinationLatitude,
                                                formData.destinationLongitude,
                                            ]}
                                        />

                                    )}

                            </MapContainer>

                        </div>

                    </div>


                    {/* ================= DATE / TIME ================= */}

                    <form
                        onSubmit={
                            handleSearch
                        }
                    >

                        <div className="row g-3 mt-3">


                            {/* DATE */}

                            <div className="col-md-4">

                                <label className="form-label fw-semibold">
                                    Ride Date
                                </label>


                                <div className="input-group">

                                    <span className="input-group-text">

                                        <CalendarDays
                                            size={17}
                                        />

                                    </span>


                                    <input
                                        type="date"
                                        className="form-control"
                                        value={
                                            formData.rideDate
                                        }
                                        onChange={(e) =>
                                            setFormData(
                                                (
                                                    prev
                                                ) => ({
                                                    ...prev,

                                                    rideDate:
                                                    e
                                                        .target
                                                        .value,
                                                })
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* TIME */}

                            <div className="col-md-4">

                                <label className="form-label fw-semibold">
                                    Preferred Time
                                </label>


                                <div className="input-group">

                                    <span className="input-group-text">

                                        <Clock
                                            size={17}
                                        />

                                    </span>


                                    <input
                                        type="time"
                                        className="form-control"
                                        value={
                                            formData.preferredTime
                                        }
                                        onChange={(e) =>
                                            setFormData(
                                                (
                                                    prev
                                                ) => ({
                                                    ...prev,

                                                    preferredTime:
                                                    e
                                                        .target
                                                        .value,
                                                })
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            {/* SEARCH BUTTON */}

                            <div className="col-md-4 d-flex align-items-end">

                                <button
                                    type="submit"
                                    className="btn btn-warning fw-semibold w-100"
                                    disabled={
                                        loading
                                    }
                                >

                                    {loading ? (

                                        <>
                                            <Loader2
                                                size={
                                                    17
                                                }
                                                className="me-2"
                                            />

                                            Searching...
                                        </>

                                    ) : (

                                        <>
                                            <Search
                                                size={
                                                    17
                                                }
                                                className="me-2"
                                            />

                                            Search Rides
                                        </>

                                    )}

                                </button>

                            </div>

                        </div>

                    </form>

                </div>

            </div>


            {/* =====================================================
                SEARCH RESULTS
            ===================================================== */}

            {searched && (

                <div>

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h4 className="fw-bold mb-0">
                            Matching Rides
                        </h4>

                        <span className="text-muted">
                            {rides.length} ride
                            {rides.length !== 1
                                ? "s"
                                : ""}{" "}
                            found
                        </span>

                    </div>


                    {/* NO RIDES */}

                    {rides.length === 0 ? (

                        <div className="card border-0 shadow-sm">

                            <div className="card-body text-center py-5">

                                <Car
                                    size={50}
                                    className="text-warning mb-3"
                                />

                                <h5 className="fw-bold">
                                    No Matching Rides
                                </h5>

                                <p className="text-muted mb-0">
                                    Try changing your
                                    locations, date or
                                    preferred time.
                                </p>

                            </div>

                        </div>

                    ) : (

                        // ================= RIDES =================

                        <div className="row g-4">

                            {rides.map(
                                (ride) => (

                                    <div
                                        key={
                                            ride.id
                                        }
                                        className="col-lg-6"
                                    >

                                        <div className="card border-0 shadow-sm h-100">

                                            <div className="card-body p-4">


                                                {/* ROUTE */}

                                                <h5 className="fw-bold mb-3">

                                                    {
                                                        ride.start_location
                                                    }

                                                    {" → "}

                                                    {
                                                        ride.destination
                                                    }

                                                </h5>


                                                {/* DETAILS */}

                                                <div className="row g-3">


                                                    <div className="col-md-6">

                                                        <CalendarDays
                                                            size={
                                                                17
                                                            }
                                                            className="me-2 text-warning"
                                                        />

                                                        {
                                                            ride.ride_date
                                                        }

                                                    </div>


                                                    <div className="col-md-6">

                                                        <Clock
                                                            size={
                                                                17
                                                            }
                                                            className="me-2 text-warning"
                                                        />

                                                        {
                                                            ride.departure_time
                                                        }

                                                    </div>


                                                    <div className="col-md-6">

                                                        <Users
                                                            size={
                                                                17
                                                            }
                                                            className="me-2 text-warning"
                                                        />

                                                        {
                                                            ride.available_seats
                                                        }{" "}
                                                        seats available

                                                    </div>


                                                    <div className="col-md-6">

                                                        <Banknote
                                                            size={
                                                                17
                                                            }
                                                            className="me-2 text-warning"
                                                        />

                                                        Rs.{" "}
                                                        {
                                                            ride.fee_per_seat
                                                        }{" "}
                                                        / seat

                                                    </div>

                                                </div>


                                                {/* MATCH DISTANCES */}

                                                {ride.start_distance_km !==
                                                    undefined && (

                                                        <div className="bg-light rounded p-3 mt-3 small">

                                                            Start match:{" "}

                                                            <strong>
                                                                {
                                                                    ride.start_distance_km
                                                                }{" "}
                                                                km
                                                            </strong>

                                                        </div>

                                                    )}


                                                {ride.destination_distance_km !==
                                                    undefined && (

                                                        <div className="bg-light rounded p-3 mt-2 small">

                                                            Destination match:{" "}

                                                            <strong>
                                                                {
                                                                    ride.destination_distance_km
                                                                }{" "}
                                                                km
                                                            </strong>

                                                        </div>

                                                    )}


                                                {/* REQUEST */}

                                                <button
                                                    type="button"
                                                    className="btn btn-warning fw-semibold w-100 mt-4"
                                                    disabled={
                                                        requestingRide ===
                                                        ride.id
                                                    }
                                                    onClick={() =>
                                                        handleRequestRide(
                                                            ride.id
                                                        )
                                                    }
                                                >

                                                    {requestingRide ===
                                                    ride.id
                                                        ? "Sending Request..."
                                                        : "Request to Join"}

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            )}

        </div>
    );
};

export default FindRides;