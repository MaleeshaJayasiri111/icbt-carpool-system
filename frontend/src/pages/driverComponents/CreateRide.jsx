import React, { useEffect, useState } from "react";

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
    Car,
    CalendarDays,
    Clock,
    Users,
    Banknote,
    Loader2,
} from "lucide-react";

import {
    getMyVehicles,
} from "../../services/vehicleService";

import {
    createRide,
} from "../../services/rideService";


// ========================================
// MAP CONTROLLER
// ========================================

const MapController = ({
                           start,
                           destination,
                       }) => {

    const map = useMap();

    useEffect(() => {

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


// ========================================
// CREATE RIDE
// ========================================

const CreateRide = () => {

    const [
        vehicles,
        setVehicles,
    ] = useState([]);

    const [
        loadingVehicles,
        setLoadingVehicles,
    ] = useState(true);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");


    // ========================================
    // LOCATION SEARCH STATE
    // ========================================

    const [
        startSearch,
        setStartSearch,
    ] = useState("");

    const [
        destinationSearch,
        setDestinationSearch,
    ] = useState("");

    const [
        startResults,
        setStartResults,
    ] = useState([]);

    const [
        destinationResults,
        setDestinationResults,
    ] = useState([]);

    const [
        searchingLocation,
        setSearchingLocation,
    ] = useState("");


    // ========================================
    // FORM
    // ========================================

    const [
        formData,
        setFormData,
    ] = useState({

        vehicleId: "",

        startLocation: "",
        startLatitude: null,
        startLongitude: null,

        destination: "",
        destinationLatitude: null,
        destinationLongitude: null,

        rideDate: "",
        departureTime: "",

        totalSeats: "",
        feePerSeat: "",
    });


    // ========================================
    // LOAD VEHICLES
    // ========================================

    const loadVehicles = async () => {

        try {

            setLoadingVehicles(true);

            const response =
                await getMyVehicles();


            const activeVehicles =
                (response.data || [])
                    .filter(
                        (vehicle) =>
                            vehicle.is_active
                    );


            setVehicles(
                activeVehicles
            );

        } catch (err) {

            console.error(
                "Vehicle loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load vehicles."
            );

        } finally {

            setLoadingVehicles(false);
        }
    };


    useEffect(() => {
        loadVehicles();
    }, []);


    // ========================================
    // NORMAL INPUT CHANGE
    // ========================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setFormData(
            (prev) => ({
                ...prev,
                [name]: value,
            })
        );
    };


    // ========================================
    // SEARCH LOCATION
    // ========================================

    const searchLocation = async (
        type
    ) => {

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

            setSearchingLocation(
                type
            );


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
                    "Location search failed"
                );
            }


            const data =
                await response.json();


            if (type === "start") {

                setStartResults(
                    data
                );

            } else {

                setDestinationResults(
                    data
                );
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


    // ========================================
    // SELECT SEARCH RESULT
    // ========================================

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

                    startLocation:
                    location.display_name,

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

                    destination:
                    location.display_name,

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


    // ========================================
    // SUBMIT
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (!formData.vehicleId) {

            setError(
                "Please select a vehicle."
            );

            return;
        }


        if (
            formData.startLatitude === null ||
            formData.startLongitude === null
        ) {

            setError(
                "Please search and select a start location."
            );

            return;
        }


        if (
            formData.destinationLatitude === null ||
            formData.destinationLongitude === null
        ) {

            setError(
                "Please search and select a destination."
            );

            return;
        }


        if (
            !formData.rideDate ||
            !formData.departureTime ||
            !formData.totalSeats ||
            !formData.feePerSeat
        ) {

            setError(
                "Please fill in all ride details."
            );

            return;
        }


        try {

            setSaving(true);


            const payload = {

                vehicleId:
                formData.vehicleId,

                startLocation:
                formData.startLocation,

                startLatitude:
                formData.startLatitude,

                startLongitude:
                formData.startLongitude,

                destination:
                formData.destination,

                destinationLatitude:
                formData.destinationLatitude,

                destinationLongitude:
                formData.destinationLongitude,

                rideDate:
                formData.rideDate,

                departureTime:
                formData.departureTime,

                totalSeats:
                    Number(
                        formData.totalSeats
                    ),

                feePerSeat:
                    Number(
                        formData.feePerSeat
                    ),
            };


            console.log(
                "Create ride payload:",
                payload
            );


            await createRide(
                payload
            );


            setSuccess(
                "Ride created successfully."
            );


            // Reset form

            setFormData({

                vehicleId: "",

                startLocation: "",
                startLatitude: null,
                startLongitude: null,

                destination: "",
                destinationLatitude: null,
                destinationLongitude: null,

                rideDate: "",
                departureTime: "",

                totalSeats: "",
                feePerSeat: "",
            });


            setStartSearch("");
            setDestinationSearch("");

            setStartResults([]);
            setDestinationResults([]);


        } catch (err) {

            console.error(
                "Create ride error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to create ride."
            );

        } finally {

            setSaving(false);
        }
    };


    // ========================================
    // SELECTED VEHICLE
    // ========================================

    const selectedVehicle =
        vehicles.find(
            (vehicle) =>
                vehicle.id ===
                formData.vehicleId
        );


    // ========================================
    // UI
    // ========================================

    return (

        <div className="container-fluid p-4 p-md-5">


            {/* HEADER */}

            <div className="mb-4">

                <h2 className="fw-bold mb-1">
                    Create Ride
                </h2>

                <p className="text-muted mb-0">
                    Search and select your route,
                    then enter the ride details.
                </p>

            </div>


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


            <form
                onSubmit={
                    handleSubmit
                }
            >

                <div className="row g-4">


                    {/* =================================
                        LEFT SIDE
                    ================================= */}

                    <div className="col-lg-5">


                        {/* VEHICLE */}

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">

                                    <Car
                                        size={20}
                                        className="text-warning"
                                    />

                                    Vehicle

                                </h5>


                                {loadingVehicles ? (

                                    <div className="text-muted">
                                        Loading vehicles...
                                    </div>

                                ) : vehicles.length === 0 ? (

                                    <div className="alert alert-warning mb-0">

                                        You need to add a vehicle
                                        before creating a ride.

                                    </div>

                                ) : (

                                    <select
                                        className="form-select"
                                        name="vehicleId"
                                        value={
                                            formData.vehicleId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >

                                        <option value="">
                                            Select vehicle
                                        </option>


                                        {vehicles.map(
                                            (vehicle) => (

                                                <option
                                                    key={
                                                        vehicle.id
                                                    }
                                                    value={
                                                        vehicle.id
                                                    }
                                                >

                                                    {vehicle.brand}{" "}
                                                    {vehicle.model}
                                                    {" - "}
                                                    {vehicle.vehicle_number}

                                                </option>

                                            )
                                        )}

                                    </select>

                                )}


                                {selectedVehicle && (

                                    <div className="bg-light rounded-3 p-3 mt-3 small">

                                        <div>

                                            <strong>
                                                Capacity:
                                            </strong>{" "}

                                            {
                                                selectedVehicle.seat_capacity
                                            }{" "}
                                            seats

                                        </div>


                                        <div>

                                            <strong>
                                                Type:
                                            </strong>{" "}

                                            {
                                                selectedVehicle.vehicle_type
                                            }

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* =================================
                            ROUTE SEARCH
                        ================================= */}

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">
                                    Route Details
                                </h5>


                                {/* START */}

                                <div className="mb-4">

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
                                            placeholder="e.g. Anuradhapura"
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


                                    {/* START SUGGESTIONS */}

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
                                                    (
                                                        location
                                                    ) => (

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


                                    {formData.startLatitude !==
                                        null && (

                                            <div className="small text-success mt-2">

                                                ✓ Start selected

                                            </div>

                                        )}

                                </div>


                                {/* DESTINATION */}

                                <div>

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
                                                        "220px",

                                                    overflowY:
                                                        "auto",
                                                }}
                                            >

                                                {destinationResults.map(
                                                    (
                                                        location
                                                    ) => (

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


                                    {formData.destinationLatitude !==
                                        null && (

                                            <div className="small text-success mt-2">

                                                ✓ Destination selected

                                            </div>

                                        )}

                                </div>

                            </div>

                        </div>


                        {/* =================================
                            RIDE DETAILS
                        ================================= */}

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-3">
                                    Ride Details
                                </h5>


                                <div className="row g-3">


                                    {/* DATE */}

                                    <div className="col-md-6">

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

                                            <span className="input-group-text">

                                                <Clock
                                                    size={17}
                                                />

                                            </span>


                                            <input
                                                type="time"
                                                className="form-control"
                                                name="departureTime"
                                                value={
                                                    formData.departureTime
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

                                            <span className="input-group-text">

                                                <Users
                                                    size={17}
                                                />

                                            </span>


                                            <input
                                                type="number"
                                                min="1"
                                                max={
                                                    selectedVehicle
                                                        ?.seat_capacity ||
                                                    undefined
                                                }
                                                className="form-control"
                                                name="totalSeats"
                                                value={
                                                    formData.totalSeats
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />

                                        </div>

                                    </div>


                                    {/* FEE */}

                                    <div className="col-md-6">

                                        <label className="form-label fw-semibold">
                                            Fee Per Seat
                                        </label>


                                        <div className="input-group">

                                            <span className="input-group-text">

                                                <Banknote
                                                    size={17}
                                                />

                                            </span>


                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="form-control"
                                                name="feePerSeat"
                                                placeholder="e.g. 500"
                                                value={
                                                    formData.feePerSeat
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        RIGHT SIDE MAP
                    ================================= */}

                    <div className="col-lg-7">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body p-4">


                                <h5 className="fw-bold mb-2">
                                    Route Preview
                                </h5>

                                <p className="text-muted small mb-3">
                                    Search and select your start
                                    and destination to preview them
                                    on the map.
                                </p>


                                <div
                                    style={{
                                        height: "500px",
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
                                            attribution="&copy; OpenStreetMap contributors"
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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


                                        {/* START */}

                                        {formData.startLatitude !==
                                            null && (

                                                <Marker
                                                    position={[
                                                        formData.startLatitude,
                                                        formData.startLongitude,
                                                    ]}
                                                />

                                            )}


                                        {/* DESTINATION */}

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


                                {/* COORDINATES */}

                                <div className="row g-3 mt-2">


                                    <div className="col-md-6">

                                        <div className="bg-light p-3 rounded">

                                            <strong>
                                                Start
                                            </strong>

                                            <div className="small text-muted mt-1">

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

                                        <div className="bg-light p-3 rounded">

                                            <strong>
                                                Destination
                                            </strong>

                                            <div className="small text-muted mt-1">

                                                {formData.destinationLatitude !==
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


                                {/* CREATE BUTTON */}

                                <button
                                    type="submit"
                                    className="btn btn-warning w-100 fw-bold py-3 mt-4"
                                    disabled={
                                        saving ||
                                        vehicles.length === 0
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

                            </div>

                        </div>

                    </div>

                </div>

            </form>

        </div>
    );
};

export default CreateRide;