import React, { useState } from 'react';
import { db } from '../Firebase/Firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import '../screens/Adminscreens/Admin.css'; // Ensure styles are included

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.info('Submitting your feedback...', { autoClose: false });
    try {
      await addDoc(collection(db, 'Feedback'), { name, number, feedback, createdAt: new Date() });
      setName('');
      setNumber('');
      setFeedback('');
      toast.dismiss();
      toast.success('Feedback submitted successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Error submitting feedback. Please try again.');
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h2 className="feedback-form-title">Leave Us A </h2>
      <input 
        type="text" 
        placeholder="Your Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        className="feedback-input" 
        required 
      />
      <input 
        type="text" 
        placeholder="Your Phone Number" 
        value={number} 
        onChange={(e) => setNumber(e.target.value)} 
        className="feedback-input" 
        required 
      />
      <textarea 
        placeholder="Your Feedback" 
        value={feedback} 
        onChange={(e) => setFeedback(e.target.value)} 
        className="feedback-textarea" 
        required 
      />
      <button type="submit" className="feedback-submit-button" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default FeedbackForm;
