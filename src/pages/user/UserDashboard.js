
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
  
  
  const searchParams = new URLSearchParams(location.search);
  const hideBanner = searchParams.has("search") && searchParams.get("search").trim() !== "";

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        if (currentUser) {
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
        }

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
                <Link key={category.id} to={`/category-details?category=${category.id}`} className="flex-shrink-0 group">

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

        {/* Featured Products Section */}
        {/* <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/product/${product.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.imageUrl || "/placeholder.svg?height=192&width=256"}
                      alt={product.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-indigo-600 font-bold">₹{product.price.toFixed(2)}</p>
                      {product.originalPrice && (
                        <p className="text-gray-500 line-through text-sm">₹{product.originalPrice.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500">No featured products found</div>
            )}
          </div>
        </section> */}
      </main>
      <ProductListing />
    </div>
  );
};

export default UserDashboard;























