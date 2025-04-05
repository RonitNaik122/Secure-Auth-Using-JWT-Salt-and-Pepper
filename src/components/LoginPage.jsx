"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useApi } from "../context/ApiContext"; // ⬅️ import the context

const LoginPage = ({ onLogin }) => {
  const { apiBase } = useApi(); // ⬅️ get the API base URL
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const data = isLogin
        ? { username, password }
        : { username, password, email };

      // ✅ now using dynamic API base
      const response = await axios.post(`${apiBase}${endpoint}`, data);

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        onLogin(response.data.access_token, username);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setError(error.response?.data?.detail || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl w-96 border border-white/20"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-white">
            {isLogin ? "Welcome Back" : "Join Us"}
          </h2>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 text-white px-4 py-3 rounded-xl relative mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50 backdrop-blur-sm"
            />
          </motion.div>

          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50 backdrop-blur-sm"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50 backdrop-blur-sm"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <button
              type="submit"
              className="w-full bg-white text-black font-bold p-4 rounded-xl hover:bg-opacity-90 transition duration-300 text-lg"
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  className="flex justify-center items-center"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1,
                    ease: "linear",
                  }}
                >
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </motion.div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </motion.div>
        </form>

        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/70 hover:text-white transition-colors"
          >
            {isLogin
              ? "Need an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
