import React from 'react';
import './Components.css'; // Add appropriate styles for the modal
import { IoIosCloseCircleOutline } from "react-icons/io";

const FeedbackModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}><IoIosCloseCircleOutline /></button>
                {children}
            </div>
        </div>
    );
};

export default FeedbackModal;
