import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../Firebase/Firebase';
import { doc, getDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { UserContext } from '../Firebase/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import  faces from "../assets/faces.png"

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const login = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    toast.promise(
      (async () => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser(userData); // Store the entire user document in context
            navigate('/'); 
          } else {
            throw new Error("Failed to retrieve user data.");
          }
        } catch (error) {
          console.error("Error logging in: ", error);
          throw new Error("Failed to log in. Check your email and password.");
        } finally {
          setIsLoading(false);
        }
      })(),
      {
        pending: 'Logging in...',
        success: 'Logged in successfully!',
        error: {
          render({ data }) {
            return data.message || 'Failed to log in. Check your email and password.';
          },
        },
      }
    );
  };

  return (
    <div className="login-container">
      <h2>Sign in to your account</h2>
      <div className="contain">
        <img src={faces} width="400" className='faces'/>
      <div className="form">
        <input
          type="email"
          className="lform"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          placeholder="Email address"
        />
        <input
          type="password"
          className="lform"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          placeholder="Password"
        />
        <button className="auth-button" onClick={login} disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        <div className="auth-footer">
          <p>Don't have an account?</p>
          <Link to="/signup">Create one now</Link>
        </div>
      </div>
      </div>
    </div>
  );
}
