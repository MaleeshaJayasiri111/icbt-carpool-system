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

            <div className="col-md-6 col-lg-4">
                <div className="card shadow-sm h-100">
                    <div className="card-body">
                        <h5>Vehicles</h5>
                        <p>Register and manage your vehicles.</p>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/driver/vehicles")}
                        >
                            Manage Vehicles
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-md-6 col-lg-4">
                <div className="card shadow-sm h-100">
                    <div className="card-body">
                        <h5>Post Ride</h5>
                        <p>Create a new ride for passengers.</p>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/driver/post-ride")}
                        >
                            Post Ride
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-md-6 col-lg-4">
                <div className="card shadow-sm h-100">
                    <div className="card-body">
                        <h5>Ride Requests</h5>
                        <p>Review passenger requests.</p>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/driver/ride-requests")}
                        >
                            View Requests
                        </button>
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
                    <h1 className="display-5 fw-bold mb-2 text-white">Welcome, {user.full_name}</h1>
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
