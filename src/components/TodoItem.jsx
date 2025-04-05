"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const TodoItem = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(todo.title)
  const [editedDescription, setEditedDescription] = useState(todo.description || "")
  const [editedPriority, setEditedPriority] = useState(todo.priority || 1)

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(todo.id, {
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority,
      completed: todo.completed,
    })
    setIsEditing(false)
  }

  const priorityColors = {
    1: "bg-blue-500/20 text-blue-200 border-blue-500/30",
    2: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
    3: "bg-red-500/20 text-red-200 border-red-500/30",
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 shadow-lg"
    >
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
            placeholder="Task title"
            required
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
            placeholder="Description (optional)"
            rows="2"
          />
          <div className="flex items-center space-x-2">
            <label className="text-white/70">Priority:</label>
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(Number(e.target.value))}
              className="bg-black/20 border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xl"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-3 py-1 bg-white text-black rounded-xl"
            >
              Save
            </motion.button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => onToggle(todo.id, todo.completed)}
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  todo.completed ? "bg-white border-white" : "bg-transparent border-white/30 hover:border-white/60"
                }`}
              >
                {todo.completed && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-black"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </motion.button>
              <div className="flex-1">
                <h3 className={`text-lg font-medium ${todo.completed ? "text-white/50 line-through" : "text-white"}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`mt-1 text-sm ${todo.completed ? "text-white/30 line-through" : "text-white/70"}`}>
                    {todo.description}
                  </p>
                )}
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-lg border ${priorityColors[todo.priority]}`}>
                    {todo.priority === 1 ? "Low" : todo.priority === 2 ? "Medium" : "High"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="p-1 text-white/70 hover:text-white rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(todo.id)}
                className="p-1 text-white/70 hover:text-white rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.li>
  )
}

export default TodoItem

