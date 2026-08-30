import React from "react";
import { Outlet } from "react-router-dom";
import PassengerSidebar from "../components/passenger/PassengerSidebar";

const PassengerLayout = () => {

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8fafc",
            }}
        >

            <PassengerSidebar />

            <main
                style={{
                    minWidth: 0,
                    overflowX: "hidden",
                }}
            >
                <Outlet />
            </main>

        </div>
    );
};

export default PassengerLayout;