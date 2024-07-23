import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/Firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './Admin.css';
import { RotatingLines } from 'react-loader-spinner';

export default function AdminCommands() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const listingsCollection = collection(db, 'Listings');
      const q = query(listingsCollection);
      const listingsSnapshot = await getDocs(q);
      const listingsData = listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(listingsData);
    } catch (error) {
      console.error('Error fetching listings: ', error);
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleListingClick = async (id) => {
    try {
      const listingRef = doc(db, 'Listings', id);
      await updateDoc(listingRef, {
        clicks: increment(1),
        lastClickedAt: serverTimestamp(),
      });
      fetchListings(); // Re-fetch to update clicks count order
    } catch (error) {
      console.error('Error updating clicks: ', error);
      toast.error('Error updating clicks');
    }
  };

  const toggleApproveListing = async (listingId, currentStatus) => {
    try {
      const listingRef = doc(db, 'Listings', listingId);
      await updateDoc(listingRef, { approved: !currentStatus });
      setListings(listings.map(listing => listing.id === listingId ? { ...listing, approved: !currentStatus } : listing));
      toast.success(`Listing ${!currentStatus ? 'approved' : 'unapproved'} successfully`);
    } catch (error) {
      console.error('Error toggling approval: ', error);
      toast.error('Error toggling approval');
    }
  };

  const toggleFeatureListing = async (listingId, currentStatus) => {
    try {
      const listingRef = doc(db, 'Listings', listingId);
      await updateDoc(listingRef, { featured: !currentStatus });
      setListings(listings.map(listing => listing.id === listingId ? { ...listing, featured: !currentStatus } : listing));
      toast.success(`Listing ${!currentStatus ? 'featured' : 'unfeatured'} successfully`);
    } catch (error) {
      console.error('Error toggling feature: ', error);
      toast.error('Error toggling feature');
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await deleteDoc(doc(db, 'Listings', listingId));
      setListings(listings.filter(listing => listing.id !== listingId));
      toast.success('Listing deleted successfully');
    } catch (error) {
      console.error('Error deleting listing: ', error);
      toast.error('Error deleting listing');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
        <RotatingLines
          visible={true}
          height="30"
          width="30"
          strokeWidth="5"
          strokeColor="#161616"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
  }

  return (
    <div className="admin-commands-container">
      <div className="listings-container">
        {listings.map(listing => (
          <div key={listing.id} className="admin-listing-card" >
            <div className='admin-listing-header'>
              <img src={listing.images[0]} alt={listing.name} className="admin-listing-image" />
              <div>
                <h3 className="admin-listing-title">{listing.name}</h3>
                <p className="admin-listing-status"><strong>Approved:</strong> {listing.approved ? 'Yes' : 'No'}</p>
                <p className="admin-listing-status"><strong>Featured:</strong> {listing.featured ? 'Yes' : 'No'}</p>
                <p className="admin-listing-status"><strong>Clicks:</strong> {listing.clicks}</p>
              </div>
            </div>
            <div className="admin-button-group">
              <button className="admin-approve-button" onClick={(e) => { e.stopPropagation(); toggleApproveListing(listing.id, listing.approved); }}>
                {listing.approved ? 'Unapprove' : 'Approve'}
              </button>
              <button className="admin-feature-button" onClick={(e) => { e.stopPropagation(); toggleFeatureListing(listing.id, listing.featured); }}>
                {listing.featured ? 'Unfeature' : 'Feature'}
              </button>
              <button className="admin-delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteListing(listing.id); }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
