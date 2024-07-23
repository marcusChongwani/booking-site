import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Admin.css';
import { Link} from 'react-router-dom'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    userCount: 0,
    totalPosts: 0,
    featuredPosts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersCollection = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersCount = usersSnapshot.size;

        const listingsCollection = collection(db, 'Listings');
        const listingsSnapshot = await getDocs(listingsCollection);
        const totalPosts = listingsSnapshot.size;
        const featuredCount = listingsSnapshot.docs.filter(doc => doc.data().featured).length;

        setStats({
          userCount: usersCount,
          totalPosts: totalPosts,
          featuredPosts: featuredCount,
        });
      } catch (error) {
        console.error('Error fetching statistics: ', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard">
        <div className="info">
          <h1>Welcome!</h1>
          <p>Total number of users : </p>
          <h2>{stats.userCount} Users</h2>
          <p>Total Posts</p>
          <h2>{stats.totalPosts} posts available</h2>
           <p>Featured Posts</p>
          <h2>{stats.featuredPosts} featured posts</h2>
        </div>
      </div>
    </div>
   
    
  );
}
