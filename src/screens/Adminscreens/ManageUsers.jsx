import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/Firebase'; // Adjust the import path as needed
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './Admin.css'; // Import your CSS file
import { MdOutlineDelete } from "react-icons/md";
import { RotatingLines } from 'react-loader-spinner';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'Users'); // Adjust the collection name
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
      setLoading(false)
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'Users', userId)); // Adjust the collection name
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  if(loading){
    return( 
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

  return (
    <div className="manage-users-container">
      <div className="user-cards-container">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className='userheader'>
              <p className="user-name">{user.name}</p>
              <button className="delete-button" onClick={() => handleDeleteUser(user.id)}><MdOutlineDelete className='delete-button-icon'/></button>
            </div>
           <div className='userheader'>
              <p>Phone: {user.phone}</p>
              <p>User: {user.role}</p>
           </div>
            <p>Email: {user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
