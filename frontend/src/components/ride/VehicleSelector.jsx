import React from "react";

import {
    Car,
    Users,
} from "lucide-react";


const VehicleSelector = ({
                             vehicles,
                             loadingVehicles,
                             formData,
                             handleChange,
                             selectedVehicle,
                         }) => {

    return (

        <div className="card border-0 shadow-sm mb-4">

            <div
                style={{
                    height: "4px",
                    backgroundColor: "#ffc107",
                }}
            />


            <div className="card-body p-4">

                <div className="d-flex align-items-center gap-2 mb-3">

                    <div
                        className="rounded-3 d-flex align-items-center justify-content-center"
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#fff3cd",
                        }}
                    >
                        <Car
                            size={20}
                            className="text-warning"
                        />
                    </div>

                    <div>

                        <h5
                            className="fw-bold mb-0"
                            style={{
                                color: "#0d6efd",
                            }}
                        >
                            Select Vehicle
                        </h5>

                        <small className="text-muted">
                            Choose the vehicle for this ride
                        </small>

                    </div>

                </div>


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
                                    {
                                        vehicle.vehicle_number
                                    }

                                </option>

                            )
                        )}

                    </select>

                )}


                {selectedVehicle && (

                    <div
                        className="rounded-3 p-3 mt-3"
                        style={{
                            backgroundColor:
                                "#f5f9ff",
                            border:
                                "1px solid #dbeafe",
                        }}
                    >

                        <div className="row g-3">

                            <div className="col-6">

                                <small className="text-muted d-block">
                                    Vehicle Type
                                </small>

                                <strong
                                    className="text-capitalize"
                                    style={{
                                        color:
                                            "#0d6efd",
                                    }}
                                >
                                    {
                                        selectedVehicle
                                            .vehicle_type
                                            ?.replace(
                                                "_",
                                                " "
                                            )
                                    }
                                </strong>

                            </div>


                            <div className="col-6">

                                <small className="text-muted d-block">
                                    Capacity
                                </small>

                                <div className="d-flex align-items-center gap-1">

                                    <Users
                                        size={15}
                                        className="text-warning"
                                    />

                                    <strong>
                                        {
                                            selectedVehicle
                                                .seat_capacity
                                        } seats
                                    </strong>

                                </div>

                            </div>

                        </div>


                        <div className="small text-muted mt-3">

                            Driver occupies one seat.
                            Maximum passenger seats:{" "}

                            <strong>
                                {
                                    Math.max(
                                        Number(
                                            selectedVehicle
                                                .seat_capacity
                                        ) - 1,
                                        1
                                    )
                                }
                            </strong>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
};


export default VehicleSelector;