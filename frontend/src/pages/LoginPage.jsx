import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      navigate("/main");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[350px] rounded-2xl p-8 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
      >
        <h1 className="text-2xl font-semibold text-slate-100 mb-6">Welcome Back</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-white text-slate-900 border border-slate-300 placeholder-slate-400 outline-none focus:border-indigo-500 dark:bg-transparent dark:text-slate-100 dark:border-slate-700"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-white text-slate-900 border border-slate-300 placeholder-slate-400 outline-none focus:border-indigo-500 dark:bg-transparent dark:text-slate-100 dark:border-slate-700"
          />

          {error && <p className="text-sm text-rose-400 text-center">{error}</p>}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full border border-slate-300 text-slate-900 bg-white hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:bg-transparent dark:hover:bg-slate-700/30"
          >
            {loading ? "Logging in..." : "Log in"}
          </motion.button>
        </form>

        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-6">
          Don’t have an account?{' '}
          <span onClick={() => navigate('/signup')} className="text-slate-400 dark:text-slate-200 cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </motion.div>
    </div>
  );
}
