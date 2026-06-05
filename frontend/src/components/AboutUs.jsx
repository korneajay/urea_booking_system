import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './AboutUs.css';

const AboutUs = () => {
  const { t } = useLanguage();

  return (
    <div className="about-container fade-in">
      <div className="about-hero-section">
        <h1>Empowering Indian Farmers</h1>
        <p className="hero-subtext">Ensuring Fair & Transparent Fertilizer Distribution for Kharif 2026</p>
      </div>

      <div className="about-content-grid">
        <div className="about-card glass-card">
          <h2>Our Mission</h2>
          <p>
            Kisan Urea is a government-backed digital initiative launched to address the challenges in urea supply and distribution during critical agricultural seasons. Our mission is to prevent black marketing, eliminate supply deficits, and guarantee that every farmer has access to fair and subsidized fertilizer quotas.
          </p>
        </div>

        <div className="about-card glass-card">
          <h2>How It Works</h2>
          <p>
            The platform connects farmers, local authorized dealers, and agricultural administrators in a transparent ecosystem.
          </p>
          <ul className="about-list">
            <li><strong>Quota Allotment:</strong> Automatic quota calculation based on land ownership (2 bags per acre).</li>
            <li><strong>Digital Booking:</strong> Farmers request bags online from local dealers.</li>
            <li><strong>Secure Tokens:</strong> Unique digital tokens generated upon approval for secure warehouse collection.</li>
          </ul>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-item glass-card">
          <h3>10 Lakh+</h3>
          <p>Farmers Enrolled</p>
        </div>
        <div className="stat-item glass-card">
          <h3>5,000+</h3>
          <p>Registered Dealers</p>
        </div>
        <div className="stat-item glass-card">
          <h3>50 Lakh+</h3>
          <p>Bags Distributed</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
