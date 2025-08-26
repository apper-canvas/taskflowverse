import { forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Checkbox = forwardRef(({ 
  className, 
  checked, 
  onChange,
  children,
  ...props 
}, ref) => {
  return (
    <div className="flex items-center space-x-3">
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        <div
          onClick={() => onChange?.({ target: { checked: !checked } })}
          className={cn(
            "w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center",
            checked 
              ? "bg-gradient-to-br from-primary-500 to-primary-600 border-primary-500" 
              : "bg-white border-gray-300 hover:border-primary-400",
            className
          )}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ApperIcon 
                name="Check" 
                size={12} 
                className="text-white" 
              />
            </motion.div>
          )}
        </div>
      </motion.div>
      {children && (
        <label 
          onClick={() => onChange?.({ target: { checked: !checked } })}
          className="cursor-pointer select-none text-sm text-gray-700"
        >
          {children}
        </label>
      )}
    </div>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox