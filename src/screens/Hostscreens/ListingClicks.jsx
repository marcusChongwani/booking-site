import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../Firebase/Firebase'; // Adjust import path as per your setup
import { onAuthStateChanged } from 'firebase/auth';
import CustomSkeleton from '../../components/Skeleton';

const ListingClicks = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [clickData, setClickData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    Chart.register(...registerables);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchClickData = async () => {
      try {
        const q = query(collection(db, 'Listings'), where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        return data;
      } catch (error) {
        console.error('Error fetching click data:', error);
        return [];
      }
    };

    const groupDataByWeek = (data) => {
      const weeklyData = {
        'Mon-Tue': 0,
        'Wed-Thu': 0,
        'Fri-Sat': 0,
        'Sun': 0,
      };

      data.forEach(listing => {
        if (listing.clicks && listing.lastClickedAt) {
          const timestamp = listing.lastClickedAt.toDate();
          const day = timestamp.getDay();

          if (day === 0) { // Sunday
            weeklyData['Sun'] += listing.clicks;
          } else if (day === 1 || day === 2) { // Monday or Tuesday
            weeklyData['Mon-Tue'] += listing.clicks;
          } else if (day === 3 || day === 4) { // Wednesday or Thursday
            weeklyData['Wed-Thu'] += listing.clicks;
          } else if (day === 5 || day === 6) { // Friday or Saturday
            weeklyData['Fri-Sat'] += listing.clicks;
          }
        }
      });

      return weeklyData;
    };

    const createChart = (weeklyData) => {
      const ctx = chartRef.current.getContext('2d');

      // Destroy the previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(weeklyData),
          datasets: [{
            label: 'Clicks',
            data: Object.values(weeklyData),
            backgroundColor: '#ADD8E6',
            borderRadius: 4,
            pointBackgroundColor: '#4CAF50', // Custom point color
          }]
        },
        options: {
          layout: {
            padding: {
              left: 20, // Adjust left padding
              right: 20, // Adjust right padding
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              type: 'linear' // Ensure the 'linear' scale is defined here
            }
          }
        }
      });
    };

    const setupChart = async () => {
      const data = await fetchClickData();
      const weeklyData = groupDataByWeek(data);
      createChart(weeklyData);
      setLoading(false);
    };

    setupChart();

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [currentUser]); // Include currentUser as a dependency to refetch data when it changes

  return (
    <>
      {loading ? (
        <CustomSkeleton layout='chart' />
      ) : (
        <canvas ref={chartRef}></canvas>
      )}
    </>
  );
};

export default ListingClicks;
