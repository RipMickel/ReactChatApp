import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsub();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>🔥 Messenger Chat</h1>
        {user && <button onClick={() => signOut(auth)}>Logout</button>}
      </header>
      {user ? <ChatRoom user={user} /> : <Login />}
    </div>
  );
}

export default App;
