// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div style={{ textAlign: 'center' }}>
    <h1>Welcome to the Chat App</h1>
    <Link to="/login">Login</Link>
  </div>
);

export default Home;
