// "use client"

// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import { collection, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore"
// import { db } from "../../firebase/config"
// import { Package, Plus, Edit, Trash2, Search } from "lucide-react"

// const ManageProducts = () => {
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [categories, setCategories] = useState({})
//   const [selectedCategory, setSelectedCategory] = useState("")

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch categories
//         const categoriesSnapshot = await getDocs(collection(db, "categories"))
//         const categoriesData = {}
//         categoriesSnapshot.docs.forEach((doc) => {
//           categoriesData[doc.id] = doc.data().name
//         })
//         setCategories(categoriesData)

//         // Fetch products
//         const productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"))
//         const productsSnapshot = await getDocs(productsQuery)
//         const productsData = productsSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }))

//         setProducts(productsData)
//         setLoading(false)
//       } catch (error) {
//         console.error("Error fetching data:", error)
//         setError("Failed to load products")
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         await deleteDoc(doc(db, "products", id))
//         setProducts(products.filter((product) => product.id !== id))
//       } catch (error) {
//         console.error("Error deleting product:", error)
//         setError("Failed to delete product")
//       }
//     }
//   }

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.description.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true

//     return matchesSearch && matchesCategory
//   })

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
//           <h1 className="text-lg font-medium text-gray-900">Manage Products</h1>
//           <Link
//             to="/admin/add-product"
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Product
//           </Link>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           {error && (
//             <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//               <span className="block sm:inline">{error}</span>
//             </div>
//           )}

//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div className="relative flex-1">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Search className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search products..."
//                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>

//                 <div className="w-full md:w-64">
//                   <select
//                     className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                   >
//                     <option value="">All Categories</option>
//                     {Object.entries(categories).map(([id, name]) => (
//                       <option key={id} value={id}>
//                         {name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {filteredProducts.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Product
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Category
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Price
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Stock
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredProducts.map((product) => (
//                       <tr key={product.id}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10">
//                               <img
//                                 className="h-10 w-10 rounded-full object-cover"
//                                 src={product.imageUrl || "/placeholder.svg?height=40&width=40"}
//                                 alt={product.name}
//                               />
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                               <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{categories[product.categoryId] || "Unknown"}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">₹{product.price}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{product.stock}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <Link
//                               to={`/admin/edit-product/${product.id}`}
//                               className="text-indigo-600 hover:text-indigo-900"
//                             >
//                               <Edit className="h-5 w-5" />
//                             </Link>
//                             <button
//                               onClick={() => handleDelete(product.id)}
//                               className="text-red-600 hover:text-red-900"
//                             >
//                               <Trash2 className="h-5 w-5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="p-6 text-center">
//                 <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
//                 <p className="text-gray-500 mb-4">
//                   {searchTerm || selectedCategory
//                     ? "Try adjusting your search or filter criteria"
//                     : "Get started by adding your first product"}
//                 </p>
//                 <Link
//                   to="/admin/add-product"
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Product
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default ManageProducts





"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { collection, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore"
import { db } from "../../firebase/config"
import { Package, Plus, Edit, Trash2, Search } from "lucide-react"

const ManageProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState({})
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Predefined categories
        const foodCategories = [
          { id: "fruits", name: "Fruits" },
          { id: "vegetables", name: "Vegetables" },
          { id: "dairy", name: "Dairy Products" },
          { id: "beverages", name: "Beverages" },
          { id: "snacks", name: "Snacks" },
        ]

        const categoriesData = {};
        foodCategories.forEach(category => {
          categoriesData[category.id] = category.name;
        });

        // Fetch categories from Firestore
        const categoriesSnapshot = await getDocs(collection(db, "categories"))
        categoriesSnapshot.docs.forEach((doc) => {
          categoriesData[doc.id] = doc.data().name
        })
        setCategories(categoriesData)

        // Fetch products
        const productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"))
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
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id))
        setProducts(products.filter((product) => product.id !== id))
      } catch (error) {
        console.error("Error deleting product:", error)
        setError("Failed to delete product")
      }
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-900">Manage Products</h1>
          <Link
            to="/admin/add-product"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="w-full md:w-64">
                  <select
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {Object.entries(categories).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ManageProducts
