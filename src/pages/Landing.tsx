import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Shield, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import { useThemeStore } from '../store/useThemeStore';

const Landing: React.FC = () => {
  const { mode, toggleTheme } = useThemeStore();
  
  return (
    <div className={mode === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ВЕС.
              </span>
              <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            </div>

            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className="p-2 mr-4 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {mode === "dark" ? (
                  <span className="flex items-center">
                    <Zap className="h-5 w-5 text-yellow-400 mr-1" />
                    Light
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Zap className="h-5 w-5 text-gray-700 mr-1" />
                    Dark
                  </span>
                )}
              </button>

              <Link to="/login">
                <Button size="sm" variant="outline">
                  Log in
                </Button>
              </Link>
              <Link
                to="/signup"
                className="ml-4  text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          </div>
        </header>

        <main>
          {/* Hero section */}
          <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    Stay connected with friends and family
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Fast, simple, and secure messaging for free. Connect with
                    the people who matter most.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/signup">
                      <Button size="lg">Get Started</Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline">
                        Log in
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <img
                    src="https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="People messaging"
                    className="rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features section */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Everything you need to stay connected
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
                  <MessageSquare className="h-12 w-12 text-blue-600 dark:text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Instant Messaging
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Send messages instantly to friends and family, with read
                    receipts and typing indicators.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
                  <Users className="h-12 w-12 text-blue-600 dark:text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Group Chats
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Create groups with friends, family, or colleagues to
                    coordinate and stay in touch.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
                  <Shield className="h-12 w-12 text-blue-600 dark:text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Secure Messaging
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your messages are secure and private, with strong encryption
                    to protect your conversations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA section */}
          <section className="py-20 bg-blue-600 dark:bg-blue-700">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to start messaging?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join millions of people already using Ves. to stay connected
                with friends and family.
              </p>
              <Link to="/signup">
                <button
                  type="button"
                  className="px-6 py-3 text-lg font-semibold rounded-md bg-white text-black hover:bg-gray-100 focus:ring-2 focus:ring-white focus:outline-none transition"
                >
                  Sign up
                </button>
              </Link>
            </div>
          </section>
        </main>

        <footer className="bg-gray-100 dark:bg-gray-800 py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0 space-x-2">
                <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ВЕС.
                </span>
              </div>
              {/* остальной контент футера */}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;