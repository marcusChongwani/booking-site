import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function HostlistingPricing() {
  const hostlisting = useOutletContext();

  const filteredDetailsBoys = hostlisting.detailsBoys.filter(room => room.trim() !== '');
  const filteredDetailsGirls = hostlisting.detailsGirls.filter(room => room.trim() !== '');

  return (
    <div>
      <p>Price: K{hostlisting.price}/mon</p>
      <div className="more-info">
        {filteredDetailsBoys.length > 0 && (
          <div className="room-list">
            <h4>Male rooms</h4>
            {filteredDetailsBoys.map((room, index) => (
              <p key={index}>{room}</p>
            ))}
          </div>
        )}
        {filteredDetailsGirls.length > 0 && (
          <div className="room-list">
            <h4>Female rooms</h4>
            {filteredDetailsGirls.map((room, index) => (
              <p key={index}>{room}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
