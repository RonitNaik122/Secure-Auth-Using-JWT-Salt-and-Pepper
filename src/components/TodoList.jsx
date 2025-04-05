"use client";

//TodoList.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import TodoItem from "./TodoItem";
import AddTodoForm from "./AddTodoForm";

const TodoList = ({ onLogout, username }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Configure axios with auth header
  const api = axios.create({
    baseURL: "http://0.0.0.0:8080",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/todos/");
      setTodos(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching todos:", err);
      if (err.response && err.response.status === 401) {
        setError("Authentication failed. Please log in again.");
        // Optional: Auto-logout on auth failure
        onLogout();
      } else {
        setError("Failed to load your todos. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (newTodo) => {
    try {
      const response = await api.post("/todos/", newTodo);
      setTodos([...todos, response.data]);
    } catch (err) {
      console.error("Error adding todo:", err);
      if (err.response && err.response.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else {
        setError("Failed to add todo. Please try again.");
      }
    }
  };

  const toggleTodoStatus = async (id, completed) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      const updatedTodo = { ...todoToUpdate, completed: !completed };

      await api.put(`/todos/${id}`, updatedTodo);

      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo)));
    } catch (err) {
      console.error("Error updating todo:", err);
      if (err.response && err.response.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else {
        setError("Failed to update todo. Please try again.");
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
      if (err.response && err.response.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else {
        setError("Failed to delete todo. Please try again.");
      }
    }
  };

  const updateTodo = async (id, updatedData) => {
    try {
      const response = await api.put(`/todos/${id}`, updatedData);
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
    } catch (err) {
      console.error("Error updating todo:", err);
      if (err.response && err.response.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else {
        setError("Failed to update todo. Please try again.");
      }
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // 'all'
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white">My Tasks</h1>
            <p className="text-white/70 mt-1">Welcome back, {username}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition duration-200 backdrop-blur-sm"
          >
            Sign Out
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 shadow-xl mb-8 border border-white/20"
        >
          <AddTodoForm onAddTodo={addTodo} />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/30 text-white px-4 py-3 rounded-xl mb-6"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex space-x-2 mb-6"
        >
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")} label="All" count={todos.length} />
          <FilterButton
            active={filter === "active"}
            onClick={() => setFilter("active")}
            label="Active"
            count={activeCount}
          />
          <FilterButton
            active={filter === "completed"}
            onClick={() => setFilter("completed")}
            label="Completed"
            count={completedCount}
          />
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-2 border-t-white border-white/20 rounded-full"
            />
          </div>
        ) : filteredTodos.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-white/70">
            {todos.length === 0
              ? "You don't have any tasks yet. Add one above!"
              : `No ${filter === "active" ? "active" : "completed"} tasks found.`}
          </motion.div>
        ) : (
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <AnimatePresence>
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodoStatus}
                  onDelete={deleteTodo}
                  onUpdate={updateTodo}
                />
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </div>
  );
};

const FilterButton = ({ active, onClick, label, count }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-2 rounded-xl flex items-center space-x-2 ${
      active ? "bg-white text-black font-medium" : "bg-white/10 text-white hover:bg-white/20"
    }`}
  >
    <span>{label}</span>
    <span className={`text-sm px-2 py-0.5 rounded-full ${active ? "bg-black/10" : "bg-white/20"}`}>{count}</span>
  </motion.button>
);

export default TodoList;