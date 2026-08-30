import React, {
    useEffect,
    useState,
} from "react";

import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    CalendarDays,
    Pencil,
    Save,
    X,
    Loader2,
    Trash2,
} from "lucide-react";

import {
    getMyProfile,
    updateMyProfile,
} from "../../services/userService";


const Profile = () => {

    const [
        profile,
        setProfile,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        editing,
        setEditing,
    ] = useState(false);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");

    const [
        formData,
        setFormData,
    ] = useState({
        fullName: "",
        phone: "",
    });


    // ==============================
    // LOAD PROFILE
    // ==============================

    const loadProfile =
        async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await getMyProfile();

                const user =
                    response.data;

                setProfile(
                    user
                );

                setFormData({
                    fullName:
                        user.full_name ||
                        "",

                    phone:
                        user.phone ||
                        "",
                });

            } catch (err) {

                console.error(
                    "Profile loading error:",
                    err
                );

                setError(
                    err.response?.data
                        ?.message ||
                    "Unable to load your profile."
                );

            } finally {

                setLoading(false);

            }
        };


    useEffect(() => {

        loadProfile();

    }, []);


    // ==============================
    // INPUT
    // ==============================

    const handleChange =
        (e) => {

            const {
                name,
                value,
            } = e.target;

            setFormData(
                (prev) => ({
                    ...prev,

                    [name]:
                    value,
                })
            );
        };


    // ==============================
    // SAVE
    // ==============================

    const handleSave =
        async (e) => {

            e.preventDefault();

            try {

                setSaving(true);

                setError("");

                setSuccess("");


                const response =
                    await updateMyProfile({
                        fullName:
                        formData.fullName,

                        phone:
                        formData.phone,
                    });


                setProfile(
                    response.data
                );


                setFormData({
                    fullName:
                        response.data
                            .full_name ||
                        "",

                    phone:
                        response.data
                            .phone ||
                        "",
                });


                setEditing(false);

                setSuccess(
                    "Profile updated successfully."
                );

            } catch (err) {

                console.error(
                    "Profile update error:",
                    err
                );

                setError(
                    err.response?.data
                        ?.message ||
                    "Unable to update your profile."
                );

            } finally {

                setSaving(false);

            }
        };


    // ==============================
    // CANCEL EDIT
    // ==============================

    const handleCancel =
        () => {

            setFormData({

                fullName:
                    profile
                        ?.full_name ||
                    "",

                phone:
                    profile
                        ?.phone ||
                    "",

            });

            setEditing(false);

            setError("");

            setSuccess("");
        };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div
                className="container py-5 text-center"
            >

                <Loader2
                    size={28}
                    className="text-primary"
                />

                <p className="text-muted mt-2">
                    Loading profile...
                </p>

            </div>

        );
    }


    // ==============================
    // ERROR
    // ==============================

    if (!profile) {

        return (

            <div className="container py-5">

                <div className="alert alert-danger">

                    {error ||
                        "Profile not found."}

                </div>

            </div>

        );
    }


    return (

        <div
            className="container-fluid py-4 py-md-5"
            style={{
                backgroundColor:
                    "#ffffff",

                minHeight:
                    "100vh",
            }}
        >

            <div
                className="container"
                style={{
                    maxWidth:
                        "1050px",
                }}
            >

                {/* HEADER */}

                <div className="mb-4">

                    <span
                        className="badge rounded-pill px-3 py-2 mb-3"
                        style={{
                            backgroundColor:
                                "#fff3cd",

                            color:
                                "#0d6efd",
                        }}
                    >
                        Account Settings
                    </span>


                    <h2
                        className="fw-bold mb-1"
                        style={{
                            color:
                                "#0d6efd",
                        }}
                    >
                        My Profile
                    </h2>


                    <p className="text-muted mb-0">
                        Manage your personal
                        information and account
                        details.
                    </p>

                </div>


                {/* ALERTS */}

                {error && (

                    <div className="alert alert-danger">
                        {error}
                    </div>

                )}


                {success && (

                    <div className="alert alert-success">
                        {success}
                    </div>

                )}


                <div className="row g-4">

                    {/* LEFT PROFILE CARD */}

                    <div className="col-lg-4">

                        <div
                            className="card border-0 shadow-sm h-100"
                        >

                            <div
                                style={{
                                    height:
                                        "5px",

                                    backgroundColor:
                                        "#ffc107",
                                }}
                            />


                            <div
                                className="card-body p-4 text-center"
                            >

                                {/* PROFILE IMAGE */}

                                <div
                                    className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center overflow-hidden"
                                    style={{
                                        width:
                                            "110px",

                                        height:
                                            "110px",

                                        backgroundColor:
                                            "#f5f9ff",

                                        border:
                                            "4px solid #fff3cd",
                                    }}
                                >

                                    {profile
                                        .user_profile ? (

                                        <img
                                            src={
                                                profile
                                                    .user_profile
                                            }
                                            alt="Profile"
                                            className="w-100 h-100"
                                            style={{
                                                objectFit:
                                                    "cover",
                                            }}
                                        />

                                    ) : (

                                        <User
                                            size={50}
                                            className="text-primary"
                                        />

                                    )}

                                </div>


                                <h4 className="fw-bold mb-1">

                                    {
                                        profile
                                            .full_name
                                    }

                                </h4>


                                <span
                                    className="badge rounded-pill text-capitalize"
                                    style={{
                                        backgroundColor:
                                            "#e7f1ff",

                                        color:
                                            "#0d6efd",
                                    }}
                                >

                                    {
                                        profile.role
                                    }

                                </span>


                                <hr className="my-4" />


                                <div className="text-start">

                                    <small className="text-muted d-block">
                                        Member since
                                    </small>

                                    <div className="d-flex align-items-center gap-2 mt-1">

                                        <CalendarDays
                                            size={16}
                                            className="text-warning"
                                        />

                                        <span>
                                            {new Date(
                                                profile.created_at
                                            ).toLocaleDateString()}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* RIGHT DETAILS */}

                    <div className="col-lg-8">

                        <div
                            className="card border-0 shadow-sm"
                        >

                            <div
                                style={{
                                    height:
                                        "5px",

                                    backgroundColor:
                                        "#0d6efd",
                                }}
                            />


                            <div className="card-body p-4 p-md-5">

                                <div className="d-flex justify-content-between align-items-center mb-4">

                                    <div>

                                        <h5 className="fw-bold mb-1">
                                            Personal Information
                                        </h5>

                                        <small className="text-muted">
                                            Your account information
                                        </small>

                                    </div>


                                    {!editing && (

                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() =>
                                                setEditing(
                                                    true
                                                )
                                            }
                                        >

                                            <Pencil
                                                size={16}
                                                className="me-1"
                                            />

                                            Edit

                                        </button>

                                    )}

                                </div>


                                <form
                                    onSubmit={
                                        handleSave
                                    }
                                >

                                    {/* NAME */}

                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Full Name
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text bg-white">

                                                <User
                                                    size={17}
                                                    className="text-primary"
                                                />

                                            </span>


                                            <input
                                                type="text"
                                                className="form-control"
                                                name="fullName"
                                                value={
                                                    formData
                                                        .fullName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    !editing
                                                }
                                                required
                                            />

                                        </div>

                                    </div>


                                    {/* EMAIL */}

                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Email
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text bg-white">

                                                <Mail
                                                    size={17}
                                                    className="text-primary"
                                                />

                                            </span>


                                            <input
                                                type="email"
                                                className="form-control"
                                                value={
                                                    profile.email ||
                                                    ""
                                                }
                                                disabled
                                            />

                                        </div>


                                        <small className="text-muted">
                                            Email is linked to
                                            your account.
                                        </small>

                                    </div>


                                    {/* PHONE */}

                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Phone Number
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text bg-white">

                                                <Phone
                                                    size={17}
                                                    className="text-warning"
                                                />

                                            </span>


                                            <input
                                                type="text"
                                                className="form-control"
                                                name="phone"
                                                value={
                                                    formData
                                                        .phone
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    !editing
                                                }
                                                placeholder="Enter your phone number"
                                            />

                                        </div>

                                    </div>


                                    {/* ROLE */}

                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Account Type
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text bg-white">

                                                <ShieldCheck
                                                    size={17}
                                                    className="text-primary"
                                                />

                                            </span>


                                            <input
                                                type="text"
                                                className="form-control text-capitalize"
                                                value={
                                                    profile.role ||
                                                    ""
                                                }
                                                disabled
                                            />

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

                                    {editing && (

                                        <div className="d-flex gap-2 pt-2">

                                            <button
                                                type="submit"
                                                className="btn btn-primary px-4"
                                                disabled={
                                                    saving
                                                }
                                            >

                                                {saving ? (

                                                    <>
                                                        <Loader2
                                                            size={17}
                                                            className="me-2"
                                                        />

                                                        Saving...
                                                    </>

                                                ) : (

                                                    <>
                                                        <Save
                                                            size={17}
                                                            className="me-2"
                                                        />

                                                        Save Changes
                                                    </>

                                                )}

                                            </button>


                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary px-4"
                                                onClick={
                                                    handleCancel
                                                }
                                                disabled={
                                                    saving
                                                }
                                            >

                                                <X
                                                    size={17}
                                                    className="me-2"
                                                />

                                                Cancel

                                            </button>

                                        </div>

                                    )}

                                </form>

                            </div>

                        </div>

                    </div>

                </div>


                {/* DANGER ZONE */}

                <div className="card border-0 shadow-sm mt-4">

                    <div className="card-body p-4">

                        <div className="d-flex align-items-center justify-content-between">

                            <div>

                                <h6 className="fw-bold mb-1 text-danger">
                                    Account
                                </h6>

                                <small className="text-muted">
                                    Account deletion will be
                                    handled separately.
                                </small>

                            </div>


                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                disabled
                            >

                                <Trash2
                                    size={16}
                                    className="me-1"
                                />

                                Delete Account

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
};


export default Profile;