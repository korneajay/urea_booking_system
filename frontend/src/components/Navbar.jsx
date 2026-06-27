import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { languages } from '../utils/translations';
import './Navbar.css';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [menuActive, setMenuActive] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setMenuActive(false);
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="navbar fade-in">
      <div className="nav-container">
        <div className="logo-section">
          <Link to="/" style={{display: 'flex', alignItems: 'center', gap: '12px'}} onClick={() => setMenuActive(false)}>
            <img src="/logo.png" alt="Kisan Urea Logo" className="logo-img" />
            <div className="brand-text">
              <span className="brand-name">KISAN UREA</span>
              <span className="brand-tagline">{t('tagline')}</span>
            </div>
          </Link>
        </div>

        {/* Hamburger Menu Icon */}
        <button 
          className={`hamburger ${menuActive ? 'active' : ''}`} 
          onClick={() => setMenuActive(!menuActive)}
          aria-label="Toggle navigation menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        
        <div className={`nav-menu ${menuActive ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/" className="active" onClick={() => setMenuActive(false)}>{t('home')}</Link></li>
            {user && <li><Link to="/dashboard" onClick={() => setMenuActive(false)}>{t('dashboard') || 'Dashboard'}</Link></li>}
            <li><Link to="/about" onClick={() => setMenuActive(false)}>{t('aboutUs')}</Link></li>
            <li><Link to="/availability" onClick={() => setMenuActive(false)}>{t('availability')}</Link></li>
            <li><Link to="/dealer-locator" onClick={() => setMenuActive(false)}>{t('dealerLocator')}</Link></li>
            <li><Link to="/support" onClick={() => setMenuActive(false)}>{t('support')}</Link></li>
          </ul>

          <div className="nav-actions" style={{display: 'flex', alignItems: 'center'}}>
            <select 
              className="lang-selector" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            {user ? (
              <button className="login-btn" onClick={handleLogout}>
                <span>{t('logout')}</span>
              </button>
            ) : (
              <Link to="/login" onClick={() => setMenuActive(false)}>
                <button className="login-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span>{t('login')}</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
