import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/Firebase'; // Ensure this path is correct
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import Star from './Star';
import { MdOutlineDelete } from "react-icons/md";

const ReviewsList = ({ listingId, currentUserId }) => {
  const [reviews, setReviews] = useState([]);
 
  useEffect(() => {
    if (!listingId) {
      console.error('No listingId provided');
      return;
    }

    const q = query(
      collection(db, 'Reviews'),
      where('listingId', '==', listingId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error('Error fetching reviews: ', error);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [listingId]);

  const handleDelete = async (reviewId) => {
    try {
      await deleteDoc(doc(db, 'Reviews', reviewId));
      console.log('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review: ', error);
    }
  };

  return (
    <div className="unique-reviews-list">
      <h2 className="unique-reviews-header">Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id} className="unique-review-card">
          <div className='unique-review-head'>
            <Star rating={review.rating} readOnly />
            {review.userId === currentUserId && (
              <button className="unique-review-delete-button" onClick={() => handleDelete(review.id)}>
                <MdOutlineDelete className='del'/>
              </button>
            )}
          </div>
          <p className="unique-review-comment">Comment: {review.comment}</p>
          <p className="unique-review-timestamp">
            On: {review.timestamp ? new Date(review.timestamp.seconds * 1000).toString() : 'No timestamp available'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
