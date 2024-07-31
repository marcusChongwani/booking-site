import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'; // Ensure this path is correct
import AllCards from '../../components/AllCards';
import CustomSkeleton from '../../components/Skeleton';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState(null);
  

  const fetchListings = async (priceFilter = null) => {
    setLoading(true);
    try {
      let baseQuery = query(collection(db, 'Listings'), where('approved', '==', true));

      if (priceFilter) {
        switch (priceFilter) {
          case 'lessK1000':
            baseQuery = query(baseQuery, where('price', '<=', 1000));
            break;
          case 'lessK2000':
            baseQuery = query(baseQuery, where('price', '<=', 2000));
            break;
          case 'lessK3000':
            baseQuery = query(baseQuery, where('price', '<=', 3000));
            break;
          default:
            break;
        }
      }


      const querySnapshot = await getDocs(baseQuery);
      const fetchedListings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setListings(fetchedListings);

    } catch (error) {
      console.error('Error fetching listings: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleFilterByPrice = (filter) => {
    setPriceFilter(filter);
    setListings([]);
    fetchListings(filter);
  };

  return (
    <div className='listings-container'>
      <h2>Explore our listings.</h2>
      <div className='fills'>
        <p>Filter by </p>
        <div className="filters-container">
          <button className='category' onClick={() => handleFilterByPrice('lessK1000')}>Less K1000</button>
          <button className='category' onClick={() => handleFilterByPrice('lessK2000')}>Less K2000</button>
          <button className='category' onClick={() => handleFilterByPrice('lessK3000')}>Less K3000</button>
          <button className='category' onClick={() => handleFilterByPrice(null)}>All...</button>
        </div>
      </div>
      {loading && <CustomSkeleton layout='allCards' />}
      <AllCards listings={listings} />
    </div>
  );
}
