import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

function Signup({ onNavigate }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home">
      <div className="button-group">
        <input
          type="text"
          placeholder="Username"
          className="floppy-button"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <button className="floppy-button" onClick={handleSignup}>Signup</button>
        <button className="floppy-button" onClick={() => onNavigate('login')}>Go to Login</button>
      </div>
    </div>
  );
}

export default Signup;
