import React, { useState, useEffect } from 'react';
import { useSocket } from 'D:/Web Chat/chat-room/src/SocketContext.js';
import './Chat.css';

const Chat = ({ username, isLoggedIn, setIsLoggedIn, setUsername }) => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [isPopupOpen, setPopupOpen] = useState(false);

  const { messages, login, sendMessage, isAvailable,usersOnline} = useSocket();

  // Effect to trigger the popup when isAvailable changes to false
  useEffect(() => {
    if (!isAvailable) {
      setPopupOpen(true);
    } else {
      setPopupOpen(false); // Close the popup if available
    }
  }, [isAvailable]);

  const handleLogin = () => {
    if (username) {
      login(username);
    } else {
      alert('Please enter username!');
    }
  };

  const handleSendMessage = () => {
    if (message && recipient) {
      sendMessage(recipient, message);
      setMessage('');
    } else {
      alert('Please enter both recipient and message.');
    }
  };

  const handleClosePopup = () => {
    setPopupOpen(false); // Close the popup
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, serif', fontSize: '14pt' }}>
       <div className="active-users" style={{ marginBottom: '20px' }}>
        <h3>Active Users</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {usersOnline && usersOnline.length > 0 ? (
            usersOnline.map((user, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {user.Username} (Session ID: {user.sessID})
              </li>
            ))
          ) : (
            <p>No active users currently</p>
          )}
        </ul>
      </div>
      <div id="messages" style={{
        margin: '0 auto',
        width: '60%',
        textAlign: 'left',
        minHeight: '300px',
        border: '1px solid #ccc',
        padding: '10px',
        overflowY: 'auto',
        maxHeight: '400px',
      }}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      {!isLoggedIn ? (
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="To"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}

      {isPopupOpen && !isAvailable && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Realtime Chat</h2>
            <p>User not online!</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
