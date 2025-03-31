import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { ShoppingBag, Search } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus, updatedAt: new Date().toISOString() });
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status");
    }
  };

  // const filteredOrders = orders.filter((order) => {
  //   const matchesSearch =
  //     order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     (order.userName && order.userName.toLowerCase().includes(searchTerm.toLowerCase()));
  //   const matchesStatus = statusFilter ? order.status === statusFilter : true;
  //   return matchesSearch && matchesStatus;
  // });


  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.userName && order.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.total && order.total.toString().includes(searchTerm)); // Allow searching by total amount
  
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button onClick={() => navigate("/admin-dashboard")} className="text-gray-600 hover:text-gray-900 mr-2">
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-medium text-gradient bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">Recent Orders</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Search orders..."
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="ml-4 w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {currentOrders.length > 0 ? (
            <div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userName || "Unknown"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-purple-500"
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center items-center mt-4 space-x-4">
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">Prev</button>
                <span className="text-lg font-bold">{currentPage}</span>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">Next</button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};
export default ManageOrders;





// fist wala work me tha
// 

// import React, { useState, useEffect } from "react";
// import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
// import { db } from "../../firebase/config";
// import { ShoppingBag, Search } from "lucide-react";
// import { FaArrowLeft } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const ManageOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const ordersPerPage = 5;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
//         const ordersSnapshot = await getDocs(ordersQuery);
//         const ordersData = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setOrders(ordersData);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setError("Failed to load orders");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   const handleUpdateStatus = async (orderId, newStatus) => {
//     try {
//       await updateDoc(doc(db, "orders", orderId), { status: newStatus, updatedAt: new Date().toISOString() });
//       setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       setError("Failed to update order status");
//     }
//   };

//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch =
//       order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (order.userName && order.userName.toLowerCase().includes(searchTerm.toLowerCase()));
//     const matchesStatus = statusFilter ? order.status === statusFilter : true;
//     return matchesSearch && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

//   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm py-4 px-6 flex items-center">
//         <button onClick={() => navigate("/admin-dashboard")} className="text-gray-600 hover:text-gray-900 mr-2">
//           <FaArrowLeft className="h-5 w-5" />
//         </button>
//         <h1 className="text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Recent Orders</h1>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="flex gap-4 mb-4">
//           <div className="relative w-full max-w-md">
//             <Search className="absolute left-2 top-3 text-gray-400" />
//             <input
//               type="text"
//               className="w-full pl-10 pr-3 py-2 border rounded-md shadow-sm"
//               placeholder="Search by Order ID or Customer"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <select
//             className="border rounded-md px-3 py-2 shadow-sm"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="processing">Processing</option>
//             <option value="shipped">Shipped</option>
//             <option value="delivered">Delivered</option>
//             <option value="cancelled">Cancelled</option>
//           </select>
//         </div>

//         {currentOrders.length > 0 ? (
//           <>
//             <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm rounded-lg overflow-hidden">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentOrders.map((order) => (
//                   <tr key={order.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userName || "Unknown"}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <select
//                         className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md"
//                         value={order.status}
//                         onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
//                       >
//                         <option value="pending">Pending</option>
//                         <option value="processing">Processing</option>
//                         <option value="shipped">Shipped</option>
//                         <option value="delivered">Delivered</option>
//                         <option value="cancelled">Cancelled</option>
//                       </select>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="flex justify-center items-center mt-4">
//               <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 mx-2 bg-gray-300 rounded">Prev</button>
//               <span className="text-lg font-semibold">{currentPage}</span>
//               <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 mx-2 bg-gray-300 rounded">Next</button>
//             </div>
//           </>
//         ) : (
//           <p className="text-center text-gray-600">No orders found</p>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ManageOrders;












// // import React from 'react';
// // import { useState, useEffect } from "react";
// // import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
// // import { db } from "../../firebase/config";
// // import { ShoppingBag, Search, Filter } from "lucide-react";
// // import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";

// // const ManageOrders = () => {
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [statusFilter, setStatusFilter] = useState("");
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchOrders = async () => {
// //       try {
// //         const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
// //         const ordersSnapshot = await getDocs(ordersQuery);
// //         const ordersData = ordersSnapshot.docs.map((doc) => ({
// //           id: doc.id,
// //           ...doc.data(),
// //         }));

// //         setOrders(ordersData);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error("Error fetching orders:", error);
// //         setError("Failed to load orders");
// //         setLoading(false);
// //       }
// //     };

// //     fetchOrders();
// //   }, []);

// //   const handleUpdateStatus = async (orderId, newStatus) => {
// //     try {
// //       await updateDoc(doc(db, "orders", orderId), {
// //         status: newStatus,
// //         updatedAt: new Date().toISOString(),
// //       });

// //       setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
// //     } catch (error) {
// //       console.error("Error updating order status:", error);
// //       setError("Failed to update order status");
// //     }
// //   };

// //   const filteredOrders = orders.filter((order) => {
// //     const matchesSearch =
// //       order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       (order.userName && order.userName.toLowerCase().includes(searchTerm.toLowerCase()));
// //     const matchesStatus = statusFilter ? order.status === statusFilter : true;

// //     return matchesSearch && matchesStatus;
// //   });

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <header className="bg-white shadow-sm">
// //         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
// //           <div className="flex items-center">
// //             <button 
// //               onClick={() => navigate("/admin-dashboard")} 
// //               className="text-gray-600 hover:text-gray-900 mr-2"
// //             >
// //               <FaArrowLeft className="h-5 w-5" />
// //             </button>
// //             <h1 className="text-lg font-medium text-gray-900">Recent Orders</h1>
// //           </div>
// //         </div>
// //       </header>

// //       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
// //         <div className="px-4 py-6 sm:px-0">
// //           {error && (
// //             <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
// //               <span className="block sm:inline">{error}</span>
// //             </div>
// //           )}

// //           <div className="bg-white shadow rounded-lg overflow-hidden">
// //             <div className="p-6 border-b border-gray-200">
// //               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //                 <div className="relative flex-1">
// //                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                     <Search className="h-5 w-5 text-gray-400" />
// //                   </div>
// //                   <input
// //                     type="text"
// //                     placeholder="Search orders..."
// //                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
// //                     value={searchTerm}
// //                     onChange={(e) => setSearchTerm(e.target.value)}
// //                   />
// //                 </div>

// //                 <div className="w-full md:w-64">
// //                   <div className="relative">
// //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                       <Filter className="h-5 w-5 text-gray-400" />
// //                     </div>
// //                     <select
// //                       className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
// //                       value={statusFilter}
// //                       onChange={(e) => setStatusFilter(e.target.value)}
// //                     >
// //                       <option value="">All Statuses</option>
// //                       <option value="pending">Pending</option>
// //                       <option value="processing">Processing</option>
// //                       <option value="shipped">Shipped</option>
// //                       <option value="delivered">Delivered</option>
// //                       <option value="cancelled">Cancelled</option>
// //                     </select>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {filteredOrders.length > 0 ? (
// //               <div className="overflow-x-auto">
// //                 <table className="min-w-full divide-y divide-gray-200">
// //                   <thead className="bg-gray-50">
// //                     <tr>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Order ID
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Customer
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Date
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Total
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Status
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Actions
// //                       </th>
// //                     </tr>
// //                   </thead>
// //                   <tbody className="bg-white divide-y divide-gray-200">
// //                     {filteredOrders.map((order) => (
// //                       <tr key={order.id}>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                           #{order.id.slice(0, 8)}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                           {order.userName || "Unknown"}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                           {new Date(order.createdAt).toLocaleDateString()}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <span
// //                             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
// //                               order.status === "delivered"
// //                                 ? "bg-green-100 text-green-800"
// //                                 : order.status === "shipped"
// //                                   ? "bg-blue-100 text-blue-800"
// //                                   : order.status === "processing"
// //                                     ? "bg-yellow-100 text-yellow-800"
// //                                     : order.status === "cancelled"
// //                                       ? "bg-red-100 text-red-800"
// //                                       : "bg-gray-100 text-gray-800"
// //                             }`}
// //                           >
// //                             {order.status}
// //                           </span>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// //                           <select
// //                             className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
// //                             value={order.status}
// //                             onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
// //                           >
// //                             <option value="pending">Pending</option>
// //                             <option value="processing">Processing</option>
// //                             <option value="shipped">Shipped</option>
// //                             <option value="delivered">Delivered</option>
// //                             <option value="cancelled">Cancelled</option>
// //                           </select>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             ) : (
// //               <div className="p-6 text-center">
// //                 <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// //                 <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
// //                 <p className="text-gray-500">
// //                   {searchTerm || statusFilter
// //                     ? "Try adjusting your search or filter criteria"
// //                     : "Orders will appear here when customers place them"}
// //                 </p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default ManageOrders;





// // "use client"

// // import { useState, useEffect } from "react"
// // import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore"
// // import { db } from "../../firebase/config"
// // import { ShoppingBag, Search, Filter } from "lucide-react"
// // import { FaArrowLeft ,FaEdit, FaTrash } from "react-icons/fa";

// // import { useNavigate } from "react-router-dom"


// // const ManageOrders = () => {
// //   const [orders, setOrders] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState("")
// //   const [searchTerm, setSearchTerm] = useState("")
// //   const [statusFilter, setStatusFilter] = useState("")
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchOrders = async () => {
// //       try {
// //         const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"))
// //         const ordersSnapshot = await getDocs(ordersQuery)
// //         const ordersData = ordersSnapshot.docs.map((doc) => ({
// //           id: doc.id,
// //           ...doc.data(),
// //         }))

// //         setOrders(ordersData)
// //         setLoading(false)
// //       } catch (error) {
// //         console.error("Error fetching orders:", error)
// //         setError("Failed to load orders")
// //         setLoading(false)
// //       }
// //     }

// //     fetchOrders()
// //   }, [])

// //   const handleUpdateStatus = async (orderId, newStatus) => {
// //     try {
// //       await updateDoc(doc(db, "orders", orderId), {
// //         status: newStatus,
// //         updatedAt: new Date().toISOString(),
// //       })

// //       setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
// //     } catch (error) {
// //       console.error("Error updating order status:", error)
// //       setError("Failed to update order status")
// //     }
// //   }

// //   const filteredOrders = orders.filter((order) => {
// //     const matchesSearch =
// //       order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       (order.userName && order.userName.toLowerCase().includes(searchTerm.toLowerCase()))
// //     const matchesStatus = statusFilter ? order.status === statusFilter : true

// //     return matchesSearch && matchesStatus
// //   })

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">

// //       <header className="bg-white shadow-sm">
// //         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
// //          <div className="bg-gray-800 text-white py-3 px-6  flex items-center">
// //            <button onClick={() => navigate("/admin-dashboard")} className="flex items-center text-white hover:text-gray-300">
// //              <FaArrowLeft className="mr-2" /> Back to Admin Dashboard
// //            </button>
// //            </div>
// //           <h1 className="text-lg font-medium text-gray-900">Recent Orders</h1>
// //         </div>
// //       </header>

// //       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
// //         <div className="px-4 py-6 sm:px-0">
// //           {error && (
// //             <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
// //               <span className="block sm:inline">{error}</span>
// //             </div>
// //           )}

// //           <div className="bg-white shadow rounded-lg overflow-hidden">
// //             <div className="p-6 border-b border-gray-200">
// //               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //                 <div className="relative flex-1">
// //                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                     <Search className="h-5 w-5 text-gray-400" />
// //                   </div>
// //                   <input
// //                     type="text"
// //                     placeholder="Search orders..."
// //                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
// //                     value={searchTerm}
// //                     onChange={(e) => setSearchTerm(e.target.value)}
// //                   />
// //                 </div>

// //                 <div className="w-full md:w-64">
// //                   <div className="relative">
// //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                       <Filter className="h-5 w-5 text-gray-400" />
// //                     </div>
// //                     <select
// //                       className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
// //                       value={statusFilter}
// //                       onChange={(e) => setStatusFilter(e.target.value)}
// //                     >
// //                       <option value="">All Statuses</option>
// //                       <option value="pending">Pending</option>
// //                       <option value="processing">Processing</option>
// //                       <option value="shipped">Shipped</option>
// //                       <option value="delivered">Delivered</option>
// //                       <option value="cancelled">Cancelled</option>
// //                     </select>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {filteredOrders.length > 0 ? (
// //               <div className="overflow-x-auto">
// //                 <table className="min-w-full divide-y divide-gray-200">
// //                   <thead className="bg-gray-50">
// //                     <tr>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Order ID
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Customer
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Date
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Total
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Status
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Actions
// //                       </th>
// //                     </tr>
// //                   </thead>
// //                   <tbody className="bg-white divide-y divide-gray-200">
// //                     {filteredOrders.map((order) => (
// //                       <tr key={order.id}>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                           #{order.id.slice(0, 8)}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                           {order.userName || "Unknown"}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                           {new Date(order.createdAt).toLocaleDateString()}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <span
// //                             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
// //                               order.status === "delivered"
// //                                 ? "bg-green-100 text-green-800"
// //                                 : order.status === "shipped"
// //                                   ? "bg-blue-100 text-blue-800"
// //                                   : order.status === "processing"
// //                                     ? "bg-yellow-100 text-yellow-800"
// //                                     : order.status === "cancelled"
// //                                       ? "bg-red-100 text-red-800"
// //                                       : "bg-gray-100 text-gray-800"
// //                             }`}
// //                           >
// //                             {order.status}
// //                           </span>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// //                           <select
// //                             className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
// //                             value={order.status}
// //                             onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
// //                           >
// //                             <option value="pending">Pending</option>
// //                             <option value="processing">Processing</option>
// //                             <option value="shipped">Shipped</option>
// //                             <option value="delivered">Delivered</option>
// //                             <option value="cancelled">Cancelled</option>
// //                           </select>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             ) : (
// //               <div className="p-6 text-center">
// //                 <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// //                 <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
// //                 <p className="text-gray-500">
// //                   {searchTerm || statusFilter
// //                     ? "Try adjusting your search or filter criteria"
// //                     : "Orders will appear here when customers place them"}
// //                 </p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   )
// // }

// // export default ManageOrders

