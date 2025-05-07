import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Mail, Lock, User } from "lucide-react";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!username) newErrors.username = "Username is required";
    else if (username.length < 3)
      newErrors.username = "Username must be at least 3 characters";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!nickname) newErrors.nickname = "Nickname is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError("");

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include',
        body: JSON.stringify({
          username,
          nickname,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/chat");
    } catch (error:unknown) {
      setApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout heading="Create an account" subheading="Sign up to get started">
      <form onSubmit={handleSubmit}>
        {apiError && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
            {apiError}
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
          label="Username"
          type="text"
          placeholder="Choose a username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
          leftIcon={<User className="h-4 w-4" />}
        />

        <Input
          label="Nickname"
          type="text"
          placeholder="Enter your nickname"
          fullWidth
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          error={errors.nickname}
          leftIcon={<User className="h-4 w-4" />}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          leftIcon={<Lock className="h-4 w-4" />}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          leftIcon={<Lock className="h-4 w-4" />}
        />

        <div className="flex items-center mb-6">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            I agree to the{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Privacy Policy
            </a>
          </label>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Sign Up
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
