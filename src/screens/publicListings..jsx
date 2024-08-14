import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';
import AllCards from '../components/AllCards';
import CustomSkeleton from '../components/Skeleton';
import { Link } from 'react-router-dom';


export default function PublicListings() {
  const [listings2, setListings2] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Create a query to fetch only the first 3 documents
      const q = query(
        collection(db, 'Listings'),
        limit(3) // Limit the number of documents fetched
      );

      const querySnapshot = await getDocs(q);
      const fetchedListings = [];
      querySnapshot.forEach(doc => {
        fetchedListings.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Set the fetched listings to state
      setListings2(fetchedListings);
    } catch (error) {
      console.error('Error fetching public listings: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className='listings-container'>
      <h2>Explore our listings.</h2>
      {loading ? (
        <CustomSkeleton layout='allCards' />
      ) : (
        <AllCards listings={listings2} />
      )}
      <Link to='/listings' className='link-button link-button-hover'>
      SEE ALL
    </Link>
    </div>
  );
}
