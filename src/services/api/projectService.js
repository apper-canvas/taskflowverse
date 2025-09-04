import projectsData from '@/services/mockData/projects.json'

let projects = [...projectsData]

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const projectService = {
  async getAll() {
    await delay()
    return [...projects]
  },

  async getById(id) {
    await delay()
    const project = projects.find(p => p.Id === parseInt(id))
    if (!project) {
      throw new Error(`Project with id ${id} not found`)
    }
    return { ...project }
  },

  async create(projectData) {
    await delay()
    const newProject = {
      Id: Math.max(...projects.map(p => p.Id), 0) + 1,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    projects = [newProject, ...projects]
    return { ...newProject }
  },

  async update(id, projectData) {
    await delay()
    const index = projects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Project with id ${id} not found`)
    }
    
    const updatedProject = {
      ...projects[index],
      ...projectData,
      Id: projects[index].Id, // Preserve original ID
      updatedAt: new Date().toISOString()
    }
    
    projects[index] = updatedProject
    return { ...updatedProject }
  },

  async delete(id) {
    await delay()
    const index = projects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Project with id ${id} not found`)
    }
    
    const deletedProject = projects[index]
    projects = projects.filter(p => p.Id !== parseInt(id))
    return { ...deletedProject }
  },

  // Utility methods for filtering
  getActiveProjects(projectsList = projects) {
    return projectsList.filter(project => project.status === 'active')
  },

  getCompletedProjects(projectsList = projects) {
    return projectsList.filter(project => project.status === 'completed')
  },

  getProjectsByPriority(priority, projectsList = projects) {
    return projectsList.filter(project => 
      project.priority.toLowerCase() === priority.toLowerCase()
    )
  },

  getProjectsByStatus(status, projectsList = projects) {
    return projectsList.filter(project => 
      project.status.toLowerCase() === status.toLowerCase()
    )
  },

  // Statistics
  getProjectStats(projectsList = projects) {
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