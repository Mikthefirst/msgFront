import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { Moon, Sun } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, sidebar }) => {
  const { mode, toggleTheme } = useThemeStore();
  
  return (
    <div className={`flex h-screen overflow-hidden ${mode === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      {sidebar && (
        <div className="hidden md:flex flex-col w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {sidebar}
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
         
          
          <div className="ml-auto">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;