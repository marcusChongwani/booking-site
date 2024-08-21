import React from 'react';
import { Link } from 'react-router-dom';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';
import './Components.css';
import CustomSkeleton from './Skeleton';
import imi from '../assets/back2.png';

export default function AllCards({ listings }) {
  const handleListingClick = async (listingId) => {
    try {
      const listingRef = doc(db, 'Listings', listingId);
  
      // Increment the click count and update the last clicked timestamp
      await updateDoc(listingRef, {
        clicks: increment(1),
        lastClickedAt: new Date(),
      });
  
      // Add a new document to the 'clicks' subcollection
      const clicksRef = collection(listingRef, 'clicks');
      await addDoc(clicksRef, {
        clickedAt: new Date(),
      });
  
    } catch (error) {
      console.error('Error updating click data:', error);
    }
  
  };

  // Render loading state or empty state
  if (!listings) {
    return <CustomSkeleton layout='allCards' />;
  }

  // Check if listings array is empty
  if (listings.length === 0) {
    return <p className='ifno'>No listings available.</p>;
  }

  return (
    <div className='all-cards-div'>
      {listings.map((item, index) => (
        <Link
          to={`/listings/${item.id}`}
          key={`${item.id}-${index}`}
          className="listing-link"
          onClick={() => handleListingClick(item.id)}
        >
          <div className="listing-card">
            <div className="badge-container">
              <span className={`badge ${item.isAvailable ? 'badge-available' : 'badge-not-available'}`}>
                {item.isAvailable ? 'Space Available' : 'No Space'}
              </span>
            </div>
            <div className="card-media">
              <img src={item.images?.[0] || imi} alt="house" />
            </div>
            <div className="card-content">
              <h2 className='header1'>{item.name}</h2>
              <div className='listing-info'>
                <p className="location">{item.location}</p>
                <p className="lprice">K{item.price}/mon</p>
              </div>
              <div className='listing-info'>
                <p className="school">{item.school}</p>
                <p className="time">{item.time} minutes walk</p>
              </div>
              <p className="gender">{item.gender}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
