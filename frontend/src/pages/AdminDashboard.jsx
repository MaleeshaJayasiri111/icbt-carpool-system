import React, { useState, useEffect, useCallback } from 'react';
import {
    Users,
    Car,
    Shield,
    ShieldCheck,
    ShieldAlert,
    Trash2,
    CheckCircle2,
    XCircle,
    RefreshCw,
    BarChart3,
    Activity,
    Fuel,
    Coins,
    Leaf,
    Search,
    UserCheck,
    UserX,
    MapPin,
    Calendar,
    Clock,
    AlertTriangle
} from 'lucide-react';
import {
    getAdminAnalytics,
    getAdminLogs,
    getAdminUsers,
    updateAdminUserVerification,
    deleteAdminUser,
    getAdminRides,
    deleteAdminRide
} from '../services/adminService';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    // Data States
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [rides, setRides] = useState([]);
    const [logs, setLogs] = useState([]);

    // Filter & Search States
    const [userSearch, setUserSearch] = useState('');
    const [userFilter, setUserFilter] = useState('all'); // all, driver, passenger, unverified
    const [rideSearch, setRideSearch] = useState('');
    const [rideFilter, setRideFilter] = useState('all'); // all, available, completed, cancelled
    const [logSearch, setLogSearch] = useState('');

    // Modal Confirmation State
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        type: null, // 'user' or 'ride'
        id: null,
        name: ''
    });

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const [analyticsRes, usersRes, ridesRes, logsRes] = await Promise.all([
                getAdminAnalytics().catch(() => null),
                getAdminUsers().catch(() => ({ data: [] })),
                getAdminRides().catch(() => ({ data: [] })),
                getAdminLogs().catch(() => ({ data: [] }))
            ]);

            if (analyticsRes?.data) setAnalytics(analyticsRes.data);
            if (usersRes?.data) setUsers(usersRes.data);
            if (ridesRes?.data) setRides(ridesRes.data);
            if (logsRes?.data) setLogs(logsRes.data);

        } catch (err) {
            console.error("Failed to load admin data:", err);
            setError("Failed to load system data. Please try again.");
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    // User Verification Toggle
    const handleToggleVerification = async (userId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await updateAdminUserVerification(userId, newStatus);
            setSuccessMsg(`ICBT ID verification status updated successfully.`);
            setTimeout(() => setSuccessMsg(''), 3000);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update verification status.');
        }
    };

    // Confirm Delete Action Trigger
    const openDeleteModal = (type, id, name) => {
        setDeleteModal({
            show: true,
            type,
            id,
            name
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ show: false, type: null, id: null, name: '' });
    };

    // Execute Delete Action
    const confirmDelete = async () => {
        try {
            if (deleteModal.type === 'user') {
                await deleteAdminUser(deleteModal.id);
                setSuccessMsg(`User "${deleteModal.name}" deleted successfully.`);
            } else if (deleteModal.type === 'ride') {
                await deleteAdminRide(deleteModal.id);
                setSuccessMsg(`Ride post deleted successfully.`);
            }
            setTimeout(() => setSuccessMsg(''), 3000);
            closeDeleteModal();
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || `Failed to delete ${deleteModal.type}.`);
        }
    };

    // Filtering Users
    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.full_name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                              (user.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                              (user.phone || '').toLowerCase().includes(userSearch.toLowerCase());
        
        if (!matchesSearch) return false;

        if (userFilter === 'driver') return user.role === 'driver';
        if (userFilter === 'passenger') return user.role === 'passenger';
        if (userFilter === 'unverified') return !user.is_verified && user.user_profile !== 'verified';
        return true;
    });

    // Filtering Rides
    const filteredRides = rides.filter(ride => {
        const matchesSearch = (ride.start_location || '').toLowerCase().includes(rideSearch.toLowerCase()) ||
                              (ride.destination || '').toLowerCase().includes(rideSearch.toLowerCase()) ||
                              (ride.users?.full_name || '').toLowerCase().includes(rideSearch.toLowerCase());

        if (!matchesSearch) return false;

        if (rideFilter !== 'all') return ride.status === rideFilter;
        return true;
    });

    // Filtering Logs
    const filteredLogs = logs.filter(log =>
        (log.description || '').toLowerCase().includes(logSearch.toLowerCase()) ||
        (log.category || '').toLowerCase().includes(logSearch.toLowerCase())
    );

    return (
        <div style={{ backgroundColor: '#f8fafc', color: '#1e293b', minHeight: '100vh', paddingBottom: '3rem' }}>
            {/* Header Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #172554 100%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2.5rem 0'
            }}>
                <div className="container">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="badge bg-warning text-white font-monospace px-3 py-1 text-uppercase fw-bold rounded-pill" style={{ letterSpacing: '1px' }}>
                                    <Shield size={14} className="me-1" /> Admin Control Panel
                                </span>
                                <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 px-3 py-1 rounded-pill">
                                    ICBT Carpool System
                                </span>
                            </div>
                            <h1 className="h2 fw-bold text-white mb-1 d-flex align-items-center gap-2">
                                System Administration & Analytics
                            </h1>
                            <p className="text-secondary mb-0">
                                Monitor users, ride activities, security verifications, and Sri Lanka fuel quota metrics.
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="btn btn-outline-light d-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm"
                                style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.05)' }}
                            >
                                <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
                                {refreshing ? 'Refreshing...' : 'Refresh Data'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mt-4">
                {/* Alert Notifications */}
                {successMsg && (
                    <div className="alert alert-success d-flex align-items-center alert-dismissible fade show bg-success bg-opacity-10 border-success text-success rounded-3 shadow-sm" role="alert">
                        <CheckCircle2 size={18} className="me-2 flex-shrink-0" />
                        <div>{successMsg}</div>
                        <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger d-flex align-items-center alert-dismissible fade show bg-danger bg-opacity-10 border-danger text-danger rounded-3 shadow-sm" role="alert">
                        <XCircle size={18} className="me-2 flex-shrink-0" />
                        <div>{error}</div>
                    </div>
                )}

                {/* Quick Summary Stats Bar */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="p-3 rounded-4" style={{ background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-secondary small fw-medium">Total Registered Users</div>
                                    <div className="h3 fw-bold text-white mb-0 mt-1">
                                        {analytics ? analytics.users.total : users.length}
                                    </div>
                                    <div className="small text-muted mt-1">
                                        <span className="text-info fw-semibold">{analytics?.users.drivers || 0} Drivers</span> • <span className="text-warning fw-semibold">{analytics?.users.passengers || 0} Passengers</span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary">
                                    <Users size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="p-3 rounded-4" style={{ background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-secondary small fw-medium">Completed Rides</div>
                                    <div className="h3 fw-bold text-white mb-0 mt-1">
                                        {analytics ? analytics.rides.completed : 0}
                                    </div>
                                    <div className="small text-muted mt-1">
                                        <span className="text-success fw-semibold">{analytics?.rides.active || 0} Active Now</span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-3 bg-success bg-opacity-10 text-success">
                                    <Car size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="p-3 rounded-4" style={{ background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-secondary small fw-medium">Fuel Saved (Liters)</div>
                                    <div className="h3 fw-bold text-warning mb-0 mt-1">
                                        {analytics ? `${analytics.quotaSavings.fuelSavedLiters} L` : '0 L'}
                                    </div>
                                    <div className="small text-muted mt-1">
                                        Sri Lanka Quota Metric
                                    </div>
                                </div>
                                <div className="p-3 rounded-3 bg-warning bg-opacity-10 text-warning">
                                    <Fuel size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="p-3 rounded-4" style={{ background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-secondary small fw-medium">Fuel Cost Saved</div>
                                    <div className="h3 fw-bold text-info mb-0 mt-1">
                                        {analytics ? `LKR ${analytics.quotaSavings.moneySavedLkr.toLocaleString()}` : 'LKR 0'}
                                    </div>
                                    <div className="small text-muted mt-1">
                                        Community Savings
                                    </div>
                                </div>
                                <div className="p-3 rounded-3 bg-info bg-opacity-10 text-info">
                                    <Coins size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation Controls */}
                <div className="d-flex flex-wrap gap-2 mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold transition-all ${
                            activeTab === 'analytics'
                                ? 'btn-warning text-white shadow-sm'
                                : 'btn-outline-light border-0'
                        }`}
                    >
                        <BarChart3 size={18} />
                        Analytics & Quota Metrics
                    </button>

                    <button
                        onClick={() => setActiveTab('users')}
                        className={`btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold transition-all ${
                            activeTab === 'users'
                                ? 'btn-warning text-white shadow-sm'
                                : 'btn-outline-light border-0'
                        }`}
                    >
                        <Users size={18} />
                        User Management ({users.length})
                    </button>

                    <button
                        onClick={() => setActiveTab('rides')}
                        className={`btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold transition-all ${
                            activeTab === 'rides'
                                ? 'btn-warning text-white shadow-sm'
                                : 'btn-outline-light border-0'
                        }`}
                    >
                        <Car size={18} />
                        Ride Management ({rides.length})
                    </button>

                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold transition-all ${
                            activeTab === 'logs'
                                ? 'btn-warning text-white shadow-sm'
                                : 'btn-outline-light border-0'
                        }`}
                    >
                        <Activity size={18} />
                        Activity Logs ({logs.length})
                    </button>
                </div>

                {/* TAB 1: ANALYTICS & QUOTA SAVINGS */}
                {activeTab === 'analytics' && (
                    <div className="row g-4">
                        {/* Sri Lanka Fuel Crisis Context Card */}
                        <div className="col-12">
                            <div className="p-4 rounded-4" style={{
                                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, #1e293b 100%)',
                                border: '1px solid rgba(234, 179, 8, 0.3)'
                            }}>
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="p-3 bg-warning text-white rounded-circle shadow-sm">
                                        <Fuel size={28} />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold text-white mb-1">Sri Lanka Fuel Shortage & Quota Savings Metrics</h4>
                                        <p className="text-secondary mb-0">
                                            Quantifying the positive impact of ICBT Campus Carpooling during fuel shortages and QR quota constraints.
                                        </p>
                                    </div>
                                </div>

                                <div className="row g-3 mt-2">
                                    <div className="col-12 col-md-4">
                                        <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                                            <div className="d-flex align-items-center gap-2 text-warning mb-1">
                                                <Fuel size={18} />
                                                <span className="fw-bold">Total Fuel Saved</span>
                                            </div>
                                            <div className="h2 fw-extrabold text-white mb-0">
                                                {analytics?.quotaSavings.fuelSavedLiters || 0} <small className="fs-6 text-muted">Liters</small>
                                            </div>
                                            <div className="small text-secondary mt-1">Based on shared passenger trips</div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-4">
                                        <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                                            <div className="d-flex align-items-center gap-2 text-info mb-1">
                                                <Coins size={18} />
                                                <span className="fw-bold">Total Cost Saved</span>
                                            </div>
                                            <div className="h2 fw-extrabold text-white mb-0">
                                                LKR {(analytics?.quotaSavings.moneySavedLkr || 0).toLocaleString()}
                                            </div>
                                            <div className="small text-secondary mt-1">Direct savings for ICBT students/staff</div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-4">
                                        <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                                            <div className="d-flex align-items-center gap-2 text-success mb-1">
                                                <Leaf size={18} />
                                                <span className="fw-bold">CO2 Emission Reduced</span>
                                            </div>
                                            <div className="h2 fw-extrabold text-white mb-0">
                                                {analytics?.quotaSavings.co2ReducedKg || 0} <small className="fs-6 text-muted">kg</small>
                                            </div>
                                            <div className="small text-secondary mt-1">Campus eco-footprint reduction</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Breakdown */}
                        <div className="col-12 col-md-6">
                            <div className="p-4 rounded-4 h-100" style={{ background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                                    <Users size={20} className="text-warning" /> Registered User Composition
                                </h5>

                                <div className="d-flex justify-content-between mb-2 small text-secondary">
                                    <span>Drivers ({analytics?.users.drivers || 0})</span>
                                    <span>Passengers ({analytics?.users.passengers || 0})</span>
                                </div>

                                <div className="progress mb-4 rounded-pill" style={{ height: '14px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                    <div
                                        className="progress-bar bg-info"
                                        style={{ width: `${analytics?.users.total ? (analytics.users.drivers / analytics.users.total) * 100 : 50}%` }}
                                    ></div>
                                    <div
                                        className="progress-bar bg-warning"
                                        style={{ width: `${analytics?.users.total ? (analytics.users.passengers / analytics.users.total) * 100 : 50}%` }}
                                    ></div>
                                </div>

                                <ul className="list-group list-group-flush bg-transparent">
                                    <li className="list-group-item bg-transparent text-white border-secondary border-opacity-25 d-flex justify-content-between">
                                        <span>Total Accounts Registered</span>
                                        <span className="fw-bold">{analytics?.users.total || 0}</span>
                                    </li>
                                    <li className="list-group-item bg-transparent text-white border-secondary border-opacity-25 d-flex justify-content-between">
                                        <span>ICBT Verified ID Users</span>
                                        <span className="badge bg-success bg-opacity-25 text-success">{analytics?.users.verified || 0} Verified</span>
                                    </li>
                                    <li className="list-group-item bg-transparent text-white border-secondary border-opacity-25 d-flex justify-content-between">
                                        <span>Pending ID Verifications</span>
                                        <span className="badge bg-warning text-white">{(analytics?.users.total || 0) - (analytics?.users.verified || 0)} Pending</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Ride Status Composition */}
                        <div className="col-12 col-md-6">
                            <div className="p-4 rounded-4 h-100" style={{ background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                                    <Car size={20} className="text-warning" /> Ride Post Activity
                                </h5>

                                <div className="row g-2 text-center my-3">
                                    <div className="col-4">
                                        <div className="p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25">
                                            <div className="h4 fw-bold text-success mb-0">{analytics?.rides.completed || 0}</div>
                                            <div className="small text-secondary">Completed</div>
                                        </div>
                                    </div>

                                    <div className="col-4">
                                        <div className="p-3 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-25">
                                            <div className="h4 fw-bold text-primary mb-0">{analytics?.rides.active || 0}</div>
                                            <div className="small text-secondary">Active Now</div>
                                        </div>
                                    </div>

                                    <div className="col-4">
                                        <div className="p-3 rounded-3 bg-danger bg-opacity-10 border border-danger border-opacity-25">
                                            <div className="h4 fw-bold text-danger mb-0">{analytics?.rides.cancelled || 0}</div>
                                            <div className="small text-secondary">Cancelled</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="small text-secondary text-center mt-3">
                                    Total ride requests booked across system: <span className="text-white fw-bold">{analytics?.bookings.total || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: USER MANAGEMENT */}
                {activeTab === 'users' && (
                    <div className="card border-0 rounded-4 shadow-lg" style={{ background: '#1e293b',border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <div className="card-body p-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                                <div>
                                    <h5 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
                                        <Users size={20} className="text-warning" /> Registered Users Management
                                    </h5>
                                    <p className="text-secondary small mb-0">View all registered drivers and passengers, verify ICBT Student/Staff IDs, or manage accounts.</p>
                                </div>

                                {/* Filter Controls */}
                                <div className="d-flex flex-wrap align-items-center gap-2">
                                    <div className="input-group input-group-sm" style={{ width: '220px' }}>
                                        <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                                            <Search size={14} />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control bg-dark border-secondary border-opacity-25 text-white"
                                            placeholder="Search name/email..."
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                        />
                                    </div>

                                    <select
                                        className="form-select form-select-sm bg-dark border-secondary border-opacity-25 text-white"
                                        style={{ width: '150px' }}
                                        value={userFilter}
                                        onChange={(e) => setUserFilter(e.target.value)}
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="driver">Drivers Only</option>
                                        <option value="passenger">Passengers Only</option>
                                        <option value="unverified">Unverified ID</option>
                                    </select>
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                                    <thead>
                                        <tr className="text-secondary border-bottom border-secondary border-opacity-25">
                                            <th>User Info</th>
                                            <th>Role</th>
                                            <th>Phone</th>
                                            <th>ICBT ID Verification</th>
                                            <th>Joined Date</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-muted">
                                                    No users found matching your search criteria.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map(user => {
                                                const isVerified = user.is_verified || user.user_profile === 'verified';
                                                return (
                                                    <tr key={user.id} className="border-bottom border-secondary border-opacity-25">
                                                        <td>
                                                            <div className="fw-bold text-white">{user.full_name}</div>
                                                            <div className="small text-secondary">{user.email}</div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge text-capitalize px-3 py-1 rounded-pill ${
                                                                user.role === 'admin' ? 'bg-danger' :
                                                                user.role === 'driver' ? 'bg-info text-white' : 'bg-warning text-white'
                                                            }`}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="text-secondary small">{user.phone || 'N/A'}</td>
                                                        <td>
                                                            {isVerified ? (
                                                                <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 d-inline-flex align-items-center gap-1 px-2 py-1">
                                                                    <ShieldCheck size={14} /> ICBT Verified
                                                                </span>
                                                            ) : (
                                                                <span className="badge bg-secondary bg-opacity-25 text-warning border border-warning border-opacity-50 d-inline-flex align-items-center gap-1 px-2 py-1">
                                                                    <ShieldAlert size={14} /> Pending Verification
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="text-secondary small">
                                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="d-flex align-items-center justify-content-end gap-2">
                                                                <button
                                                                    onClick={() => handleToggleVerification(user.id, isVerified)}
                                                                    className={`btn btn-sm d-flex align-items-center gap-1 ${
                                                                        isVerified ? 'btn-outline-warning' : 'btn-outline-success'
                                                                    }`}
                                                                    title={isVerified ? "Revoke Verification" : "Approve Student/Staff ID"}
                                                                >
                                                                    {isVerified ? <UserX size={14} /> : <UserCheck size={14} />}
                                                                    {isVerified ? 'Unverify' : 'Verify ID'}
                                                                </button>

                                                                {user.role !== 'admin' && (
                                                                    <button
                                                                        onClick={() => openDeleteModal('user', user.id, user.full_name)}
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        title="Delete User Account"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: RIDE MANAGEMENT */}
                {activeTab === 'rides' && (
                    <div className="card border-0 rounded-4 shadow-lg" style={{ background: '#1e293b',border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <div className="card-body p-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                                <div>
                                    <h5 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
                                        <Car size={20} className="text-warning" /> System Ride Management
                                    </h5>
                                    <p className="text-secondary small mb-0">View all active, completed, and cancelled rides. Remove inappropriate ride listings.</p>
                                </div>

                                <div className="d-flex flex-wrap align-items-center gap-2">
                                    <div className="input-group input-group-sm" style={{ width: '220px' }}>
                                        <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                                            <Search size={14} />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control bg-dark border-secondary border-opacity-25 text-white"
                                            placeholder="Search route/driver..."
                                            value={rideSearch}
                                            onChange={(e) => setRideSearch(e.target.value)}
                                        />
                                    </div>

                                    <select
                                        className="form-select form-select-sm bg-dark border-secondary border-opacity-25 text-white"
                                        style={{ width: '150px' }}
                                        value={rideFilter}
                                        onChange={(e) => setRideFilter(e.target.value)}
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="available">Active / Available</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Rides Table */}
                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                                    <thead>
                                        <tr className="text-secondary border-bottom border-secondary border-opacity-25">
                                            <th>Driver</th>
                                            <th>Route (Pickup ➔ Dropoff)</th>
                                            <th>Date & Time</th>
                                            <th>Seats</th>
                                            <th>Fee / Seat</th>
                                            <th>Status</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRides.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-4 text-muted">
                                                    No rides found matching your search.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredRides.map(ride => (
                                                <tr key={ride.id} className="border-bottom border-secondary border-opacity-25">
                                                    <td>
                                                        <div className="fw-bold text-white">{ride.users?.full_name || 'Driver'}</div>
                                                        <div className="small text-secondary">{ride.users?.phone || ''}</div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-1 text-white">
                                                            <MapPin size={14} className="text-warning flex-shrink-0" />
                                                            <span className="fw-medium">{ride.start_location}</span>
                                                            <span className="text-muted mx-1">➔</span>
                                                            <span className="fw-medium text-info">{ride.destination}</span>
                                                        </div>
                                                        {ride.vehicles && (
                                                            <div className="small text-muted mt-1">
                                                                Vehicle: {ride.vehicles.brand} {ride.vehicles.model} ({ride.vehicles.vehicle_number})
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="small text-secondary">
                                                        <div className="d-flex align-items-center gap-1"><Calendar size={13} /> {ride.ride_date}</div>
                                                        <div className="d-flex align-items-center gap-1"><Clock size={13} /> {ride.departure_time}</div>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-dark border border-secondary text-white">
                                                            {ride.available_seats} / {ride.total_seats} Left
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold text-warning">
                                                        LKR {Number(ride.fee_per_seat).toLocaleString()}
                                                    </td>
                                                    <td>
                                                        <span className={`badge text-capitalize px-3 py-1 rounded-pill ${
                                                            ride.status === 'completed' ? 'bg-success bg-opacity-25 text-success border border-success' :
                                                            ride.status === 'available' ? 'bg-primary bg-opacity-25 text-primary border border-primary' :
                                                            'bg-danger bg-opacity-25 text-danger border border-danger'
                                                        }`}>
                                                            {ride.status}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        <button
                                                            onClick={() => openDeleteModal('ride', ride.id, `${ride.start_location} to ${ride.destination}`)}
                                                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                                                            title="Delete Ride Post"
                                                        >
                                                            <Trash2 size={14} /> Remove Post
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: SYSTEM AUDIT LOGS */}
                {activeTab === 'logs' && (
                    <div className="card border-0 rounded-4 shadow-lg" style={{ background: '#1e293b',border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <div className="card-body p-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                                <div>
                                    <h5 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
                                        <Activity size={20} className="text-warning" /> System Audit & Activity Logs
                                    </h5>
                                    <p className="text-secondary small mb-0">Audit history of registrations, ride creations, and administrative actions.</p>
                                </div>

                                <div className="input-group input-group-sm" style={{ width: '250px' }}>
                                    <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                                        <Search size={14} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control bg-dark border-secondary border-opacity-25 text-white"
                                        placeholder="Filter audit logs..."
                                        value={logSearch}
                                        onChange={(e) => setLogSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                                    <thead>
                                        <tr className="text-secondary border-bottom border-secondary border-opacity-25">
                                            <th>Event Category</th>
                                            <th>Description</th>
                                            <th>Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-muted">
                                                    No activity logs found.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLogs.map((log) => (
                                                <tr key={log.id} className="border-bottom border-secondary border-opacity-25">
                                                    <td>
                                                        <span className="badge bg-secondary bg-opacity-25 text-info border border-info border-opacity-50">
                                                            {log.category}
                                                        </span>
                                                    </td>
                                                    <td className="text-white">{log.description}</td>
                                                    <td className="text-secondary small">
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg text-white" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="modal-header border-secondary border-opacity-25">
                                <h5 className="modal-header-title text-danger d-flex align-items-center gap-2 mb-0 fw-bold">
                                    <AlertTriangle size={20} /> Confirm Delete Action
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeDeleteModal}></button>
                            </div>
                            <div className="modal-body py-4">
                                <p className="mb-0">
                                    Are you sure you want to delete this {deleteModal.type === 'user' ? 'User Account' : 'Ride Post'}?
                                </p>
                                {deleteModal.name && (
                                    <div className="p-3 bg-dark rounded-3 mt-3 font-monospace text-warning border border-secondary border-opacity-25">
                                        "{deleteModal.name}"
                                    </div>
                                )}
                                <p className="small text-danger mt-3 mb-0">
                                    This action is permanent and cannot be undone.
                                </p>
                            </div>
                            <div className="modal-footer border-secondary border-opacity-25">
                                <button type="button" className="btn btn-outline-light px-4" onClick={closeDeleteModal}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger px-4 fw-bold" onClick={confirmDelete}>
                                    Delete Permanently
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
