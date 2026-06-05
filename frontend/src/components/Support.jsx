import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Support.css';

const Support = () => {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', query: '' });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: "What is the urea booking quota limit?",
      a: "The booking quota is strictly based on land ownership at a rate of 2 bags per acre. For example, if you own 3 acres of land, your maximum booking limit for the Kharif 2026 season is 6 bags."
    },
    {
      q: "How do I request/book urea bags?",
      a: "Log into your account with your registered phone number. In the dashboard under 'Request Urea Bags', enter the quantity, select an authorized dealer near you, and submit the request. The dealer will verify and approve/reject the booking."
    },
    {
      q: "How can I claim my booked bags from the dealer?",
      a: "Once the dealer approves your booking, a unique alphanumeric token will be generated on your dashboard. Visit the dealer's shop or warehouse, show this token, complete the verification, and collect your bags."
    },
    {
      q: "What does the 'Priority' label mean?",
      a: "Priority is automatically calculated based on factors such as land size and previous bookings. Small/marginal landholders are given a higher priority tag to ensure equitable access during supply deficits."
    },
    {
      q: "My booking was rejected. What should I do?",
      a: "Bookings can be rejected due to out-of-stock inventory, wrong crop season details, or verification issues. You can select another nearby dealer with available stock and submit a new request."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.phone && form.query) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', phone: '', query: '' });
        alert("Thank you! Your support ticket has been registered. An official will contact you shortly.");
      }, 1000);
    }
  };

  return (
    <div className="support-container fade-in">
      <div className="support-hero">
        <h1>Help & Customer Support Desk</h1>
        <p>Find answers to common questions or reach out directly to the KisanUrea Helpline</p>
      </div>

      <div className="support-grid">
        {/* Left: FAQs */}
        <div className="faq-section glass-card">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <span className="faq-icon">{activeFaq === index ? '−' : '+'}</span>
                </div>
                {activeFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Contact & Submit query */}
        <div className="contact-section">
          <div className="contact-details glass-card">
            <h2>Contact Helpline</h2>
            <div className="helpline-info">
              <div className="info-block">
                <strong>Toll-Free Helpline:</strong>
                <span>1800-425-8888 (Toll Free)</span>
              </div>
              <div className="info-block">
                <strong>Support Email:</strong>
                <span>support.kisanurea@gov.in</span>
              </div>
              <div className="info-block">
                <strong>Working Hours:</strong>
                <span>Monday to Saturday — 9:00 AM to 6:00 PM IST</span>
              </div>
            </div>
          </div>

          <div className="query-form-card glass-card">
            <h2>Register a Complaint/Query</h2>
            <form onSubmit={handleSubmit} className="query-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Details of Query / Grievance</label>
                <textarea 
                  placeholder="Describe your issue or question..."
                  rows="4"
                  value={form.query}
                  onChange={(e) => setForm({ ...form, query: e.target.value })}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-primary form-submit">
                {submitted ? 'Submitting ticket...' : 'Submit Support Ticket'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
