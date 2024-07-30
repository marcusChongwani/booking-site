import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from '../Firebase/Firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bus from "../assets/bus.png"

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    setIsLoading(true);

    toast.promise(
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          return setDoc(doc(db, "Users", user.uid), {
            uid: user.uid,
            name,
            phone,
            email,
            role,
          });
        })
        .then(() => {
          toast.success("Account created successfully!");
          navigate('/login');
        })
        .catch((error) => {
          console.error("Error creating account: ", error);
          toast.error("Failed to create account.");
        })
        .finally(() => {
          setIsLoading(false);
        }),
      {
        pending: 'Creating your account...',
        error: 'Failed to create account!',
      }
    );
  };

  return (
    <div className="signup-container">
      <h2>Create an account</h2>
      <div className="contain">
        <img src={bus} width="400"/>
      <div className="form">
        <input
          type="text"
          className="input-field"
          required
          placeholder="Enter name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          className="input-field"
          required
          placeholder="Phone number"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
        <input
          type="email"
          className="input-field"
          required
          placeholder="Email address"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          className="input-field"
          required
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <div className="radio-container">
          <label>
            <input
              type="radio"
              name="role"
              value="user"
              checked={formData.role === 'user'}
              onChange={handleInputChange}
              required
            />
            User
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="host"
              checked={formData.role === 'host'}
              onChange={handleInputChange}
              required
            />
            Host
          </label>
        </div>
        <button className="signup-button" onClick={signUp} disabled={isLoading}>
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
