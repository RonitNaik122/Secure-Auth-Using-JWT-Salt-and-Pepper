"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const AddTodoForm = ({ onAddTodo }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    console.log("Todo being sent:", {
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
    })
    

    onAddTodo({
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
    })

    setTitle("")
    setDescription("")
    setPriority(1)
    setIsExpanded(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center">
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (e.target.value && !isExpanded) setIsExpanded(true)
          }}
          onFocus={() => setIsExpanded(true)}
          className="flex-1 p-4 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!title.trim()}
          className="ml-2 bg-white text-black font-bold p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </motion.button>
      </div>

      <AnimatedExpandableSection isExpanded={isExpanded}>
        <div className="space-y-4 pt-2">
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
            rows="2"
          />

          <div className="flex items-center space-x-2">
            <label className="text-white/70">Priority:</label>
            <div className="flex space-x-2">
              <PriorityButton active={priority === 1} onClick={() => setPriority(1)} label="Low" color="blue" />
              <PriorityButton active={priority === 2} onClick={() => setPriority(2)} label="Medium" color="yellow" />
              <PriorityButton active={priority === 3} onClick={() => setPriority(3)} label="High" color="red" />
            </div>
          </div>
        </div>
      </AnimatedExpandableSection>
    </form>
  )
}

const AnimatedExpandableSection = ({ isExpanded, children }) => (
  <motion.div
    initial={false}
    animate={{
      height: isExpanded ? "auto" : 0,
      opacity: isExpanded ? 1 : 0,
    }}
    transition={{ duration: 0.3 }}
    style={{ overflow: "hidden" }}
  >
    {children}
  </motion.div>
)

const PriorityButton = ({ active, onClick, label, color }) => {
  const baseClasses = "px-3 py-1 rounded-lg text-sm font-medium"
  const colorClasses = {
    blue: active ? "bg-blue-500 text-white" : "bg-blue-500/20 text-blue-200 hover:bg-blue-500/30",
    yellow: active ? "bg-yellow-500 text-white" : "bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30",
    red: active ? "bg-red-500 text-white" : "bg-red-500/20 text-red-200 hover:bg-red-500/30",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${colorClasses[color]}`}
    >
      {label}
    </motion.button>
  )
}

export default AddTodoForm

