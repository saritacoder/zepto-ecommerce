

"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "../../firebase/config"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"
import { ShoppingBag, Grid, List } from "lucide-react"

const ProductListing = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const categoryId = queryParams.get("category")
  const urlSearchTerm = queryParams.get("search") || ""

  const { currentUser, logout } = useAuth()
  const { addToCart, getCartItemsCount } = useCart()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm)
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState("grid")
  const [priceRange, setPriceRange] = useState([0, 10000])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, "categories"))
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setCategories(categoriesData)

        // Fetch products
        let productsQuery

        if (categoryId) {
          productsQuery = query(collection(db, "products"), where("categoryId", "==", categoryId), orderBy("name"))
        } else {
          productsQuery = query(collection(db, "products"), orderBy("name"))
        }

        const productsSnapshot = await getDocs(productsQuery)
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setProducts(productsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load products")
        setLoading(false)
      }
    }

    fetchData()
  }, [categoryId])

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId)
    }
  }, [categoryId])

  // Update searchTerm when URL search parameter changes
  useEffect(() => {
    const urlSearchTerm = queryParams.get("search") || ""
    setSearchTerm(urlSearchTerm)
  }, [location.search, queryParams])

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const handlePriceRangeChange = (e, index) => {
    const newRange = [...priceRange]
    newRange[index] = Number.parseInt(e.target.value)
    setPriceRange(newRange)
  }

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

    return matchesSearch && matchesCategory && matchesPrice
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    } else if (sortBy === "price-low") {
      return a.price - b.price
    } else if (sortBy === "price-high") {
      return b.price - a.price
    }
    return 0
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header commented out in original code */}

      <main className="container mx-auto px-4 py-8">
        {/* Always show filters sidebar and main content in the same layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Always visible */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4 h-fit">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(e, 0)}
                />
                <span>to</span>
                <input
                  type="number"
                  min="0"
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(e, 1)}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("")
                  setPriceRange([0, 10000])
                  
                  // Clear search by navigating to the base URL
                  const searchParams = new URLSearchParams(location.search)
                  searchParams.delete("search")
                  const newUrl = `${location.pathname}?${searchParams.toString()}`
                  window.location.href = newUrl
                }}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Products Content */}
          <div className="flex-1">
            {searchTerm ? (
              // Search Results Section
              <div className="w-full">
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1">
                      <h1 className="text-2xl font-bold text-indigo-600">Search Results for: "{searchTerm}"</h1>
                    </div>
                    <button
                      onClick={() => {
                        // Clear search by navigating to the base URL
                        const searchParams = new URLSearchParams(location.search)
                        searchParams.delete("search")
                        const newUrl = `${location.pathname}?${searchParams.toString()}`
                        window.location.href = newUrl
                      }}
                      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}

                {sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <Link to={`/products/${product.id}`}>
                          <div className="h-48 overflow-hidden">
                            <img
                              src={product.imageUrl || "/placeholder.svg?height=192&width=100%"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link to={`/products/${product.id}`}>
                            <h3 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
                            <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                          </Link>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-600">₹{product.price}</span>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">
                      No products match your search for "{searchTerm}". Try a different search term.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Regular Products View (when no search is active)
              <>
                {/* <div className="bg-white rounded-lg shadow-md p-4 mb-6"> */}
                <div className="bg-gradient-to-r from-purple-50 to-gray-100 shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1">
                      <h1 className="text-2xl font-bold text-indigo-600">ALL PRODUCTS</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-full md:w-48">
                        <select
                          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={sortBy}
                          onChange={handleSortChange}
                        >
                          <option value="name">Sort by Name</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                        </select>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`p-2 rounded-md ${viewMode === "grid" ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:text-gray-500"}`}
                        >
                          <Grid className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={`p-2 rounded-md ${viewMode === "list" ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:text-gray-500"}`}
                        >
                          <List className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div
                    className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}

                {sortedProducts.length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <Link to={`/products/${product.id}`}>
                            <div className="h-48 overflow-hidden">
                              <img
                                src={product.imageUrl || "/placeholder.svg?height=192&width=100%"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>
                          <div className="p-4">
                            <Link to={`/products/${product.id}`}>
                              <h3 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
                              <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                            </Link>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-600">₹{product.price}</span>
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row">
                            <Link to={`/products/${product.id}`} className="md:w-1/4">
                              <div className="h-48 md:h-full overflow-hidden">
                                <img
                                  src={product.imageUrl || "/placeholder.svg?height=192&width=100%"}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </Link>
                            <div className="p-4 flex-1 flex flex-col">
                              <Link to={`/products/${product.id}`}>
                                <h3 className="font-medium text-gray-800 mb-1">{product.name}</h3>
                              </Link>
                              <p className="text-gray-500 text-sm mb-2 flex-grow">{product.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-indigo-600">₹{product.price}</span>
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || selectedCategory || priceRange[0] > 0 || priceRange[1] < 10000
                        ? "Try adjusting your search or filter criteria"
                        : "Products will appear here once they are added"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductListing


