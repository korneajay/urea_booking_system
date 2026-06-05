import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { languages } from '../utils/translations';
import './Navbar.css';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="navbar fade-in">
      <div className="nav-container">
        <div className="logo-section">
          <Link to="/" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <img src="/logo.png" alt="Kisan Urea Logo" className="logo-img" />
            <div className="brand-text">
              <span className="brand-name">KISAN UREA</span>
              <span className="brand-tagline">{t('tagline')}</span>
            </div>
          </Link>
        </div>
        
        <ul className="nav-links">
          <li><Link to="/" className="active">{t('home')}</Link></li>
          {user && <li><Link to="/dashboard">{t('dashboard') || 'Dashboard'}</Link></li>}
          <li><Link to="/about">{t('aboutUs')}</Link></li>
          <li><Link to="/availability">{t('availability')}</Link></li>
          <li><Link to="/dealer-locator">{t('dealerLocator')}</Link></li>
          <li><Link to="/support">{t('support')}</Link></li>
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
            <Link to="/login">
              <button className="login-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>{t('login')}</span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
