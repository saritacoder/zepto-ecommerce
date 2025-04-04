import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";

const CategoryDetailsProduct = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (categoryId) {
          const productsQuery = query(
            collection(db, "products"),
            where("categoryId", "==", categoryId),
            orderBy("name")
          );
          const productsSnapshot = await getDocs(productsQuery);
          const productsData = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(productsData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Category Products</h2>
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.imageUrl || "/placeholder.svg?height=192&width=256"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 truncate">
                    {product.name}
                  </h3>
                  <p className="text-indigo-600 font-bold">₹{product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No products found for this category.</div>
        )}
      </main>
    </div>
  );
};

export default CategoryDetailsProduct;
