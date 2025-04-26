import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs } from '../firebase';

const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Function to handle sending a message
  const sendMessage = async () => {
    if (message.trim()) {
      await addDoc(collection(db, "messages"), {
        text: message,
        timestamp: new Date(),
      });
      setMessage(''); // Clear input after sending message
    }
  };

  // Fetch messages from Firestore when the component loads
  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, "messages"));
      const messagesArray = querySnapshot.docs.map(doc => doc.data());
      setMessages(messagesArray);
    };
    fetchMessages();
  }, []);

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.text}</p>
        ))}
      </div>
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Type your message..." 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
