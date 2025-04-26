


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

 
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }


  useEffect(() => {

    if (location.pathname.includes("/user")) {
  
      const searchParams = new URLSearchParams(location.search)

      if (searchQuery) {
        searchParams.set("search", searchQuery)
      } else {
        searchParams.delete("search")
      }

    
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
      handleLogout() 
    }

    navigate("/user/login")
  }

  // Do not render header on homepage
  // if (location.pathname === "/") {
  //   return null;
  // }

  return (
    // <header className=" bg-white shadow-md" >
    //   <div className="container mx-auto flex items-center justify-between py-4 px-6 " >
    <header className="bg-gradient-to-r from-purple-50 to-indigo-500 shadow-md">
  <div className="container mx-auto flex items-center justify-between py-4 px-6">
        
        
        <Link to="/" className="flex items-center">
          
          <span className="font-bold text-xl text-blue-600">QuickMart</span>
        </Link>

        {/* Icons and Search Container */}
        <div className="flex items-center space-x-4">
         
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
