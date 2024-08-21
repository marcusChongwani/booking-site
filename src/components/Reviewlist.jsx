import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/Firebase';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';
import Star from './Star';
import { MdOutlineDelete } from "react-icons/md";

const ReviewsList = ({ listingId, currentUserId }) => {
  const [reviews, setReviews] = useState([]);
  const [userEmails, setUserEmails] = useState({});

  useEffect(() => {
    if (!listingId) {
      console.error('No listingId provided');
      return;
    }

    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, 'Reviews'),
          where('listingId', '==', listingId),
          orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
          console.log('Snapshot size:', snapshot.size); // Log the size of the snapshot
          
          const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Fetch user emails
          const userIds = [...new Set(reviewsData.map(review => review.userId))];
          const emailPromises = userIds.map(async (userId) => {
            const userDoc = await getDoc(doc(db, 'Users', userId)); // Assuming you have a 'Users' collection
            return { id: userId, email: userDoc.data()?.email || 'Unknown' };
          });

          const userEmailsArray = await Promise.all(emailPromises);
          const userEmailsMap = userEmailsArray.reduce((acc, user) => {
            acc[user.id] = user.email;
            return acc;
          }, {});

          setUserEmails(userEmailsMap);
          setReviews(reviewsData);
        }, (error) => {
          console.error('Error fetching reviews: ', error);
        });

        return () => {
          console.log('Unsubscribing from reviews snapshot');
          unsubscribe(); // Cleanup subscription on unmount
        };
      } catch (error) {
        console.error('Error fetching reviews or emails: ', error);
      }
    };

    fetchReviews();
  }, [listingId]);

  const handleDelete = async (reviewId) => {
    try {
      await deleteDoc(doc(db, 'Reviews', reviewId));
      console.log('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review: ', error);
    }
  };

  const formatEmail = (email) => {
    if (!email) return 'Unknown';
    const firstSix = email.slice(0, 6);
    return `${firstSix}...`;
  };

  return (
    <div className="unique-reviews-list">
      <h2 className="unique-reviews-header">Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="unique-review-card">
            <div className='unique-review-head'>
              <div className="unique-review-user-info">
                <p className="unique-review-username">
                  {formatEmail(userEmails[review.userId])} {/* Display formatted email */}
                </p>
                <p className="unique-review-timestamp">
                  {review.timestamp ? new Date(review.timestamp.seconds * 1000).toLocaleDateString() : 'No date available'}
                </p>
              </div>
              <div className="unique-review-rating">
                <Star rating={review.rating} readOnly />
                {review.userId === currentUserId && (
                  <button className="unique-review-delete-button" onClick={() => handleDelete(review.id)}>
                    <MdOutlineDelete className='del' />
                  </button>
                )}
              </div>
            </div>
            <p className="unique-review-comment">"{review.comment}"</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewsList;
