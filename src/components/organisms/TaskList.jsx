import { motion, AnimatePresence } from "framer-motion"
import TaskCard from "@/components/molecules/TaskCard"
import Empty from "@/components/ui/Empty"

const TaskList = ({ 
  tasks = [], 
  onToggleComplete, 
  onEditTask, 
  onDeleteTask,
  onAddTask,
  emptyTitle = "No tasks found",
  emptyDescription = "Create your first task to get started",
  className = ""
}) => {
  if (tasks.length === 0) {
    return (
      <Empty
        title={emptyTitle}
        description={emptyDescription}
        onAction={onAddTask}
        actionText="Add Task"
        icon="CheckSquare"
        className={className}
      />
    )
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    // Incomplete tasks first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    // Then by priority (High, Medium, Low)
    const priorityOrder = { High: 3, Medium: 2, Low: 1 }
    const aPriority = priorityOrder[a.priority] || 1
    const bPriority = priorityOrder[b.priority] || 1
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }
    
    // Then by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    
    // Finally by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return (
    <div className={`space-y-4 ${className}`}>
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.Id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList