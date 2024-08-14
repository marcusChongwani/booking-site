import * as React from 'react';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/material/Typography'; // Import Typography component
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../Firebase/Firebase'; // Adjust import path as per your project structure
import './Components.css';
import CustomSkeleton from './Skeleton';
import { Link } from 'react-router-dom';

export default function FeaturedCard() {
  const [featuredListings, setFeaturedListings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFeaturedListings = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(query(collection(db, 'Listings'), where('featured', '==', true)));
        const fetchedListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeaturedListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching featured listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedListings();
  }, []);

  if (loading) {
    return <CustomSkeleton layout="featuredCards" />;
  }

  return (
    <div className="container">
      {featuredListings.length > 0 ? (
        featuredListings.map((item) => (
          <Link to={`/listings/${item.id}`} key={item.id}>
            <Card sx={{ height: '200px', width: 140, marginRight: 1 }} className="card">
              <CardCover>
                <img
                  src={item.images[0]} // Assuming images array exists in your Firestore document structure
                  loading="lazy"
                  alt={item.name}
                />
              </CardCover>
              <CardCover
                sx={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                }}
              />
              <CardContent sx={{ justifyContent: 'flex-end' }}>
                <Typography 
                  variant="h6" 
                  style={{ 
                    color: '#fff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.name}
                </Typography>
                <Typography 
                  variant="h6" 
                  style={{ 
                    color: 'GREY',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.location}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <Typography>No featured listings available.</Typography>
      )}
    </div>
  );
}
