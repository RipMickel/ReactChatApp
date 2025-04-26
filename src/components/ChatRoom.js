import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

function ChatRoom({ user }) {
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState("");
  const dummy = useRef();

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "messages"), {
      text: formValue,
      createdAt: serverTimestamp(),
      uid: user.uid,
      photoURL: user.photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} user={user} />
        ))}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Say something..."
        />
        <button type="submit" disabled={!formValue}>
          Send
        </button>
      </form>
    </>
  );
}

function Message({ message, user }) {
  const isUser = message.uid === user.uid;

  return (
    <div className={`message ${isUser ? "sent" : "received"}`}>
      <img src={message.photoURL} alt="avatar" />
      <p>{message.text}</p>
    </div>
  );
}

export default ChatRoom;
