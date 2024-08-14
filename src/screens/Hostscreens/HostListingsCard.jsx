import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../Firebase/Firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

export default function ListingCard({ listing }) {
  const [isAvailable, setIsAvailable] = useState(listing.isAvailable);

  useEffect(() => {
    const listingRef = doc(db, 'Listings', listing.id);

    const unsubscribe = onSnapshot(listingRef, (doc) => {
      if (doc.exists()) {
        setIsAvailable(doc.data().isAvailable);
      }
    });

    return () => unsubscribe();
  }, [listing.id]);

  const toggleAvailability = async (e) => {
    e.preventDefault();
    const newStatus = !isAvailable;

    // Update the status in Firestore
    try {
      const listingRef = doc(db, 'Listings', listing.id);
      await updateDoc(listingRef, {
        isAvailable: newStatus
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <Link to={`/host/detail/${listing.id}`} className='linky'>
      <div className="host-listing-card">
        <div className="badge-container">
          <span className={`badge ${isAvailable ? 'badge-available' : 'badge-not-available'}`}>
            {isAvailable ? 'Space Available' : 'No Space'}
          </span>
        </div>
        <img src={listing.images[0]} alt={listing.name} />
        <div className="host-listing-card-info">
          <h3>{listing.name}</h3>
          <p>K{listing.price}/mon</p>
          <button onClick={toggleAvailability} className="availability-toggle">
            {isAvailable ? 'Mark as Not Available' : 'Mark as Available'}
          </button>
        </div>
      </div>
    </Link>
  );
}
