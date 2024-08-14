import React from 'react';
import './Components.css';

export default function HowItWorks() {
  return (
    <div className="how-it-works-container">
      <h2 className="section-title">How Our Platform Simplifies Your Search</h2>
      <div className="steps-container">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3 className="step-title">Explore Listings</h3>
            <p className="step-description">
              Browse a wide range of student accommodations without any subscription fees. Find the perfect place based on your needs and preferences.
            </p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3 className="step-title">Connect with Hosts</h3>
            <p className="step-description">
              Easily connect with hosts to inquire about properties and arrange viewings. No hidden fees—just straightforward connections.
            </p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3 className="step-title">Post Your Property</h3>
            <p className="step-description">
              Hosts can post their listings for free and enjoy free marketing to attract potential tenants. Your property will reach students looking for accommodations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
