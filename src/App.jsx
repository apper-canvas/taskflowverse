import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import TaskBoard from "@/components/pages/TaskBoard"
import ProjectList from "@/components/pages/ProjectList"

function App() {
  return (
    <>
      <Router>
<Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TaskBoard />} />
            <Route path="category/:categoryName" element={<TaskBoard />} />
            <Route path="today" element={<TaskBoard filterType="today" />} />
            <Route path="upcoming" element={<TaskBoard filterType="upcoming" />} />
            <Route path="completed" element={<TaskBoard filterType="completed" />} />
            <Route path="projects" element={<ProjectList />} />
          </Route>
        </Routes>
      </Router>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="custom-toast"
        style={{ zIndex: 9999 }}
      />
    </>
  )
}

export default App