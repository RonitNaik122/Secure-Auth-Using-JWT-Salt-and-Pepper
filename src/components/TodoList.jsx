"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import TodoItem from "./TodoItem";
import AddTodoForm from "./AddTodoForm";

const TodoList = ({ onLogout, username }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");

  // Create API instance with proper configuration
  const api = axios.create({
    baseURL: "https://c1fd-2405-201-3c-20a9-9d73-d42e-c812-890f.ngrok-free.app",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      // Add these headers to bypass ngrok inspection page
      "ngrok-skip-browser-warning": "true",
      "ngrok-skip-browser-verify": "true",
    },
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      console.log("Fetching todos...");

      // Use fetch API as alternative to axios for more control
      const response = await fetch(`${api.defaults.baseURL}/todos/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "ngrok-skip-browser-verify": "true",
          // Add cache control to prevent browser caching
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      console.log("Response status:", response.status);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Received non-JSON response:", contentType);
        // Try to get the text to see what's wrong
        const textData = await response.text();
        console.log("Response text:", textData);
        throw new Error("Expected JSON response but received: " + contentType);
      }

      const data = await response.json();
      console.log("Fetched todos:", data);

      const todosArray = Array.isArray(data) ? data : data.todos;
      setTodos(todosArray || []);
      setError("");
    } catch (err) {
      console.error("Error fetching todos:", err);

      if (err.response && err.response.status === 401) {
        setError("Authentication failed. Please log in again.");
        onLogout();
      } else {
        setError(`Failed to load your todos: ${err.message}`);
      }
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (newTodo) => {
    try {
      const response = await api.post("/todos/", newTodo);
      console.log("Add todo response:", response.data);

      // Make sure we use the priority from the newTodo if it's missing in the response
      const savedTodo = {
        ...response.data,
        priority: response.data.priority || newTodo.priority,
      };

      setTodos((prevTodos) => [...prevTodos, savedTodo]);
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add todo. Please try again.");
    }
  };

  const toggleTodoStatus = async (id, completed) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      const updatedTodo = { ...todoToUpdate, completed: !completed };
      await api.put(`/todos/${id}`, updatedTodo);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("Failed to update todo. Please try again.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete todo. Please try again.");
    }
  };

  const updateTodo = async (id, updatedData) => {
    try {
      const response = await api.put(`/todos/${id}`, updatedData);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? response.data : todo))
      );
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("Failed to update todo. Please try again.");
    }
  };

  // Force refresh todos
  const refreshTodos = () => {
    setLoading(true);
    fetchTodos();
  };

  const filteredTodos = Array.isArray(todos)
    ? todos
        .filter((todo) => {
          if (filter === "active") return !todo.completed;
          if (filter === "completed") return todo.completed;
          return true;
        })
        .sort((a, b) => {
          // For "completed" view, sort normally by priority
          if (filter === "completed") {
            return (b.priority || 0) - (a.priority || 0);
          }

          // For "all" or "active", completed ones go to bottom
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }

          // Then sort by priority
          return (b.priority || 0) - (a.priority || 0);
        })
    : [];

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
            className="bg-red-500/20 border border-red-500/30 text-white px-4 py-3 rounded-xl mb-6 flex justify-between items-center"
          >
            <div>{error}</div>
            <button
              onClick={refreshTodos}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-sm"
            >
              Retry
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="All"
              count={todos.length}
            />
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
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshTodos}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition duration-200"
          >
            Refresh
          </motion.button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-2 border-t-white border-white/20 rounded-full"
            />
          </div>
        ) : filteredTodos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-white/70"
          >
            {todos.length === 0
              ? "You don't have any tasks yet. Add one above!"
              : `No ${
                  filter === "active" ? "active" : "completed"
                } tasks found.`}
          </motion.div>
        ) : (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
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
      active
        ? "bg-white text-black font-medium"
        : "bg-white/10 text-white hover:bg-white/20"
    }`}
  >
    <span>{label}</span>
    <span
      className={`text-sm px-2 py-0.5 rounded-full ${
        active ? "bg-black/10" : "bg-white/20"
      }`}
    >
      {count}
    </span>
  </motion.button>
);

export default TodoList;
