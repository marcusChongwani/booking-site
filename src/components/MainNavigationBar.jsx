import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Components.css';
import { IoPerson } from "react-icons/io5";
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../Firebase/Firebase';
import ThemeToggleButton from './Toggle';

export default function MainNavigationBar() {
  const [userType, setUserType] = useState(null);
  const [user, setUser] = useState(null); // State to store current user
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle menu
  const auth = getAuth();
  const location = useLocation(); // Hook to access the current route

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth); // Set the current user in state
        await fetchUserType(userAuth); // Fetch user type if user is authenticated
      } else {
        setUser(null); // Clear user state if not authenticated
        setUserType(null); // Clear user type state if not authenticated
      }
    });

    return () => unsubscribe(); // Clean up by unsubscribing from the auth state listener
  }, [auth]);

  useEffect(() => {
    // Close menu on route change
    if (menuOpen) {
      setMenuOpen(false);
    }
  }, [location]);

  const fetchUserType = async (userAuth) => {
    const userDocRef = doc(db, 'Users', userAuth.uid); // Ensure 'Users' matches your Firestore collection
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      setUserType(userDoc.data().role); // Ensure 'userType' is the correct field in your Firestore document
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const activeStyles = {
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#ff5a5f"
  };

  const active = {
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#ec2930"
  };

  return (
    <nav className='nav'>
      <div className='logo'>
        <NavLink to='/'><span style={{color:"#FF5A5F"}}>Instay.</span></NavLink>
      </div>
   
      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <div className={`other-links ${menuOpen ? 'show' : ''}`}>
        {userType === 'admin' && (
          <NavLink 
            to='/admin'
            style={({ isActive }) => isActive ? active : null}
          >
            Admin
          </NavLink>
        )}
        {userType === 'host' && (
          <NavLink 
            to='/host'
            style={({ isActive }) => isActive ? activeStyles : null}
          >
            Host
          </NavLink>
        )}
        <NavLink 
          to='/about'
          style={({ isActive }) => isActive ? activeStyles : null}
        >
          About
        </NavLink>
        <NavLink 
          to={user ? '/listings' : '/public-listings'}
          style={({ isActive }) => isActive ? activeStyles : null}
        >
          Listings
        </NavLink>
        {user && ( // Show profile icon only if user is authenticated
          <Link to='/profile' className='profile-icon'><IoPerson /></Link>
        )}
      </div>
      {menuOpen && <div className="modal-overlay" onClick={toggleMenu}></div>}
    </nav>
  );
}
