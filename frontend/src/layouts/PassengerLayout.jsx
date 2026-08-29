import React from "react";
import { Outlet } from "react-router-dom";
import PassengerSidebar from "../components/passenger/PassengerSidebar";

const PassengerLayout = () => {

    return (
        <div className="d-flex">

            <PassengerSidebar />

            <main
                className="flex-grow-1"
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#f8f9fa",
                }}
            >
                <Outlet />
            </main>

        </div>
    );
};

export default PassengerLayout;