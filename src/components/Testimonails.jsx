import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';
import './Components.css'; // Make sure this file contains the necessary styles

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Feedback'));
                const fetchedTestimonials = querySnapshot.docs.map(doc => doc.data());
                setTestimonials(fetchedTestimonials);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            }
        };

        fetchTestimonials();
    }, []);

    useEffect(() => {
        const container = document.querySelector('.testimonials-container');
        if (!container || testimonials.length === 0) return;

        const scrollInterval = 3000; // Time in ms between scrolls
        const scrollAmount = container.scrollWidth / testimonials.length;

        const scroll = () => {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        };

        const interval = setInterval(scroll, scrollInterval);

        return () => clearInterval(interval);
    }, [testimonials]);

    return (
        <div className="testimonials-section">
            <h2>What Our Users Say</h2>
            <div className="testimonials-container">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="testimonial-card">
                        <p className="testimonial-feedback">"{testimonial.feedback}"</p>
                        <p className="testimonial-name">- {testimonial.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
