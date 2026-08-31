import React, { useEffect, useState } from "react";
import {
    Car,
    Plus,
    Pencil,
    Trash2,
    X,
    Loader2,
} from "lucide-react";

import {
    getMyVehicles,
    addVehicle,
    updateVehicle,
    deactivateVehicle,
} from "../../services/vehicleService";

const Vehicles = () => {

    const [vehicles, setVehicles] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingVehicle, setEditingVehicle] =
        useState(null);

    const initialForm = {
        vehicleNumber: "",
        vehicleType: "car",
        brand: "",
        model: "",
        color: "",
        seatCapacity: "",
    };

    const [formData, setFormData] =
        useState(initialForm);


    // ==============================
    // LOAD VEHICLES
    // ==============================

    const loadVehicles = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getMyVehicles();

            setVehicles(
                response.data || []
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

            setLoading(false);
        }
    };


    useEffect(() => {

        loadVehicles();

    }, []);


    // ==============================
    // INPUT CHANGE
    // ==============================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    // ==============================
    // OPEN ADD FORM
    // ==============================

    const openAddForm = () => {

        setEditingVehicle(null);
        setFormData(initialForm);

        setError("");
        setSuccess("");

        setShowForm(true);
    };


    // ==============================
    // OPEN EDIT FORM
    // ==============================

    const openEditForm = (vehicle) => {

        setEditingVehicle(vehicle);

        setFormData({
            vehicleNumber:
                vehicle.vehicle_number || "",

            vehicleType:
                vehicle.vehicle_type || "car",

            brand:
                vehicle.brand || "",

            model:
                vehicle.model || "",

            color:
                vehicle.color || "",

            seatCapacity:
                vehicle.seat_capacity || "",
        });

        setError("");
        setSuccess("");

        setShowForm(true);
    };


    // ==============================
    // CLOSE FORM
    // ==============================

    const closeForm = () => {

        setShowForm(false);
        setEditingVehicle(null);
        setFormData(initialForm);
    };


    // ==============================
    // SAVE VEHICLE
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (
            !formData.vehicleNumber ||
            !formData.vehicleType ||
            !formData.brand ||
            !formData.model ||
            !formData.seatCapacity
        ) {

            setError(
                "Please fill in all required fields."
            );

            return;
        }


        try {

            setSaving(true);


            const payload = {

                vehicleNumber:
                formData.vehicleNumber,

                vehicleType:
                formData.vehicleType,

                brand:
                formData.brand,

                model:
                formData.model,

                color:
                formData.color,

                seatCapacity:
                    Number(
                        formData.seatCapacity
                    ),
            };


            if (editingVehicle) {

                await updateVehicle(
                    editingVehicle.id,
                    payload
                );

                setSuccess(
                    "Vehicle updated successfully."
                );

            } else {

                await addVehicle(payload);

                setSuccess(
                    "Vehicle added successfully."
                );
            }


            closeForm();

            await loadVehicles();


        } catch (err) {

            console.error(
                "Vehicle save error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to save vehicle."
            );

        } finally {

            setSaving(false);
        }
    };


    // ==============================
    // DEACTIVATE VEHICLE
    // ==============================

    const handleDeactivate = async (
        vehicleId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to deactivate this vehicle?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setSuccess("");

            await deactivateVehicle(
                vehicleId
            );

            setSuccess(
                "Vehicle deactivated successfully."
            );

            await loadVehicles();

        } catch (err) {

            console.error(
                "Vehicle deactivate error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to deactivate vehicle."
            );
        }
    };


    return (

        <div className="container-fluid p-4 p-md-5">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        My Vehicles
                    </h2>

                    <p className="text-muted mb-0">
                        Manage the vehicles you use for carpool rides.
                    </p>

                </div>


                <button
                    className="btn btn-warning fw-semibold d-flex align-items-center gap-2"
                    onClick={openAddForm}
                >
                    <Plus size={18} />

                    Add Vehicle
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="alert alert-danger">

                    {error}

                </div>

            )}


            {/* SUCCESS */}

            {success && (

                <div className="alert alert-success">

                    {success}

                </div>

            )}


            {/* VEHICLE FORM */}

            {showForm && (

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h5 className="fw-bold mb-0">

                                {editingVehicle
                                    ? "Edit Vehicle"
                                    : "Add Vehicle"}

                            </h5>


                            <button
                                type="button"
                                className="btn btn-sm btn-light"
                                onClick={closeForm}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>

                            <div className="row g-3">


                                {/* VEHICLE NUMBER */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">

                                        Vehicle Number
                                        <span className="text-danger">
                                            *
                                        </span>

                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="vehicleNumber"
                                        value={
                                            formData.vehicleNumber
                                        }
                                        placeholder="e.g. CAA-1234"
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* VEHICLE TYPE */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">

                                        Vehicle Type
                                        <span className="text-danger">
                                            *
                                        </span>

                                    </label>

                                    <select
                                        className="form-select"
                                        name="vehicleType"
                                        value={
                                            formData.vehicleType
                                        }
                                        onChange={handleChange}
                                    >

                                        <option value="car">
                                            Car
                                        </option>

                                        <option value="van">
                                            Van
                                        </option>

                                        <option value="three_wheeler">
                                            Three Wheeler
                                        </option>

                                    </select>

                                </div>


                                {/* BRAND */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">

                                        Brand
                                        <span className="text-danger">
                                            *
                                        </span>

                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="brand"
                                        value={
                                            formData.brand
                                        }
                                        placeholder="e.g. Toyota"
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* MODEL */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">

                                        Model
                                        <span className="text-danger">
                                            *
                                        </span>

                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="model"
                                        value={
                                            formData.model
                                        }
                                        placeholder="e.g. Aqua"
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* COLOR */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Color
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="color"
                                        value={
                                            formData.color
                                        }
                                        placeholder="e.g. White"
                                        onChange={handleChange}
                                    />

                                </div>


                                {/* SEAT CAPACITY */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">

                                        Seat Capacity
                                        <span className="text-danger">
                                            *
                                        </span>

                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        name="seatCapacity"
                                        min="1"
                                        value={
                                            formData.seatCapacity
                                        }
                                        placeholder="e.g. 4"
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                            </div>


                            <div className="d-flex justify-content-end gap-2 mt-4">

                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="btn btn-warning fw-semibold"
                                    disabled={saving}
                                >

                                    {saving ? (

                                        <>
                                            <Loader2
                                                size={17}
                                                className="me-2"
                                            />

                                            Saving...
                                        </>

                                    ) : (

                                        editingVehicle
                                            ? "Update Vehicle"
                                            : "Save Vehicle"

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* VEHICLE LIST */}

            {loading ? (

                <div className="text-center py-5">

                    <Loader2 size={30} />

                    <p className="text-muted mt-2">
                        Loading vehicles...
                    </p>

                </div>

            ) : vehicles.length === 0 ? (

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <Car
                            size={55}
                            className="text-warning mb-3"
                        />

                        <h5 className="fw-bold">
                            No Vehicles Added
                        </h5>

                        <p className="text-muted">
                            Add your first vehicle before creating a ride.
                        </p>

                        <button
                            className="btn btn-warning"
                            onClick={openAddForm}
                        >
                            Add Vehicle
                        </button>

                    </div>

                </div>

            ) : (

                <div className="row g-4">

                    {vehicles.map((vehicle) => (

                        <div
                            className="col-md-6 col-xl-4"
                            key={vehicle.id}
                        >

                            <div
                                className="card border-0 h-100 rounded-4"
                                style={{
                                    background: "rgba(8, 20, 45, 0.95)",
                                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                                    overflow: "hidden",
                                }}
                            >

                                <div className="card-body p-4">

                                    {/* TOP SECTION */}

                                    <div className="d-flex align-items-start justify-content-between mb-3">

                                        <div className="d-flex align-items-center gap-3">

                                            <div
                                                className="rounded-4 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "52px",
                                                    height: "52px",
                                                    backgroundColor: "rgba(250, 204, 21, 0.12)",
                                                }}
                                            >
                                                <Car
                                                    size={25}
                                                    className="text-warning"
                                                />
                                            </div>

                                            <div>

                                                <h5 className="fw-bold text-white mb-1">
                                                    {vehicle.brand} {vehicle.model}
                                                </h5>

                                                <span className="text-white-50 small">
                                    {vehicle.vehicle_number}
                                </span>

                                            </div>

                                        </div>


                                        {/* STATUS */}

                                        <span
                                            className={`badge rounded-pill px-3 py-2 ${
                                                vehicle.is_active
                                                    ? "bg-success bg-opacity-75"
                                                    : "bg-secondary"
                                            }`}
                                        >
                            {vehicle.is_active
                                ? "Active"
                                : "Inactive"}
                        </span>

                                    </div>


                                    {/* DIVIDER */}

                                    <div
                                        className="my-3"
                                        style={{
                                            borderTop:
                                                "1px solid rgba(255,255,255,0.1)",
                                        }}
                                    />


                                    {/* VEHICLE DETAILS */}

                                    <div className="row g-3">

                                        <div className="col-4">

                                            <div className="text-white-50 small mb-1">
                                                Type
                                            </div>

                                            <div className="text-white fw-semibold small">
                                                {vehicle.vehicle_type}
                                            </div>

                                        </div>


                                        <div className="col-4">

                                            <div className="text-white-50 small mb-1">
                                                Color
                                            </div>

                                            <div className="text-white fw-semibold small">
                                                {vehicle.color || "-"}
                                            </div>

                                        </div>


                                        <div className="col-4">

                                            <div className="text-white-50 small mb-1">
                                                Seats
                                            </div>

                                            <div className="text-white fw-semibold small">
                                                {vehicle.seat_capacity}
                                            </div>

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

                                    {vehicle.is_active && (

                                        <div className="d-flex gap-2 mt-4">

                                            <button
                                                className="btn btn-outline-light btn-sm rounded-3 flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                                                onClick={() =>
                                                    openEditForm(vehicle)
                                                }
                                            >

                                                <Pencil size={15} />

                                                Edit

                                            </button>


                                            <button
                                                className="btn btn-outline-danger btn-sm rounded-3 flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                                                onClick={() =>
                                                    handleDeactivate(
                                                        vehicle.id
                                                    )
                                                }
                                            >

                                                <Trash2 size={15} />

                                                Deactivate

                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default Vehicles;