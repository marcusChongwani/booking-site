// src/components/Chat/Chat.js
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../Firebase/Firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';


function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Sign in anonymously if not already signed in
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        signInAnonymously(auth);
      }
    });

    // Listen for new messages
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        timestamp: new Date(),
        uid: user.uid,
        photoURL: user.photoURL || 'https://via.placeholder.com/150' // default profile picture
      });
      setNewMessage("");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await deleteDoc(doc(db, "messages", id));
    }
  };

  return (
    <div className="App">
      <h1>Chat App</h1>
      <div className="chat-window">
        {messages.map((message) => (
          <div
            key={message.id}
            className="message"
            onContextMenu={(e) => {
              e.preventDefault();
              handleDeleteMessage(message.id);
            }}
          >
            <img src={message.photoURL} alt="Profile" className="profile-pic" />
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
