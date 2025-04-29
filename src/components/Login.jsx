import { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

function Login({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Get displayName (set during signup or from google)
      const name = result.user.displayName || 'Player';
      onLogin({ name });
      onNavigate('home');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const name = result.user.displayName || 'Player';
      onLogin({ name });
      onNavigate('home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="home">
      <h2 className="title">Login</h2>
      <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
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

export default Login;
