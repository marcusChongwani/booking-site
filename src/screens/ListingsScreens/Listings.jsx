import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'; // Import your Firebase config
import AllCards from '../../components/AllCards';
import CustomSkeleton from '../../components/Skeleton';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(collection(db, 'Listings'), where('approved', '==', true));
        const querySnapshot = await getDocs(q);
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

    fetchListings();
  }, []);

  const filterByPrice = async (priceFilter) => {
    setLoading(true);
    try {
      let q;
      const baseQuery = query(collection(db, 'Listings'), where('approved', '==', true));

      if (priceFilter) {
        switch (priceFilter) {
          case 'lessK1000':
            q = query(baseQuery, where('price', '<=', 1000));
            break;
          case 'lessK2000':
            q = query(baseQuery, where('price', '<=', 2000));
            break;
          case 'lessK3000':
            q = query(baseQuery, where('price', '<=', 3000));
            break;
          default:
            q = baseQuery;
            break;
        }
      } else {
        q = baseQuery; // When no filter is applied, fetch all approved listings
      }

      const querySnapshot = await getDocs(q);
      const fetchedListings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings(fetchedListings);
    } catch (error) {
      console.error('Error filtering listings by price: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='listings-container'>
      <h2>Explore our listings.</h2>
      <p style={{ margin: 0 }}>Filter by </p>
      <div className="button-container">
        <button className='category' onClick={() => filterByPrice('lessK1000')}>Less K1000</button>
        <button className='category' onClick={() => filterByPrice('lessK2000')}>Less K2000</button>
        <button className='category' onClick={() => filterByPrice('lessK3000')}>Less K3000</button>
        <button className='category' onClick={() => filterByPrice()}>All...</button>
      </div>
      {loading ? (
        <CustomSkeleton layout='allCards'/>
      ) : (
        <AllCards listings={listings} />
      )}
    </div>
  );
}
