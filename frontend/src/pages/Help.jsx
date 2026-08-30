import React, { useState } from 'react';
import { BookOpen, Users, Car, HelpCircle, Mail, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const DARK_CARD = { backgroundColor: '#0d1b5e', border: '2px solid rgba(59,130,246,0.5)' };

const AccordionItem = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="rounded-4 mb-3 overflow-hidden" style={DARK_CARD}>
            <button
                className="w-100 d-flex align-items-center justify-content-between gap-3 px-4 py-3 border-0 fw-bold fs-6 text-start"
                style={{ backgroundColor: 'transparent', color: '#fff', cursor: 'pointer' }}
                onClick={() => setOpen(!open)}
            >
                <span className="d-flex align-items-center gap-3">
                    <span className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle d-flex" style={{ width: '36px', height: '36px', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={18} />
                    </span>
                    {title}
                </span>
                {open ? <ChevronUp size={20} className="text-warning flex-shrink-0" /> : <ChevronDown size={20} className="text-white-50 flex-shrink-0" />}
            </button>
            {open && (
                <div className="px-4 pb-4 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

const Help = () => {
    return (
        <div
            className="d-flex flex-column"
            style={{
                minHeight: '85vh',
                background: 'radial-gradient(circle at 10% 20%, rgba(250, 204, 21, 0.05) 0%, rgba(15, 23, 42, 0.05) 90%)',
                marginTop: '-1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem', width: 'calc(100% + 3rem)'
            }}>

            {/* Hero Header */}
            <div className="text-center pt-5 pb-4 mt-4">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center shadow-sm">
                        <BookOpen size={16} className="me-1" /> Documentation
                    </span>
                    <h1 className="display-4 fw-bold mb-3 premium-gradient-text" style={{ paddingBottom: '5px' }}>
                        Help & User Manual
                    </h1>
                    <p className="lead fw-semibold mb-0 mx-auto" style={{ maxWidth: '680px', lineHeight: '1.6', color: '#1e293b' }}>
                        Everything you need to get started with ICBT Carpool — whether you're a passenger or a driver.
                    </p>
                </div>
            </div>

            <div className="container py-4" style={{ maxWidth: '900px' }}>

                {/* Instructions Accordion */}
                <h5 className="fw-bold mb-3 ms-1" style={{ color: '#0f172a' }}>📘 Role Instructions</h5>

                <AccordionItem title="Instructions for Passengers" icon={Users} defaultOpen>
                    <ul className="list-unstyled mb-0 mt-3 d-flex flex-column gap-3">
                        {[
                            ['Registration', "Register as a 'Passenger'. Ensure your details are correct."],
                            ['Finding a Ride', "Navigate to 'Search Rides', select your route (e.g., Kegalle, Kandy) and browse available vehicles."],
                            ['Booking', "Click 'Request' on your preferred ride. The driver will receive a notification to Accept or Reject."],
                            ['Status', "Check your 'Dashboard' for the status of your request (Pending/Accepted/Rejected)."],
                            ['Chat', "Once matched, coordinate pick-up times via the real-time chat box."],
                        ].map(([label, text]) => (
                            <li key={label} className="d-flex gap-3">
                                <span className="text-warning fw-bold flex-shrink-0">→</span>
                                <span className="text-white-50"><strong className="text-white">{label}:</strong> {text}</span>
                            </li>
                        ))}
                    </ul>
                </AccordionItem>

                <AccordionItem title="Instructions for Drivers" icon={Car}>
                    <p className="text-white-50 mt-3 mb-3" style={{ lineHeight: '1.7' }}>
                        As a driver on ICBT Carpool, you can offer seats in your vehicle to fellow students and staff travelling the same route.
                    </p>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                        {[
                            ['Registration', "Select 'Driver' role during sign up. Enter your Vehicle Name, Number Plate, and available Seat count accurately."],
                            ['Adding Vehicles', "From your Dashboard, click '+ Add Vehicle' to register a new vehicle at any time."],
                            ['Posting a Ride', "Go to your Dashboard and use the 'Post a Ride' form. Select your vehicle, pick locations on the map, set departure time, and enter available seats."],
                            ['Using the Map', "Click 'Set Pickup' or 'Set Dropoff', then click your location on the map to pin it. A dashed line connects both points."],
                            ['Managing Requests', "Passengers will send ride requests visible in the 'Booking Requests' panel. Review and click Accept or Reject."],
                            ['Chat', "Use the real-time Chat to coordinate precise pickup times with accepted passengers before departure."],
                        ].map(([label, text]) => (
                            <li key={label} className="d-flex gap-3">
                                <span className="text-warning fw-bold flex-shrink-0">→</span>
                                <span className="text-white-50"><strong className="text-white">{label}:</strong> {text}</span>
                            </li>
                        ))}
                    </ul>
                </AccordionItem>

                {/* FAQ */}
                <h5 className="fw-bold mt-5 mb-3 ms-1" style={{ color: '#0f172a' }}>❓ Frequently Asked Questions</h5>

                <AccordionItem title="How is the fuel cost calculated?" icon={HelpCircle}>
                    <p className="text-white-50 mb-0 mt-3" style={{ lineHeight: '1.7' }}>
                        The fuel cost is automatically calculated based on the route distance and the number of accepted passengers. Payments can be tracked on your dashboard.
                    </p>
                </AccordionItem>

                <AccordionItem title="Is my data secure?" icon={HelpCircle}>
                    <p className="text-white-50 mb-0 mt-3" style={{ lineHeight: '1.7' }}>
                        Yes, all ICBT student and staff data is encrypted and kept private. We only share necessary trip details between the matched driver and passenger.
                    </p>
                </AccordionItem>

                <AccordionItem title="Can I cancel a ride?" icon={HelpCircle}>
                    <p className="text-white-50 mb-0 mt-3" style={{ lineHeight: '1.7' }}>
                        Yes. Passengers can cancel a pending or accepted request from the 'My Rides' section. Drivers can delete a ride from 'My Rides' as long as it hasn't departed.
                    </p>
                </AccordionItem>

                {/* Support Contact */}
                <h5 className="fw-bold mt-5 mb-3 ms-1" style={{ color: '#0f172a' }}>📞 Support Contact</h5>
                <div className="card p-4 p-md-5 rounded-4 shadow-sm" style={DARK_CARD}>
                    <div className="row g-4">
                        <div className="col-sm-4 d-flex align-items-start gap-3">
                            <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="fw-bold text-white mb-0 small">Email</p>
                                <p className="text-white-50 small mb-0">support-carpool@icbt.lk</p>
                            </div>
                        </div>
                        <div className="col-sm-4 d-flex align-items-start gap-3">
                            <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="fw-bold text-white mb-0 small">Helpdesk</p>
                                <p className="text-white-50 small mb-0">+94 11 234 5678 (ext 102)</p>
                            </div>
                        </div>
                        <div className="col-sm-4 d-flex align-items-start gap-3">
                            <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="fw-bold text-white mb-0 small">Office</p>
                                <p className="text-white-50 small mb-0">Student Services, ICBT Kandy</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Help;
