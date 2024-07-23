import React from 'react';
import ListingClicks from './ListingClicks';

const Visits = () => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Listing Visits Statistics</h3>
      <div style={styles.chartContainer}>
        <ListingClicks />
      </div>
      <div style={styles.footer}>
        This chart shows the weekly distribution of visits to your listings. To boost your listing visits, consider the following tips:
        <ul  style={styles.footer2}>
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
    border:"1px solid #d4d4d4",
    borderRadius:10,
    padding: '10px',

  },
  footer: {
    margin: '20px',

    textAlign: 'left',
    color: '#666',
  },
  footer2: {
    marginTop:"10px",
    marginLeft:'20px'
  },
};

export default Visits;
