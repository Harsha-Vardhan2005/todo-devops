import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = ({ user, onLogout }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (user) {
    return (
      <div className="user-welcome">
        <p>Welcome, {user.email}</p>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    );
  }

return (
  <div className="login-container">
    <div className="login-header">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
    </div>
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-btn">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
      </button>
    </div>
  </div>
);
};

export default Login;