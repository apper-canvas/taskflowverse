const { ApperClient } = window.ApperSDK

// Initialize ApperClient
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const TABLE_NAME = 'task_c'

export const taskService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "status_c"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}]
      }
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      // Transform database fields back to UI field names for compatibility
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        completed: task.completed_c,
        category: task.category_c,
        priority: task.priority_c,
        dueDate: task.due_date_c,
        createdAt: task.created_at_c,
        order: task.order_c,
        status: task.status_c
      }))
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "status_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params)
      
      if (!response?.data) {
        throw new Error("Task not found")
      }

      // Transform database fields back to UI field names for compatibility
      const task = response.data
      return {
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        completed: task.completed_c,
        category: task.category_c,
        priority: task.priority_c,
        dueDate: task.due_date_c,
        createdAt: task.created_at_c,
        order: task.order_c,
        status: task.status_c
      }
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error)
      throw new Error("Task not found")
    }
  },

  async create(taskData) {
    try {
      const params = {
        records: [{
          Name: taskData.title, // Required standard field
          title_c: taskData.title,
          description_c: taskData.description || "",
          completed_c: false,
          category_c: taskData.category,
          priority_c: taskData.priority,
          due_date_c: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
          created_at_c: new Date().toISOString(),
          order_c: 1,
          status_c: taskData.status || "pending"
        }]
      }
      
      const response = await apperClient.createRecord(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      const successful = response.results.filter(r => r.success)
      if (successful.length > 0) {
        const task = successful[0].data
        return {
          Id: task.Id,
          title: task.title_c,
          description: task.description_c,
          completed: task.completed_c,
          category: task.category_c,
          priority: task.priority_c,
          dueDate: task.due_date_c,
          createdAt: task.created_at_c,
          order: task.order_c,
          status: task.status_c
        }
      }
      
      throw new Error("Failed to create task")
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      throw new Error("Failed to create task")
    }
  },

  async update(id, updateData) {
    try {
      const updateRecord = {
        Id: parseInt(id)
      }
      
      // Map UI field names to database field names for updateable fields only
      if (updateData.title !== undefined) {
        updateRecord.Name = updateData.title
        updateRecord.title_c = updateData.title
      }
      if (updateData.description !== undefined) updateRecord.description_c = updateData.description
      if (updateData.completed !== undefined) updateRecord.completed_c = updateData.completed
      if (updateData.category !== undefined) updateRecord.category_c = updateData.category
      if (updateData.priority !== undefined) updateRecord.priority_c = updateData.priority
      if (updateData.dueDate !== undefined) updateRecord.due_date_c = updateData.dueDate ? new Date(updateData.dueDate).toISOString() : null
      if (updateData.order !== undefined) updateRecord.order_c = updateData.order
      if (updateData.status !== undefined) updateRecord.status_c = updateData.status
      
      const params = {
        records: [updateRecord]
      }
      
      const response = await apperClient.updateRecord(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      const successful = response.results.filter(r => r.success)
      if (successful.length > 0) {
        const task = successful[0].data
        return {
          Id: task.Id,
          title: task.title_c,
          description: task.description_c,
          completed: task.completed_c,
          category: task.category_c,
          priority: task.priority_c,
          dueDate: task.due_date_c,
          createdAt: task.created_at_c,
          order: task.order_c,
          status: task.status_c
        }
      }
      
      throw new Error("Failed to update task")
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
      throw new Error("Failed to update task")
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      const successful = response.results.filter(r => r.success)
      if (successful.length === 0) {
        throw new Error("Failed to delete task")
      }
      
      return { success: true }
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      throw new Error("Failed to delete task")
    }
  },

  async toggleComplete(id) {
    try {
      // First get the current task to check completed status
      const currentTask = await this.getById(id)
      
      // Update with opposite completed status
      const updatedTask = await this.update(id, {
        completed: !currentTask.completed,
        status: !currentTask.completed ? "completed" : "pending"
      })
      
      return updatedTask
    } catch (error) {
      console.error("Error toggling task completion:", error?.response?.data?.message || error)
      throw new Error("Failed to toggle task completion")
    }
  },

  async reorderTasks(reorderedTasks) {
    try {
      const updatePromises = reorderedTasks.map((task, index) =>
        this.update(task.Id, { order: index + 1 })
      )
      
      const updatedTasks = await Promise.all(updatePromises)
      return updatedTasks
    } catch (error) {
      console.error("Error reordering tasks:", error?.response?.data?.message || error)
      throw new Error("Failed to reorder tasks")
    }
  },

  // Filtering utilities for temporal queries (client-side filtering)
  getTasksForToday(taskList) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return taskList.filter(task => {
      if (!task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate.getTime() === today.getTime()
    })
  },

  getUpcomingTasks(taskList) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    return taskList.filter(task => {
      if (!task.dueDate || task.completed) return false
      const dueDate = new Date(task.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate.getTime() >= tomorrow.getTime()
    })
  },

  getCompletedTasks(taskList) {
    return taskList.filter(task => task.completed === true)
  }
}