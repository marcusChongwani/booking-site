import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { auth, db } from '../Firebase/Firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bus from '../assets/bus.png';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const navigate = useNavigate();

  useEffect(() => {
    // Show a toast notification when the page loads
    toast.info('Sign up to view all listings and details.');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setPasswordValid(value.length >= 8);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const signUp = async () => {
    const { name, phone, email, password, role } = formData;

    if (!name || !phone || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (!isChecked) {
      toast.error('You must agree to the terms and conditions.');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        name,
        phone,
        email,
        role,
        acceptedTerms: isChecked // Save checkbox status to the database
      });
      toast.success("Account created successfully!");
      navigate('/login');
    } catch (error) {
      console.error("Error creating account: ", error);
      toast.error("Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Create an account</h2>
      <div className="contain">
        <img src={bus} width="400" alt="bus" />
        <div className="signup-form">
          <input
            type="text"
            required
            placeholder="Enter name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <input
            type="number"
            required
            placeholder="Phone number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <input
            type="email"
            required
            placeholder="Email address"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {!passwordValid && (
            <p className="password-requirements">Password must be at least 8 characters long.</p>
          )}
          <div className="radio-contain">
            <div className='radio'>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === 'user'}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <span className='inn'>User</span>
              </label>
            </div>
            <div className='radio'> 
              <label>
                <input
                  type="radio"
                  name="role"
                  value="host"
                  checked={formData.role === 'host'}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <span className='inn'>Host</span>
              </label>
            </div>
          </div>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="termsAndConditions"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="terms-checkbox"
            />
            <label htmlFor="termsAndConditions" className="terms-label">
              I have read, understood, and agree to the Terms and Conditions </label>
          </div>
          <Link to="/terms-and-conditions" className="defff" >Terms & conditions</Link>

          <button className="signup-button" onClick={signUp} disabled={isLoading || !isChecked}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <div className="login-link-container">
            <p>Already have an account?</p>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
