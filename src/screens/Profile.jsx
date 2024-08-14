import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import defaultProfilePic from '../assets/profileImage.jpg';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Firebase/UserContext';
import { db, storage } from '../Firebase/Firebase'; // Import Firebase storage and Firestore
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { MdDeleteOutline, MdAdd } from "react-icons/md";


const Profile = () => {
  const { user, signOut } = useContext(UserContext);
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'Users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setProfilePic(userData.profilePic || defaultProfilePic);
        }
      });

      return () => unsubscribe(); // Cleanup subscription on unmount
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');  // Redirect to home page
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error('Failed to sign out.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const userDocRef = doc(db, 'Users', user.uid);
        await updateDoc(userDocRef, { profilePic: downloadURL });
        setProfilePic(downloadURL);
        toast.success('Profile picture updated successfully');
      } catch (error) {
        console.error('Error uploading profile picture: ', error);
        toast.error('Failed to upload profile picture.');
      }
    }
  };

  const handleDeleteProfilePic = async () => {
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    try {
      // Delete the image from Firebase Storage
      await deleteObject(storageRef);

      // Remove the profile picture URL from Firestore
      const userDocRef = doc(db, 'Users', user.uid);
      await updateDoc(userDocRef, { profilePic: null });
      setProfilePic(defaultProfilePic); // Reset to default picture
      toast.success('Profile picture deleted successfully');
    } catch (error) {
      console.error('Error deleting profile picture: ', error);
      toast.error('Failed to delete profile picture.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={profilePic} alt="Profile" className="profile-picture" />
        <h2 className="profile-email">{user ? user.email : 'User Email'}</h2>
      </div>
      <div className="profile-actions">
        <label htmlFor="file-upload" className="custom-file-upload">
          <MdAdd className="add-icon" />
        </label>
        <input id="file-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
        <button className="upload-button" onClick={handleUpload}>
          Upload
        </button>
        <button className="profile-delete-button" onClick={handleDeleteProfilePic}>
          <MdDeleteOutline />
        </button>
      </div>
      <button className="sign-out-button1" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default Profile;
