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
      
      {/* Add Logout Button in top-right corner */}
      <div className="fixed top-4 right-4 z-50">
        {window.ApperSDK && (
          <button
            onClick={async () => {
              try {
                const { ApperUI } = window.ApperSDK
                await ApperUI.logout()
                window.location.reload()
              } catch (error) {
                console.error("Logout failed:", error)
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Logout
          </button>
        )}
      </div>
      
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