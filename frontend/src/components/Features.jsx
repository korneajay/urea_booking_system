import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Features.css';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t('easyBookingTitle'),
      description: t('easyBookingDesc'),
      icon: "📦"
    },
    {
      title: t('realTimeTitle'),
      description: t('realTimeDesc'),
      icon: "📊"
    },
    {
      title: t('priorityTitle'),
      description: t('priorityDesc'),
      icon: "🌱"
    },
    {
      title: t('secureTitle'),
      description: t('secureDesc'),
      icon: "🔒"
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="section-header fade-in">
          <h2>{t('whyChoose').split(' ')[0]} <span className="green">Kisan Urea</span>?</h2>
          <p>{t('whyChooseSubtitle')}</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card fade-in" key={index} style={{animationDelay: `${index * 0.1}s`}}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
