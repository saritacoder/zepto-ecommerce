"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!currentUser) {
    return <Navigate to="/user/login" />
  }

  return children
}

export default ProtectedRoute




////////////  ye avi ka code h - 21.3  time - 17.7 is se phele create kiya 
//  issue ye h ki uper code or jo avi code diye use me changes h


// "use client"
// import { Navigate } from "react-router-dom"
// import { useAuth } from "../contexts/AuthContext"

// export default function ProtectedRoute({ children, requireAdmin = false }) {
//   const { currentUser, loading, userRole } = useAuth()

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   if (!currentUser) {
//     return <Navigate to="/login" />
//   }

//   if (requireAdmin && userRole !== "admin") {
//     return <Navigate to="/" />
//   }

//   return children
// }

