import { useState } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"

const SearchBar = ({ onSearch, placeholder = "Search tasks...", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (value) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    onSearch("")
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <ApperIcon 
          name="Search" 
          size={16} 
          className={`transition-colors duration-200 ${
            isFocused ? "text-primary-500" : "text-gray-400"
          }`}
        />
      </div>
      
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="pl-11 pr-10"
      />
      
      {searchTerm && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
        >
          <ApperIcon 
            name="X" 
            size={14} 
            className="text-gray-400 hover:text-gray-600"
          />
        </motion.button>
      )}
    </div>
  )
}

export default SearchBar