import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, Car, Check, X, Clock, MapPin } from 'lucide-react';
import MapPicker from '../components/MapPicker';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Driver states
    const [postedRides, setPostedRides] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([
        { id: 101, passengerName: 'Ruwan Senanayake', route: 'Kegalle', status: 'pending' },
        { id: 102, passengerName: 'Kasun Silva', route: 'Kandy', status: 'pending' }
    ]);
    const [vehicles, setVehicles] = useState([
        { id: 1, name: 'Toyota Prius (CBE-1234)' }
    ]);
    const [newVehicle, setNewVehicle] = useState('');
    const [showVehicleInput, setShowVehicleInput] = useState(false);
    const [postForm, setPostForm] = useState({ route: '', time: '', seats: '', vehicle: '', pickup: null, dropoff: null });

    // Passenger states
    const [myRequests, setMyRequests] = useState([
        { id: 201, driverName: 'Saman Kumara', route: 'Kegalle', time: '08:00 AM', status: 'pending' },
        { id: 202, driverName: 'Kumari Perera', route: 'Colombo', time: '07:30 AM', status: 'accepted' },
        { id: 203, driverName: 'Nimal Silva', route: 'Kandy', time: '09:00 AM', status: 'rejected' }
    ]);
    const [activePayment, setActivePayment] = useState(null);

    const handleCancelRequest = (id) => {
        setMyRequests(myRequests.filter(req => req.id !== id));
    };

    const processPayment = (req) => {
        setActivePayment({ ...req, amount: 450, date: new Date().toLocaleDateString() });
    };

    const closePayment = () => {
        if (activePayment) {
            setMyRequests(myRequests.map(r => r.id === activePayment.id ? { ...r, status: 'paid' } : r));
        }
        setActivePayment(null);
    };

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser) {
                navigate('/login');
            } else {
                setUser(storedUser);
            }
        } catch (err) {
            console.error(err);
            navigate('/login');
        }
    }, [navigate]);

    if (!user) return <div className="text-center p-5">Loading...</div>;

    const handleAddVehicle = () => {
        if (newVehicle.trim()) {
            const added = { id: Date.now(), name: newVehicle };
            setVehicles([...vehicles, added]);
            setNewVehicle('');
            setShowVehicleInput(false);
            if (!postForm.vehicle) {
                setPostForm({ ...postForm, vehicle: added.name });
            }
        }
    };

    const handlePostRide = (e) => {
        e.preventDefault();
        try {
            const newRide = { ...postForm, id: Date.now() };
            setPostedRides([...postedRides, newRide]);
            setPostForm({ route: '', time: '', seats: '', vehicle: postForm.vehicle });
            alert('Ride posted successfully!');
        } catch (err) {
            console.error(err);
        }
    };

    const updateRequestStatus = (id, newStatus) => {
        try {
            setIncomingRequests(incomingRequests.map(req =>
                req.id === id ? { ...req, status: newStatus } : req
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const DriverDashboard = () => (
        <div className="row g-4">
            <div className="col-md-5">
                <div className="card shadow-sm border-0 h-100 mb-4">
                    <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2"><Car size={20} className="text-primary" /> Post a Ride</h5>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowVehicleInput(!showVehicleInput)}>+ Add Vehicle</button>
                    </div>
                    <div className="card-body">
                        {showVehicleInput && (
                            <div className="mb-4 p-3 bg-light rounded border border-primary border-opacity-25">
                                <h6 className="fw-medium small mb-2">Add New Vehicle</h6>
                                <div className="d-flex gap-2">
                                    <input type="text" className="form-control form-control-sm" placeholder="e.g. Honda Civic (CAA-9876)" value={newVehicle} onChange={e => setNewVehicle(e.target.value)} />
                                    <button type="button" className="btn btn-sm btn-primary" onClick={handleAddVehicle}>Add</button>
                                </div>
                            </div>
                        )}
                        <form onSubmit={handlePostRide}>
                            {/* Map Location Picker */}
                            <div className="mb-3">
                                <label className="form-label fw-medium small d-flex align-items-center gap-1">
                                    <MapPin size={14} className="text-primary" /> Pick Locations on Map
                                </label>
                                <MapPicker
                                    height="260px"
                                    onPickupChange={(lat, lng) => setPostForm(f => ({ ...f, pickup: lat && lng ? { lat, lng } : null }))}
                                    onDropoffChange={(lat, lng) => setPostForm(f => ({ ...f, dropoff: lat && lng ? { lat, lng } : null }))}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-medium small">Select Vehicle</label>
                                <select className="form-select" required value={postForm.vehicle} onChange={e => setPostForm({ ...postForm, vehicle: e.target.value })}>
                                    <option value="">Select a Vehicle...</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.name}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-medium small">Route / Destination</label>
                                <select className="form-select" required value={postForm.route} onChange={e => setPostForm({ ...postForm, route: e.target.value })}>
                                    <option value="">Select Route</option>
                                    <option value="Kegalle">Kegalle</option>
                                    <option value="Colombo">Colombo</option>
                                    <option value="Kandy">Kandy</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-medium small">Departure Time</label>
                                <input type="time" className="form-control" required value={postForm.time} onChange={e => setPostForm({ ...postForm, time: e.target.value })} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-medium small">Available Seats</label>
                                <input type="number" min="1" max="10" className="form-control" required value={postForm.seats} onChange={e => setPostForm({ ...postForm, seats: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Post Ride Offer</button>
                        </form>
                    </div>
                </div>

                {postedRides.length > 0 && (
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom py-3">
                            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2"><Car size={20} className="text-primary" /> My Posted Rides</h5>
                        </div>
                        <ul className="list-group list-group-flush">
                            {postedRides.map(ride => (
                                <li key={ride.id} className="list-group-item py-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1 text-dark">{ride.route}</h6>
                                            <div className="small text-muted d-flex align-items-center gap-2 mt-1">
                                                <span className="d-flex align-items-center gap-1"><Clock size={12} /> {ride.time}</span>
                                                {ride.vehicle && (
                                                    <span className="d-flex align-items-center gap-1 border-start border-2 ps-2"><Car size={12} /> {ride.vehicle}</span>
                                                )}
                                            </div>
                                            {ride.pickup && (
                                                <div className="small text-muted mt-1 d-flex align-items-center gap-1">
                                                    <MapPin size={11} className="text-success" />
                                                    <span>{ride.pickup.lat.toFixed(4)}, {ride.pickup.lng.toFixed(4)}</span>
                                                    {ride.dropoff && <><span>→</span><span>{ride.dropoff.lat.toFixed(4)}, {ride.dropoff.lng.toFixed(4)}</span></>}
                                                </div>
                                            )}
                                        </div>
                                        <span className="badge bg-secondary">{ride.seats} Seats</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Ride Requests Section */}
            <div className="col-md-7">
                <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-white border-bottom py-3">
                        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2"><Settings size={20} className="text-primary" /> Booking Requests</h5>
                    </div>
                    <div className="card-body p-0">
                        {incomingRequests.length === 0 ? (
                            <div className="p-4 text-center text-muted">No requests at the moment.</div>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {incomingRequests.map(req => (
                                    <li key={req.id} className="list-group-item p-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1 fw-semibold">{req.passengerName}</h6>
                                                <span className="text-muted small d-flex align-items-center gap-1"><MapPin size={12} /> Route: {req.route}</span>
                                            </div>
                                            <div>
                                                {req.status === 'pending' ? (
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-success d-flex align-items-center gap-1" onClick={() => updateRequestStatus(req.id, 'accepted')}><Check size={16} /> Accept</button>
                                                        <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" onClick={() => updateRequestStatus(req.id, 'rejected')}><X size={16} /> Reject</button>
                                                    </div>
                                                ) : (
                                                    <span className={`badge ${req.status === 'accepted' ? 'bg-success' : 'bg-danger'} px-2 py-1`}>
                                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );


    const PassengerDashboard = () => (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2"><Clock size={20} className="text-primary" /> My Ride Requests</h5>
                <Link to="/search-rides" className="btn btn-sm btn-primary">Find New Ride</Link>
            </div>
            <div className="card-body p-0">
                {myRequests.length === 0 ? (
                    <div className="p-4 text-center text-muted">No rides requested yet.</div>
                ) : (
                    <ul className="list-group list-group-flush">
                        {myRequests.map(req => (
                            <li key={req.id} className="list-group-item p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1 fw-semibold">Driver: {req.driverName}</h6>
                                        <span className="text-muted small me-3"><MapPin size={12} className="me-1" />{req.route}</span>
                                        <span className="text-muted small"><Clock size={12} className="me-1" />{req.time}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <span className={`badge px-2 py-1 ${req.status === 'pending' ? 'bg-warning text-dark' : req.status === 'accepted' ? 'bg-success' : req.status === 'paid' ? 'bg-primary' : 'bg-danger'}`}>
                                            {req.status.toUpperCase()}
                                        </span>
                                        {req.status === 'accepted' && (
                                            <button onClick={() => processPayment(req)} className="btn btn-sm btn-success d-flex align-items-center gap-1">
                                                Pay Share
                                            </button>
                                        )}
                                        {(req.status === 'pending' || req.status === 'accepted') && (
                                            <button onClick={() => handleCancelRequest(req.id)} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1">
                                                <X size={14} /> Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {activePayment && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="card shadow border-0 p-4" style={{ maxWidth: '400px', width: '100%' }}>
                        <h4 className="fw-bold mb-3 text-center">Digital Receipt</h4>
                        <div className="bg-light p-3 rounded mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Transaction ID:</span>
                                <strong>#TXN-{Math.floor(Math.random() * 100000)}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Date:</span>
                                <strong>{activePayment.date}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Driver:</span>
                                <strong>{activePayment.driverName}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Route:</span>
                                <strong>{activePayment.route}</strong>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <span className="fw-medium">Fuel Share Cost:</span>
                                <h5 className="fw-bold text-success">LKR {activePayment.amount}</h5>
                            </div>
                        </div>
                        <button onClick={closePayment} className="btn btn-primary w-100 fw-semibold">Confirm Payment & Close</button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div style={{ marginTop: '-1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem', width: 'calc(100% + 3rem)' }}>
            {/* Role-Based Full-Width Hero Banner */}
            <div
                className="w-100 text-white position-relative overflow-hidden shadow-sm"
                style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.55)), url('/${user.role === 'driver' ? 'driver-hero.jpg' : 'passenger-hero.jpg'}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '320px',
                    padding: '3.5rem 1.5rem 5rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <div className="container text-start" style={{ maxWidth: '1000px' }}>
                    <span className={`badge px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center ${user.role === 'driver' ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
                        {user.role === 'driver' ? <Car size={16} className="me-1" /> : <Clock size={16} className="me-1" />}
                        {user.role === 'driver' ? 'Driver Dashboard' : 'Passenger Dashboard'}
                    </span>
                    <h1 className="display-5 fw-bold mb-2 text-white">Welcome, {user.name}</h1>
                    <p className="lead text-light text-opacity-90 mb-0" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
                        {user.role === 'driver'
                            ? 'Post your rides, manage booking requests, and connect with passengers heading your way.'
                            : 'Track your ride requests, confirm bookings, and coordinate with your driver seamlessly.'}
                    </p>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="w-100 mx-auto py-4 px-3" style={{ maxWidth: '1000px' }}>
                <div className="position-relative" style={{ marginTop: '-50px', zIndex: 2 }}>
                    {user.role === 'driver' ? <DriverDashboard /> : <PassengerDashboard />}
                </div>

                {/* Universal Chat Link */}
                <div className="mt-5 text-center px-3 py-4 bg-light rounded border border-primary border-opacity-10">
                    <h5 className="fw-semibold">Need to coordinate details?</h5>
                    <p className="text-muted small mb-3">Open the live messaging center to communicate with your matches.</p>
                    <Link to="/chat" className="btn btn-outline-primary px-4">Open Chat</Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
