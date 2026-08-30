import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, HelpCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        category: 'General Inquiry',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            console.log('Contact form payload:', formData);
            setTimeout(() => {
                setSubmitting(false);
                setSubmitted(true);
                setFormData({ name: '', email: '', phone: '', category: 'General Inquiry', subject: '', message: '' });
            }, 600);
        } catch (err) {
            console.error('Submission error:', err);
            setSubmitting(false);
        }
    };

    const DARK_CARD = { backgroundColor: '#0d1b5e', border: '2px solid rgba(59,130,246,0.5)' };

    return (
        <div
            className="d-flex flex-column"
            style={{
                minHeight: '85vh',
                background: 'radial-gradient(circle at 10% 20%, rgba(250, 204, 21, 0.05) 0%, rgba(15, 23, 42, 0.05) 90%)',
                marginTop: '-1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem', width: 'calc(100% + 3rem)'
            }}>

            {/* Hero Header — No Image */}
            <div className="text-center pt-5 pb-4 mt-4">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center shadow-sm">
                        <MessageSquare size={16} className="me-1" /> Get In Touch
                    </span>
                    <h1 className="display-4 fw-bold mb-3 premium-gradient-text" style={{ paddingBottom: '5px' }}>
                        Let's Connect
                    </h1>
                    <p className="lead fw-semibold mb-0 mx-auto" style={{ maxWidth: '680px', lineHeight: '1.6', color: '#1e293b' }}>
                        Need help, have feedback, or just want to say hello? We're here to support the ICBT campus community every step of the way.
                    </p>
                </div>
            </div>

            <div className="container py-4" style={{ maxWidth: '1000px' }}>

                {/* Contact Info Strip */}
                <div className="card p-4 p-md-5 mb-5 rounded-4 shadow-sm" style={DARK_CARD}>
                    <div className="row g-4 text-center text-md-start">
                        {[
                            { icon: MapPin, label: 'Campus Address', lines: ['ICBT Kandy Campus,', 'No. 12, Peradeniya Road,', 'Kandy, Sri Lanka'] },
                            { icon: Phone, label: 'Phone Number', lines: ['+94 (0) 81 222 7888', '+94 (0) 77 123 4567'] },
                            { icon: Mail, label: 'Email Address', lines: ['support@icbtcarpool.lk', 'info@icbt.lk'] },
                            { icon: Clock, label: 'Operating Hours', lines: ['Mon - Fri: 8:00 AM – 6:00 PM', 'Sat: 8:30 AM – 1:30 PM'] },
                        ].map(({ icon: Icon, label, lines }) => (
                            <div key={label} className="col-sm-6 col-md-3">
                                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3">
                                    <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px' }}>
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold text-white mb-1">{label}</h6>
                                        {lines.map(l => <p key={l} className="text-white-50 small mb-0">{l}</p>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Form */}
                <div className="card p-4 p-md-5 rounded-4 shadow-sm mb-4" style={DARK_CARD}>
                    <h4 className="fw-bold text-white mb-1">Send Us a Message</h4>
                    <p className="text-white-50 small mb-4">Fill out the form below and our campus support team will get back to you within 24 hours.</p>

                    {submitted && (
                        <div className="d-flex align-items-center gap-3 p-3 rounded-3 mb-4"
                            style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                            <CheckCircle2 size={24} className="text-success flex-shrink-0" />
                            <div>
                                <h6 className="fw-bold text-white mb-1">Message Sent Successfully!</h6>
                                <p className="small mb-0 text-white-50">Thank you for reaching out. A support representative will respond to your email shortly.</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-white-50 small">Your Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg fs-6"
                                    placeholder="e.g. Nimal Perera"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-white-50 small">Email Address <span className="text-danger">*</span></label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg fs-6"
                                    placeholder="e.g. nimal@icbt.lk"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-white-50 small">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-control form-control-lg fs-6"
                                    placeholder="0771234567"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-white-50 small">Topic Category</label>
                                <select
                                    className="form-select form-select-lg fs-6"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                                >
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Booking Help">Booking / Search Issue</option>
                                    <option value="Driver Account">Driver Registration</option>
                                    <option value="Safety & Policy">Safety & Code of Conduct</option>
                                    <option value="Feedback">App Feedback</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold text-white-50 small">Subject <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg fs-6"
                                    placeholder="Short summary of your query"
                                    required
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold text-white-50 small">Message <span className="text-danger">*</span></label>
                                <textarea
                                    className="form-control form-control-lg fs-6"
                                    rows="4"
                                    placeholder="Provide as much detail as possible..."
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                                />
                            </div>
                            <div className="col-12 mt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn btn-yb-yellow btn-lg w-100 d-flex align-items-center justify-content-center gap-2 fw-bold py-3"
                                >
                                    {submitting ? 'Sending...' : <><Send size={18} /> Send Message</>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Help Quick Reference */}
                <div className="card p-4 p-md-5 rounded-4 shadow-sm mb-4" style={DARK_CARD}>
                    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
                        <div className="d-flex align-items-center gap-4 text-start">
                            <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '56px', height: '56px' }}>
                                <HelpCircle size={28} />
                            </div>
                            <div>
                                <h5 className="fw-bold text-white mb-1">Looking for Immediate Answers?</h5>
                                <p className="text-white-50 small mb-0">Check out our User Manual and step-by-step FAQ section for common questions.</p>
                            </div>
                        </div>
                        <Link to="/help" className="btn btn-yb-yellow px-4 fw-bold text-nowrap">
                            View User Manual
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;
