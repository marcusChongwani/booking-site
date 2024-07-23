import React, { useState } from 'react';
import Star from './Star';
import { db } from '../Firebase/Firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


const ReviewForm = ({ listingId, currentUserId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'Reviews'), {
        userId: currentUserId,
        listingId,
        rating,
        comment,
        timestamp: serverTimestamp(),
      });

      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error adding review: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="unique-review-form">
        <div className="unique-form-group">
        <Star rating={rating} onRatingChange={setRating}/>
        </div>
      
      <div className="unique-form-group">
        <input
          placeholder='Leave a review'
          type='text'
          className="unique-form-textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="unique-form-button">Submit Review</button>
      
    </form>
  );
};

export default ReviewForm;
