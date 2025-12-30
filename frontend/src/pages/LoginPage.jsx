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
      const res = await axios.post("http://localhost:5000/login", { email, password });
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[350px] rounded-2xl p-8 bg-slate-800 border border-slate-700"
      >
        <h1 className="text-2xl font-semibold text-slate-100 mb-6">Welcome Back</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-transparent border border-slate-700 text-slate-100 placeholder-slate-400 outline-none focus:border-slate-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-transparent border border-slate-700 text-slate-100 placeholder-slate-400 outline-none focus:border-slate-500"
          />

          {error && <p className="text-sm text-rose-400 text-center">{error}</p>}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full border border-slate-700 text-slate-100 hover:bg-slate-700/30"
          >
            {loading ? "Logging in..." : "Log in"}
          </motion.button>
        </form>

        <p className="text-sm text-slate-400 text-center mt-4 cursor-pointer hover:underline">Forgot Password?</p>

        <p className="text-sm text-slate-400 text-center mt-6">
          Don’t have an account?{' '}
          <span onClick={() => navigate('/signup')} className="text-slate-200 cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </motion.div>
    </div>
  );
}
