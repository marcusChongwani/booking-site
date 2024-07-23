import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsStarFill } from 'react-icons/bs';
import HostListings from './HostListings';
import ListingClicks from './ListingClicks';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../Firebase/Firebase'; // Adjust import path as per your setup

const Dashboard = () => {
  const [listingVisits, setListingVisits] = useState(0); // State to hold listing visits count
  const [averageRating, setAverageRating] = useState(0); // State to hold the average rating
  const [totalReviews, setTotalReviews] = useState(0); // State to hold total number of reviews
  const currentUser = auth.currentUser; // Access current user directly from Firebase auth

  useEffect(() => {
    const fetchListingVisits = async () => {
      try {
        if (!currentUser) return;

        const q = query(collection(db, 'Listings'), where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.reduce((total, doc) => {
          const listingData = doc.data();
          return total + (listingData.clicks || 0);
        }, 0);

        setListingVisits(data);
      } catch (error) {
        console.error('Error fetching listing visits:', error);
      }
    };

    fetchListingVisits();
  }, [currentUser]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const reviewsSnapshot = await getDocs(collection(db, 'Reviews'));
        let totalRating = 0;
        let numReviews = 0;

        reviewsSnapshot.forEach((reviewDoc) => {
          const reviewData = reviewDoc.data();
          totalRating += reviewData.rating;
          numReviews++;
        });

        const avgRating = numReviews > 0 ? totalRating / numReviews : 0;
        setAverageRating(avgRating);
        setTotalReviews(numReviews);
      } catch (error) {
        console.error('Error fetching average rating:', error);
      }
    };

    fetchAverageRating();
  }, []);

  return (
    <div>
      <section className="host-dashboard">
        <div className="info">
          <h1>Welcome!</h1>
          <p>Listing Visits in the last <span>Week</span></p>
          <h2>{listingVisits} Clicks</h2> {/* Display dynamic visits count */}
        </div>
        <Link to="visits" className='det'>Details</Link>
      </section>
      <section className="host-dashboard-reviews2">
        <h2>Review score</h2>
        <BsStarFill className="star" />
        <p>
          <span>{averageRating.toFixed(1)}</span>/5 
        </p>
      {  /*<p>Total : ({totalReviews} reviews)</p>*/}
      </section>
      <ListingClicks />
      <HostListings />
    </div>
  );
};

export default Dashboard;
