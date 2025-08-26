import tasksData from "@/services/mockData/tasks.json"

let tasks = [...tasksData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(task => task.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    return { ...task }
  },

  async create(taskData) {
    await delay(400)
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || "",
      completed: false,
      category: taskData.category,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
      order: tasks.length + 1
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updateData) {
    await delay(300)
    const index = tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    
    tasks[index] = { ...tasks[index], ...updateData }
    return { ...tasks[index] }
  },

  async delete(id) {
    await delay(250)
    const index = tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    
    const deletedTask = tasks.splice(index, 1)[0]
    return { ...deletedTask }
  },

  async toggleComplete(id) {
    await delay(200)
    const index = tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    
    tasks[index].completed = !tasks[index].completed
    return { ...tasks[index] }
  },

  async reorderTasks(reorderedTasks) {
    await delay(300)
    tasks = reorderedTasks.map((task, index) => ({
      ...task,
      order: index + 1
    }))
    return [...tasks]
  }
}