import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function HostlistingPhotos() {
  const hostlisting = useOutletContext();

  return (
    <div>
      {hostlisting.images.map((image, index) => (
        <img key={index} src={image} alt={`Listing ${index}`} className='HostlistingPhotos' />
      ))}
    </div>
  );
}
