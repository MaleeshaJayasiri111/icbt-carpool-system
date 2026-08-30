import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import {loginUser} from "../services/authService";

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await loginUser({
                email: formData.email,
                password: formData.password,
            });

            console.log("Login response:", response);

            const user = response.data.user;
            const session = response.data.session;

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "token",
                session.access_token
            );

            if (user.role === "driver") {
                navigate("/driver/dashboard");
            } else if (user.role === "passenger") {
                navigate("/passenger/dashboard");
            } else if (user.role === "admin") {
                navigate("/admin");
            }

        } catch (err) {
            console.error("Login error:", err);

            setError(
                err.response?.data?.message ||
                "Login failed. Please check your email and password."
            );
        }
    };

    return (
        <div 
            className="d-flex align-items-center justify-content-center" 
            style={{ 
                minHeight: '85vh', 
                background: 'radial-gradient(circle at 10% 20%, rgba(250, 204, 21, 0.05) 0%, rgba(15, 23, 42, 0.05) 90%)',
                marginTop: '-1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem', width: 'calc(100% + 3rem)'
            }}>
            <div className="card glass-card p-4 p-md-5 w-100 border-0" style={{ maxWidth: '450px', borderTop: '4px solid #facc15 !important' }}>
                <div className="text-center mb-4">
                    <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 mb-3 shadow-sm">
                        <LogIn size={36} className="text-warning" />
                    </div>
                    <h2 className="fw-bold premium-gradient-text">Welcome Back</h2>
                    <p className="text-secondary mt-1">Login to your account to continue</p>
                </div>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={handleLogin}>


                    <div className="mb-3">
                        <label className="form-label fw-semibold text-dark">Email address</label>
                        <input type="email" className="form-control" placeholder="example@students.icbt.lk" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <label className="form-label fw-semibold mb-0 text-dark">Password</label>

                        </div>
                        <input type="password" className="form-control" placeholder="••••••••" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        <Link
                            to="/forgot-password"
                            className="text-decoration-none small fw-semibold"
                            style={{
                                color: "red",
                            }}
                        >
                            Forgot password?
                        </Link>

                    </div>


                    <button type="submit" className="btn btn-yb-yellow w-100 mb-4 py-2 fs-6">
                        Login
                    </button>
                </form>

                <div className="text-center text-muted small mt-2">
                    Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-underline ms-1">Sign up here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
