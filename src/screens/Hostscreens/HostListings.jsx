import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../Firebase/Firebase';
import ListingCard from './HostListingsCard';
import { toast } from 'react-toastify';
import CustomSkeleton from '../../components/Skeleton';

export default function HostListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    const fetchUserUid = () => {
      const user = auth.currentUser;
      if (user) {
        setUserUid(user.uid);
      } else {
        toast.error('User not logged in.');
        setLoading(false);
      }
    };

    fetchUserUid();
  }, []);

  useEffect(() => {
    if (!userUid) return;

    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'Listings');
        const q = query(listingsRef, where('uid', '==', userUid)); 
        const querySnapshot = await getDocs(q);
        
        const listingsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setListings(listingsData);
        
      } catch (error) {
        console.error('Error fetching listings: ', error);
        toast.error('Failed to fetch listings.');
      } finally {
        setLoading(false); 
      }
    };

    fetchListings();
  }, [userUid]);

  if (loading) {
    return (
      <div className='hosts-listings'>
        <h3>Your Listings</h3>
        <CustomSkeleton layout='hostCards' />
      </div>
    );
  }

  return (
    <div className='hosts-listings'>
      <h3 className='title2'>Your Listings</h3>
      {listings.length > 0 ? (
        <div className="listings-grid">
          {listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
     
      ) : (
        <p>You have no listings.</p>
      )}
    </div>
  );
}
