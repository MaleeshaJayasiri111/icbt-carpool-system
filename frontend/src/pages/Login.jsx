import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'passenger' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        try {
            // Simulate login logic
            if (!formData.email || !formData.password) {
                throw new Error('Please enter both email and password.');
            }
            console.log('Login attempt:', formData);
            // Save dummy user data in localStorage to simulate auth
            localStorage.setItem('user', JSON.stringify({ role: formData.role, name: formData.email.split('@')[0] }));
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            <div className="card shadow-sm p-4 w-100 border-0 shadow-lg" style={{ maxWidth: '450px', borderTop: '4px solid #facc15' }}>
                <div className="text-center mb-4">
                    <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 mb-2">
                        <LogIn size={36} className="text-warning" />
                    </div>
                    <h2 className="fw-bold">Welcome Back</h2>
                    <p className="text-muted">Login to your account to continue</p>
                </div>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Signing in as:</label>
                        <div className="d-flex gap-3">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="role" id="rolePassenger" defaultChecked onChange={() => setFormData({ ...formData, role: 'passenger' })} />
                                <label className="form-check-label fw-medium" htmlFor="rolePassenger">Passenger</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="role" id="roleDriver" onChange={() => setFormData({ ...formData, role: 'driver' })} />
                                <label className="form-check-label fw-medium" htmlFor="roleDriver">Driver</label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email address</label>
                        <input type="email" className="form-control" placeholder="example@students.icbt.lk" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <label className="form-label fw-semibold mb-0">Password</label>
                            <Link to="/forgot-password" className="text-dark small text-decoration-none fw-bold">Forgot Password?</Link>
                        </div>
                        <input type="password" className="form-control" placeholder="••••••••" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>

                    <button type="submit" className="btn btn-yb-yellow w-100 mb-3 py-2 fs-6">
                        Login
                    </button>
                </form>

                <div className="text-center text-muted small">
                    Don't have an account? <Link to="/register" className="text-dark fw-bold text-decoration-underline ms-1">Sign up here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
