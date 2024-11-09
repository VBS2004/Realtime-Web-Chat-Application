import React from 'react';
import { useSocket } from 'D:/Web Chat/chat-room/src/SocketContext.js';
import { useNavigate } from 'react-router-dom';


const Login = ({ isLoggedIn, setUsername}) => {
  const {login} = useSocket();
  const navigate = useNavigate();
  
  
  const handleLogin = (username) => {
    if (username) {
      login(username);
      setUsername(username);
      navigate('/chat');
    }
    else {
      alert('Please enter username!');
    }

  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <button onClick={() => handleLogin(document.querySelector('input').value)}>
        Login
      </button>
    </div>
  );
};

export default Login;
