

import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { ShoppingBag, Search } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/common/Footer";

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.userName && order.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.total && order.total.toString().includes(searchTerm));
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button onClick={() => navigate("/admin-dashboard")} className="text-gray-600 hover:text-gray-900 mr-2">
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Recent Orders
            </h1>
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <select
              className="ml-4 w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.userName || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{order.total}
                      </td>
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
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-lg font-bold">{currentPage}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default ManageOrders;





// upprt pagination sahi kar rahi

// import React, { useState, useEffect } from "react";
// import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
// import { db } from "../../firebase/config";
// import { ShoppingBag, Search } from "lucide-react";
// import { FaArrowLeft } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import Footer from "../../components/common/Footer";


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
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setError("Failed to load orders");
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

//   // const filteredOrders = orders.filter((order) => {
//   //   const matchesSearch =
//   //     order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //     (order.userName && order.userName.toLowerCase().includes(searchTerm.toLowerCase()));
//   //   const matchesStatus = statusFilter ? order.status === statusFilter : true;
//   //   return matchesSearch && matchesStatus;
//   // });


//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch =
//       (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (order.userName && order.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (order.total && order.total.toString().includes(searchTerm)); // Allow searching by total amount
  
//     const matchesStatus = statusFilter ? order.status === statusFilter : true;
//     return matchesSearch && matchesStatus;
//   });
  
//   const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

//   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-purple shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
//           <div className="flex items-center">
//             <button onClick={() => navigate("/admin-dashboard")} className="text-gray-600 hover:text-gray-900 mr-2">
//               <FaArrowLeft className="h-5 w-5" />
//             </button>
//             <h1 className="text-lg font-medium text-gradient bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">Recent Orders</h1>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="flex mb-4">
//             <input
//               type="text"
//               placeholder="Search orders..."
//               className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <select
//               className="ml-4 w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//           {currentOrders.length > 0 ? (
//             <div>
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {currentOrders.map((order) => (
//                     <tr key={order.id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userName || "Unknown"}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <select
//                           className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-purple-500"
//                           value={order.status}
//                           onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="processing">Processing</option>
//                           <option value="shipped">Shipped</option>
//                           <option value="delivered">Delivered</option>
//                           <option value="cancelled">Cancelled</option>
//                         </select>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="flex justify-center items-center mt-4 space-x-4">
//                 <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">Prev</button>
//                 <span className="text-lg font-bold">{currentPage}</span>
//                 <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">Next</button>
//               </div>
//             </div>
//           ) : null}
//         </div>
//         <Footer />
//       </main>
//     </div>
//   );
// };
// export default ManageOrders;



