import React, {
    useState,
} from "react";

import {
    Mail,
    ArrowLeft,
    Send,
    Loader2,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    forgotPassword,
} from "../../services/authService";


const ForgotPassword = () => {

    const [
        email,
        setEmail,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");


    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (!email.trim()) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await forgotPassword(
                    email.trim()
                );


            setSuccess(
                response.message ||
                "If an account exists for this email, a password reset link has been sent."
            );


            setEmail("");


        } catch (err) {

            console.error(
                "Forgot password error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to process your request."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div
            className="min-vh-100 d-flex align-items-center justify-content-center p-4"
            style={{
                backgroundColor:
                    "#ffffff",
            }}
        >

            <div
                className="card border-0 shadow-sm"
                style={{
                    maxWidth:
                        "480px",

                    width:
                        "100%",

                    borderRadius:
                        "20px",

                    overflow:
                        "hidden",
                }}
            >

                {/* YELLOW TOP */}

                <div
                    style={{
                        height:
                            "5px",

                        backgroundColor:
                            "#ffc107",
                    }}
                />


                <div className="card-body p-4 p-md-5">

                    {/* ICON */}

                    <div
                        className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width:
                                "70px",

                            height:
                                "70px",

                            backgroundColor:
                                "#fff8db",
                        }}
                    >

                        <Mail
                            size={30}
                            className="text-warning"
                        />

                    </div>


                    {/* TITLE */}

                    <div
                        className="text-center mb-4"
                    >

                        <h3
                            className="fw-bold mb-2"
                            style={{
                                color:
                                    "#0d6efd",
                            }}
                        >
                            Forgot Password?
                        </h3>


                        <p className="text-muted mb-0">

                            Enter the email address
                            associated with your account
                            and we'll send you a reset link.

                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="alert alert-danger">

                            {error}

                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="alert alert-success">

                            {success}

                        </div>

                    )}


                    {/* FORM */}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div className="mb-3">

                            <label
                                className="form-label fw-semibold"
                            >
                                Email Address
                            </label>


                            <div className="input-group">

                                <span
                                    className="input-group-text bg-white"
                                >

                                    <Mail
                                        size={17}
                                        className="text-primary"
                                    />

                                </span>


                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={
                                        email
                                    }
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        loading
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="btn btn-primary w-100 fw-semibold py-2"
                            disabled={
                                loading
                            }
                        >

                            {loading ? (

                                <>
                                    <Loader2
                                        size={17}
                                        className="me-2"
                                    />

                                    Sending Reset Link...
                                </>

                            ) : (

                                <>
                                    <Send
                                        size={17}
                                        className="me-2"
                                    />

                                    Send Reset Link
                                </>

                            )}

                        </button>

                    </form>


                    {/* BACK */}

                    <div
                        className="text-center mt-4"
                    >

                        <Link
                            to="/login"
                            className="text-decoration-none fw-semibold"
                            style={{
                                color:
                                    "#0d6efd",
                            }}
                        >

                            <ArrowLeft
                                size={15}
                                className="me-1"
                            />

                            Back to Login

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );
};


export default ForgotPassword;