import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, limit, startAfter } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'; // Import your Firebase config
import AllCards from '../../components/AllCards';
import CustomSkeleton from '../../components/Skeleton';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const batchSize = 15;

  const fetchListings = async (lastDocument = null) => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'Listings'),
        where('approved', '==', true),
        limit(batchSize)
      );
      
      if (lastDocument) {
        q = query(q, startAfter(lastDocument));
      }

      const querySnapshot = await getDocs(q);
      const fetchedListings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setListings(prevListings => {
        // Filter out duplicates by checking if the listing already exists in the state
        const newList = [...prevListings, ...fetchedListings];
        const uniqueList = newList.filter((item, index, self) => 
          index === self.findIndex((t) => t.id === item.id)
        );
        return uniqueList;
      });

      if (querySnapshot.docs.length < batchSize) {
        setIsEndOfList(true);
      } else {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error('Error fetching listings: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const loadMoreListings = () => {
    if (!isEndOfList && !loading) {
      fetchListings(lastDoc);
    }
  };

  const filterByPrice = async (priceFilter) => {
    setLoading(true);
    setListings([]);
    setLastDoc(null);
    setIsEndOfList(false);
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

      q = query(q, limit(batchSize));
      const querySnapshot = await getDocs(q);
      const fetchedListings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings(fetchedListings);

      if (querySnapshot.docs.length < batchSize) {
        setIsEndOfList(true);
      } else {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error('Error filtering listings by price: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='listings-container'>
      <h2>Explore our listings.</h2>
      <div className='fills'>
        <p>Filter by </p>
        <div className="filters-container">
          <button className='category' onClick={() => filterByPrice('lessK1000')}>Less K1000</button>
          <button className='category' onClick={() => filterByPrice('lessK2000')}>Less K2000</button>
          <button className='category' onClick={() => filterByPrice('lessK3000')}>Less K3000</button>
          <button className='category' onClick={() => filterByPrice()}>All...</button>
        </div>
      </div>
      {loading && <CustomSkeleton layout='allCards' />}
      <AllCards listings={listings} />
      {!isEndOfList && !loading && (
        <button onClick={loadMoreListings}className='load-more-btn'>Load More</button>
      )}
    </div>
  );
}
