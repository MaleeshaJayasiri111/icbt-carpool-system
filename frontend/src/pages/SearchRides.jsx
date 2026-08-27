import React, { useState, useEffect } from 'react';
import { Search, MapPin, User, Clock, ArrowRight, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapPicker from '../components/MapPicker';

const DUMMY_RIDES = [
    { id: 1, driver: 'Saman Kumara', vehicle: 'Toyota Prius (CAA-1234)', route: 'Kegalle', time: '08:00 AM', seatsLeft: 2 },
    { id: 2, driver: 'Kamal Perera', vehicle: 'Honda Fit (CBB-5678)', route: 'Colombo', time: '07:30 AM', seatsLeft: 3 },
    { id: 3, driver: 'Nimal Silva', vehicle: 'Suzuki Fiero (WP-9012)', route: 'Kandy', time: '09:00 AM', seatsLeft: 1 },
    { id: 4, driver: 'Amal Fernando', vehicle: 'Nissan Leaf (CBE-3456)', route: 'Kegalle', time: '05:00 PM', seatsLeft: 2 }
];

const SearchRides = () => {
    const [filter, setFilter] = useState('');
    const [timeFilter, setTimeFilter] = useState('');
    const [rides, setRides] = useState([]);
    const [bookingStatus, setBookingStatus] = useState(null);
    const [mapPickup, setMapPickup] = useState(null);
    const [mapDropoff, setMapDropoff] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Initial load
        setRides(DUMMY_RIDES);
    }, []);

    const displayedRides = rides.filter(r => {
        const matchRoute = filter ? r.route === filter : true;
        let matchTime = true;
        if (timeFilter === 'Morning') matchTime = r.time.includes('AM');
        if (timeFilter === 'Afternoon/Evening') matchTime = r.time.includes('PM');
        return matchRoute && matchTime;
    });

    const handleSearch = (e) => {
        setFilter(e.target.value);
    };

    const handleTimeSearch = (e) => {
        setTimeFilter(e.target.value);
    };

    const handleRequestRide = (rideId) => {
        try {
            // Basic simulation of booking request
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                navigate('/login');
                return;
            }

            console.log(`Request sent to ride ID ${rideId}`);
            setBookingStatus(`Your request to join ride #${rideId} has been sent successfully.`);
            setTimeout(() => setBookingStatus(null), 3000);

        } catch (err) {
            console.error(err);
        }
    };

    const [locationConfirmed, setLocationConfirmed] = useState(false);

    const handleConfirmLocation = () => {
        setShowMap(false);
        setLocationConfirmed(true);
    };

    const handleClearLocation = () => {
        setMapPickup(null);
        setMapDropoff(null);
        setLocationConfirmed(false);
    };

    return (
        <div className="mx-auto" style={{ maxWidth: '1000px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-3">
                <h2 className="fw-bold mb-0">Available Rides</h2>
                <div className="d-flex gap-2 align-items-center">
                    <button
                        type="button"
                        className={`btn btn-sm ${showMap ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-1`}
                        onClick={() => { setShowMap(v => !v); setLocationConfirmed(false); }}
                    >
                        <MapPin size={15} /> {showMap ? 'Hide Map' : 'Pick on Map'}
                    </button>
                    <div className="d-flex align-items-center bg-white border rounded px-3 py-1 shadow-sm" style={{ width: '200px' }}>
                        <Clock size={18} className="text-muted me-2" />
                        <select className="form-select border-0 shadow-none text-muted" value={timeFilter} onChange={handleTimeSearch}>
                            <option value="">Any Time</option>
                            <option value="Morning">Morning (AM)</option>
                            <option value="Afternoon/Evening">Afternoon/Evening (PM)</option>
                        </select>
                    </div>
                    <div className="d-flex align-items-center bg-white border rounded px-3 py-1 shadow-sm" style={{ width: '200px' }}>
                        <MapPin size={18} className="text-muted me-2" />
                        <select className="form-select border-0 shadow-none text-muted" value={filter} onChange={handleSearch}>
                            <option value="">All Routes</option>
                            <option value="Kegalle">Kegalle</option>
                            <option value="Colombo">Colombo</option>
                            <option value="Kandy">Kandy</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Collapsible Map Picker */}
            {showMap && (
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-bottom py-2 d-flex align-items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        <span className="fw-semibold small">Select Your Pickup &amp; Dropoff Location</span>
                    </div>
                    <div className="card-body">
                        <MapPicker
                            height="320px"
                            onPickupChange={(lat, lng) => { setMapPickup(lat && lng ? { lat, lng } : null); setLocationConfirmed(false); }}
                            onDropoffChange={(lat, lng) => { setMapDropoff(lat && lng ? { lat, lng } : null); setLocationConfirmed(false); }}
                        />
                        {/* Action button — only shown when both pins are placed */}
                        {mapPickup && mapDropoff && (
                            <div className="d-flex justify-content-end mt-2">
                                <button
                                    type="button"
                                    className="btn btn-primary d-flex align-items-center gap-2 fw-semibold"
                                    onClick={handleConfirmLocation}
                                >
                                    <Search size={16} /> Search Rides Near My Pickup
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Location confirmed banner */}
            {locationConfirmed && mapPickup && (
                <div className="alert alert-primary d-flex align-items-start gap-3 mb-4 shadow-sm border-0" style={{ borderLeft: '4px solid #0d6efd' }}>
                    <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                    <div className="flex-grow-1">
                        <div className="fw-semibold mb-1">Searching rides near your selected location</div>
                        <div className="small text-muted d-flex flex-wrap gap-3">
                            <span>
                                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#27ae60', marginRight: 5 }} />
                                Pickup: {mapPickup.lat.toFixed(5)}, {mapPickup.lng.toFixed(5)}
                            </span>
                            {mapDropoff && (
                                <span>
                                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#e74c3c', marginRight: 5 }} />
                                    Dropoff: {mapDropoff.lat.toFixed(5)}, {mapDropoff.lng.toFixed(5)}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-0"
                        onClick={handleClearLocation}
                        style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                    >
                        ✕ Clear
                    </button>
                </div>
            )}

            {bookingStatus && (
                <div className="alert alert-success d-flex align-items-center gap-2">
                    <span>{bookingStatus}</span>
                </div>
            )}


            {displayedRides.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <Search size={40} className="mb-3 opacity-50" />
                    <h5>No rides found for this route.</h5>
                    <p>Please try selecting another region or check back later.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {displayedRides.map(ride => (
                        <div key={ride.id} className="col-md-6 col-lg-6">
                            <div className="card h-100 border-0 shadow-sm custom-card">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h5 className="fw-bold text-primary mb-1">{ride.route} Route</h5>
                                            <div className="text-muted small d-flex align-items-center gap-1">
                                                <Clock size={14} />
                                                <span>Departure: {ride.time}</span>
                                            </div>
                                        </div>
                                        <span className="badge bg-light text-primary border px-2 py-1">
                                            {ride.seatsLeft} Seats Left
                                        </span>
                                    </div>

                                    <div className="bg-light rounded p-3 mb-3 border">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <User size={16} className="text-secondary" />
                                            <span className="fw-medium text-dark">{ride.driver}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <Car size={16} className="text-secondary" />
                                            <span className="small text-muted">{ride.vehicle}</span>
                                        </div>
                                    </div>

                                    <button onClick={() => handleRequestRide(ride.id)} className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-medium">
                                        Request to Join <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchRides;
