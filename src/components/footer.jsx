import React from 'react';
import { FaFacebook,FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './Components.css'

const Footer = () => {
  return (
    <div className="footer">
      <div className="footerContainer">
        <div className="footerSection">
          <h4>Company</h4>
          <Link to="/about" className="footerLink">About Us</Link>
          <Link to="/" className="footerLink">Terms & conditions</Link>
        </div>
        <div className="footerSection">
          <h4>Create account</h4>
          <Link to="/signup" className="footerLink">Register</Link>
          <Link to="/login" className="footerLink">Login</Link>
        </div>
        <div className="footerSection">
          <h4>Host</h4>
          <a href="#host-home" className="footerLink">Host Your Home</a>
          <a href="#host-experience" className="footerLink">Hosting process</a>
        </div>
        <div className="footerSection">
          <h4>Support</h4>
          <Link to="/contact" className="footerLink">Help center</Link>
          <a href="#safety" className="footerLink">Safety Information</a>
        </div>
      </div>
      <div className="footerBottom">
        <div className="footerSocials">
          <a href="#facebook" className="socialLink"><FaFacebook className='social-icon'/></a>
          <a href="#twitter" className="socialLink"><FaXTwitter className='social-icon' /></a>
          <a href="#instagram" className="socialLink"><FaInstagram className='social-icon' /></a>
        </div>
        <div className="footerInfo">
          <p>&copy; 2024 Instay. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;

