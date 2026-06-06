import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { indiaStates } from '../utils/indiaData';
import { API_BASE_URL } from '../config';
import './Auth.css';

const Auth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('FARMER'); // FARMER, DEALER, ADMIN
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // OTP flow states
  const [otpStep, setOtpStep] = useState(false); // false = phone step, true = otp step
  const [otp, setOtp] = useState('');
  const [displayedOtp, setDisplayedOtp] = useState(''); // OTP shown from backend
  const [otpLoading, setOtpLoading] = useState(false);

  // Registration Form States
  const [registerForm, setRegisterForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: 'password123', // Default placeholder password
    // Farmer specific
    adhar: '',
    passbookNumber: '',
    landSize: '',
    cropType: 'Paddy',
    state: '',
    district: '',
    village: '',
    // Dealer specific
    shopId: '',
    licenseNumber: '',
    mandal: ''
  });

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const stateObj = indiaStates.find(s => s.state === selectedState);
    const firstDistrict = stateObj && stateObj.districts.length > 0 ? stateObj.districts[0] : '';
    setRegisterForm(prev => ({
      ...prev,
      state: selectedState,
      district: firstDistrict
    }));
  };


  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!phone || phone.length < 10) {
      setMessage({ type: 'error', text: 'Please enter a valid phone number.' });
      return;
    }
    setOtpLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Phone number not registered.');
      }
      const data = await response.json();
      setDisplayedOtp(data.otp);
      setOtpStep(true);
      setMessage({ type: 'success', text: 'OTP sent! Use the code below to login.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!otp || otp.length < 4) {
      setMessage({ type: 'error', text: 'Please enter the OTP.' });
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid OTP. Please try again.');
      }
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      setMessage({ type: 'success', text: t('loginSuccess') });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleResetOtp = () => {
    setOtpStep(false);
    setOtp('');
    setDisplayedOtp('');
    setMessage({ type: '', text: '' });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!registerForm.name || !registerForm.phone) {
      setMessage({ type: 'error', text: 'Name and Phone number are required.' });
      return;
    }

    const endpoint = role === 'FARMER' ? 'farmer' : 'dealer';
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Registration failed. Check details or phone uniqueness.');
      }

      setMessage({ type: 'success', text: 'Account registered successfully! You can now log in.' });
      setPhone(registerForm.phone);
      setIsLogin(true);
      setOtpStep(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <img src="/logo.png" alt="Kisan Urea" className="auth-logo" />
          <h2>{isLogin ? t('loginTitle') : `Register as ${role === 'FARMER' ? t('roleFarmer') : t('roleDealer')}`}</h2>
          <p>{isLogin ? 'Enter your details to access your dashboard' : t('tagline')}</p>
        </div>

        {/* Role Selection Tabs */}
        {isLogin && (
          <div className="role-tabs">
            <button 
              className={`role-tab ${role === 'FARMER' ? 'active' : ''}`}
              onClick={() => { setRole('FARMER'); }}
            >
              {t('roleFarmer')}
            </button>
            <button 
              className={`role-tab ${role === 'DEALER' ? 'active' : ''}`}
              onClick={() => { setRole('DEALER'); }}
            >
              {t('roleDealer')}
            </button>
            <button 
              className={`role-tab ${role === 'ADMIN' ? 'active' : ''}`}
              onClick={() => { setRole('ADMIN'); }}
            >
              {t('roleAdmin')}
            </button>
          </div>
        )}

        {message.text && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        {isLogin ? (
          /* Login Form */
          !otpStep ? (
            /* Step 1: Enter Phone */
            <form className="auth-form" onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>{t('enterPhone')}</label>
                <input 
                  type="tel" 
                  placeholder={t('placeholderPhone')} 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary auth-submit" disabled={otpLoading}>
                {otpLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            /* Step 2: Show OTP + Enter OTP */
            <form className="auth-form" onSubmit={handleVerifyOtp}>
              {displayedOtp && (
                <div className="otp-display-box">
                  <span className="otp-display-label">🔑 Your OTP</span>
                  <span className="otp-display-code">{displayedOtp}</span>
                  <span className="otp-display-hint">Copy and enter below</span>
                </div>
              )}
              <div className="form-group">
                <label>Enter OTP</label>
                <input 
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  autoFocus
                  required
                />
              </div>
              <button type="submit" className="btn-primary auth-submit">
                Login
              </button>
              <button type="button" className="btn-secondary auth-back" onClick={handleResetOtp}>
                ← Change Number
              </button>
            </form>
          )
        ) : (
          /* Registration Form (Farmer / Dealer) */
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                placeholder="Enter full name" 
                value={registerForm.name}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Phone Number (Unique)</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="Enter 10-digit phone" 
                value={registerForm.phone}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="Enter email address" 
                value={registerForm.email}
                onChange={handleInputChange}
                required 
              />
            </div>

            {role === 'FARMER' ? (
              <>
                <div className="form-group">
                  <label>Aadhar Number</label>
                  <input 
                    type="text" 
                    name="adhar"
                    placeholder="12-digit Aadhaar" 
                    value={registerForm.adhar}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Passbook Number</label>
                  <input 
                    type="text" 
                    name="passbookNumber"
                    placeholder="Enter bank passbook no." 
                    value={registerForm.passbookNumber}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Land Size (Acres)</label>
                  <input 
                    type="number" 
                    name="landSize"
                    step="0.1" 
                    placeholder="e.g. 3.5" 
                    value={registerForm.landSize}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Crop Type</label>
                  <select 
                    name="cropType" 
                    value={registerForm.cropType} 
                    onChange={handleInputChange} 
                    className="form-select"
                  >
                    <option value="Paddy">Paddy / Rice</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Maize">Maize</option>
                    <option value="Wheat">Wheat</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Shop ID</label>
                  <input 
                    type="text" 
                    name="shopId"
                    placeholder="e.g. SH123" 
                    value={registerForm.shopId}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>License Number</label>
                  <input 
                    type="text" 
                    name="licenseNumber"
                    placeholder="Enter license no." 
                    value={registerForm.licenseNumber}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Mandal</label>
                  <input 
                    type="text" 
                    name="mandal"
                    placeholder="Enter mandal name" 
                    value={registerForm.mandal}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>State</label>
              <select
                name="state"
                value={registerForm.state}
                onChange={handleStateChange}
                className="form-select"
                required
              >
                <option value="">Select State</option>
                {indiaStates.map((s, idx) => (
                  <option key={idx} value={s.state}>{s.state}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>District</label>
              <select
                name="district"
                value={registerForm.district}
                onChange={handleInputChange}
                className="form-select"
                disabled={!registerForm.state}
                required
              >
                <option value="">Select District</option>
                {registerForm.state && 
                  (indiaStates.find(s => s.state === registerForm.state)?.districts || []).map((dist, idx) => (
                    <option key={idx} value={dist}>{dist}</option>
                  ))
                }
              </select>
            </div>


            <div className="form-group">
              <label>Village</label>
              <input 
                type="text" 
                name="village"
                placeholder="Enter village" 
                value={registerForm.village}
                onChange={handleInputChange}
                required 
              />
            </div>

            <button type="submit" className="btn-primary auth-submit">
              Register Now
            </button>
          </form>
        )}

        <div className="auth-footer">
          {/* Allow toggle only for Farmer and Dealer roles */}
          {role !== 'ADMIN' && (
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage({ type: '', text: '' });
                }} 
                className="toggle-auth"
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </p>
          )}
          <Link to="/" className="back-home">← {t('backToHome')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
