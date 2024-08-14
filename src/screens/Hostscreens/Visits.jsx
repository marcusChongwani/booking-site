import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'; // Adjust the import path as needed
import ListingClicks from './ListingClicks';

const Visits = () => {
  const [listingClicks, setListingClicks] = useState([]);

  useEffect(() => {
    const fetchClickData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Listings'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          clicks: doc.data().clicks || 0,
          lastClickedAt: doc.data().lastClickedAt?.toDate().toLocaleString() || 'No Clicks',
        }));
        setListingClicks(data);
      } catch (error) {
        console.error('Error fetching click data:', error);
      }
    };

    fetchClickData();
  }, []);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Listing Visits Statistics</h3>
     
        <ListingClicks />
 
      <div style={styles.clickDetails}>
        <h4 style={styles.subtitle}>Click Details Per Listing</h4>
        <div style={styles.listingDetails}>
          {listingClicks.map((listing) => (
            <div key={listing.id} style={styles.listingCard}>
              <h5 style={styles.listingName}>{listing.name}</h5>
              <p style={styles.listingClicks}><strong>Clicks:</strong> {listing.clicks}</p>
              <p style={styles.lastClickedAt}><strong>Last Clicked At:</strong> {listing.lastClickedAt}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.footer}>
        This chart shows the weekly distribution of visits to your listings. To boost your listing visits, consider the following tips:
        <ul style={styles.footer2}>
          <li>Enhance your listing description with compelling details and high-quality images.</li>
          <li>Promote your listings on social media platforms and relevant online communities.</li>
          <li>Offer special promotions or discounts to attract more visitors.</li>
          <li>Regularly update your listing information to keep it fresh and relevant.</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  chartContainer: {
    border: "1px solid #d4d4d4",
    borderRadius: '5px',
    marginBottom:'10px'
  },
  clickDetails: {
    margin: '20px 0',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#333',
  },
  listingDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // Two cards per row
    gap: '20px',
  },
  listingCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
  },
  listingName: {
    fontSize: '16px',
    marginBottom: '5px',
    color: '#000',
  },
  listingClicks: {
    fontSize: '14px',
    color: '#555',
  },
  lastClickedAt: {
    fontSize: '14px',
    color: '#555',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'left',
    color: '#666',
  },
  footer2: {
    marginTop: '10px',
    marginLeft: '20px',
  },
};

export default Visits;
