import React from "react";
import { Outlet } from "react-router-dom";
import DriverSidebar from "../components/driver/DriverSidebar";

const DriverLayout = () => {
    return (
        <div
            className="d-flex bg-light"
            style={{
                minHeight: "100vh",
            }}
        >
            {/* SIDEBAR */}
            <DriverSidebar />

            {/* PAGE CONTENT */}
            <main
                className="flex-grow-1"
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