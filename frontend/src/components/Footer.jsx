import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo-section">
              <img src="/logo.png" alt="Logo" className="footer-logo" />
              <h3>KISAN UREA</h3>
            </div>
            <p>Empowering the backbone of our nation through technology and transparency.</p>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/availability">Check Availability</a></li>
              <li><a href="/support">Support</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>Email: support@kisanurea.com</p>
            <p>Phone: 1800-123-4567</p>
            <p>Address: Agricultural Hub, New Delhi, India</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Kisan Urea. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
