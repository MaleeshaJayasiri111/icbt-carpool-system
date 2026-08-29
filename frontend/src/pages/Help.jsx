import React from 'react';

const Help = () => {
    return (
        <div className="w-100 max-w-3xl mx-auto mt-4" style={{ maxWidth: '800px' }}>
            <h2 className="mb-4 fw-bold">Help & User Manual</h2>
            <p className="text-muted mb-5">Welcome to the ICBT Carpool manual. Please follow the instructions below based on your role.</p>

            <div className="accordion" id="helpAccordion">
                <div className="accordion-item shadow-sm mb-3 border-0 rounded">
                    <h2 className="accordion-header" id="headingPassenger">
                        <button className="accordion-button rounded fw-semibold bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePassenger" aria-expanded="true" aria-controls="collapsePassenger">
                            Instructions for Passengers
                        </button>
                    </h2>
                    <div id="collapsePassenger" className="accordion-collapse collapse show" aria-labelledby="headingPassenger" data-bs-parent="#helpAccordion">
                        <div className="accordion-body text-start">
                            <ul>
                                <li className="mb-2"><strong>Registration:</strong> Register as a 'Passenger'. Ensure your details are correct.</li>
                                <li className="mb-2"><strong>Finding a Ride:</strong> Navigate to 'Search Rides', select your route (e.g., Kegalle, Kandy) and browse available vehicles.</li>
                                <li className="mb-2"><strong>Booking:</strong> Click 'Request' on your preferred ride. The driver will receive a notification to Accept or Reject.</li>
                                <li className="mb-2"><strong>Status:</strong> Check your 'Dashboard' for the status of your request (Pending/Accepted/Rejected).</li>
                                <li className="mb-2"><strong>Chat:</strong> Once you locate a driver, you can coordinate pick-up times via the real-time chat box.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="accordion-item shadow-sm mb-3 border-0 rounded">
                    <h2 className="accordion-header" id="headingDriver">
                        <button className="accordion-button rounded fw-semibold bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDriver" aria-expanded="true" aria-controls="collapseDriver">
                            Instructions for Drivers
                        </button>
                    </h2>
                    <div id="collapseDriver" className="accordion-collapse collapse show" aria-labelledby="headingDriver" data-bs-parent="#helpAccordion">
                        <div className="accordion-body text-start">
                            <p className="text-muted mb-3">
                                As a driver on ICBT Carpool, you can offer seats in your vehicle to fellow students and staff travelling the same route. This guide walks you through registering your vehicle, posting a ride, managing booking requests, and coordinating with passengers — all from your personal dashboard.
                            </p>
                            <ul>
                                <li className="mb-2"><strong>Registration:</strong> Select <em>'Driver'</em> role during sign up. Enter your Vehicle Name, Number Plate, and available Seat count accurately to ensure correct passenger matches.</li>
                                <li className="mb-2"><strong>Adding / Managing Vehicles:</strong> From your Dashboard, click <em>'+ Add Vehicle'</em> to register a new vehicle at any time. You can switch between registered vehicles when posting a ride.</li>
                                <li className="mb-2"><strong>Posting a Ride:</strong> Go to your <em>Dashboard</em> and use the <em>'Post a Ride'</em> form. Select your vehicle, pick locations on the interactive map, choose the route, set the departure time, and enter available seats. Then click <em>'Post Ride Offer'</em>.</li>
                                <li className="mb-2"><strong>Using the Map:</strong> Click <em>'Set Pickup'</em> or <em>'Set Dropoff'</em>, then click your location on the map to pin it. A dashed line connects both points to confirm the route visually.</li>
                                <li className="mb-2"><strong>Managing Requests:</strong> Passengers will send ride requests visible in the <em>'Booking Requests'</em> panel. Review each request and click <em>Accept</em> or <em>Reject</em> based on seat availability.</li>
                                <li className="mb-2"><strong>Chat:</strong> Use the real-time Chat to coordinate precise pickup times and locations with accepted passengers before departure.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="mt-5 mb-4 fw-bold">Frequently Asked Questions</h3>
            <div className="accordion mb-5" id="faqAccordion">
                <div className="accordion-item shadow-sm mb-3 border-0 rounded">
                    <h2 className="accordion-header" id="faqHeadingOne">
                        <button className="accordion-button collapsed rounded fw-semibold bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseOne" aria-expanded="false" aria-controls="faqCollapseOne">
                            How is the fuel cost calculated?
                        </button>
                    </h2>
                    <div id="faqCollapseOne" className="accordion-collapse collapse" aria-labelledby="faqHeadingOne" data-bs-parent="#faqAccordion">
                        <div className="accordion-body text-start">
                            The fuel cost is automatically calculated based on the route distance and the number of accepted passengers. Payments can be tracked on your dashboard.
                        </div>
                    </div>
                </div>
                <div className="accordion-item shadow-sm mb-3 border-0 rounded">
                    <h2 className="accordion-header" id="faqHeadingTwo">
                        <button className="accordion-button collapsed rounded fw-semibold bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseTwo" aria-expanded="false" aria-controls="faqCollapseTwo">
                            Is my data secure?
                        </button>
                    </h2>
                    <div id="faqCollapseTwo" className="accordion-collapse collapse" aria-labelledby="faqHeadingTwo" data-bs-parent="#faqAccordion">
                        <div className="accordion-body text-start">
                            Yes, all ICBT student and staff data is encrypted and kept private. We only share necessary trip details between the matched driver and passenger.
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="mb-4 fw-bold">Support Contact Information</h3>
            <div className="card shadow-sm border-0 bg-white p-4 text-start mb-5">
                <p className="mb-2"><strong>Email:</strong> support-carpool@icbt.lk</p>
                <p className="mb-2"><strong>Phone:</strong> +94 11 234 5678 (Helpdesk ext 102)</p>
                <p className="mb-0"><strong>Office:</strong> Student Services Center, ICBT Main Campus, Colombo 04</p>
            </div>
        </div>
    );
};

export default Help;
