import { motion } from "framer-motion"

const Loading = ({ className = "" }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg animate-pulse" />
      </div>
      
      {/* Task Cards Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 task-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="w-5 h-5 bg-gray-200 rounded border-2 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
                  <div className="h-6 w-16 bg-gradient-to-r from-amber-200 to-amber-300 rounded-full animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-5 w-20 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Loading