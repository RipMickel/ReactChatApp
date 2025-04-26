import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase"; 

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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          width: '300px',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            marginBottom: '10px',
          }}
        >
          Login
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: '#555',
            marginBottom: '20px',
          }}
        >
          Sign in to continue
        </p>
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '12px 20px',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Google_2015_logo.svg/512px-Google_2015_logo.svg.png"
            alt="Google Logo"
            style={{
              width: '20px',
              marginRight: '10px',
            }}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
