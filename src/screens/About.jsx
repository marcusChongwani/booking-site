import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div >
        <div className='about'>
        </div>
        <div className='info'>
           <h2>Don't struggle when you can easily find the perfect home.</h2>
           <p>Our mission is to help students find affordable, secure accommodation near their campuses, making sure they can focus on their studies without worry. Each listing is thoroughly verified to ensure a safe and comfortable living environment. 😊</p>
           <p>Our team, being students ourselves, understands the importance of having a reliable place to stay, and we're here to make that happen.</p>
        </div>
        <div className='about-main'>
           <h2>Your perfect home is waiting. Your room is ready.</h2>
           <Link to='/listings'>Discover your next home</Link>
        </div>
    </div>
  )
}
