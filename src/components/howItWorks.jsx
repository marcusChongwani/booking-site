import React from 'react';
import './Components.css'

export default function HowItWorks() {
  return (
    <div className="how-it-works-container">
      <h2 className="section-title">How It Works</h2>
      <div className="steps-container">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
          <h3 className="step-title">subcription fee</h3>
            <p className="step-description">
              Take advantage of our subscription of k20 per month for a better experience
            </p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3 className="step-title">Explore Listings</h3>
            <p className="step-description">
              Browse through detailed property listings, including photos, amenities, and pricing information.
            </p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
          <h3 className="step-title">Search for university</h3>
            <p className="step-description">
              Use our search feature to find properties based on location, price range and room type.
            </p>
           
          </div>
        </div>
      </div>
    </div>
  );
}
