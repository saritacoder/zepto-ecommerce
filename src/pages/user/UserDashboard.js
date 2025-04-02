// import React from 'react';
// import { Link } from 'react-router-dom'; 
//  import { useRef, useEffect, useState } from "react"

//   import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
//   import { db } from "../../firebase/config"
//   import { useAuth } from "../../contexts/AuthContext"

//   import { ShoppingBag, Package, User } from "lucide-react";
//   import { useCart } from "../../contexts/CartContext"
//   import ProductListing from './ProductListing';



//   const UserDashboard = () => {
//     const { currentUser, logout } = useAuth();
//     const { getCartItemsCount } = useCart();
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [categories, setCategories] = useState([]);
//     const [featuredProducts, setFeaturedProducts] = useState([]);
//     const categoriesRef = useRef(null);

//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           // Fetch user's recent orders
//           const ordersQuery = query(
//             collection(db, "orders"),
//             where("userId", "==", currentUser.uid),
//             orderBy("createdAt", "desc"),
//             limit(5),
//           );

//           const ordersSnapshot = await getDocs(ordersQuery);
//           const ordersData = ordersSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));

//           setOrders(ordersData);

//           // Fetch categories
//           const categoriesSnapshot = await getDocs(collection(db, "categories"));
//           const categoriesData = categoriesSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));

//           setCategories(categoriesData);

//           // Fetch featured products
//           const productsQuery = query(collection(db, "products"), where("featured", "==", true), limit(8));

//           const productsSnapshot = await getDocs(productsQuery);
//           const productsData = productsSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));

//           setFeaturedProducts(productsData);

//           setLoading(false);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//           setLoading(false);
//         }
//       };

//       fetchData();
//     }, [currentUser]);

//     const scrollCategories = (direction) => {
//       if (categoriesRef.current) {
//         const scrollAmount = direction === "left" ? -200 : 200;
//         categoriesRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
//       }
//     };

//     const handleLogout = async () => {
//       try {
//         await logout();
//       } catch (error) {
//         console.error("Failed to log out", error);
//       }
//     };

//     if (loading) {
//       return (
//         <div className="flex items-center justify-center h-screen">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//       );
//     }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="container mx-auto px-4 py-8">
//         <section className="mb-10">
//           <div className="flex items-center justify-between mb-6 min-w-0">
//             <h2 className="text-2xl font-bold text-gray-800 w-full truncate">Categories</h2>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => scrollCategories("left")}
//                 className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path
//                     fillRule="evenodd"
//                     d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//               <button
//                 onClick={() => scrollCategories("right")}
//                 className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path
//                     fillRule="evenodd"
//                     d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           <div ref={categoriesRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//             {categories.length > 0 ? (
//               categories.map((category) => (
//                 <Link key={category.id} to={`/products?category=${category.id}`} className="flex-shrink-0 group">
//                   <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow">
//                     <img
//                       src={category.imageUrl || "/placeholder.svg?height=96&width=96"}
//                       alt={category.name}
//                       className="w-12 h-12 object-contain"
//                     />
//                   </div>
//                   <p className="text-sm text-center text-gray-700">{category.name}</p>
//                 </Link>
//               ))
//             ) : (
//               <div className="text-gray-500">No categories found</div>
//             )}
//           </div>
//         </section>

//         {/* New Banner Section */}
//         <section className="mb-10">
//           <div className="relative overflow-hidden rounded-lg">
//             <img 
//               src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
//               alt="Big Sale Banner"
//               className="w-full h-[300px] object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-pink-500/50">
//               <div className="h-full flex flex-col justify-center px-8">
//                 <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">BIG SALE</h2>
//                 <p className="text-xl md:text-2xl text-white mb-6">Up to 75% off on selected items</p>
//                 <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold w-fit hover:bg-purple-50 transition-colors">
//                   Shop Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>

       
//       </main>
//       <ProductListing />
//     </div>
//   );
// }

// export default UserDashboard;





// // code sahi h search implement kar rahi search isme h hi ni


//   // import { useRef, useEffect, useState } from "react"
//   // import { Link } from "react-router-dom"
//   // import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
//   // import { db } from "../../firebase/config"
//   // import { useAuth } from "../../contexts/AuthContext"

//   // import { ShoppingBag, Package, User } from "lucide-react";
//   // import { useCart } from "../../contexts/CartContext"



//   // const UserDashboard = () => {
//   //   const { currentUser, logout } = useAuth();
//   //   const { getCartItemsCount } = useCart();
//   //   const [orders, setOrders] = useState([]);
//   //   const [loading, setLoading] = useState(true);
//   //   const [categories, setCategories] = useState([]);
//   //   const [featuredProducts, setFeaturedProducts] = useState([]);
//   //   const categoriesRef = useRef(null);

//   //   useEffect(() => {
//   //     const fetchData = async () => {
//   //       try {
//   //         // Fetch user's recent orders
//   //         const ordersQuery = query(
//   //           collection(db, "orders"),
//   //           where("userId", "==", currentUser.uid),
//   //           orderBy("createdAt", "desc"),
//   //           limit(5),
//   //         );

//   //         const ordersSnapshot = await getDocs(ordersQuery);
//   //         const ordersData = ordersSnapshot.docs.map((doc) => ({
//   //           id: doc.id,
//   //           ...doc.data(),
//   //         }));

//   //         setOrders(ordersData);

//   //         // Fetch categories
//   //         const categoriesSnapshot = await getDocs(collection(db, "categories"));
//   //         const categoriesData = categoriesSnapshot.docs.map((doc) => ({
//   //           id: doc.id,
//   //           ...doc.data(),
//   //         }));

//   //         setCategories(categoriesData);

//   //         // Fetch featured products
//   //         const productsQuery = query(collection(db, "products"), where("featured", "==", true), limit(8));

//   //         const productsSnapshot = await getDocs(productsQuery);
//   //         const productsData = productsSnapshot.docs.map((doc) => ({
//   //           id: doc.id,
//   //           ...doc.data(),
//   //         }));

//   //         setFeaturedProducts(productsData);

//   //         setLoading(false);
//   //       } catch (error) {
//   //         console.error("Error fetching data:", error);
//   //         setLoading(false);
//   //       }
//   //     };

//   //     fetchData();
//   //   }, [currentUser]);

//   //   const scrollCategories = (direction) => {
//   //     if (categoriesRef.current) {
//   //       const scrollAmount = direction === "left" ? -200 : 200;
//   //       categoriesRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
//   //     }
//   //   };

//   //   const handleLogout = async () => {
//   //     try {
//   //       await logout();
//   //     } catch (error) {
//   //       console.error("Failed to log out", error);
//   //     }
//   //   };

//   //   if (loading) {
//   //     return (
//   //       <div className="flex items-center justify-center h-screen">
//   //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//   //       </div>
//   //     );
//   //   }

//   //   return (
//   //     <div className="min-h-screen bg-gray-50">
       

//   //       <main className="container mx-auto px-4 py-8">
//   //         <section className="mb-10">
//   //           <div className="flex items-center justify-between mb-6">
//   //             <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
//   //             <div className="flex space-x-2">
//   //               <button
//   //                 onClick={() => scrollCategories("left")}
//   //                 className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
//   //               >
//   //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//   //                   <path
//   //                     fillRule="evenodd"
//   //                     d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//   //                     clipRule="evenodd"
//   //                   />
//   //                 </svg>
//   //               </button>
//   //               <button
//   //                 onClick={() => scrollCategories("right")}
//   //                 className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
//   //               >
//   //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//   //                   <path
//   //                     fillRule="evenodd"
//   //                     d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//   //                     clipRule="evenodd"
//   //                   />
//   //                 </svg>
//   //               </button>
//   //             </div>
//   //           </div>

//   //           <div ref={categoriesRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//   //             {categories.length > 0 ? (
//   //               categories.map((category) => (
//   //                 <Link key={category.id} to={`/products?category=${category.id}`} className="flex-shrink-0 group">
//   //                   <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow">
//   //                     <img
//   //                       src={category.imageUrl || "/placeholder.svg?height=96&width=96"}
//   //                       alt={category.name}
//   //                       className="w-12 h-12 object-contain"
//   //                     />
//   //                   </div>
//   //                   <p className="text-sm text-center text-gray-700">{category.name}</p>
//   //                 </Link>
//   //               ))
//   //             ) : (
//   //               <div className="text-gray-500">No categories found</div>
//   //             )}
//   //           </div>
//   //         </section>

//   //         <section className="mb-10">
//   //           <div className="flex items-center justify-between mb-6">
//   //             <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
//   //             <Link to="/products" className="text-indigo-600 hover:text-indigo-800">
//   //               View All
//   //             </Link>
//   //           </div>

//   //           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//   //             {featuredProducts.length > 0 ? (
//   //               featuredProducts.map((product) => (
//   //                 <Link
//   //                   key={product.id}
//   //                   to={`/products/${product.id}`}
//   //                   className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//   //                 >
//   //                   <div className="h-40 overflow-hidden">
//   //                     <img
//   //                       src={product.imageUrl || "/placeholder.svg?height=160&width=160"}
//   //                       alt={product.name}
//   //                       className="w-full h-full object-cover"
//   //                     />
//   //                   </div>
//   //                   <div className="p-4">
//   //                     <h3 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
//   //                     <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
//   //                     <div className="flex items-center justify-between">
//   //                       <span className="font-bold text-indigo-600">₹{product.price}</span>
//   //                       <button className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Add</button>
//   //                     </div>
//   //                   </div>
//   //                 </Link>
//   //               ))
//   //             ) : (
//   //               <div className="col-span-full text-gray-500">No featured products found</div>
//   //             )}
//   //           </div>
//   //         </section>

         
//   //       </main>
//   //     </div>
//   //   );
//   // };

//   // export default UserDashboard;




// // // Recent orders 

// //    {/* <section>
// //             <div className="flex items-center justify-between mb-6">
// //               <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
// //               <Link to="/orders" className="text-indigo-600 hover:text-indigo-800">
// //                 View All
// //               </Link>
// //             </div>

// //             {orders.length > 0 ? (
// //               <div className="bg-white rounded-lg shadow-md overflow-hidden">
// //                 <div className="overflow-x-auto">
// //                   <table className="min-w-full divide-y divide-gray-200">
// //                     <thead className="bg-gray-50">
// //                       <tr>
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                           Order ID
// //                         </th>
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                           Date
// //                         </th>
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                           Status
// //                         </th>
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                           Total
// //                         </th>
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                           Actions
// //                         </th>
// //                       </tr>
// //                     </thead>
// //                     <tbody className="bg-white divide-y divide-gray-200">
// //                       {orders.map((order) => (
// //                         <tr key={order.id}>
// //                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                             #{order.id.slice(0, 8)}
// //                           </td>
// //                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                             {new Date(order.createdAt).toLocaleDateString()}
// //                           </td>
// //                           <td className="px-6 py-4 whitespace-nowrap">
// //                             <span
// //                               className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
// //                                 order.status === "delivered"
// //                                   ? "bg-green-100 text-green-800"
// //                                   : order.status === "shipped"
// //                                     ? "bg-blue-100 text-blue-800"
// //                                     : order.status === "processing"
// //                                       ? "bg-yellow-100 text-yellow-800"
// //                                       : "bg-gray-100 text-gray-800"
// //                               }`}
// //                             >
// //                               {order.status}
// //                             </span>
// //                           </td>
// //                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total}</td>
// //                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// //                             <Link to={`/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
// //                               View
// //                             </Link>
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </div>
// //             ) : (
// //               <div className="bg-white rounded-lg shadow-md p-6 text-center">
// //                 <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// //                 <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
// //                 <p className="text-gray-500 mb-4">Start shopping to place your first order</p>
// //                 <Link
// //                   to="/products"
// //                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
// //                 >
// //                   Browse Products
// //                 </Link>
// //               </div>
// //             )}
// //           </section> */}





import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { ShoppingBag, Package, User } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import ProductListing from "./ProductListing";

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const categoriesRef = useRef(null);
  
  const location = useLocation();
  
  // Check if a search query is present in the URL
  const searchParams = new URLSearchParams(location.search);
  const hideBanner = searchParams.has("search") && searchParams.get("search").trim() !== "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's recent orders
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);

        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);

        // Fetch featured products
        const productsQuery = query(
          collection(db, "products"),
          where("featured", "==", true),
          limit(8)
        );
        const productsSnapshot = await getDocs(productsQuery);
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeaturedProducts(productsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      categoriesRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Categories Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6 min-w-0">
            <h2 className="text-2xl font-bold text-gray-800 w-full truncate">Categories</h2>
            <div className="flex space-x-2">
              <button onClick={() => scrollCategories("left")} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button onClick={() => scrollCategories("right")} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={categoriesRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link key={category.id} to={`/products?category=${category.id}`} className="flex-shrink-0 group">
                  <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow">
                    <img
                      src={category.imageUrl || "/placeholder.svg?height=96&width=96"}
                      alt={category.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <p className="text-sm text-center text-gray-700">{category.name}</p>
                </Link>
              ))
            ) : (
              <div className="text-gray-500">No categories found</div>
            )}
          </div>
        </section>

        {/* Banner Section: Hide if a search is active */}
        {!hideBanner && (
          <section className="mb-10">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80"
                alt="Big Sale Banner"
                className="w-full h-[300px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-pink-500/50">
                <div className="h-full flex flex-col justify-center px-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">BIG SALE</h2>
                  <p className="text-xl md:text-2xl text-white mb-6">Up to 75% off on selected items</p>
                  <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold w-fit hover:bg-purple-50 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>
      <ProductListing />
    </div>
  );
};

export default UserDashboard;
