import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon broken in React build
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

/**
 * Reverse geocode a lat/lng using OpenStreetMap Nominatim (free, no API key).
 * Returns a short readable place name.
 */
const reverseGeocode = async (lat, lng) => {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        // Build a short name: suburb / city / town / state
        const addr = data.address || {};
        const name =
            addr.suburb ||
            addr.neighbourhood ||
            addr.village ||
            addr.town ||
            addr.city ||
            addr.county ||
            addr.state ||
            data.display_name?.split(',')[0] ||
            'Unknown';
        return name;
    } catch {
        return 'Unknown';
    }
};

const ClickHandler = ({ onClick }) => {
    useMapEvents({ click: (e) => onClick(e.latlng) });
    return null;
};

/**
 * MapPicker — sequential click with reverse geocoding.
 *   1st click → green Pickup pin + Nominatim place name
 *   2nd click → red Dropoff pin + Nominatim place name
 *   Reset     → clears both
 *
 * Callbacks receive (lat, lng, placeName):
 *   onPickupChange(lat, lng, name)
 *   onDropoffChange(lat, lng, name)
 */
const MapPicker = ({ onPickupChange, onDropoffChange, height = '350px' }) => {
    const [pickup, setPickup] = useState(null);   // { lat, lng, name }
    const [dropoff, setDropoff] = useState(null); // { lat, lng, name }
    const [loading, setLoading] = useState(false);

    const defaultCenter = [6.9271, 79.8612];

    const handleMapClick = useCallback(async (latlng) => {
        const { lat, lng } = latlng;
        setLoading(true);
        const name = await reverseGeocode(lat, lng);
        setLoading(false);

        if (!pickup) {
            const pin = { lat, lng, name };
            setPickup(pin);
            if (onPickupChange) onPickupChange(lat, lng, name);
        } else if (!dropoff) {
            const pin = { lat, lng, name };
            setDropoff(pin);
            if (onDropoffChange) onDropoffChange(lat, lng, name);
        }
    }, [pickup, dropoff, onPickupChange, onDropoffChange]);

    const handleReset = () => {
        setPickup(null);
        setDropoff(null);
        if (onPickupChange) onPickupChange(null, null, null);
        if (onDropoffChange) onDropoffChange(null, null, null);
    };

    const polylinePositions = pickup && dropoff
        ? [[pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]]
        : [];

    return (
        <div className="mb-4">
            {/* Legend row */}
            <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                <div className="d-flex flex-wrap gap-3 small">
                    <span className="d-flex align-items-center gap-1">
                        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#27ae60', display: 'inline-block', flexShrink: 0 }} />
                        <span className="text-muted">
                            {pickup ? (
                                <><strong className="text-dark">{pickup.name}</strong><span className="ms-1 text-muted" style={{ fontSize: '0.7rem' }}>({pickup.lat.toFixed(4)}, {pickup.lng.toFixed(4)})</span></>
                            ) : '1st click — Pickup'}
                        </span>
                    </span>
                    <span className="d-flex align-items-center gap-1">
                        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#e74c3c', display: 'inline-block', flexShrink: 0 }} />
                        <span className="text-muted">
                            {dropoff ? (
                                <><strong className="text-dark">{dropoff.name}</strong><span className="ms-1 text-muted" style={{ fontSize: '0.7rem' }}>({dropoff.lat.toFixed(4)}, {dropoff.lng.toFixed(4)})</span></>
                            ) : '2nd click — Dropoff'}
                        </span>
                    </span>
                    {loading && (
                        <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                            <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} /> Getting location name...
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-0 px-2"
                    onClick={handleReset}
                    style={{ fontSize: '0.75rem' }}
                >
                    ↺ Reset
                </button>
            </div>

            {/* Map */}
            <div style={{ height, borderRadius: '10px', overflow: 'hidden', border: '1px solid #dee2e6' }}>
                <MapContainer
                    center={defaultCenter}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ClickHandler onClick={handleMapClick} />
                    {pickup && <Marker position={[pickup.lat, pickup.lng]} icon={greenIcon} />}
                    {dropoff && <Marker position={[dropoff.lat, dropoff.lng]} icon={redIcon} />}
                    {polylinePositions.length === 2 && (
                        <Polyline
                            positions={polylinePositions}
                            pathOptions={{ color: '#0d6efd', weight: 3, dashArray: '6, 8' }}
                        />
                    )}
                </MapContainer>
            </div>

            {/* Status hint */}
            <p className="text-muted mt-1 mb-0" style={{ fontSize: '0.73rem' }}>
                {!pickup && !dropoff && '📍 Click on the map to set your Pickup location.'}
                {pickup && !dropoff && '🔴 Now click to set your Dropoff location.'}
                {pickup && dropoff && '✅ Both locations selected. Click Reset to start over.'}
            </p>
        </div>
    );
};

export default MapPicker;
