"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/admin/login" />
  }

  return children
}

export default AdminRoute

