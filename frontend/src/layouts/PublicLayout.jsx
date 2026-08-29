import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PublicLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">

            {/* Public Navigation */}
            <Navbar />

            {/* Public Page Content */}
            <main className="flex-grow-1">
                <Outlet />
            </main>

            {/* Public Footer */}
            <Footer />

        </div>
    );
};

export default PublicLayout;