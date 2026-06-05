import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { indiaStates } from '../utils/indiaData';
import { API_BASE_URL } from '../config';
import './DealerLocator.css';

const DealerLocator = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dealers`);
        if (response.ok) {
          setDealers(await response.json());
        }
      } catch (err) {
        console.error("Failed to fetch dealers, using preseeded fallback:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDealers();
  }, []);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedDistrict('');
  };

  const filteredDealers = dealers.filter(dealer => {
    const matchesSearch = !searchQuery || 
      dealer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.shopId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.village?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = !selectedState || dealer.state?.toLowerCase() === selectedState.toLowerCase();
    const matchesDistrict = !selectedDistrict || dealer.district?.toLowerCase() === selectedDistrict.toLowerCase();
    
    return matchesSearch && matchesState && matchesDistrict;
  });

  return (
    <div className="locator-container fade-in">
      <div className="locator-hero">
        <h1>Find Authorized Dealers Near You</h1>
        <p>Search authorized urea dealerships across India and view their contact details and live stock</p>
      </div>

      <div className="locator-controls glass-card">
        <div className="search-box">
          <label>Search Directory</label>
          <input 
            type="text" 
            placeholder="Search by name, shop ID, or village..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="controls-filters">
          <div className="filter-item">
            <label>State</label>
            <select value={selectedState} onChange={handleStateChange} className="locator-select">
              <option value="">All States</option>
              {indiaStates.map((s, idx) => (
                <option key={idx} value={s.state}>{s.state}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>District</label>
            <select 
              value={selectedDistrict} 
              onChange={(e) => setSelectedDistrict(e.target.value)} 
              className="locator-select"
              disabled={!selectedState}
            >
              <option value="">All Districts</option>
              {selectedState && 
                (indiaStates.find(s => s.state === selectedState)?.districts || []).map((dist, idx) => (
                  <option key={idx} value={dist}>{dist}</option>
                ))
              }
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="locator-loader">Loading dealer registry...</div>
      ) : filteredDealers.length === 0 ? (
        <div className="locator-empty glass-card">
          <h3>No matching dealers found</h3>
          <p>Try refining your search terms or selecting a different region.</p>
        </div>
      ) : (
        <div className="locator-grid">
          {filteredDealers.map((dealer) => (
            <div key={dealer.id} className="dealer-card glass-card">
              <div className="dealer-card-header">
                <span className="shop-badge">{dealer.shopId || 'SH-REG'}</span>
                <span className={`stock-indicator ${dealer.currentStock > 0 ? 'instock' : 'outstock'}`}>
                  {dealer.currentStock > 0 ? `${dealer.currentStock} Bags Available` : 'Out of Stock'}
                </span>
              </div>

              <h3>{dealer.name}</h3>
              
              <div className="dealer-card-body">
                <div className="info-row">
                  <span className="info-label">License:</span>
                  <span className="info-value">{dealer.licenseNumber}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Village:</span>
                  <span className="info-value">{dealer.village}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Mandal:</span>
                  <span className="info-value">{dealer.mandal}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">District:</span>
                  <span className="info-value">{dealer.district}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">State:</span>
                  <span className="info-value">{dealer.state}</span>
                </div>
              </div>

              <div className="dealer-card-actions">
                <button className="btn-secondary" onClick={() => alert(`Contacting ${dealer.name} at registered number: ${dealer.phone}`)}>
                  📞 Contact Dealer
                </button>
                <button className="btn-primary" onClick={() => alert(`Directions to Shop ID ${dealer.shopId} in ${dealer.village} Mandal ${dealer.mandal} is coming soon!`)}>
                  📍 Locate Shop
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DealerLocator;
