// "use client"

// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"
// import { collection, getDocs, query, orderBy, limit, getCountFromServer } from "firebase/firestore"
// import { db } from "../../firebase/config"
// import { useAuth } from "../../contexts/AuthContext"
// import { Package, Users, ShoppingBag, Tag, BarChart2, LogOut, Plus, Settings } from "lucide-react"
// // import Footer from "../../components/common/Footer"

// const AdminDashboard = () => {
//   const { currentUser, logout } = useAuth()
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     totalOrders: 0,
//     totalUsers: 0,
//     totalCategories: 0,
//   })
//   const [recentOrders, setRecentOrders] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Get counts
//         const productsCount = await getCountFromServer(collection(db, "products"))
//         const ordersCount = await getCountFromServer(collection(db, "orders"))
//         const usersCount = await getCountFromServer(collection(db, "users"))
//         const categoriesCount = await getCountFromServer(collection(db, "categories"))

//         setStats({
//           totalProducts: productsCount.data().count,
//           totalOrders: ordersCount.data().count,
//           totalUsers: usersCount.data().count,
//           totalCategories: categoriesCount.data().count,
//         })

//         // Fetch recent orders
//         const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5))

//         const ordersSnapshot = await getDocs(ordersQuery)
//         const ordersData = ordersSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }))

//         setRecentOrders(ordersData)
//         setLoading(false)
//       } catch (error) {
//         console.error("Error fetching data:", error)
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   const handleLogout = async () => {
//     try {
//       await logout()
//     } catch (error) {
//       console.error("Failed to log out", error)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-300 shadow-md hidden md:block">
//         <div className="p-6">
//           <Link to="/admin" className="flex items-center">
//             <h1 className="text-xl font-bold text-purple-600">QuickMart Admin</h1>
//           </Link>
//         </div>

//         <nav className="mt-6">
//           <Link
//             to="/admin"
//             className="flex items-center px-6 py-3 text-gray-700 bg-purple-50 border-r-4 border-purple-500"
//           >
//             <BarChart2 className="h-5 w-5 mr-3 text-purple-500" />
//             Dashboard
//           </Link>

//           <Link to="/admin/manage-products" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
//             <Package className="h-5 w-5 mr-3 text-gray-400" />
//             Products
//           </Link>

//           <Link to="/admin/manage-categories" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
//             <Tag className="h-5 w-5 mr-3 text-gray-400" />
//             Categories
//           </Link>

//           <Link to="/admin/manage-orders" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
//             <ShoppingBag className="h-5 w-5 mr-3 text-gray-400" />
//             Orders
//           </Link>

//           <Link to="/admin/manage-users" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
//             <Users className="h-5 w-5 mr-3 text-gray-400" />
//             Users
//           </Link>

//           <Link to="/admin/settings" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
//             <Settings className="h-5 w-5 mr-3 text-gray-400" />
//             Settings
//           </Link>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1">
//         <header className="bg-gray-200 shadow-sm">
//           <div className="px-4 py-4 flex items-center justify-between">
//             <button className="md:hidden">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>

//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <button className="flex items-center space-x-1">
//                   <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
//                     <span className="text-sm font-medium text-purple-600">{currentUser?.name?.charAt(0) || "A"}</span>
//                   </div>
//                   <span className="hidden md:inline-block text-sm font-medium text-gray-700">
//                     {currentUser?.name || "Admin"}
//                   </span>
//                 </button>
//               </div>

//               <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
//                 <LogOut className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </header>

//         <main className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
//             <Link
//               to="/admin/add-product"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add Product
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-center">
//                 <div className="p-3 rounded-full bg-purple-100 mr-4">
//                   <Package className="h-6 w-6 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Total Products</p>
//                   <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-center">
//                 <div className="p-3 rounded-full bg-blue-100 mr-4">
//                   <ShoppingBag className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Total Orders</p>
//                   <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-center">
//                 <div className="p-3 rounded-full bg-green-100 mr-4">
//                   <Users className="h-6 w-6 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Total Users</p>
//                   <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-center">
//                 <div className="p-3 rounded-full bg-yellow-100 mr-4">
//                   <Tag className="h-6 w-6 text-yellow-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Total Categories</p>
//                   <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
//             </div>

//             {recentOrders.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Order ID
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Customer
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Total
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {recentOrders.map((order) => (
//                       <tr key={order.id}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           #{order.id.slice(0, 8)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {order.userName || "Unknown"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               order.status === "delivered"
//                                 ? "bg-green-100 text-green-800"
//                                 : order.status === "shipped"
//                                   ? "bg-blue-100 text-blue-800"
//                                   : order.status === "processing"
//                                     ? "bg-yellow-100 text-yellow-800"
//                                     : "bg-gray-100 text-gray-800"
//                             }`}
//                           >
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <Link to={`/admin/orders/${order.id}`} className="text-purple-600 hover:text-purple-900">
//                             View
//                           </Link>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="p-6 text-center">
//                 <p className="text-gray-500">No recent orders</p>
//               </div>
//             )}
//           </div>
//         </main>
//         {/* <Footer /> */}
//       </div>
      
//     </div>
//   )
// }

// export default AdminDashboard












import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { collection, getDocs, query, orderBy, limit, getCountFromServer } from "firebase/firestore"
import { db } from "../../firebase/config"
import { useAuth } from "../../contexts/AuthContext"
import { Package, Users, ShoppingBag, Tag, BarChart2, LogOut, Plus, Settings } from "lucide-react"

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalCategories: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get counts
        const productsCount = await getCountFromServer(collection(db, "products"))
        const ordersCount = await getCountFromServer(collection(db, "orders"))
        const usersCount = await getCountFromServer(collection(db, "users"))
        const categoriesCount = await getCountFromServer(collection(db, "categories"))

        setStats({
          totalProducts: productsCount.data().count,
          totalOrders: ordersCount.data().count,
          totalUsers: usersCount.data().count,
          totalCategories: categoriesCount.data().count,
        })

        // Fetch recent orders
        const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5))

        const ordersSnapshot = await getDocs(ordersQuery)
        const ordersData = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setRecentOrders(ordersData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-300 shadow-md hidden md:block">
        <div className="p-6">
          <Link to="/admin" className="flex items-center">
            <h1 className="text-xl font-bold text-purple-600">QuickMart Admin</h1>
          </Link>
        </div>

        <nav className="mt-6">
          <Link
            to="/admin"
            className="flex items-center px-6 py-3 text-gray-700 bg-purple-50 border-r-4 border-purple-500"
          >
            <BarChart2 className="h-5 w-5 mr-3 text-purple-500" />
            Dashboard
          </Link>

          <Link to="/admin/manage-products" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <Package className="h-5 w-5 mr-3 text-gray-400" />
            Products
          </Link>

          <Link to="/admin/manage-categories" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <Tag className="h-5 w-5 mr-3 text-gray-400" />
            Categories
          </Link>

          <Link to="/admin/manage-orders" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <ShoppingBag className="h-5 w-5 mr-3 text-gray-400" />
            Orders
          </Link>

          <Link to="/admin/manage-users" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <Users className="h-5 w-5 mr-3 text-gray-400" />
            Users
          </Link>

          {/* <Link to="/admin/settings" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <Settings className="h-5 w-5 mr-3 text-gray-400" />
            Settings
          </Link> */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-gray-200 shadow-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <button className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-1">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">{currentUser?.name?.charAt(0) || "A"}</span>
                  </div>
                  <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                    {currentUser?.name || "Admin"}
                  </span>
                </button>
              </div>

              <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <Link
              to="/admin/add-product"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                  <Tag className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Categories</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            </div>

            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.userName || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/admin/orders/${order.id}`} className="text-purple-600 hover:text-purple-900">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No recent orders</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard