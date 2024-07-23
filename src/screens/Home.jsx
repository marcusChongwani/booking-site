import React from 'react'
import { Link } from 'react-router-dom'
import FeaturedCard from '../components/FeaturedCard'
import HowItWorks from '../components/howItWorks'
import InfinitScroll from '../components/InfinitScroll'
import FeedbackForm from '../components/FeedBackForm'
import GetToKnowUs from '../components/GetToKnowUs'
import svg from '../assets/svv.svg'
import svg2 from '../assets/svg2.svg'


export default function Home() {
  return (
    <div>
        <div className="hero">
            <h1>Find the perfect stay with ease.</h1>
            
            <Link to="/listings" >Discover Listings</Link>
            
        </div>
        <div className='popular-section'>
            <p>Popular choices near <span className='styled-text'>cavendish university</span></p>
             <FeaturedCard/>
        </div>
        <h3 style={{marginLeft:20,marginBottom:10,marginTop:20}}>Trusted by</h3>
        <InfinitScroll/>
        <section className='section'>
            <HowItWorks/>
        </section>
        <div style={{marginBottom:20}}>
         <img src={svg2} className='svg-image'/>
          <section className='section'>
            <h2 style={{marginLeft:20,marginBottom:10,}}>Get To Know Us</h2>
            <GetToKnowUs/>
          </section>
        </div>
        <FeedbackForm/>
    </div>
  )
}
