import React, { useState } from "react";
const server = import.meta.env.VITE_SERVER_URL;

interface AdminContactProps {
  reason: string;
}

const AdminContact: React.FC<AdminContactProps> = ({ reason }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !message) {
      setError("Please fill out all fields.");
      return;
    }

    setError(null);
    try {
      // Здесь можно подключить отправку на сервер:
      await fetch(`${server}/users/support/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message, reason }),
      });
      console.log("Feedback submitted:", { email, message, reason });

      setSubmitted(true);
    } catch (err) {
      setError(String(err)||"Something went wrong. Please try again later.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-lg shadow-lg border dark:border-gray-700 transition-all duration-500 text-center">
        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
          Thank you!
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Your message has been sent to the administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-lg shadow-lg border dark:border-gray-700 transition-all duration-500">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        Contact Administrator
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        Your account has been blocked.
      </p>
      <p className="text-sm text-red-500 dark:text-red-400 font-medium mb-4">
        Reason: {reason}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            placeholder="Describe your issue or ask a question"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default AdminContact;
