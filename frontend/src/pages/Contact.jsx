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
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    category: 'General Inquiry',
                    subject: '',
                    message: ''
                });
            }, 600);
        } catch (err) {
            console.error('Submission error:', err);
            setSubmitting(false);
        }
    };

    return (
        <div style={{ marginTop: '-1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem', width: 'calc(100% + 3rem)' }}>
            {/* Full-Width Edge-to-Edge Hero Banner Section with Background Image */}
            <div
                className="w-100 text-white position-relative overflow-hidden shadow-sm"
                style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.80)), url('/contact-hero.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '380px',
                    padding: '4rem 1.5rem 6rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <div className="container text-start" style={{ maxWidth: '960px' }}>
                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center">
                        <MessageSquare size={16} className="me-1" /> Get In Touch
                    </span>
                    <h1 className="display-4 fw-bold mb-3" style={{ color: '#f59e0b' }}>
                        Let's Connect
                    </h1>
                    <p className="lead text-light text-opacity-90 mb-0" style={{ maxWidth: '720px', lineHeight: '1.6' }}>
                        If you're unable to find what you're looking for or if you need further assistance, please don't hesitate to contact us. We'll make every effort to accommodate your needs and ensure your requirements are met.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container py-4" style={{ maxWidth: '960px' }}>
                <div className="g-4 mb-5 position-relative" style={{ marginTop: '-70px', zIndex: 2 }}>
                    {/* Form Section - Full Width First */}
                    <div className="mb-4">
                        <div className="card p-4 p-md-5 border-0 shadow-lg bg-white rounded-4">
                            <h4 className="fw-bold mb-2">Send Us a Message</h4>
                            <p className="text-secondary small mb-4">Fill out the form below and our campus support team will get back to you within 24 hours.</p>

                            {submitted && (
                                <div className="alert alert-success d-flex align-items-center gap-3 p-3 rounded-3 mb-4" role="alert">
                                    <CheckCircle2 size={24} className="text-success flex-shrink-0" />
                                    <div>
                                        <h6 className="fw-bold mb-1">Message Sent Successfully!</h6>
                                        <p className="small mb-0">Thank you for reaching out. A support representative will respond to your email shortly.</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Your Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg fs-6"
                                            placeholder="e.g. Nimal Perera"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Email Address <span className="text-danger">*</span></label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg fs-6"
                                            placeholder="e.g. nimal@icbt.lk"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control form-control-lg fs-6"
                                            placeholder="0771234567"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Topic Category</label>
                                        <select
                                            className="form-select form-select-lg fs-6"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Booking Help">Booking / Search Issue</option>
                                            <option value="Driver Account">Driver Registration</option>
                                            <option value="Safety & Policy">Safety & Code of Conduct</option>
                                            <option value="Feedback">App Feedback</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Subject <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg fs-6"
                                            placeholder="Short summary of your query"
                                            required
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Message <span className="text-danger">*</span></label>
                                        <textarea
                                            className="form-control form-control-lg fs-6"
                                            rows="4"
                                            placeholder="Provide as much detail as possible..."
                                            required
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="col-12 mt-4">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                                        >
                                            {submitting ? (
                                                <>Submitting...</>
                                            ) : (
                                                <>
                                                    <Send size={18} /> Send Message
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Contact Information - Full Width Horizontal Row Below */}
                    <div className="card p-4 border-0 shadow-sm bg-white rounded-4 mb-4">
                        <h4 className="fw-bold mb-4">Contact Info</h4>
                        <div className="row g-3">
                            <div className="col-sm-6 col-md-3">
                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-primary-subtle text-primary p-2 rounded-3 flex-shrink-0">
                                        <MapPin size={22} />
                                    </div>
                                    <div>
                                        <h6 className="fw-semibold mb-1">Campus Address</h6>
                                        <p className="text-secondary small mb-0">
                                            ICBT Campus Building,<br />
                                            No. 36, De Kretser Place,<br />
                                            Bambalapitiya, Colombo 04
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3">
                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-success-subtle text-success p-2 rounded-3 flex-shrink-0">
                                        <Phone size={22} />
                                    </div>
                                    <div>
                                        <h6 className="fw-semibold mb-1">Phone Number</h6>
                                        <p className="text-secondary small mb-0">+94 (0) 11 477 7888</p>
                                        <p className="text-secondary small mb-0">+94 (0) 77 123 4567</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3">
                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-warning-subtle text-warning p-2 rounded-3 flex-shrink-0">
                                        <Mail size={22} />
                                    </div>
                                    <div>
                                        <h6 className="fw-semibold mb-1">Email Address</h6>
                                        <p className="text-secondary small mb-0">support@icbtcarpool.lk</p>
                                        <p className="text-secondary small mb-0">info@icbt.lk</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3">
                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-info-subtle text-info p-2 rounded-3 flex-shrink-0">
                                        <Clock size={22} />
                                    </div>
                                    <div>
                                        <h6 className="fw-semibold mb-1">Operating Hours</h6>
                                        <p className="text-secondary small mb-0">Mon - Fri: 8:00 AM - 6:00 PM</p>
                                        <p className="text-secondary small mb-0">Sat: 8:30 AM - 1:30 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Quick Reference */}
                <div className="card border-0 bg-light p-4 rounded-4 shadow-sm text-center">
                    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3 text-start">
                            <div className="bg-primary text-white p-3 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                                <HelpCircle size={28} />
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Looking for Immediate Answers?</h5>
                                <p className="text-secondary small mb-0">Check out our User Manual and step-by-step FAQ section for common questions.</p>
                            </div>
                        </div>
                        <Link to="/help" className="btn btn-outline-primary px-4 text-nowrap">
                            View User Manual
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
