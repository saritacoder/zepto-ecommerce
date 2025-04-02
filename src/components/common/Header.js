// "use client"

// import { Link, useNavigate, useLocation } from "react-router-dom"
// import { User } from "lucide-react"
// import { useCart } from "../../contexts/CartContext"
// import { useState, useEffect } from "react"
// import img from "../../assets/img.png"

// const Header = ({ handleLogout }) => {
//   const { getCartItemsCount } = useCart()
//   const [searchQuery, setSearchQuery] = useState("")
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const navigate = useNavigate()
//   const location = useLocation()

//   // Handle search input change
//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value)
//   }

//   // Apply search when input changes
//   useEffect(() => {
//     // Only apply search if we're on the products page
//     if (location.pathname.includes("/user")) {
//       // Create or update the search parameter
//       const searchParams = new URLSearchParams(location.search)

//       if (searchQuery) {
//         searchParams.set("search", searchQuery)
//       } else {
//         searchParams.delete("search")
//       }

//       // Update the URL with the search parameter
//       const newUrl = `${location.pathname}?${searchParams.toString()}`
//       navigate(newUrl, { replace: true })
//       // invisible
//     }
//   }, [searchQuery, location.pathname, navigate])

//   const handleNavigation = (e, path) => {
//     e.preventDefault()
//     setIsDropdownOpen(false)
//     navigate(path)
//   }

//   const handleSignOut = () => {
//     setIsDropdownOpen(false)

//     if (typeof handleLogout === "function") {
//       handleLogout() // Clear authentication state
//     }

//     navigate("/user/login") // Redirect to user login page
//   }

//   return (
//     <header className="bg-white shadow-md">
//       <div className="container mx-auto flex items-center justify-between py-4 px-6">
//         <Link to="/" className="flex items-center">
//           <img src={img || "/placeholder.svg"} alt="Logo" className="h-8 mr-2" />
//           <span className="font-bold text-xl">E-Commerce</span>
//         </Link>

//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <svg
//               className="w-4 h-4 text-gray-500 dark:text-gray-400"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//               />
//             </svg>
//           </div>
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={handleSearch}
//             className="w-[200px] px-2 py-2 pl-10 border border-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         <div className="flex items-center space-x-4">
//           <Link to="/cart" className="relative">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="1.5"
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h9.478c.896 0 1.708-.586 1.975-1.409l.97-3.654A2.24 2.24 0 0 0 16.83 5.66l-.008-.042a1.5 1.5 0 0 0-1.029-1.105L11 9.677M4.5 3.007l1.199 4.497"
//               />
//             </svg>
//             {getCartItemsCount() > 0 && (
//               <span className="absolute top-[-4px] right-[-4px] bg-red-500 text-white rounded-full px-2 text-xs">
//                 {getCartItemsCount()}
//               </span>
//             )}
//           </Link>

//           <div className="relative inline-block text-left">
//             <div>
//               <button
//                 type="button"
//                 className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 id="menu-button"
//                 aria-expanded={isDropdownOpen}
//                 aria-haspopup="true"
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               >
//                 <User />
//                 <svg
//                   className="-mr-1 ml-2 h-5 w-5"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>

//             {isDropdownOpen && (
//               <div
//                 className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
//                 role="menu"
//                 aria-orientation="vertical"
//                 aria-labelledby="menu-button"
//                 tabIndex="-1"
//               >
//                 <div className="py-1" role="none">
//                   <a
//                     href="/user/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                     role="menuitem"
//                     tabIndex="-1"
//                     id="menu-item-0"
//                     onClick={(e) => handleNavigation(e, "/user/profile")}
//                   >
//                     Profile
//                   </a>
//                   <a
//                     href="/user/orders"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                     role="menuitem"
//                     tabIndex="-1"
//                     id="menu-item-1"
//                     onClick={(e) => handleNavigation(e, "/user/orders")}
//                   >
//                     Orders
//                   </a>
//                   <button
//                     type="submit"
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                     role="menuitem"
//                     tabIndex="-1"
//                     id="menu-item-2"
//                     onClick={handleSignOut}
//                   >
//                     Sign out
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Header







// // import { Link, useNavigate } from "react-router-dom";
// // import { User } from "lucide-react";
// // import { useCart } from "../../contexts/CartContext";
// // import { useState } from "react";
// // import img from "../../assets/img.png";

// // const Header = ({ handleLogout }) => {
// //   const { getCartItemsCount } = useCart();
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// //   const navigate = useNavigate();

// //   const handleSearch = (e) => {
// //     setSearchQuery(e.target.value);
// //   };

// //   const handleNavigation = (e, path) => {
// //     e.preventDefault();
// //     setIsDropdownOpen(false);
// //     navigate(path);
// //   };

// //   const handleSignOut = () => {
// //     setIsDropdownOpen(false);

// //     if (typeof handleLogout === "function") {
// //       handleLogout(); // Clear authentication state
// //     }

// //     navigate("/user/login"); // Redirect to user login page
// //   };

// //   return (
// //     <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-50 h-14 flex items-center">
// //       <div className="container mx-auto px-4 flex items-center justify-between">
// //         <Link to="/user" className="flex items-center">
// //           <h1 className="text-2xl font-bold text-indigo-600">QuickMart</h1>
// //         </Link>

// //         <div className="flex items-center space-x-4">
          
// //           {/* Search Bar */}
// //           {/* <input
// //             type="text"
// //             placeholder="Search..."
// //             value={searchQuery}
// //             onChange={handleSearch}
// //             className="px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //           /> */}


// // <div className="relative w-full">
// //   {/* <input
// //     type="text"
// //     placeholder="Search..."
// //     value={searchQuery}
// //     onChange={handleSearch}
// //     className="w-full px-4 py-2 pl-10 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //   />
// //   <svg
// //     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
// //     fill="none"
// //     height="18px"
// //     viewBox="0 0 15 15"
// //     width="18px"
// //     xmlns="http://www.w3.org/2000/svg"
// //   >
// //     <path
// //       clipRule="evenodd"
// //       d="M2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 8.98528 8.98528 11 6.5 11C4.01472 11 2 8.98528 2 6.5ZM6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1ZM11.2669 10.4068C11.0773 10.206 10.7609 10.1969 10.5601 10.3864C10.3593 10.576 10.3502 10.8924 10.5397 11.0932L13.1368 13.8442C13.3264 14.045 13.6428 14.0541 13.8436 13.8646C14.0444 13.675 14.0535 13.3585 13.864 13.1577L11.2669 10.4068Z"
// //       fill="currentColor"
// //       fillRule="evenodd"
// //     />
// //   </svg> */}

// // <input
// //   type="text"
// //   placeholder="🔍 Search..."
// //   value={searchQuery}
// //   onChange={handleSearch}
// //   // className="w-full px-4 py-2 pl-10 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //     className="w-[300px] px-2 py-2 pl-12 border border-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // />
// // </div>




// //           {/* Cart Icon with Badge */}
// //           <Link to="/cart" className="relative">
// //             <img src={img} alt="Cart" className="h-6 w-6" />
// //             <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
// //               {getCartItemsCount()}
// //             </span>
// //           </Link>

// //           {/* User Profile */}
// //           <div className="relative">
// //             <button
// //               className="flex items-center space-x-1"
// //               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
// //             >
// //               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
// //                 <User className="h-5 w-5 text-indigo-600" />
// //               </div>
// //             </button>

// //             {/* Dropdown Menu */}
// //             {isDropdownOpen && (
// //               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
// //                 <button
// //                   onClick={(e) => handleNavigation(e, "/profile")}
// //                   className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// //                 >
// //                   Profile
// //                 </button>
// //                 <button
// //                   onClick={(e) => handleNavigation(e, "/orders")}
// //                   className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// //                 >
// //                   Orders
// //                 </button>

// //                 <button
// //                   onClick={handleSignOut}
// //                   className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// //                 >
// //                   Sign Out
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // };

// // export default Header;





// "use client"

// import { Link, useNavigate, useLocation } from "react-router-dom"
// import { User } from "lucide-react"
// import { useCart } from "../../contexts/CartContext"
// import { useState, useEffect } from "react"
// import img from "../../assets/img.png"

// const Header = ({ handleLogout }) => {
//   const { getCartItemsCount } = useCart()
//   const [searchQuery, setSearchQuery] = useState("")
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const navigate = useNavigate()
//   const location = useLocation()

//   // Handle search input change
//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value)
//   }

//   // Apply search when input changes
//   useEffect(() => {
//     // Only apply search if we're on the products page
//     if (location.pathname.includes("/user")) {
//       // Create or update the search parameter
//       const searchParams = new URLSearchParams(location.search)

//       if (searchQuery) {
//         searchParams.set("search", searchQuery)
//       } else {
//         searchParams.delete("search")
//       }

//       // Update the URL with the search parameter
//       const newUrl = `${location.pathname}?${searchParams.toString()}`
//       navigate(newUrl, { replace: true })
//       // invisible
//     }
//   }, [searchQuery, location.pathname, navigate])

//   const handleNavigation = (e, path) => {
//     e.preventDefault()
//     setIsDropdownOpen(false)
//     navigate(path)
//   }

//   const handleSignOut = () => {
//     setIsDropdownOpen(false)

//     if (typeof handleLogout === "function") {
//       handleLogout() // Clear authentication state
//     }

//     navigate("/user/login") // Redirect to user login page
//   }

//   return (
//     <header className="bg-white shadow-md">
//       <div className="container mx-auto flex items-center justify-between py-4 px-6">
//         <Link to="/" className="flex items-center">
//           {/* <img src={img || "/placeholder.svg"} alt="Logo" className="h-8 mr-2" /> */}
//           <span className="font-bold text-xl text-blue-600">QuickMart</span>
//         </Link>

//         {/* Icons and Search Container */}
//         <div className="flex items-center space-x-4">
//           {/* Search Bar placed just before the Cart Icon */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <svg
//                 className="w-4 h-4 text-gray-500 dark:text-gray-400"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//                 />
//               </svg>
//             </div>
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={handleSearch}
//               className="w-[300px] px-2 py-2 pl-10 border border-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Cart Icon */}
//           <Link to="/cart" className="relative">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
              
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="1.5"
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h9.478c.896 0 1.708-.586 1.975-1.409l.97-3.654A2.24 2.24 0 0 0 16.83 5.66l-.008-.042a1.5 1.5 0 0 0-1.029-1.105L11 9.677M4.5 3.007l1.199 4.497"
//               />
//             </svg>
//             {getCartItemsCount() > 0 && (
//               <span className="absolute top-[-4px] right-[-4px] bg-red-500 text-white rounded-full px-2 text-xs">
//                 {getCartItemsCount()}
//               </span>
//             )}
//           </Link>

//           {/* User Dropdown */}
//           <div className="relative inline-block text-left">
//             <div>
//               <button
//                 type="button"
//                 className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 id="menu-button"
//                 aria-expanded={isDropdownOpen}
//                 aria-haspopup="true"
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               >
//                 <User />
//                 <svg
//                   className="-mr-1 ml-2 h-5 w-5"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>

//             {isDropdownOpen && (
//               <div
//                 className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
//                 role="menu"
//                 aria-orientation="vertical"
//                 aria-labelledby="menu-button"
//                 tabIndex="-1"
//               >
//                 <div className="py-1" role="none">
//                   <a
//                     href="/user/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                     role="menuitem"
//                     tabIndex="-1"
//                     id="menu-item-0"
//                     onClick={(e) => handleNavigation(e, "/user/profile")}
//                   >
//                     Profile
//                   </a>
//                   <a
//                     href="/user/orders"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                     role="menuitem"
//                     tabIndex="-1"
//                     id="menu-item-1"
//                     onClick={(e) => handleNavigation(e, "/user/orders")}
//                   >
//                     Orders
//                   </a>
//                   <button
//                     type="submit"
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                     role="menuitem"
//                     tabIndex="-1"
//                     id="menu-item-2"
//                     onClick={handleSignOut}
//                   >
//                     Sign out
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Header





"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { User } from "lucide-react"
import { useCart } from "../../contexts/CartContext"
import { useState, useEffect } from "react"
import img from "../../assets/img.png"

const Header = ({ handleLogout }) => {
  const { getCartItemsCount } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  // Apply search when input changes
  useEffect(() => {
    // Only apply search if we're on the products page
    if (location.pathname.includes("/user")) {
      // Create or update the search parameter
      const searchParams = new URLSearchParams(location.search)

      if (searchQuery) {
        searchParams.set("search", searchQuery)
      } else {
        searchParams.delete("search")
      }

      // Update the URL with the search parameter
      const newUrl = `${location.pathname}?${searchParams.toString()}`
      navigate(newUrl, { replace: true })
    }
  }, [searchQuery, location.pathname, navigate])

  const handleNavigation = (e, path) => {
    e.preventDefault()
    setIsDropdownOpen(false)
    navigate(path)
  }

  const handleSignOut = () => {
    setIsDropdownOpen(false)

    if (typeof handleLogout === "function") {
      handleLogout() // Clear authentication state
    }

    navigate("/user/login") // Redirect to user login page
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="flex items-center">
          {/* <img src={img || "/placeholder.svg"} alt="Logo" className="h-8 mr-2" /> */}
          <span className="font-bold text-xl text-blue-600">QuickMart</span>
        </Link>

        {/* Icons and Search Container */}
        <div className="flex items-center space-x-4">
          {/* Search Bar placed just before the Cart Icon */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-[300px] px-2 py-2 pl-10 border border-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Replaced Cart Icon */}
          <Link to="/cart" className="relative">
            <img src={img || "/placeholder.svg"} alt="Logo" className="h-8 mr-2" />
            {getCartItemsCount() > 0 && (
              <span className="absolute top-[-4px] right-[-4px] bg-red-500 text-white rounded-full px-2 text-xs">
                {getCartItemsCount()}
              </span>
            )}
          </Link>

          {/* User Dropdown */}
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                id="menu-button"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <User />
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {isDropdownOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  <a
                    href="/user/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-0"
                    onClick={(e) => handleNavigation(e, "/profile")}
                  >
                    Profile
                  </a>
                  <a
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-1"
                    onClick={(e) => handleNavigation(e, "/orders")}
                  >
                    Orders
                  </a>
                  <button
                    type="submit"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-2"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
