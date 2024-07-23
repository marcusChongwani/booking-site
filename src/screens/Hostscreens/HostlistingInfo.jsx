import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function HostlistingInfo() {
  const hostlisting = useOutletContext();

  return (
    <div>
      <p><span className="label1">Category:</span> {hostlisting.category}</p>
      <p><span className="label1">Name:</span> {hostlisting.name}</p>
      <p><span className="label1">Gender:</span> {hostlisting.gender}</p>
      <p><span className="label1">Description:</span> {hostlisting.information}</p>
    </div>
  );
}
