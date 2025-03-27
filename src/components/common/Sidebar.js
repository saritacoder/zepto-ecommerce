"use client"
import { Link, useLocation } from "react-router-dom"
import { FiHome, FiPackage, FiGrid, FiShoppingBag, FiLogOut, FiSettings } from "react-icons/fi"
import { signOut } from "firebase/auth"
import { auth } from "../../services/firebase"

export default function Sidebar() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      // Redirect is handled by the AuthContext
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-white text-2xl font-bold">SwiftMart</span>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              <Link
                to="/"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/") ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <FiHome className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/products"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/products") || isActive("/add-product") || location.pathname.includes("/edit-product")
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <FiPackage className="mr-3 h-5 w-5" />
                Products
              </Link>
              <Link
                to="/categories"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/categories")
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <FiGrid className="mr-3 h-5 w-5" />
                Categories
              </Link>
              <Link
                to="/orders"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/orders") || location.pathname.includes("/orders/")
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <FiShoppingBag className="mr-3 h-5 w-5" />
                Orders
              </Link>
              <Link
                to="/settings"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/settings") ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <FiSettings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

