import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { Moon, Sun } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  subheading?: string;
  image?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  heading,
  subheading,
  image = 'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
}) => {
  const { mode, toggleTheme } = useThemeStore();
  
  return (
    <div className={`flex min-h-screen ${mode === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12">
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {mode === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
        
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {heading}
          </h1>
          
          {subheading && (
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {subheading}
            </p>
          )}
          
          {children}
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
        <div className="w-full h-full flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="text-center text-white px-8">
            <h2 className="text-4xl font-bold mb-4">Connect with friends and the world around you</h2>
            <p className="text-xl">
              Stay in touch with friends and loved ones with our fast, simple, and secure messaging app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;