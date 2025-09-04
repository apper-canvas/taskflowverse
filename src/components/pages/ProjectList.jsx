import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { projectService } from "@/services/api/projectService"
import Header from "@/components/organisms/Header"
import ProjectModal from "@/components/molecules/ProjectModal"
import Error from "@/components/ui/Error"
import Loading from "@/components/ui/Loading"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import { toast } from "react-toastify"

const ProjectList = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError("")
      const projectsData = await projectService.getAll()
      setProjects(projectsData)
    } catch (err) {
      setError("Failed to load projects. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects
    
    const query = searchQuery.toLowerCase()
    return projects.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.status.toLowerCase().includes(query)
    )
  }, [projects, searchQuery])

  const handleSaveProject = async (projectData) => {
    try {
      if (editingProject) {
        const updatedProject = await projectService.update(editingProject.Id, projectData)
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project.Id === editingProject.Id ? updatedProject : project
          )
        )
        toast.success("Project updated successfully!")
      } else {
        const newProject = await projectService.create(projectData)
        setProjects(prevProjects => [newProject, ...prevProjects])
        toast.success("Project created successfully!")
      }
      setIsModalOpen(false)
      setEditingProject(null)
    } catch (err) {
      toast.error("Failed to save project")
      throw err
    }
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return
    }
    
    try {
      await projectService.delete(projectId)
      setProjects(prevProjects => prevProjects.filter(project => project.Id !== projectId))
      toast.success("Project deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete project")
    }
  }

  const handleAddProject = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="h-full">
        <Header 
          onAddTask={handleAddProject}
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
          onAddTask={handleAddProject}
          onSearch={setSearchQuery}
          totalTasks={0}
          completedTasks={0}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadProjects} />
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
        onAddTask={handleAddProject}
        onSearch={setSearchQuery}
        totalTasks={projects.length}
        completedTasks={projects.filter(p => p.status === 'completed').length}
      />

      <div className="flex-1 p-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600 text-sm mt-1">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} found
          </p>
        </motion.div>

        {filteredProjects.length === 0 ? (
          <Empty
            title={searchQuery ? "No matching projects found" : "No projects yet"}
            description={searchQuery ? "Try adjusting your search terms" : "Create your first project to get started"}
            actionLabel="Add Project"
            onAction={handleAddProject}
          />
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.Id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 task-shadow hover:task-shadow-hover transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Priority:</span>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>

                  {project.dueDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Due:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditProject(project)}
                      className="text-gray-500 hover:text-primary-600"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(project.Id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                  
                  {project.teamSize && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <ApperIcon name="Users" size={14} />
                      <span>{project.teamSize}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
        project={editingProject}
      />
    </motion.div>
  )
}

export default ProjectList