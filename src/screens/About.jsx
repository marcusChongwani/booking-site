import React from 'react';
import { Link } from 'react-router-dom';
import people from "../assets/aboutImage.png";
import person1 from "../assets/girls2.jpeg";
import person2 from "../assets/2.png";
import person3 from "../assets/3.png";

export default function About() {
  return (
    <div>
      <div className='about'>
        <img src={people} className='about-image' alt="Accommodation life" />
        <div className='info'>
          <h2>Find Your Ideal Home Effortlessly</h2>
          <p>We’re dedicated to helping everyone find affordable and secure accommodations. Whether you're a student, a professional, or anyone in need of a new place to call home, we’ve got you covered. Focus on your goals while we handle the rest.</p>
        </div>
      </div>

      <div className='about-main2'>
        <div className='about-main3'>
          <div className='about-main'>
            <div className='about-images'>
              <img src={person1} className='person1' alt="Happy resident" />
            </div>
            <h2>Your Ideal Space Awaits</h2>
          </div>
          <Link to='/listings' className='about-link'>
            Find Your Next Home
          </Link>
        </div>
        <div className='about-ps'>
          <p>Every listing is carefully vetted to ensure a safe and comfortable living environment. 😊</p>
          <p>We understand the need for a reliable and welcoming place to stay. Whether you're a student or a professional, we're here to make that happen.</p>
        </div>
      </div>
    </div>
  );
}
