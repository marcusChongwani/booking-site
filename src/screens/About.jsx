import React from 'react'
import { Link } from 'react-router-dom'
import people from "../assets/aboutImage2.png"
import person1 from "../assets/1.png"
import person2 from "../assets/2.png"
import person3 from "../assets/3.png"

export default function About() {
  return (
    <div >
        <div className='about'>
          <img src={people} className='about-image'/>
          <div className='info'>
            <h2>Don't struggle <br/>when you can easily<br/> find the perfect home.</h2>
            <p>Our mission is to help students find affordable, <br/>secure accommodation near their campuses, <br/>making sure they can focus on their studies without worry. </p>
          </div>
        </div>
        <div className='about-main2'>
          <div className='about-main3'>
            <div  className='about-main'>
              <div className='about-images'>
              <img src={person1} className='person1'/>
              <img src={person2} className='person1'/>
              <img src={person3} className='person1'/>
              </div>
              <h2>Your perfect home is waiting. Your room is ready.</h2>
            </div>
              <Link to='/listings' className='about-link'>Discover your next home</Link>
          </div>
          <div className='about-ps'>
            <p>Each listing is thoroughly verified to ensure a safe and <br/>comfortable living environment. 😊</p><br/>
            <p>Our team, being students ourselves, understands <br/>the importance of having a reliable place to stay,<br/> and we're here to make that happen.</p>
          </div>
        </div>
    </div>
  )
}
