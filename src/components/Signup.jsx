import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

function Signup({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: username });

      onLogin({ name: username });
      onNavigate('home');
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/invalid-email':
            setError('Invalid email format.');
            break;
          case 'auth/email-already-in-use':
            setError('This email is already in use.');
            break;
          case 'auth/weak-password':
            setError('Password should be at least 6 characters.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Check your connection.');
            break;
          default:
            setError('Signup failed. Please try again.');
        }
      } else {
        console.error(err);
        setError('Unexpected error occurred.');
      }
    }
  };

  return (
    <div className="home">
      <h2 className="title">Sign Up</h2>
      <form onSubmit={handleSignup} style={formStyle}>
        <input
          type="text"
          placeholder="Create username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button className="floppy-button" type="submit">Sign Up</button>
      </form>

      <button className="floppy-button" style={{ marginTop: '1rem' }} onClick={() => onNavigate('login')}>
        Already have an account
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

export default Signup;
