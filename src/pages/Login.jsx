import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";

function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault(); // prevent page reload
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case 'auth/invalid-email':
            setError('Invalid email address.');
            break;
          case 'auth/missing-password':
            setError('Password is required.');
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setError('Incorrect email or password.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your connection.');
            break;
          default:
            setError(e.message || 'Login failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case 'auth/popup-closed-by-user':
            setError('Google login was cancelled.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your connection.');
            break;
          case 'auth/account-exists-with-different-credential':
            setError('This email is already registered with another provider.');
            break;
          default:
            setError(e.message || 'Google login failed.');
        }
      } else {
        setError('An unexpected error occurred.');
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <form className="button-group" onSubmit={handleEmailLogin}>
        {error && <p style={{ color: 'red', marginBottom: '8px' }}>{error}</p>}

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
        <button type="submit" className="floppy-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <button
          type="button"
          className="floppy-button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? 'Please wait...' : 'Login with Google'}
        </button>
        <button
          type="button"
          className="floppy-button"
          onClick={() => onNavigate('signup')}
          disabled={loading}
        >
          Go to Signup
        </button>
      </form>
    </div>
  );
}

export default Login;
