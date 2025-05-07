import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/useThemeStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verification from './pages/Verification';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

function App() {
  const { mode } = useThemeStore();
  
  // Apply dark mode to the document
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;