

"use client"

import { useRef } from "react"
import { Link } from "react-router-dom"
import { ShoppingBag, ShieldCheck } from "lucide-react"

const HomePage = () => {
  const containerRef = useRef(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-500">
      {/* <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
           
          </div>
        </div>
      </header> */}

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to QuickMart</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your one-stop shop for quick deliveries of groceries, electronics, and more!
          </p>
        </div>

        <div ref={containerRef} className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
          
          {/* === ADMIN UI (Login & SignUp) === */}
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Are you an Admin?</h3>
              <p className="text-gray-600 mb-6">
                Manage products, categories, and orders. Keep track of your store's performance.
              </p>
              <div className="flex gap-4">
                {/* === Admin Login Button === */}
                <Link
                  to="/admin/login"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Login
                </Link>
                {/* === Admin SignUp Button === */}
                <Link
                  to="/admin/signup"
                  className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* === USER UI (Login & SignUp) === */}
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Are you a User?</h3>
              <p className="text-gray-600 mb-6">
                Browse products, add to cart, and place orders with just a few clicks.
              </p>
              <div className="flex gap-4">
                {/* === User Login Button === */}
                <Link
                  to="/user/login"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Login
                </Link>
                {/* === User SignUp Button === */}
                <Link
                  to="/user/signup"
                  className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Why Choose QuickMart?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">Fast Delivery</h4>
              <p className="text-gray-600">Get your products delivered in minutes, not days.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">Wide Selection</h4>
              <p className="text-gray-600">From groceries to electronics, we have it all.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">Easy Payments</h4>
              <p className="text-gray-600">Cash on delivery and other payment options available.</p>
            </div>
          </div>
        </div>
      </main>

      {/* <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">QuickMart</h2>
            <p className="mb-4">© 2025 QuickMart. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  )
}

export default HomePage
