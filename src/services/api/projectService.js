const { ApperClient } = window.ApperSDK

// Initialize ApperClient
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const TABLE_NAME = 'project_c'

export const projectService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "team_size_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      }
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      // Transform database fields back to UI field names for compatibility
      return response.data.map(project => ({
        Id: project.Id,
        name: project.name_c,
        description: project.description_c,
        status: project.status_c,
        priority: project.priority_c,
        dueDate: project.due_date_c,
        teamSize: project.team_size_c,
        createdAt: project.created_at_c,
        updatedAt: project.updated_at_c
      }))
    } catch (error) {
      console.error("Error fetching projects:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "team_size_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params)
      
      if (!response?.data) {
        throw new Error(`Project with id ${id} not found`)
      }

      // Transform database fields back to UI field names for compatibility
      const project = response.data
      return {
        Id: project.Id,
        name: project.name_c,
        description: project.description_c,
        status: project.status_c,
        priority: project.priority_c,
        dueDate: project.due_date_c,
        teamSize: project.team_size_c,
        createdAt: project.created_at_c,
        updatedAt: project.updated_at_c
      }
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error?.response?.data?.message || error)
      throw new Error(`Project with id ${id} not found`)
    }
  },

  async create(projectData) {
    try {
      const params = {
        records: [{
          Name: projectData.name, // Required standard field
          name_c: projectData.name,
          description_c: projectData.description || "",
          status_c: projectData.status || "active",
          priority_c: projectData.priority || "medium",
          due_date_c: projectData.dueDate ? projectData.dueDate : null,
          team_size_c: projectData.teamSize ? parseInt(projectData.teamSize) : null,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.createRecord(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      const successful = response.results.filter(r => r.success)
      if (successful.length > 0) {
        const project = successful[0].data
        return {
          Id: project.Id,
          name: project.name_c,
          description: project.description_c,
          status: project.status_c,
          priority: project.priority_c,
          dueDate: project.due_date_c,
          teamSize: project.team_size_c,
          createdAt: project.created_at_c,
          updatedAt: project.updated_at_c
        }
      }
      
      throw new Error("Failed to create project")
    } catch (error) {
      console.error("Error creating project:", error?.response?.data?.message || error)
      throw new Error("Failed to create project")
    }
  },

  async update(id, projectData) {
    try {
      const updateRecord = {
        Id: parseInt(id),
        updated_at_c: new Date().toISOString()
      }
      
      // Map UI field names to database field names for updateable fields only
      if (projectData.name !== undefined) {
        updateRecord.Name = projectData.name
        updateRecord.name_c = projectData.name
      }
      if (projectData.description !== undefined) updateRecord.description_c = projectData.description
      if (projectData.status !== undefined) updateRecord.status_c = projectData.status
      if (projectData.priority !== undefined) updateRecord.priority_c = projectData.priority
      if (projectData.dueDate !== undefined) updateRecord.due_date_c = projectData.dueDate
      if (projectData.teamSize !== undefined) updateRecord.team_size_c = projectData.teamSize ? parseInt(projectData.teamSize) : null
      
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
        const project = successful[0].data
        return {
          Id: project.Id,
          name: project.name_c,
          description: project.description_c,
          status: project.status_c,
          priority: project.priority_c,
          dueDate: project.due_date_c,
          teamSize: project.team_size_c,
          createdAt: project.created_at_c,
          updatedAt: project.updated_at_c
        }
      }
      
      throw new Error("Failed to update project")
    } catch (error) {
      console.error("Error updating project:", error?.response?.data?.message || error)
      throw new Error("Failed to update project")
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
        throw new Error("Failed to delete project")
      }
      
      return { success: true }
    } catch (error) {
      console.error("Error deleting project:", error?.response?.data?.message || error)
      throw new Error("Failed to delete project")
    }
  },

  // Utility methods for filtering (client-side filtering)
  getActiveProjects(projectsList) {
    return projectsList.filter(project => project.status === 'active')
  },

  getCompletedProjects(projectsList) {
    return projectsList.filter(project => project.status === 'completed')
  },

  getProjectsByPriority(priority, projectsList) {
    return projectsList.filter(project => 
      project.priority.toLowerCase() === priority.toLowerCase()
    )
  },

  getProjectsByStatus(status, projectsList) {
    return projectsList.filter(project => 
      project.status.toLowerCase() === status.toLowerCase()
    )
  },

  // Statistics
  getProjectStats(projectsList) {
    const total = projectsList.length
    const active = projectsList.filter(p => p.status === 'active').length
    const completed = projectsList.filter(p => p.status === 'completed').length
    const onHold = projectsList.filter(p => p.status === 'on-hold').length
    const cancelled = projectsList.filter(p => p.status === 'cancelled').length
    
    return {
      total,
      active,
      completed,
      onHold,
      cancelled,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }
}