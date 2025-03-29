"use client";

import { useNavigate } from "react-router-dom";
import { FiMenu, FiBell, FiUser, FiLogOut } from "react-icons/fi";

function Header({ title }) {
  const navigate = useNavigate(); // Use React Router for navigation

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear authentication token
    navigate("/"); // Redirect to login page
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <FiMenu className="block h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiBell className="h-6 w-6" />
            </button>

            {/* Profile Icon (Redirects to Profile Page) */}
            <button
              type="button"
              className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate("/profile")} // Use navigate instead of router.push
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <FiUser className="h-5 w-5 text-gray-500" />
              </div>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              className="flex items-center text-sm text-gray-700 hover:text-red-600 focus:outline-none"
              onClick={handleLogout}
            >
              <FiLogOut className="h-5 w-5 mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;









// "use client"

// import { useState } from "react"
// import { FiMenu, FiBell, FiUser } from "react-icons/fi"
// // import { useAuth } from "../../hooks/useAuth"

// function Header({ title }) {
//   // const { user } = useAuth()
//   const [showProfileMenu, setShowProfileMenu] = useState(false)
//   const [showMobileMenu, setShowMobileMenu] = useState(false)

//   return (
//     <header className="bg-white shadow-sm z-10">
//       <div className="px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <button
//               type="button"
//               className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
//               onClick={() => setShowMobileMenu(!showMobileMenu)}
//             >
//               <span className="sr-only">Open main menu</span>
//               <FiMenu className="block h-6 w-6" />
//             </button>
//             <div className="flex-shrink-0 flex items-center">
//               <h1 className="text-xl font-bold text-gray-800">{title}</h1>
//             </div>
//           </div>
//           <div className="flex items-center">
//             <button
//               type="button"
//               className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <span className="sr-only">View notifications</span>
//               <FiBell className="h-6 w-6" />
//             </button>

//             {/* Profile dropdown */}
//             <div className="ml-3 relative">
//               <div>
//                 <button
//                   type="button"
//                   className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   id="user-menu"
//                   aria-expanded="false"
//                   aria-haspopup="true"
//                   onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 >
//                   <span className="sr-only">Open user menu</span>
//                   <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
//                     <FiUser className="h-5 w-5 text-gray-500" />
//                   </div>
//                 </button>
//               </div>

//               {showProfileMenu && (
//                 <div
//                   className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
//                   role="menu"
//                   aria-orientation="vertical"
//                   aria-labelledby="user-menu"
//                 >
//                   <div className="block px-4 py-2 text-sm text-gray-700">{user?.email}</div>
//                   <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
//                     Your Profile
//                   </a>
//                   <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
//                     Settings
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {showMobileMenu && (
//         <div className="md:hidden">
//           <div className="pt-2 pb-3 space-y-1">
//             <a
//               href="/"
//               className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
//             >
//               Dashboard
//             </a>
//             <a
//               href="/products"
//               className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
//             >
//               Products
//             </a>
//             <a
//               href="/categories"
//               className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
//             >
//               Categories
//             </a>
//             <a
//               href="/orders"
//               className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
//             >
//               Orders
//             </a>
//           </div>
//         </div>
//       )}
//     </header>
//   )
// }
// export default Header
