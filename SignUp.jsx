import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../store/authSlice';
import './SignUp.css';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
    };

    // Dispatch signUp action
    dispatch(signUp(userData));

    // Store email and password in localStorage
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);

    setSuccessMessage('Your account is created. You will be redirected to sign in.');

    setTimeout(() => {
      navigate('/signin');
    }, 3000);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2 className="title">Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <input
        type="text"
        className="input"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        className="input"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <input
        type="email"
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        className="input"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button className="button" type="submit">Create Account</button>
      <Link to="/signin" className="link">Already have an account? Sign In</Link>
    </form>
  );
}

export default SignUp;
