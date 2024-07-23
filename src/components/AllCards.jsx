import React from 'react';
import { db } from '../Firebase/Firebase';
import {  doc, updateDoc, increment, serverTimestamp, where } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Components.css';
import CustomSkeleton from './Skeleton';

export default function AllCards({ listings }) {
  
  const handleListingClick = async (id) => {
    const listingRef = doc(db, 'Listings', id);
    await updateDoc(listingRef, {
      clicks: increment(1),
      lastClickedAt: serverTimestamp() // Update with current timestamp
    });
  };

  if (!listings) {
    return <CustomSkeleton layout='allCards'/>;
  }

  // Check if listings array is empty
  if (listings.length === 0) {
    return <p>No listings available.</p>;
  }

  return (
    <div className='all-cards-div'>
      {listings.map((item) => (
        <Link
          to={`/listings/${item.id}`}
          key={item.id}
          className="listing-link"
          onClick={() => handleListingClick(item.id)}
        >
          <div className="listing-card">
            <div className="card-media">
              <img src={item.images[0]} alt="house" />
            </div>
            <div className="card-content">
              <h2 className='header'>{item.name}</h2>
              <div className='listing-info'>
                <p className="location">{item.location}</p>
                <p className="lprice">K{item.price}/mon</p>
              </div>
              <div className='listing-info'>
                <p className="school">{item.school}</p>
                <p className="time">{item.time}</p>
              </div>
              <p className="gender">{item.gender}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
