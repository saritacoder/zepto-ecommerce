

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
    <div className="min-h-screen bg-gray-100">
    {/* // <div className="bg-gradient-to-r from-purple-50 to-gray-100 shadow-md"> */}
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




// "use client"

// import { useState, useEffect } from "react"

// const BannerCarousel = () => {
//   const [currentBanner, setCurrentBanner] = useState(0)
//   const banners = [
//     {
//       id: 1,
//       image:
//         "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80",
//       title: "BIG SALE",
//       description: "Up to 75% off on selected items",
//       buttonText: "Shop Now",
//     },
//     {
//       id: 2,
//       image:
//         "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80",
//       title: "NEW ARRIVALS",
//       description: "Check out our latest collection",
//       buttonText: "Explore Now",
//     },
//     {
//       id: 3,
//       image:
//         "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80",
//       title: "SUMMER COLLECTION",
//       description: "Beat the heat with our summer essentials",
//       buttonText: "View Collection",
//     },
//     {
//       id: 4,
//       image:
//         "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80",
//       title: "EXCLUSIVE DEALS",
//       description: "Limited time offers on premium products",
//       buttonText: "Shop Deals",
//     },
//     {
//       id: 5,
//       image:
//         "https://media.istockphoto.com/id/1181604824/photo/beautiful-girl-excited-after-successful-online-shopping.webp?a=1&b=1&s=612x612&w=0&k=20&c=NCCYC8wsJSeMJ_thNr8tmvrz6gJeO36KmrIIr8CCWEU=",
//       title: "CLEARANCE SALE",
//       description: "Last chance to grab your favorites",
//       buttonText: "Shop Sale",
//     },
//     {
//       id: 6,
//       image:
//         "https://images.unsplash.com/photo-1607083206599-4e0c6af85078?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80",
//       title: "PREMIUM COLLECTION",
//       description: "Luxury items at affordable prices",
//       buttonText: "Discover More",
//     },
//   ]

//   // Auto-slide functionality
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
//     }, 5000) // Change slide every 5 seconds

//     return () => clearInterval(interval)
//   }, [banners.length])

//   const goToPrevious = () => {
//     setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
//   }

//   const goToNext = () => {
//     setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
//   }

//   return (
//     <div className="relative overflow-hidden rounded-lg h-[300px]">
//       {/* Banner Images */}
//       <div
//         className="flex transition-transform duration-500 ease-in-out h-full"
//         style={{ transform: `translateX(-${currentBanner * 100}%)` }}
//       >
//         {banners.map((banner) => (
//           <div key={banner.id} className="min-w-full h-full flex-shrink-0 relative">
//             <img src={banner.image || "/placeholder.svg"} alt={banner.title} className="w-full h-full object-cover" />
//             <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-pink-500/50">
//               <div className="h-full flex flex-col justify-center px-8">
//                 <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{banner.title}</h2>
//                 <p className="text-xl md:text-2xl text-white mb-6">{banner.description}</p>
//                 <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold w-fit hover:bg-purple-50 transition-colors">
//                   {banner.buttonText}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Navigation Arrows */}
//       <button
//         onClick={goToPrevious}
//         className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm transition-all"
//         aria-label="Previous banner"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//         </svg>
//       </button>

//       <button
//         onClick={goToNext}
//         className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm transition-all"
//         aria-label="Next banner"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//         </svg>
//       </button>

//       {/* Dots Indicator */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//         {banners.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentBanner(index)}
//             className={`w-2 h-2 rounded-full transition-all ${
//               currentBanner === index ? "bg-white w-4" : "bg-white/50"
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }

// const UserDashboard = ({ hideBanner }) => {
//   return (
//     <div>
//       {/* Banner Section: Hide if a search is active */}
//       {!hideBanner && (
//         <section className="mb-10">
//           <BannerCarousel />
//         </section>
//       )}
//       {/* Rest of the dashboard content */}
//       <h1>User Dashboard</h1>
//       <p>Welcome to your dashboard!</p>
//     </div>
//   )
// }

// export default UserDashboard






