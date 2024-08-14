import React from 'react';
import { FaStar } from "react-icons/fa";

const Star = ({ rating, onRatingChange }) => {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div>
      {stars.map(star => (
        <span
          key={star}
          style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'gray' }}
          onClick={() => onRatingChange(star)}
          className='star'
        >
          <FaStar />
        </span>
      ))}
    </div>
  );
};

export default Star;
