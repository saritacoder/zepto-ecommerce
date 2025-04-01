import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";
// import CartIcon from "../../assets/cart-icon.svg"; // Ensure this points to the correct cart icon
// import CartIcon from "./..assets/CartIcon.png"
import img from "../../assets/img.png"

const Header = ({ handleLogout }) => {
  const { getCartItemsCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search functionality here
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/user" className="flex items-center">
          <h1 className="text-2xl font-bold text-indigo-600">QuickMart</h1>
        </Link>

        {/* <div className="flex items-center space-x-4">
        
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="px-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          /> */}



<div className="flex items-center space-x-4">
  {/* Search Bar */}
  <input
    type="text"
    placeholder="Search..."
    value={searchQuery}
    onChange={handleSearch}
    className="px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />



          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative">
            <img src={img} alt="Cart" className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getCartItemsCount()}
            </span>
          </Link>

          {/* User Profile */}
          <div className="relative group">
            <button className="flex items-center space-x-1">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Orders
              </Link>
              <Link to="/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Addresses
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;




// import { Link } from "react-router-dom";
// import { ShoppingBag, User } from "lucide-react";
// import { useCart } from "../../contexts/CartContext";

// const Header = ({ handleLogout }) => {
//   const { getCartItemsCount } = useCart(); // ✅ Extract from context

//   return (
//     <header className="bg-white shadow-sm">
//       <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//         <Link to="/user" className="flex items-center">
//           <h1 className="text-2xl font-bold text-indigo-600">QuickMart</h1>
//         </Link>

//         <div className="flex items-center space-x-4">
//           <Link to="/cart" className="relative">
//             <ShoppingBag className="h-6 w-6 text-gray-600" />
//             <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//               {getCartItemsCount()} {/* ✅ Use function from context */}
//             </span>
//           </Link>

//           <div className="relative group">
//             <button className="flex items-center space-x-1">
//               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
//                 <User className="h-5 w-5 text-indigo-600" />
              
//               </div>
//             </button>

//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
//               <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                 Profile
//               </Link>
//               <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                 Orders
//               </Link>
//               <Link to="/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                 Addresses
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 Sign Out
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;







