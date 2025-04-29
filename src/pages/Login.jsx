import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home">
      <div className="button-group">
        <input
          type="email"
          placeholder="Email"
          className="floppy-button"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="floppy-button"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="floppy-button" onClick={handleEmailLogin}>Login</button>
        <button className="floppy-button" onClick={handleGoogleLogin}>Login with Google</button>
        <button className="floppy-button" onClick={() => onNavigate('signup')}>Go to Signup</button>
      </div>
    </div>
  );
}

export default Login;
