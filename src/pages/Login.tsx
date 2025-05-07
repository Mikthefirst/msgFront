import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Mail, Lock } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Add this useEffect to handle redirection if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(email, password);
      // The navigation is now handled by the useEffect when isAuthenticated changes
    } catch (err) {
      // Error handling is done in the store
      console.error("Login error:", err);
    }
  };

  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Sign in to access your account"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          leftIcon={<Lock className="h-4 w-4" />}
        />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>

          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Forgot password?
          </a>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Sign In
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
