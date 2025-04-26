import React, { useState, useEffect, useRef } from 'react';
import { db, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, setDoc } from '../firebase';
import { getDatabase, ref, set, onDisconnect } from 'firebase/database';  // Realtime DB imports
import './ChatRoom.css';

const ChatRoom = ({ user }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [usersTyping, setUsersTyping] = useState([]);  // Track users typing
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const realtimeDb = getDatabase();

  useEffect(() => {
    const userStatusFirestoreRef = doc(db, "status", user.uid);
    const userStatusDatabaseRef = ref(realtimeDb, `/status/${user.uid}`);

    const onlineStatus = {
      isOnline: true,
      lastActive: serverTimestamp(),
      isTyping: false
    };

    const offlineStatus = {
      isOnline: false,
      lastActive: serverTimestamp(),
      isTyping: false
    };

    set(userStatusDatabaseRef, onlineStatus);
    onDisconnect(userStatusDatabaseRef).set(offlineStatus);
    setDoc(userStatusFirestoreRef, onlineStatus, { merge: true });

    return () => {
      set(userStatusDatabaseRef, offlineStatus);
      setDoc(userStatusFirestoreRef, offlineStatus, { merge: true });
    };
  }, [user]);

  // Handle sending a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      await addDoc(collection(db, 'messages'), {
        text: message,
        userName: user.displayName,
        userPhotoURL: user.photoURL,
        timestamp: serverTimestamp(),
      });
      setMessage('');
      setIsTyping(false);
    }
  };

  // Real-time message fetching
  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = querySnapshot.docs.map((doc) => doc.data());
      setMessages(messagesArray);
    });

    return () => unsubscribe();
  }, []);

  // Typing handler
  const handleTyping = (e) => {
    setMessage(e.target.value);
    const typing = e.target.value.trim().length > 0;
    setIsTyping(typing);

    // Update Firestore with typing status
    setDoc(doc(db, 'status', user.uid), {
      isTyping: typing,
      lastActive: serverTimestamp()
    }, { merge: true });
  };

  // Listen to changes in typing status of other users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'status'), (snapshot) => {
      const typingUsers = [];
      snapshot.forEach((doc) => {
        if (doc.id !== user.uid && doc.data().isTyping) {
          typingUsers.push(doc.id);  // Collect users who are typing
        }
      });
      setUsersTyping(typingUsers);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="chat-room">
      <header className="chat-header">
        <h2>React Chat App</h2>
      </header>

      <div className="messages-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <div className="message-avatar">
                <img src={msg.userPhotoURL || 'https://via.placeholder.com/50'} alt={msg.userName} />
              </div>
              <div className="message-content">
                <p>{msg.text}</p>
              </div>
              <div className="message-info">
                <span className="user-name">{msg.userName}</span>
                {msg.timestamp?.seconds && (
                  <small>{new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()}</small>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-container">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type a message"
          />
          <button type="submit" disabled={!message.trim()}>
            Send
          </button>
        </form>
        {isTyping && <p className="typing-indicator">You are typing...</p>}
        {usersTyping.length > 0 && (
          <p className="typing-indicator">
            {usersTyping.length === 1 ? `${usersTyping[0]} is typing...` : 'Multiple users are typing...'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
