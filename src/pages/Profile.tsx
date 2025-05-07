import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAuthStore } from '../store/useAuthStore';
import ConversationList from '../components/chat/ConversationList';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import { User, Mail, Camera, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [status, setStatus] = useState(user?.status || '');
  const [isEditing, setIsEditing] = useState(false);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would update the user profile in the backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsEditing(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <MainLayout sidebar={<ConversationList />}>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>
        
        <div className="mb-8 flex flex-col items-center">
          <div className="relative">
            <Avatar 
              src={user.avatar} 
              alt={user.name} 
              size="xl" 
              status="online"
            />
            
            <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          
          {!isEditing && (
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
              {user.status && (
                <p className="text-gray-500 dark:text-gray-500 mt-2 italic">"{user.status}"</p>
              )}
            </div>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Input
              label="Name"
              type="text"
              placeholder="Your name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
            />
            
            <Input
              label="Username"
              type="text"
              placeholder="Your username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
            />
            
            <Input
              label="Status"
              type="text"
              placeholder="Set a status message"
              fullWidth
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
            
            <div className="flex space-x-4 mt-6">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <Button 
              onClick={() => setIsEditing(true)}
              fullWidth
              className="mb-4"
            >
              Edit Profile
            </Button>
            
            <Button 
              onClick={handleLogout}
              fullWidth
              variant="outline"
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              Log Out
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;