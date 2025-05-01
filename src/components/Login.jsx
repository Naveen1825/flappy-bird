import { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

function Login({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const name = result.user.displayName || 'Player';
      onLogin({ name });
      onNavigate('home');
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/invalid-email':
            setError('Invalid email address.');
            break;
          case 'auth/user-not-found':
            setError('No user found with this email.');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password.');
            break;
          case 'auth/missing-password':
            setError('Password is required.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your connection.');
            break;
          default:
            setError('Login failed. Please try again.');
        }
      } else {
        console.error(err);
        setError('Unexpected error occurred.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      const name = result.user.displayName || 'Player';
      onLogin({ name });
      onNavigate('home');
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/popup-closed-by-user':
            setError('Google login was cancelled.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your connection.');
            break;
          case 'auth/account-exists-with-different-credential':
            setError('An account already exists with a different provider.');
            break;
          default:
            setError('Google login failed. Please try again.');
        }
      } else {
        console.error(err);
        setError('Unexpected error occurred.');
      }
    }
  };

  return (
    <div className="home">
      <h2 className="title">Login</h2>
      <form onSubmit={handleEmailLogin} style={formStyle}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button className="floppy-button" type="submit">Login with Email</button>
      </form>

      <button className="floppy-button" style={{ marginTop: '1rem' }} onClick={handleGoogleLogin}>
        Login with Google
      </button>

      <button className="floppy-button" style={{ marginTop: '1rem' }} onClick={() => onNavigate('signup')}>
        Don't have an account
      </button>

      <button className="floppy-button" style={{ marginTop: '1rem' }} onClick={() => onNavigate('home')}>
        Back Home
      </button>

      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

const inputStyle = {
  padding: '1rem',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.8rem',
  width: '18rem',
  textAlign: 'center',
  border: '4px solid #355E3B',
  backgroundColor: '#F0E68C',
  boxShadow: '4px 4px 0px #BDB76B',
  outline: 'none',
  imageRendering: 'pixelated',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
};

const errorStyle = {
  color: 'red',
  marginTop: '1rem',
  textAlign: 'center',
};

export default Login;
