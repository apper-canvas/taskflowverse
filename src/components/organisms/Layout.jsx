import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/organisms/Sidebar"

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        categories={[]}
        selectedCategory=""
        onCategoryChange={() => {}}
        taskStats={{}}
        isOpen={isMobileSidebarOpen}
        onToggle={toggleMobileSidebar}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="lg:ml-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout