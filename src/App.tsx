import  { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/useThemeStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import { StoreProvider } from "./store/StoreContext";
import GroupsPage from './pages/GroupsPage';
import UserProfile from './pages/Profile/UserProfile';
import UserProfileView from './pages/Profile/UserProfileView';
import { ToastProvider } from './components/admin copy/ui/Toast';
import AdminPage from './components/admin copy/AdminPage';



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
    <StoreProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/:id" element={<UserProfileView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/group" element={<GroupsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </StoreProvider>
  );
}

export default App;