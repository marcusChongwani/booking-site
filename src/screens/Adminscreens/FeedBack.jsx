import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/Firebase'; // Adjust the import path as needed
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { RotatingLines } from 'react-loader-spinner';
import './Admin.css'; 

const FeedBack = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const feedbackCollection = collection(db, 'Feedback');
      const feedbackSnapshot = await getDocs(feedbackCollection);
      const feedbackData = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(feedbackData);
      setLoading(false);
    };

    fetchFeedbacks();
  }, []);

  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      toast.info('Deleting feedback...', { autoClose: false });
      try {
        await deleteDoc(doc(db, 'Feedback', feedbackId));
        setFeedbacks(feedbacks.filter(feedback => feedback.id !== feedbackId));
        toast.dismiss();
        toast.success('Feedback deleted successfully!');
      } catch (error) {
        toast.dismiss();
        toast.error('Error deleting feedback. Please try again.');
        console.error('Error deleting feedback:', error);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 30,flexDirection:"column" }}>
        <h2 className="feedback-title">User Feedback</h2>
        <RotatingLines
          visible={true}
          height="30"
          width="30"
          strokeWidth="5"
          strokeColor="#161616"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">User Feedback</h2>
      <div className="feedback-list">
        {feedbacks.length === 0 ? (
          <p>No feedback available.</p> // Message when no feedback is present
        ) : (
          feedbacks.map(feedback => (
            <div key={feedback.id} className="feedback-item">
              <p><strong>{feedback.name}:</strong> {feedback.feedback}</p>
              <p>{feedback.number}</p>
              <button className="delete-feedback-button" onClick={() => handleDeleteFeedback(feedback.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedBack;
