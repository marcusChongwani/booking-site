// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './screens/Home';
import About from './screens/About';
import Listings from './screens/ListingsScreens/Listings';
import MainNavigationBar from './components/MainNavigationBar';
import Footer from './components/footer';
import Details from './screens/ListingsScreens/Details';
import Notfound from './screens/Notfound';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import HostLayout from './components/HostLayout';
import Dashboard from './screens/Hostscreens/Dashboard';
import Create from './screens/Hostscreens/Create';
import HostListings from './screens/Hostscreens/HostListings';
import HostlistingDetails from './screens/Hostscreens/HostlistingDetails';
import HostlistingInfo from './screens/Hostscreens/HostlistingInfo';
import HostlistingPricing from './screens/Hostscreens/HostlistingPricing';
import HostlistingPhotos from './screens/Hostscreens/HostlistingPhotos';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRoute2 from './components/ProtectedRoute2';
import ScrollToTop from './components/ScrollToTop';
import Profile from './screens/Profile';
import Visits from './screens/Hostscreens/Visits';
import AdminLayout from './screens/Adminscreens/AdminLayout';
import AdminDashboard from './screens/Adminscreens/AdminDashboard';
import AdminCommands from './screens/Adminscreens/AdminCommands';
import ManageUsers from './screens/Adminscreens/ManageUsers';
import FeedBack from './screens/Adminscreens/FeedBack';
import ProtectedRoute3 from './components/ProtectedRoute3';
import { UserProvider } from './Firebase/UserContext';
import PublicListings from './screens/publicListings.';
import TermsAndConditions from './components/Terms';


export default function App() {
  const toastStyles = {
    width: '300px',
    padding: '16px',
    fontSize: '16px',
    borderRadius: '8px',
    marginTop: '10px',
  };

  return (
    <UserProvider>
      <BrowserRouter>
        <ScrollToTop />
        <MainNavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/public-Listings" element={<PublicListings/>}/>
          <Route path="/listings/:id" element={<Details />} /> 
          <Route path="/terms-and-conditions" element={<TermsAndConditions/>} />

          <Route element={<ProtectedRoute2 />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/listings" element={<Listings />} />
              
          </Route>
           
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Notfound />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/host" element={<HostLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="visits" element={<Visits />} />
              <Route path="create" element={<Create />} />
              <Route path="listings" element={<HostListings />} />
              <Route path="detail/:id" element={<HostlistingDetails />}>
                <Route index element={<HostlistingInfo />} />
                <Route path="pricing" element={<HostlistingPricing />} />
                <Route path="photos" element={<HostlistingPhotos />} />
              </Route>
            </Route>
          </Route>

          <Route element={<ProtectedRoute3 />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />{/* see number of users & allposts & featured and other things */}
              <Route path="commands" element={<AdminCommands />} />{/* approve post to set approved to true and set featured post to true or delete post */}
              <Route path="manageUsers" element={<ManageUsers />} />
              <Route path="feedback" element={<FeedBack />} />{/* getting feedback from users */}
            </Route>
          </Route>
        </Routes>

        <Footer />
        <ToastContainer
          style={toastStyles}
          position="top-right"
          autoClose={8000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </UserProvider>
  );
}
