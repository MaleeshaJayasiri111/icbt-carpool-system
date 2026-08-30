import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    Loader2,
    MessageCircle,
    Send,
} from "lucide-react";

import {
    getRideMessages,
    sendRideMessage,
} from "../../services/messageService";


const RideChat = () => {

    const { rideId } =
        useParams();

    const navigate =
        useNavigate();


    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [sending, setSending] =
        useState(false);

    const [error, setError] =
        useState("");


    const bottomRef =
        useRef(null);


    // =========================
    // CURRENT USER
    // =========================

    const storedUser =
        localStorage.getItem("user");

    const currentUser =
        storedUser
            ? JSON.parse(storedUser)
            : null;


    // =========================
    // LOAD MESSAGES
    // =========================

    const loadMessages = async (
        showLoader = false
    ) => {

        try {

            if (showLoader) {
                setLoading(true);
            }

            const response =
                await getRideMessages(
                    rideId
                );

            setMessages(
                response.data || []
            );

            setError("");

        } catch (err) {

            console.error(
                "Load messages error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load messages."
            );

        } finally {

            if (showLoader) {
                setLoading(false);
            }
        }
    };


    // =========================
    // INITIAL LOAD + POLLING
    // =========================

    useEffect(() => {

        loadMessages(true);


        const interval =
            setInterval(() => {

                loadMessages(false);

            }, 3000);


        return () => {
            clearInterval(interval);
        };

    }, [rideId]);


    // =========================
    // SCROLL TO BOTTOM
    // =========================

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);


    // =========================
    // SEND MESSAGE
    // =========================

    const handleSend = async (e) => {

        e.preventDefault();


        if (!message.trim()) {
            return;
        }


        try {

            setSending(true);
            setError("");


            await sendRideMessage(
                rideId,
                message.trim()
            );


            setMessage("");


            await loadMessages(false);

        } catch (err) {

            console.error(
                "Send message error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to send message."
            );

        } finally {

            setSending(false);
        }
    };


    // =========================
    // FORMAT TIME
    // =========================

    const formatTime = (
        date
    ) => {

        if (!date) {
            return "";
        }

        return new Date(
            date
        ).toLocaleTimeString(
            "en-GB",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    return (

        <div
            className="min-vh-100"
            style={{
                backgroundColor:
                    "#f6f6f3",
            }}
        >

            <div className="container-fluid p-4 p-md-5">


                {/* =========================
                    HEADER
                ========================= */}

                <div
                    className="rounded-4 p-4 mb-4"
                    style={{
                        backgroundColor:
                            "#171717",
                    }}
                >

                    <div className="d-flex align-items-center gap-3">

                        <button
                            type="button"
                            className="btn btn-warning rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width: "42px",
                                height: "42px",
                            }}
                            onClick={() =>
                                navigate(-1)
                            }
                        >

                            <ArrowLeft
                                size={19}
                            />

                        </button>


                        <div>

                            <div className="d-flex align-items-center gap-2 text-warning mb-1">

                                <MessageCircle
                                    size={17}
                                />

                                <small className="fw-bold">
                                    RIDE CHAT
                                </small>

                            </div>


                            <h3 className="text-white fw-bold mb-1">
                                Conversation
                            </h3>

                            <p className="text-white-50 mb-0 small">
                                Communicate with the
                                driver and confirmed
                                passengers.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="alert alert-danger">
                        {error}
                    </div>

                )}


                {/* =========================
                    CHAT BOX
                ========================= */}

                <div
                    className="bg-white overflow-hidden"
                    style={{
                        borderRadius: "18px",
                        boxShadow:
                            "0 6px 24px rgba(0,0,0,0.06)",
                    }}
                >


                    {/* MESSAGES */}

                    <div
                        className="p-3 p-md-4"
                        style={{
                            height: "500px",
                            overflowY: "auto",
                            backgroundColor:
                                "#fafaf8",
                        }}
                    >

                        {loading ? (

                            <div className="h-100 d-flex flex-column justify-content-center align-items-center">

                                <Loader2
                                    size={32}
                                    className="mb-2"
                                />

                                <p className="text-muted mb-0">
                                    Loading messages...
                                </p>

                            </div>

                        ) : messages.length === 0 ? (

                            <div className="h-100 d-flex flex-column justify-content-center align-items-center text-center">

                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        backgroundColor:
                                            "#fff3cd",
                                    }}
                                >

                                    <MessageCircle
                                        size={28}
                                        className="text-warning"
                                    />

                                </div>

                                <h5 className="fw-bold">
                                    No messages yet
                                </h5>

                                <p className="text-muted mb-0">
                                    Start the conversation
                                    for this ride.
                                </p>

                            </div>

                        ) : (

                            messages.map(
                                (item) => {

                                    const isMine =
                                        item.sender_id ===
                                        currentUser?.id;


                                    return (

                                        <div
                                            key={
                                                item.id
                                            }
                                            className={
                                                `d-flex mb-3 ${
                                                    isMine
                                                        ? "justify-content-end"
                                                        : "justify-content-start"
                                                }`
                                            }
                                        >

                                            <div
                                                style={{
                                                    maxWidth:
                                                        "75%",
                                                }}
                                            >

                                                {!isMine && (

                                                    <small
                                                        className="text-muted fw-semibold d-block mb-1"
                                                    >
                                                        {
                                                            item.users
                                                                ?.full_name ||
                                                            "User"
                                                        }
                                                    </small>

                                                )}


                                                <div
                                                    className="px-3 py-2"
                                                    style={{
                                                        borderRadius:
                                                            isMine
                                                                ? "16px 16px 4px 16px"
                                                                : "16px 16px 16px 4px",

                                                        backgroundColor:
                                                            isMine
                                                                ? "#ffc107"
                                                                : "#ffffff",

                                                        border:
                                                            isMine
                                                                ? "none"
                                                                : "1px solid #e5e5e5",
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            whiteSpace:
                                                                "pre-wrap",
                                                            wordBreak:
                                                                "break-word",
                                                        }}
                                                    >
                                                        {
                                                            item.message
                                                        }
                                                    </div>


                                                    <div
                                                        className={
                                                            `small mt-1 ${
                                                                isMine
                                                                    ? "text-dark"
                                                                    : "text-muted"
                                                            }`
                                                        }
                                                        style={{
                                                            fontSize:
                                                                "11px",
                                                            opacity:
                                                                "0.7",
                                                        }}
                                                    >
                                                        {formatTime(
                                                            item.created_at
                                                        )}
                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    );
                                }
                            )

                        )}


                        <div
                            ref={
                                bottomRef
                            }
                        />

                    </div>


                    {/* =========================
                        MESSAGE INPUT
                    ========================= */}

                    <div
                        className="p-3 border-top"
                        style={{
                            backgroundColor:
                                "#ffffff",
                        }}
                    >

                        <form
                            onSubmit={
                                handleSend
                            }
                        >

                            <div className="d-flex gap-2">

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type a message..."
                                    value={
                                        message
                                    }
                                    onChange={(e) =>
                                        setMessage(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        sending
                                    }
                                    autoComplete="off"
                                    style={{
                                        borderRadius:
                                            "12px",
                                    }}
                                />


                                <button
                                    type="submit"
                                    className="btn btn-warning fw-bold d-flex align-items-center justify-content-center gap-2 px-4"
                                    disabled={
                                        sending ||
                                        !message.trim()
                                    }
                                    style={{
                                        borderRadius:
                                            "12px",
                                    }}
                                >

                                    {sending ? (

                                        <Loader2
                                            size={18}
                                        />

                                    ) : (

                                        <Send
                                            size={18}
                                        />

                                    )}

                                    <span className="d-none d-md-inline">
                                        Send
                                    </span>

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default RideChat;