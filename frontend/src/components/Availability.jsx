import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { indiaStates } from '../utils/indiaData';
import './Availability.css';

const Availability = () => {
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/dealers');
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
    const matchesState = !selectedState || dealer.state?.toLowerCase() === selectedState.toLowerCase();
    const matchesDistrict = !selectedDistrict || dealer.district?.toLowerCase() === selectedDistrict.toLowerCase();
    return matchesState && matchesDistrict;
  });

  const getStockStatus = (stock) => {
    if (stock > 500) return { label: 'In Stock', class: 'status-high' };
    if (stock > 0) return { label: 'Low Stock', class: 'status-low' };
    return { label: 'Out of Stock', class: 'status-empty' };
  };

  const totalStock = filteredDealers.reduce((sum, d) => sum + (d.currentStock || 0), 0);

  return (
    <div className="availability-container fade-in">
      <div className="availability-hero">
        <h1>Live Urea Availability Tracker</h1>
        <p>Real-time check of fertilizer inventory across government-authorized distribution centers</p>
      </div>

      <div className="filter-bar glass-card">
        <div className="filter-group">
          <label>Select State</label>
          <select value={selectedState} onChange={handleStateChange} className="filter-select">
            <option value="">All States</option>
            {indiaStates.map((s, idx) => (
              <option key={idx} value={s.state}>{s.state}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Select District</label>
          <select 
            value={selectedDistrict} 
            onChange={(e) => setSelectedDistrict(e.target.value)} 
            className="filter-select"
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

      <div className="summary-cards">
        <div className="summary-card glass-card">
          <h3>Total Dealers Found</h3>
          <p className="summary-number">{filteredDealers.length}</p>
        </div>
        <div className="summary-card glass-card">
          <h3>Total Bags Available</h3>
          <p className="summary-number green">{totalStock.toLocaleString()} Bags</p>
        </div>
      </div>

      <div className="dealers-table-container glass-card">
        <h2>Authorized Dealership Directory</h2>
        {loading ? (
          <div className="table-loader">Loading live directory...</div>
        ) : filteredDealers.length === 0 ? (
          <div className="table-empty">No authorized dealers found in the selected region.</div>
        ) : (
          <table className="dealers-table">
            <thead>
              <tr>
                <th>Shop ID / License</th>
                <th>Dealer Name</th>
                <th>Location Details</th>
                <th>Current Stock</th>
                <th>Inventory Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDealers.map((dealer) => {
                const status = getStockStatus(dealer.currentStock);
                return (
                  <tr key={dealer.id}>
                    <td>
                      <div className="shop-id">{dealer.shopId || 'N/A'}</div>
                      <div className="license-no">{dealer.licenseNumber}</div>
                    </td>
                    <td className="dealer-name">{dealer.name}</td>
                    <td>
                      <div>{dealer.village}, {dealer.mandal}</div>
                      <div className="region-sub">{dealer.district}, {dealer.state}</div>
                    </td>
                    <td className="dealer-stock">{dealer.currentStock} Bags</td>
                    <td>
                      <span className={`status-badge ${status.class}`}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Availability;
