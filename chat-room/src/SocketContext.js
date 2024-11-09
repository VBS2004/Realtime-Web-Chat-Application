import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import pkg from '../package.json';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({setIsLoggedIn,children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [usersOnline, setUsersOnline] = useState([]); // State for active users

  useEffect(() => {
    const socketInstance = io(pkg.config.backend_ip);

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('message', (data) => {
      if (data === 'User not found') {
        setIsAvailable(false);
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    socketInstance.on('loginFailed', (message) => {
       setIsLoggedIn(false);
       alert(message);

    });

    // Listen for active users updates from the server
    socketInstance.on('changeActive', (activeUsers) => {
      setUsersOnline(activeUsers);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const login = (username) => {
    if (socket && username) {
      socket.emit('Login', username);
      setIsLoggedIn(true);
      setUser(username);
      return true;
    }
    return false;
  };

  const sendMessage = (recipient, message) => {
    if (socket && recipient && message) {
      const msgData = { To: recipient, Message: message };
      socket.emit('Chat', msgData);
      return true;
    }
    return false;
  };

  const value = {
    socket,
    isConnected,
    messages,
    user,
    login,
    sendMessage,
    isAvailable,
    usersOnline, // Include usersOnline in the context value
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
