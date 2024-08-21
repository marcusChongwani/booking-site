import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/Firebase';  // Adjust the path as needed
import FeaturedCard from '../components/FeaturedCard';
import HowItWorks from '../components/howItWorks';
import FeedbackForm from '../components/FeedBackForm';
import FeedbackModal from '../components/FeedBackModal';
import people from "../assets/girl-smile.jpeg";
import { FaStar } from 'react-icons/fa'; 


export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        // Set a timer to open the modal after 5 minutes (300000 ms)
        const timer = setTimeout(() => {
            setIsModalOpen(true);
        }, 40000);

        return () => {
            unsubscribe();
            clearTimeout(timer); // Clear the timer when the component is unmounted
        };
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="hero">
                <div className='hero-text'>
                    <h1>Find the Perfect <br /> place to stay as a student</h1>
                    <p> Enjoy a seamless experience with our easy-to-use platform, whether you're a student or anyone looking for a new place to call home.</p>
                    <Link to={isAuthenticated ? "/listings" : "/public-listings"} className="hero-button">
                        Discover Listings
                    </Link>
                </div>
                <div className='hero-image'>
                    <img src={people} alt="Happy person" />
                </div>
            </div>

            <div className='popular-section'>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                <p className="section-subtitle">Explore the Best Boarding Houses</p>
               <h2 className="styled-text">Featured Listings</h2>
                </div>
          
                <FeaturedCard />
            </div>
            
            

            <div className="problem-statement-section">
                <div className="text-container">
                    <h2>The Challenges</h2>
                    <p>Searching for the right accommodation can be both overwhelming and frustrating.<br /><br />
                        Users frequently encounter problems such as insufficient information, absence of virtual tours, and unreliable payment options.</p>

                    <h2>Our Innovative Solution</h2>
                    <p>We transform the search experience with cutting-edge features like advanced filters, immersive virtual tours, and secure online payment methods.<br /><br />
                        This ensures a smooth and stress-free process for discovering the perfect place to stay, whether you're a student or a professional.</p>
                </div>
            </div>

            <section className='section'>
                <HowItWorks />
            </section>

           
            {/* Feedback Form at the End of the Page */}
            <section className='feedback-section'>
                <h2>We Value Your Feedback!</h2>
                <p>Tell us what you love, and what we can improve. Your input helps us grow!</p>
                <FeedbackForm />
            </section>

            {/* Feedback Modal */}
            <FeedbackModal isOpen={isModalOpen} onClose={closeModal}>
                <FeedbackForm />
            </FeedbackModal>
        </div>
    );
}
