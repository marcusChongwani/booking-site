import React from 'react';
import './Components.css'; // Add appropriate styles for the modal

const FeedbackModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}>x</button>
                {children}
            </div>
        </div>
    );
};

export default FeedbackModal;
