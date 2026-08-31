import React, {
    useEffect,
    useState,
} from "react";

import {
    Lock,
    Save,
    Loader2,
    CheckCircle,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    resetPassword,
} from "../../services/authService";


const UpdatePassword = () => {

    const navigate =
        useNavigate();


    const [
        accessToken,
        setAccessToken,
    ] = useState("");


    const [
        newPassword,
        setNewPassword,
    ] = useState("");


    const [
        confirmPassword,
        setConfirmPassword,
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
    ] = useState(false);

    const [
        refreshToken,
        setRefreshToken,
    ] = useState("");


    // =================================
    // GET RECOVERY TOKEN
    // =================================

    useEffect(() => {

        const hash =
            window.location.hash;


        const params =
            new URLSearchParams(
                hash.replace(
                    /^#/,
                    ""
                )
            );


        const accessToken =
            params.get(
                "access_token"
            );


        const refreshToken =
            params.get(
                "refresh_token"
            );


        if (
            !accessToken ||
            !refreshToken
        ) {

            setError(
                "This password reset link is invalid or has expired."
            );

            return;
        }


        setAccessToken(
            accessToken
        );

        setRefreshToken(
            refreshToken
        );

    }, []);


    // =================================
    // SUBMIT
    // =================================

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            setError("");


            if (!accessToken) {

                setError(
                    "Password reset session is invalid."
                );

                return;
            }


            if (
                newPassword.length <
                6
            ) {

                setError(
                    "Password must be at least 6 characters long."
                );

                return;
            }


            if (
                newPassword !==
                confirmPassword
            ) {

                setError(
                    "Passwords do not match."
                );

                return;
            }


            try {

                setLoading(true);


                await resetPassword(
                    accessToken,
                    refreshToken,
                    newPassword
                );


                setSuccess(
                    true
                );


            } catch (err) {

                console.error(
                    "Reset password error:",
                    err
                );


                setError(
                    err.response?.data
                        ?.message ||
                    "Unable to reset password."
                );

            } finally {

                setLoading(false);

            }

        };


    if (success) {

        return (

            <div
                className="min-vh-100 d-flex align-items-center justify-content-center p-4"
                style={{
                    backgroundColor:
                        "#ffffff",
                }}
            >

                <div
                    className="card border-0 shadow-sm text-center"
                    style={{
                        width:
                            "100%",

                        maxWidth:
                            "480px",

                        borderRadius:
                            "20px",
                    }}
                >

                    <div
                        style={{
                            height:
                                "5px",

                            backgroundColor:
                                "#ffc107",
                        }}
                    />


                    <div className="card-body p-5">

                        <div
                            className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width:
                                    "70px",

                                height:
                                    "70px",

                                backgroundColor:
                                    "#e9f7ef",
                            }}
                        >

                            <CheckCircle
                                size={32}
                                className="text-success"
                            />

                        </div>


                        <h3
                            className="fw-bold mb-2"
                            style={{
                                color:
                                    "#0d6efd",
                            }}
                        >
                            Password Updated
                        </h3>


                        <p className="text-muted">

                            Your password has been
                            changed successfully.

                        </p>


                        <button
                            type="button"
                            className="btn btn-primary px-4"
                            onClick={() =>
                                navigate(
                                    "/login"
                                )
                            }
                        >
                            Back to Login
                        </button>

                    </div>

                </div>

            </div>

        );
    }


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
                    width:
                        "100%",

                    maxWidth:
                        "480px",

                    borderRadius:
                        "20px",

                    overflow:
                        "hidden",
                }}
            >

                <div
                    style={{
                        height:
                            "5px",

                        backgroundColor:
                            "#ffc107",
                    }}
                />


                <div className="card-body p-4 p-md-5">

                    <div
                        className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width:
                                "70px",

                            height:
                                "70px",

                            backgroundColor:
                                "#e7f1ff",
                        }}
                    >

                        <Lock
                            size={30}
                            className="text-primary"
                        />

                    </div>


                    <div className="text-center mb-4">

                        <h3
                            className="fw-bold mb-2"
                            style={{
                                color:
                                    "#0d6efd",
                            }}
                        >
                            Create New Password
                        </h3>


                        <p className="text-muted mb-0">

                            Choose a strong new
                            password for your account.

                        </p>

                    </div>


                    {error && (

                        <div className="alert alert-danger">
                            {error}
                        </div>

                    )}


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                New Password
                            </label>


                            <div className="input-group">

                                <span className="input-group-text bg-white">

                                    <Lock
                                        size={17}
                                        className="text-primary"
                                    />

                                </span>


                                <input
                                    type="password"
                                    className="form-control"
                                    value={
                                        newPassword
                                    }
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter new password"
                                    disabled={
                                        loading
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <div className="mb-4">

                            <label className="form-label fw-semibold">
                                Confirm Password
                            </label>


                            <div className="input-group">

                                <span className="input-group-text bg-white">

                                    <Lock
                                        size={17}
                                        className="text-primary"
                                    />

                                </span>


                                <input
                                    type="password"
                                    className="form-control"
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Confirm new password"
                                    disabled={
                                        loading
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2 fw-semibold"
                            disabled={
                                loading ||
                                !accessToken
                            }
                        >

                            {loading ? (

                                <>
                                    <Loader2
                                        size={17}
                                        className="me-2"
                                    />

                                    Updating Password...
                                </>

                            ) : (

                                <>
                                    <Save
                                        size={17}
                                        className="me-2"
                                    />

                                    Update Password
                                </>

                            )}

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );
};


export default UpdatePassword;