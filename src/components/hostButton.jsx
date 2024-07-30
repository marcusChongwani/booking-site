// src/components/ContactHostButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContactHostButton = ({ hostId }) => {
  const navigate = useNavigate();

  const handleContactHost = () => {
    navigate(`/chat/${hostId}`);
  };

  return <button onClick={handleContactHost}>Contact Host</button>;
};

export default ContactHostButton;
