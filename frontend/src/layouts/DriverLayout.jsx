import React from "react";
import { Outlet } from "react-router-dom";
import DriverSidebar from "../components/driver/DriverSidebar";

const DriverLayout = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8fafc",
            }}
        >
            {/* TOP NAVBAR */}
            <DriverSidebar />

            {/* PAGE CONTENT */}
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

export default DriverLayout;