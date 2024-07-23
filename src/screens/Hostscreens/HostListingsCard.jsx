// src/components/ListingCard.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  return (
    <Link to={`/host/detail/${listing.id}`} className='linky'>
      <div className="host-listing-card">
        <img src={listing.images[0]} alt={listing.name}  />
        <div className="host-listing-card-info">
          <h3>{listing.name}</h3>
          <p>K{listing.price}/mon</p>
        </div>
      </div>
    </Link>
  );
}
