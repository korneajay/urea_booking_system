import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="hero">
      <div className="hero-content fade-in">
        <h1 className="hero-title">
          {t('heroTitle')} <br />
          {t('heroTitleGreen').split(' ')[0]} <span className="highlight">{t('heroTitleGreen').substring(t('heroTitleGreen').indexOf(' ') + 1)}</span>
        </h1>
        <p className="hero-subtitle">
          {t('heroDesc')}
        </p>
        
        <div className="hero-btns">
          <Link to="/login">
            <button className="btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {t('bookNow')}
            </button>
          </Link>
          <Link to="/availability">
            <button className="btn-outline">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              {t('checkAvailability')}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
