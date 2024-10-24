import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../store/authSlice';
import './SignIn.css'; 

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state) => state.auth.errorMessage);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Populate the email and password fields from localStorage if they exist
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    
    if (savedEmail) {
      setEmail(savedEmail);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }

    if (isAuthenticated) {
      navigate('/dashboard'); 
    }
  }, [isAuthenticated, navigate]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signIn({ email, password })); // Dispatch sign-in action
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2 className="title">Sign In</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        className="input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="button" type="submit">Sign In</button>
      <Link className="link" to="/signup">Don't have an account? Sign Up</Link>
    </form>
  );
}

export default SignIn;
