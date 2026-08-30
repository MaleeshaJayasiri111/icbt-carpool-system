import React, {
    useEffect,
    useState,
} from "react";

import {
    getMyVehicles,
} from "../../services/vehicleService";

import {
    createRide,
    calculateRideFare,
} from "../../services/rideService";


// COMPONENTS

import VehicleSelector
    from "../../components/ride/VehicleSelector";

import RouteSearch
    from "../../components/ride/RouteSearch";

import RideDetails
    from "../../components/ride/RideDetails";

import FareCalculator
    from "../../components/ride/FareCalculator";

import RoutePreview
    from "../../components/ride/RoutePreview";

const CreateRide = () => {

    // VEHICLES

    const [
        vehicles,
        setVehicles,
    ] = useState([]);

    const [
        loadingVehicles,
        setLoadingVehicles,
    ] = useState(true);


 //submit state
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


    // FARE STATE
    const [
        fareEstimate,
        setFareEstimate,
    ] = useState(null);

    const [
        fareLoading,
        setFareLoading,
    ] = useState(false);

    const [
        fareError,
        setFareError,
    ] = useState("");

    //location state
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


    // FORM DATA
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

    // LOAD VEHICLES

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

    // LOAD VEHICLES ON PAGE LOAD


    useEffect(() => {

        loadVehicles();

    }, []);

    // NORMAL INPUT CHANGE

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

    // SEARCH LOCATION

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

            setSearchingLocation(
                ""
            );

        }
    };

    // SELECT LOCATION FROM SEARCH

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
    // CALCULATE FARE
    // ========================================

    const handleCalculateFare =
        async () => {

            if (!formData.vehicleId) {

                setFareError(
                    "Please select a vehicle first."
                );

                return;
            }


            if (
                !formData.startLatitude ||
                !formData.startLongitude ||
                !formData.destinationLatitude ||
                !formData.destinationLongitude
            ) {

                setFareError(
                    "Please select both start and destination locations."
                );

                return;
            }


            try {

                setFareLoading(true);

                setFareError("");


                const response =
                    await calculateRideFare({

                        vehicleId:
                        formData.vehicleId,

                        startLatitude:
                        formData.startLatitude,

                        startLongitude:
                        formData.startLongitude,

                        destinationLatitude:
                        formData.destinationLatitude,

                        destinationLongitude:
                        formData.destinationLongitude,

                    });


                console.log(
                    "Fare calculation:",
                    response
                );


                const fare =
                    response.data;


                setFareEstimate(
                    fare
                );


                // Automatically use
                // recommended fare

                setFormData(
                    (prev) => ({
                        ...prev,

                        feePerSeat:
                        fare
                            .pricing
                            .suggestedFare,
                    })
                );

            } catch (error) {

                console.error(
                    "Fare calculation error:",
                    error
                );


                setFareError(
                    error.response?.data?.message ||
                    "Unable to calculate fare."
                );

            } finally {

                setFareLoading(false);

            }

        };


    // ========================================
    // SUBMIT CREATE RIDE
    // ========================================

    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();


        setError("");

        setSuccess("");


        // VEHICLE VALIDATION

        if (!formData.vehicleId) {

            setError(
                "Please select a vehicle."
            );

            return;
        }


        // START VALIDATION

        if (
            formData.startLatitude === null ||
            formData.startLongitude === null
        ) {

            setError(
                "Please search and select a start location."
            );

            return;
        }


        // DESTINATION VALIDATION

        if (
            formData.destinationLatitude === null ||
            formData.destinationLongitude === null
        ) {

            setError(
                "Please search and select a destination."
            );

            return;
        }


        // RIDE DETAILS VALIDATION

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


            // ========================================
            // RESET FORM
            // ========================================

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

            setFareEstimate(null);

            setFareError("");


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

        <div
            className="container-fluid p-4 p-md-5"
            style={{
                backgroundColor:
                    "#ffffff",

                minHeight:
                    "100vh",
            }}
        >

            {/* ========================================
                PAGE HEADER
            ======================================== */}

            <div className="mb-4">

                <div
                    className="d-inline-flex align-items-center px-3 py-2 rounded-pill mb-3"
                    style={{
                        backgroundColor:
                            "#fff8db",

                        color:
                            "#0d6efd",

                        fontWeight:
                            "600",

                        fontSize:
                            "0.85rem",
                    }}
                >

                    Create a new ride

                </div>


                <h2
                    className="fw-bold mb-1"
                    style={{
                        color:
                            "#0d6efd",
                    }}
                >
                    Create Ride
                </h2>


                <p className="text-muted mb-0">

                    Search your route,
                    choose your vehicle,
                    and create a ride
                    for passengers.

                </p>

            </div>


            {/* ========================================
                ERROR
            ======================================== */}

            {error && (

                <div
                    className="alert alert-danger border-0 shadow-sm"
                >
                    {error}
                </div>

            )}


            {/* ========================================
                SUCCESS
            ======================================== */}

            {success && (

                <div
                    className="alert alert-success border-0 shadow-sm"
                >
                    {success}
                </div>

            )}


            {/* ========================================
                FORM
            ======================================== */}

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

                        <VehicleSelector

                            vehicles={
                                vehicles
                            }

                            loadingVehicles={
                                loadingVehicles
                            }

                            formData={
                                formData
                            }

                            handleChange={
                                handleChange
                            }

                            selectedVehicle={
                                selectedVehicle
                            }

                        />


                        {/* ROUTE SEARCH */}

                        <RouteSearch

                            formData={
                                formData
                            }

                            setFormData={
                                setFormData
                            }

                            startSearch={
                                startSearch
                            }

                            setStartSearch={
                                setStartSearch
                            }

                            destinationSearch={
                                destinationSearch
                            }

                            setDestinationSearch={
                                setDestinationSearch
                            }

                            startResults={
                                startResults
                            }

                            destinationResults={
                                destinationResults
                            }

                            searchingLocation={
                                searchingLocation
                            }

                            searchLocation={
                                searchLocation
                            }

                            selectLocation={
                                selectLocation
                            }

                        />


                        {/* RIDE DETAILS */}

                        <RideDetails

                            formData={
                                formData
                            }

                            handleChange={
                                handleChange
                            }

                            selectedVehicle={
                                selectedVehicle
                            }

                            fareEstimate={
                                fareEstimate
                            }

                        />


                        {/* FARE */}

                        <FareCalculator

                            formData={
                                formData
                            }

                            fareEstimate={
                                fareEstimate
                            }

                            fareLoading={
                                fareLoading
                            }

                            fareError={
                                fareError
                            }

                            handleCalculateFare={
                                handleCalculateFare
                            }

                        />

                    </div>


                    {/* =================================
                        RIGHT SIDE
                    ================================= */}

                    <div className="col-lg-7">

                        <RoutePreview

                            formData={
                                formData
                            }

                            saving={
                                saving
                            }

                            vehiclesLength={
                                vehicles.length
                            }

                            fareEstimate={
                                fareEstimate
                            }

                        />

                    </div>

                </div>

            </form>

        </div>

    );

};


export default CreateRide;