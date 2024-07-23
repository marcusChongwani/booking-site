import React from 'react'
import image1 from '../assets/cuz.png'
import image2 from '../assets/cuzz.png'
import image3 from '../assets/unza.png'
import'./Components.css'

export default function InfinitScroll() {
  return (
    <div className='patners'>
    <h3>Trusted by</h3>
    <div className="logos">
            <img src={image1} alt="Cavendish University Logo" />
            <img src={image2} alt="UNZA Logo" />
      </div>
    </div>
     
  )
}
