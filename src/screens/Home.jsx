import React from 'react'
import { Link } from 'react-router-dom'
import FeaturedCard from '../components/FeaturedCard'
import HowItWorks from '../components/howItWorks'
import InfinitScroll from '../components/InfinitScroll'
import FeedbackForm from '../components/FeedBackForm'
import GetToKnowUs from '../components/GetToKnowUs'
import svg from '../assets/svv.svg'
import svg2 from '../assets/svg2.svg'
import people from "../assets/people.jpeg"
import Chat from './chat/chat'


export default function Home() {
  return (
    <div>
        <div className="hero">
            <div className='hero-text'>
                <h1>Find the perfect <br/> place to stay as a student</h1>
                <p>Explore top-notch student accommodations with ease.Take virtual tours, and make secure online payments.</p>
                <Link to="/listings" >Discover Listings</Link>
            </div>
            <div className='hero-image'>
                <img src={people}/>
            </div>
        </div>
       
        <div className='popular-section'>
            <p className='styled-text'>Popular picks </p>
             <FeaturedCard/>
        </div>
        <div className="problem-statement-section">
          <div className="text-container">
              <h3>Headaches</h3>
              <p>Finding the perfect student accommodation can be challenging, time-consuming, and stressful.<br/><br/>Students often face issues with inadequate information,<br/>lack of virtual tours, and secure payment options.</p>
              <h3>Our Solution</h3>
              <p>We simplify the process with advanced search filters, virtual tours, and secure online payments,<br/> ensuring a seamless experience for students in finding their ideal living space.</p>
          </div>
          <div className="video-container">
            <video controls>
                <source src="your-video-url.mp4" type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
           </div>
        </div>

        <section className='section'>
            <HowItWorks/>
        </section>
        <div style={{marginBottom:20}}>
          <section className='section'>
            <GetToKnowUs/>
          </section>
        </div>
        <FeedbackForm/>
    </div>
  )
}
