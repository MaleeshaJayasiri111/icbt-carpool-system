import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendCode = (e) => {
        e.preventDefault();
        setError('');
        if (!email) {
            setError('Please enter your registered email address.');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 600);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setError('');
        if (!otp || otp.length < 4) {
            setError('Please enter the 4-digit verification code sent to your email.');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 600);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        setError('');
        if (!newPassword || newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(4);
        }, 600);
    };

    return (
        <div className="d-flex align-items-center justify-content-center py-4" style={{ minHeight: '70vh' }}>
            <div className="card shadow-sm border-0 p-4 p-md-5 w-100 bg-white rounded-4" style={{ maxWidth: '480px' }}>

                {/* Back to Login link */}
                <div className="mb-3">
                    <Link to="/login" className="text-decoration-none text-secondary small d-inline-flex align-items-center gap-1 hover-primary">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>

                <div className="text-center mb-4">
                    <div className="mx-auto mb-3 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                        <KeyRound size={32} />
                    </div>
                    <h3 className="fw-bold mb-1">
                        {step === 1 && "Forgot Password?"}
                        {step === 2 && "Enter Reset Code"}
                        {step === 3 && "Reset Your Password"}
                        {step === 4 && "Password Reset Complete!"}
                    </h3>
                    <p className="text-secondary small mb-0">
                        {step === 1 && "Enter your ICBT student/staff email and we'll send you a password reset code."}
                        {step === 2 && `We sent a 4-digit code to ${email}.`}
                        {step === 3 && "Create a new strong password for your account."}
                        {step === 4 && "Your password has been successfully updated. You can now login."}
                    </p>
                </div>

                {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

                {/* STEP 1: Enter Email */}
                {step === 1 && (
                    <form onSubmit={handleSendCode}>
                        <div className="mb-4">
                            <label className="form-label fw-semibold">Email Address</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light text-muted border-end-0">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    className="form-control form-control-lg fs-6 border-start-0 ps-0"
                                    placeholder="e.g. student@icbt.lk"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-100 fw-semibold">
                            {loading ? "Sending..." : "Send Verification Code"}
                        </button>
                    </form>
                )}

                {/* STEP 2: Enter Verification Code */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="mb-4">
                            <label className="form-label fw-semibold">4-Digit Code</label>
                            <input
                                type="text"
                                maxLength="6"
                                className="form-control form-control-lg text-center fs-4 letter-spacing-2"
                                placeholder="1 2 3 4"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <div className="text-center mt-2">
                                <button type="button" onClick={() => setStep(1)} className="btn btn-link btn-sm text-decoration-none">
                                    Resend Code
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-100 fw-semibold">
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </form>
                )}

                {/* STEP 3: Enter New Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">New Password</label>
                            <input
                                type="password"
                                className="form-control form-control-lg fs-6"
                                placeholder="••••••••"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control form-control-lg fs-6"
                                placeholder="••••••••"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-100 fw-semibold">
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                {/* STEP 4: Success Confirmation */}
                {step === 4 && (
                    <div className="text-center">
                        <div className="text-success mb-4">
                            <CheckCircle2 size={56} className="mx-auto" />
                        </div>
                        <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg w-100 fw-semibold">
                            Log In Now
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ForgotPassword;
