import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No tasks found",
  description = "Create your first task to get started",
  actionText = "Add Task",
  onAction,
  icon = "CheckSquare",
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-16 px-6 ${className}`}
    >
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-amber-100 rounded-full flex items-center justify-center">
          <ApperIcon 
            name={icon} 
            size={40} 
            className="text-purple-500"
          />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        
        {onAction && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAction}
            className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-accent-400 to-accent-500 text-white font-semibold rounded-xl hover:from-accent-500 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" size={18} />
            <span>{actionText}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default Empty