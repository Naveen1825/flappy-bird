
import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

function Signup({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (!username.trim()) {
        setError('Username is required.');
        return;
      }
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's displayName in Firebase
      await updateProfile(result.user, { displayName: username });

      onLogin({ name: username });
      onNavigate('home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="home">
      <h2 className="title">Sign Up</h2>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
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

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
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

export default Signup;
