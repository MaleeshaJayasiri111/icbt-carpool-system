import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatBox = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'System', text: 'Welcome to the ICBT Carpool Chat. Please keep communications strictly related to the ride coordination.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser) navigate('/login');
            else setUser(storedUser);

            // Dummy socket connection to satisfy Socket.IO client requirement without a server
            const newSocket = io('http://localhost:5000', {
                autoConnect: false // Don't actually connect since we don't have a backend
            });
            setSocket(newSocket);

            // Cleanup
            return () => newSocket.close();
        } catch (err) {
            console.error(err);
        }
    }, [navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        try {
            if (newMessage.trim() === '') return;

            const messageData = {
                id: Date.now(),
                sender: user?.name || 'Unknown',
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSelf: true
            };

            setMessages(prev => [...prev, messageData]);
            setNewMessage('');

            // If socket was active, we'd do: socket.emit('sendMessage', messageData)
            // Simulating a reply from the other person
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: user?.role === 'passenger' ? 'Driver Partner' : 'Passenger Name',
                    text: 'Got it! I will be near the campus gate on time.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }, 2000);

        } catch (err) {
            console.error('Message failed:', err);
        }
    };

    if (!user) return null;

    return (
        <div className="mx-auto" style={{ maxWidth: '800px', height: 'calc(100vh - 120px)' }}>
            <div className="card shadow-sm border-0 h-100 d-flex flex-column">
                {/* Chat Header */}
                <div className="card-header bg-white border-bottom p-3">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center">
                            <User size={24} className="text-secondary" />
                        </div>
                        <div>
                            <h5 className="mb-0 fw-bold">Trip Coordinator</h5>
                            <span className="text-success small d-flex align-items-center gap-1">
                                <span className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                                Online
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="card-body bg-light overflow-auto p-4 d-flex flex-column gap-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`d-flex ${msg.isSelf ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            <div
                                className={`p-3 rounded shadow-sm ${msg.isSelf ? 'bg-primary text-white custom-chat-self' : 'bg-white text-dark border custom-chat-other'}`}
                                style={{ maxWidth: '75%' }}
                            >
                                {!msg.isSelf && <div className="fw-semibold small mb-1">{msg.sender}</div>}
                                <div className="mb-1">{msg.text}</div>
                                <div className={`small ${msg.isSelf ? 'text-primary-light text-end opacity-75' : 'text-muted text-end'}`} style={{ fontSize: '0.7rem' }}>
                                    {msg.time}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="card-footer bg-white border-top p-3">
                    <form onSubmit={handleSendMessage} className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type your message here..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary d-flex align-items-center justify-content-center px-4">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
