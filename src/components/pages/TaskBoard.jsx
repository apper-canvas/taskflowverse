import { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { taskService } from "@/services/api/taskService"
import { categoryService } from "@/services/api/categoryService"
import Header from "@/components/organisms/Header"
import TaskList from "@/components/organisms/TaskList"
import TaskModal from "@/components/molecules/TaskModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"

const TaskBoard = () => {
const { categoryName } = useParams()
  const filterType = location.pathname.includes('/today') ? 'today' : 
                    location.pathname.includes('/upcoming') ? 'upcoming' :
                    location.pathname.includes('/completed') ? 'completed' : null
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    loadData()
}, [])
  
  // Get current location for filter detection
  const location = window.location

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError("Failed to load tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = useMemo(() => {
let filtered = [...tasks]

    // Filter by category from URL
    if (categoryName) {
      filtered = filtered.filter(task => 
        task.category.toLowerCase() === categoryName.toLowerCase()
      )
    }

    // Filter by temporal/status type
    if (filterType) {
      const { getTasksForToday, getUpcomingTasks, getCompletedTasks } = taskService
      
      switch (filterType) {
        case 'today':
          filtered = getTasksForToday(filtered)
          break
        case 'upcoming':
          filtered = getUpcomingTasks(filtered)
          break
        case 'completed':
          filtered = getCompletedTasks(filtered)
          break
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [tasks, categoryName, filterType, searchQuery])

  const taskStats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const today = tasks.filter(t => {
      const taskDate = new Date(t.dueDate)
      const today = new Date()
      return taskDate.toDateString() === today.toDateString()
    }).length
    const upcoming = tasks.filter(t => {
      const taskDate = new Date(t.dueDate)
      const today = new Date()
      return taskDate > today && !t.completed
    }).length

    return { total, completed, today, upcoming }
  }, [tasks])

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId)
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.Id === taskId ? updatedTask : task
        )
      )
    } catch (err) {
      throw new Error("Failed to update task")
    }
  }

  const handleSaveTask = async (taskData) => {
    try {
if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, {
          ...taskData,
          completed: taskData.status === "completed"
        })
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.Id === editingTask.Id ? updatedTask : task
          )
        )
      } else {
        const newTask = await taskService.create(taskData)
        setTasks(prevTasks => [newTask, ...prevTasks])
      }
    } catch (err) {
      throw new Error("Failed to save task")
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId))
    } catch (err) {
      throw new Error("Failed to delete task")
    }
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  if (loading) {
    return (
      <div className="h-full">
        <Header 
          onAddTask={handleAddTask}
          onSearch={setSearchQuery}
          totalTasks={0}
          completedTasks={0}
        />
        <div className="p-6">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full">
        <Header 
          onAddTask={handleAddTask}
          onSearch={setSearchQuery}
          totalTasks={0}
          completedTasks={0}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <Header
        onAddTask={handleAddTask}
        onSearch={setSearchQuery}
        totalTasks={taskStats.total}
        completedTasks={taskStats.completed}
      />

      <div className="flex-1 p-6">
{(categoryName || filterType) && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 capitalize">
              {categoryName ? `${categoryName} Tasks` : 
               filterType === 'today' ? 'Today\'s Tasks' :
               filterType === 'upcoming' ? 'Upcoming Tasks' :
               filterType === 'completed' ? 'Completed Tasks' : 'Tasks'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
            </p>
          </motion.div>
        )}

        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onAddTask={handleAddTask}
emptyTitle={searchQuery ? "No matching tasks found" : 
                     categoryName ? `No ${categoryName.toLowerCase()} tasks` :
                     filterType === 'today' ? "No tasks for today" :
                     filterType === 'upcoming' ? "No upcoming tasks" :
                     filterType === 'completed' ? "No completed tasks" :
                     "No tasks yet"}
          emptyDescription={searchQuery ? "Try adjusting your search terms" : 
                           filterType ? "Tasks will appear here when available" :
                           "Create your first task to get started"}
        />
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={editingTask}
        categories={categories}
      />
    </motion.div>
  )
}

export default TaskBoard