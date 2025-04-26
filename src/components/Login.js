import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase"; 
import './Login.css';

const Login = () => {
  const provider = new GoogleAuthProvider();  // Initialize the Google Auth Provider

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User logged in:", user);
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in: " + error.message); // Provide feedback to the user
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;
