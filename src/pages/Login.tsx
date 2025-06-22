import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Mail, Lock } from "lucide-react";
import AdminContact from "../components/AdminContact";
const server = import.meta.env.VITE_SERVER_URL;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [banReason, setBanReason] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);


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

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${server}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.banReason) {
          setBanReason(data.banReason);
          // Показываем обратную связь через 2 секунды
          setTimeout(() => {
            setShowFeedback(true);
          }, 2000);
        } else {
          throw new Error(data.message || "Login failed");
        }
        return;
      }
      navigate("/chat");

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Sign in to access your account"
      childrenRight={
        banReason && showFeedback && <AdminContact reason={banReason} />
      }
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
