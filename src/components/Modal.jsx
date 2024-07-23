import React from 'react';
import './Components.css'

const Modal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="modal-close" onClick={onClose}>&times;</span>
        <img src={imageSrc} alt="Full Size" className="modal-image" />
      </div>
    </div>
  );
};

export default Modal;