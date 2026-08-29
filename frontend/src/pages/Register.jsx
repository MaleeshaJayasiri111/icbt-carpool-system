import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Car, Phone, ShieldCheck, Shield } from 'lucide-react';
import {registerUser} from "../services/authService";

const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('passenger');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        profileImage: null,
        agreeTerms: false
    });

    const handleRegister = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            if (
                !formData.name ||
                !formData.email ||
                !formData.password ||
                !formData.mobile
            ) {
                throw new Error(
                    'Please fill in all required fields.'
                );
            }

            if (!formData.profileImage) {
                throw new Error(
                    'Please select a profile image.'
                );
            }

            if (!formData.agreeTerms) {
                throw new Error(
                    'You must agree to the Privacy Policy and Terms and Conditions.'
                );
            }

            const data = new FormData();

            data.append('fullName', formData.name);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('phone', formData.mobile);
            data.append('role', role);
            data.append(
                'profileImage',
                formData.profileImage
            );

            const response = await registerUser(data);

            console.log(
                'Registration successful:',
                response
            );

            navigate('/login');

        } catch (err) {
            console.error(
                'Registration error:',
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                'Registration failed.'
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="d-flex flex-column align-items-center justify-content-center py-5"
            style={{ 
                minHeight: '85vh', 
                background: 'radial-gradient(circle at 90% 10%, rgba(250, 204, 21, 0.05) 0%, rgba(15, 23, 42, 0.05) 90%)',
                marginTop: '-1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem', width: 'calc(100% + 3rem)'
            }}>
            {/* Form Card */}
            <div className="card glass-card border-0 p-4 p-md-5 w-100" style={{ maxWidth: '620px', borderTop: '4px solid #facc15 !important' }}>
                <div className="text-center mb-4">
                    <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 mb-3 shadow-sm">
                        <UserPlus size={36} className="text-warning" />
                    </div>
                    <h2 className="fw-bold mb-1 premium-gradient-text">Create an Account</h2>
                    <p className="text-secondary small mt-1">Join the ICBT carpool community today</p>
                </div>

                {/* Mandatory Field Note */}
                <div className="alert alert-warning border-warning border-opacity-50 bg-warning bg-opacity-10 py-2 px-3 small d-flex align-items-center gap-2 mb-4 rounded-3 shadow-sm">
                    <ShieldCheck size={18} className="text-warning flex-shrink-0" />
                    <span><strong>Note:</strong> Fields marked with an asterisk (<span className="text-danger fw-bold">*</span>) are mandatory.</span>
                </div>

                {error && <div className="alert alert-danger py-2 small mb-3 rounded-3">{error}</div>}

                <form onSubmit={handleRegister}>
                    {/* Role Switcher */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold d-block text-dark">I am registering as a: <span className="text-danger">*</span></label>
                        <div className="btn-group w-100 shadow-sm" role="group">
                            <input type="radio" className="btn-check" name="roleSwitch" id="passengerRadio" autoComplete="off" checked={role === 'passenger'} onChange={() => setRole('passenger')} />
                            <label className={`btn py-2 fw-bold ${role === 'passenger' ? 'btn-yb-yellow' : 'btn-outline-dark bg-white'}`} htmlFor="passengerRadio">
                                <UserPlus size={18} className="me-2" /> Passenger
                            </label>

                            <input type="radio" className="btn-check" name="roleSwitch" id="driverRadio" autoComplete="off" checked={role === 'driver'} onChange={() => setRole('driver')} />
                            <label className={`btn py-2 fw-bold ${role === 'driver' ? 'btn-yb-yellow' : 'btn-outline-dark bg-white'}`} htmlFor="driverRadio">
                                <Car size={18} className="me-2" /> Driver
                            </label>

                            <input type="radio" className="btn-check" name="roleSwitch" id="adminRadio" autoComplete="off" checked={role === 'admin'} onChange={() => setRole('admin')} />
                            <label className={`btn py-2 fw-bold ${role === 'admin' ? 'btn-yb-yellow' : 'btn-outline-dark bg-white'}`} htmlFor="adminRadio">
                                <Shield size={18} className="me-2" /> Admin
                            </label>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Full Name <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your full name"
                                required
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Email Address <span className="text-danger">*</span></label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="example@students.icbt.lk"
                                required
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Mobile Number <span className="text-danger">*</span></label>
                            <div className="input-group shadow-sm rounded-3">
                                <span className="input-group-text border-end-0 bg-white text-muted small">
                                    <Phone size={16} />
                                </span>
                                <input
                                    type="tel"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="+94 77 123 4567"
                                    required
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold text-dark">Password <span className="text-danger">*</span></label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            required
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold text-dark">
                            Profile Image
                            <span className="text-danger"> *</span>
                        </label>

                        <input
                            type="file"
                            className="form-control shadow-sm"
                            accept="image/*"
                            required
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    profileImage: e.target.files[0],
                                })
                            }
                        />
                    </div>


                    {/* Terms and Conditions Checkbox */}
                    <div className="form-check mb-4 mt-2">
                        <input
                            className="form-check-input mt-1"
                            type="checkbox"
                            id="agreeTermsCheckbox"
                            required
                            checked={formData.agreeTerms}
                            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        />
                        <label className="form-check-label small pt-1 ps-1" htmlFor="agreeTermsCheckbox">
                            I Agree with the <Link to="/privacy-policy" className="text-primary fw-bold text-decoration-underline">Privacy Policy</Link> and <span className="fw-semibold text-dark">Terms and Conditions</span> <span className="text-danger">*</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-yb-yellow w-100 py-3 fw-bold mb-4 mt-2 fs-6 shadow-sm"
                    >
                        {loading
                            ? 'Registering...'
                            : `Register as ${
                                role === 'driver'
                                    ? 'Driver'
                                    : 'Passenger'
                            }`
                        }
                    </button>
                </form>

                <div className="text-center text-muted small">
                    Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-underline ms-1">Log in</Link>
                </div>
            </div>

            {/* Advice for Driver Registration Card (Below Form Container) */}
            <div className="card glass-card border-0 p-4 p-md-5 w-100 mt-4" style={{ maxWidth: '620px' }}>
                <div className="bg-white bg-opacity-75 p-4 rounded-4 shadow-sm border border-white">
                    <h5 className="fw-bold mb-3 premium-gradient-text">Advice for driver registration</h5>
                    <ul className="text-secondary small mb-0 ps-3 lh-lg">
                        <li className="mb-2">Complete the form above and click <strong>"Register as Driver"</strong> to create your account.</li>
                        <li className="mb-2">After registering, log in to access your personalized <strong>Driver Dashboard</strong>.</li>
                        <li className="mb-2">When specifying your route, list your starting location, ICBT campus destination, and intermediate suburbs.</li>
                        <li className="mb-2">Include your morning start and arrival times, as well as evening departure and return times.</li>
                        <li className="mb-2">Ensure your vehicle number, vehicle type, and available seat count are accurate for safety verification.</li>
                        <li className="mb-2">Use the built-in <strong>Real-time Chat</strong> to communicate pickup points with your booked passengers.</li>
                        <li className="mb-2">If all details are accurate, check the Terms & Conditions box and press the submit button.</li>
                        <li className="mb-0">Need help or encounter issues? Call us at <strong className="text-dark">0740002575</strong>.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Register;
