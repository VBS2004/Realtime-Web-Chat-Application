// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Chat from './components/Chat';
import Chats from './components/Chats';
import { SocketProvider } from './SocketContext';
//<Navigate to="/login" />} />

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  return (
    <SocketProvider setIsLoggedIn={setIsLoggedIn}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} setUsername={setUsername} />} />
          <Route path="/chat" element={isLoggedIn ? <Chat username={username} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} /> :<Navigate to="/login" />} />  
          
          <Route path="/chats" element={isLoggedIn ? <Chats /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
