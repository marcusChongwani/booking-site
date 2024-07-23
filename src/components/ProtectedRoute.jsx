import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../Firebase/UserContext';
import { RotatingLines } from 'react-loader-spinner'

const ProtectedRoute = () => {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:30}}>
      <RotatingLines
      visible={true}
      height="30"
      width="30"
      strokeWidth="5"
      strokeColor="#161616"
      animationDuration="0.75"
      ariaLabel="rotating-lines-loading"
      wrapperStyle={{}}
      wrapperClass=""
      />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'host' && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
