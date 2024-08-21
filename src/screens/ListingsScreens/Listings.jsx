import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'; // Ensure this path is correct
import AllCards from '../../components/AllCards';
import CustomSkeleton from '../../components/Skeleton';
import { HiArrowsUpDown } from "react-icons/hi2";
import { GoFilter } from "react-icons/go";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const [filterType, setFilterType] = useState('');
  const [activeTab, setActiveTab] = useState('sort');

  const schools = [
    { name: 'Cavendish Main', abbreviation: 'Cavendish Main' },
    { name: 'Cavendish LongAcres', abbreviation: 'Cavendish LA' },
    { name: 'UNZA', abbreviation: 'UNZA' },
    { name: 'ZCAS', abbreviation: 'ZCAS' },
    { name: 'UNILUS', abbreviation: 'UNILUS' },
  ];

  const fetchListings = async (school) => {
    setLoading(true);
    try {
      let q = query(collection(db, 'Listings'), where('approved', '==', true));

      if (school) {
        q = query(collection(db, 'Listings'), where('approved', '==', true), where('school', '==', school));
      }

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

  useEffect(() => {
    fetchListings(selectedSchool);
  }, [selectedSchool]);

  const handleSchoolClick = (school) => {
    if (selectedSchool === school) {
      setSelectedSchool(''); // Reset the selection to show all schools
    } else {
      setSelectedSchool(school);
    }
  };

  const applyChanges = () => {
    if (sortOrder) {
      const sortedListings = [...listings].sort((a, b) => {
        return sortOrder === 'ascending' ? a.price - b.price : b.price - a.price;
      });
      setListings(sortedListings);
    }

    if (filterType) {
      if (filterType === 'available') {
        setListings(listings.filter(listing => listing.available === true));
      } else {
        fetchListings(selectedSchool);
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div className='listings-container'>
      <h2>Explore Our Listings</h2>
      
      <div className='school-selection'>
          {schools.map((school, index) => (
            <button
              key={index}
              onClick={() => handleSchoolClick(school.abbreviation)}
              className={`school-button ${selectedSchool === school.abbreviation ? 'active' : ''}`}
            >
              {school.name}
            </button>
          ))}
      </div>

      <div className='action-buttons'>
        <button className='action-button' onClick={() => { setIsModalOpen(true); setActiveTab('sort'); }}>
        <HiArrowsUpDown /> Sort
        </button>
        <button className='action-button' onClick={() => { setIsModalOpen(true); setActiveTab('filter'); }}>
        <GoFilter />Filter
        </button>
        
      </div>

      {loading ? (
        <CustomSkeleton layout='allCards' />
      ) : (
        <AllCards listings={listings} />
      )}

{isModalOpen && (
  <div className='modal fade-in'>
    <div className='modal-content'>
      <button className='close-button' onClick={() => setIsModalOpen(false)}>✕</button>
      <h3>{activeTab === 'sort' ? 'Sort by Price' : activeTab === 'filter' ? 'Filter Listings' : 'Useful Feature'}</h3>

      {activeTab === 'sort' && (
        <div >
          <label className='lradio'>
            <input
              type='radio'
              name='sort'
              onClick={() => setSortOrder('ascending')}
            />
            Ascending
          </label>
          <label className='lradio'>
            <input
              type='radio'
              name='sort'
              onClick={() => setSortOrder('descending')}
            />
            Descending
          </label>
        </div>
      )}

      {activeTab === 'filter' && (
        <div >
          <label className='lradio'>
            <input
              type='radio'
              name='filter'
              onClick={() => setFilterType('available')}
            />
            Available
          </label>
          <label className='lradio'>
            <input
              type='radio'
              name='filter'
              onClick={() => setFilterType('all')}
            />
            All
          </label>
        </div>
      )}

      {activeTab === 'feature' && (
        <div>
          <p>Here you can implement a useful feature related to posts, like saving favorites or sharing listings.</p>
        </div>
      )}

      <button className='apply-button' onClick={applyChanges}>Apply</button>
    </div>
  </div>
)}

    </div>
  );
}
