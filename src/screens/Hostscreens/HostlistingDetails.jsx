import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc as firebaseDeleteDoc } from 'firebase/firestore'; 
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../../Firebase/Firebase'; // Import storage from your Firebase config
import '../../components/Components.css';
import { MdOutlineDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { RotatingLines } from 'react-loader-spinner';


export default function HostlistingDetails() {
  const { id } = useParams();
  const [hostlisting, setHostlisting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHouse = async () => {
      const docRef = doc(db, 'Listings', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setHostlisting(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchHouse();
  }, [id]);

  if (!hostlisting) {
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

  const deleteImages = async (images) => {
    const deletePromises = images.map((imageUrl) => {
      const imageRef = ref(storage, imageUrl);
      return deleteObject(imageRef);
    });

    try {
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting images:', error);
      throw error;
    }
  };

  async function handleDeleteDoc() {
    toast.info('Deleting document...', { autoClose: false });
    try {
      if (hostlisting.images) {
        await deleteImages(hostlisting.images);
      }
      await firebaseDeleteDoc(doc(db, 'Listings', id));
      toast.dismiss();
      toast.success('Document and images deleted');
      navigate("/host");
    } catch (error) {
      toast.dismiss();
      toast.error('Error deleting document or images');
      console.error('Error deleting document or images:', error);
    }
  }

  const activeStyles = {
    fontWeight: 'bold',
    textDecoration: 'underline',
    color: '#161616'
  };

  return (
    <div className='host-details-container'>
      <div className='host-details-header'>
        <img src={hostlisting.images?.[0] || 'default-image-url'} alt='Listing' /> {/* Replace 'default-image-url' with your actual default image URL */}
        <div className='host-details-header-info'>
          <div className='delete-section'>
            <p className='host-category'>{hostlisting.category}</p>
            <button onClick={handleDeleteDoc} className='delete-btn'><MdOutlineDelete className='icon'/></button>
          </div>
          <h3>{hostlisting.name}</h3>
          <p>K{hostlisting.price}/mon</p>
        </div>
      </div>
      <nav className='host-details-nav'>
        <NavLink
          to='.'
          end
          style={({ isActive }) => (isActive ? activeStyles : null)}
        >
          Details
        </NavLink>
        <NavLink
          to='pricing'
          style={({ isActive }) => (isActive ? activeStyles : null)}
        >
          Pricing
        </NavLink>
        <NavLink
          to='photos'
          style={({ isActive }) => (isActive ? activeStyles : null)}
        >
          Photos
        </NavLink>
      </nav>
      <Outlet context={hostlisting} />
    </div>
  );
}
