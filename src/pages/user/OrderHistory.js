// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
// import { db } from '../../firebase/config';
// import { useAuth } from '../../contexts/AuthContext';
// import { FiPackage, FiChevronRight, FiArrowLeft } from 'react-icons/fi';

// export default function OrderHistory() {
//   const { currentUser } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!currentUser) return;

//       try {
//         const ordersQuery = query(
//           collection(db, 'orders'),
//           where('userId', '==', currentUser.uid),
//           orderBy('createdAt', 'desc')
//         );

//         const ordersSnapshot = await getDocs(ordersQuery);
//         const ordersList = ordersSnapshot.docs.map(doc => {
//           const data = doc.data();
//           // Ensure status is always set
//           const status = data.status || 'processing';
          
//           return {
//             id: doc.id,
//             ...data,
//             status, // Explicitly set status
//             createdAt: data.createdAt?.seconds
//               ? new Date(data.createdAt.seconds * 1000)
//               : new Date(data.createdAt) || new Date(),
//           };
//         });

//         console.log('Fetched orders:', ordersList); // Debug log
//         setOrders(ordersList);
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [currentUser]);

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'processing':
//         return 'bg-blue-100 text-blue-800';
//       case 'shipped':
//         return 'bg-purple-100 text-purple-800';
//       case 'delivered':
//         return 'bg-green-100 text-green-800';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="bg-gradient-to-r from-purple-50 to-purple-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <div className="flex items-center">
//           <Link to="/user-dashboard" className="mr-2">
//             <FiArrowLeft className="h-6 w-6 text-black cursor-pointer" />
//           </Link>
//           <h1 className="text-2xl font-bold text-black">Order History</h1>
//         </div>
//         <p className="mt-2 text-sm text-white-500">
//           View and track all your past orders
//         </p>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       ) : orders.length > 0 ? (
//         <div className="bg-gradient-to-r from-purple-50 to-purple-100 shadow overflow-hidden sm:rounded-md">
//           <ul className="divide-y divide-gray-200">
//             {orders.map((order) => (
//               <li key={order.id} className="hover:bg-gray-50">
//                 <Link to={`/order/${order.id}`} className="block">
//                   <div className="px-4 py-4 sm:px-6">
//                     {/* Order Header */}
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0">
//                           <FiPackage className="h-6 w-6 text-gray-400" />
//                         </div>
//                         <div className="ml-4">
//                           <p className="text-sm font-medium text-blue-600">
//                             Order #{order.id.slice(0, 8)}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {order.createdAt.toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
//                           {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                         </span>
//                         <FiChevronRight className="ml-2 h-5 w-5 text-gray-400" />
//                       </div>
//                     </div>

//                     {/* Order Items */}
//                     <div className="space-y-4">
//                       {order.items?.map((item, index) => (
//                         <div key={index} className="flex items-center space-x-4 py-2 border-b last:border-b-0">
//                           <div className="w-16 h-16">
//                             <img
//                               src={item.imageUrl || '/placeholder-image.png'}
//                               alt={item.name}
//                               className="w-full h-full object-cover rounded-md"
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <p className="text-sm font-medium text-gray-900">{item.name}</p>
//                             <p className="text-sm text-gray-500">
//                               {item.quantity} × ₹{item.price?.toFixed(2)}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Order Summary */}
//                     <div className="mt-4 flex justify-between items-center">
//                       <p className="text-sm text-gray-500">
//                         {order.items?.length || 0} items
//                       </p>
//                       <p className="text-sm font-medium text-gray-900">
//                         Total: ₹{(order.totalAmount ?? order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0))?.toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
//           <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
//           <p className="mt-1 text-sm text-gray-500">
//             You haven't placed any orders yet.
//           </p>
//           <div className="mt-6">
//             <Link
//               to="/products"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Start Shopping
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// top 2 prod me status or id show kar raha

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
// import { db } from '../../firebase/config';
// import { useAuth } from '../../contexts/AuthContext';
// import { FiPackage, FiChevronRight, FiArrowLeft } from 'react-icons/fi';

// export default function OrderHistory() {
//   const { currentUser } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!currentUser) return;

//       try {
//         const ordersQuery = query(
//           collection(db, 'orders'),
//           where('userId', '==', currentUser.uid),
//           orderBy('createdAt', 'desc')
//         );

//         const ordersSnapshot = await getDocs(ordersQuery);
//         const ordersList = ordersSnapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             ...data,
//             createdAt: data.createdAt?.seconds
//               ? new Date(data.createdAt.seconds * 1000)
//               : new Date(data.createdAt) || null
//           };
//         });

//         setOrders(ordersList);
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [currentUser]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'processing':
//         return 'bg-blue-100 text-blue-800';
//       case 'shipped':
//         return 'bg-purple-100 text-purple-800';
//       case 'delivered':
//         return 'bg-green-100 text-green-800';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="bg-gradient-to-r from-purple-50 to-purple-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <div className="flex items-center">
//           {/* Left Arrow Icon that redirects to user-dashboard */}
//           <Link to="/user-dashboard" className="mr-2">
//             <FiArrowLeft className="h-6 w-6 text-black cursor-pointer" />
//           </Link>
//           <h1 className="text-2xl font-bold text-black">Order History</h1>
//         </div>
//         <p className="mt-2 text-sm text-white-500">
//           View and track all your past orders
//         </p>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64 ">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 "></div>
//         </div>
//       ) : orders.length > 0 ? (
//         <div className="bg-gradient-to-r from-purple-50 to-purple-100 shadow overflow-hidden sm:rounded-md">
//           <ul className="divide-y divide-gray-200">
//             {orders.map((order) => (
//               <li key={order.id}>
//                 <Link to={`/order/${order.id}`} className="block hover:bg-gray-50">
//                   <div className="px-4 py-4 sm:px-6">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0">
//                           <FiPackage className="h-6 w-6 text-gray-400" />
//                         </div>
//                         <div className="ml-4">
//                           <p className="text-sm font-medium text-blue-600">
//                             Order #{order.id.slice(0, 8)}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
//                           {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Processing'}
//                         </span>
//                         <FiChevronRight className="ml-2 h-5 w-5 text-gray-400" />
//                       </div>
//                     </div>

//                     {/* Order Items */}
//                     <div className="mt-4">
//                       {order.items?.map((item, index) => (
//                         <div key={index} className="flex items-center space-x-4 py-2 border-b last:border-b-0">
//                           {/* Product Image */}
//                           <div className="w-16 h-16">
//                             <img
//                               src={item.imageUrl || '/placeholder-image.png'}
//                               alt={item.name}
//                               className="w-full h-full object-cover rounded-md"
//                             />
//                           </div>
//                           {/* Product Details */}
//                           <div className="flex-1">
//                             <p className="text-sm font-medium text-gray-900">{item.name}</p>
//                             <p className="text-sm text-gray-500">{item.quantity} × ₹{item.price?.toFixed(2)}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="mt-2 sm:flex sm:justify-between">
//                       <div className="sm:flex">
//                         <p className="flex items-center text-sm text-gray-500">
//                           {order.items?.length || 0} items
//                         </p>
//                       </div>
//                       <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
//                         <p>
//                           Total: ₹{(order.totalAmount ?? order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0))?.toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
//           <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
//           <p className="mt-1 text-sm text-gray-500">
//             You haven't placed any orders yet.
//           </p>
//           <div className="mt-6">
//             <Link
//               to="/products"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Start Shopping
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { FiPackage, FiChevronRight, FiArrowLeft } from 'react-icons/fi';

export default function OrderHistory() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;

      try {
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersList = ordersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.seconds
              ? new Date(data.createdAt.seconds * 1000)
              : new Date(data.createdAt) || null
          };
        });

        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center">
          {/* Left Arrow Icon that redirects to user-dashboard */}
          <Link to="/user-dashboard" className="mr-2">
            <FiArrowLeft className="h-6 w-6 text-black cursor-pointer" />
          </Link>
          <h1 className="text-2xl font-bold text-black">Order History</h1>
        </div>
        <p className="mt-2 text-sm text-white-500">
          View and track all your past orders
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 ">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 "></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id}>
                <Link to={`/order/${order.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FiPackage className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600">
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Processing'}
                        </span>
                        <FiChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-4">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 py-2 border-b last:border-b-0">
                          {/* Product Image */}
                          <div className="w-16 h-16">
                            <img
                              src={item.imageUrl || '/placeholder-image.png'}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          {/* Product Details */}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.quantity} × ₹{item.price?.toFixed(2)}</p>
                {/* Ensure order.id and order.status exist before displaying */}
        {order.id && (
          <p className="text-xs text-gray-500 mt-1">Order ID: {order.id.slice(0, 8)}</p>
        )}
        {order.status && (
          <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        )}
                          
                          
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {order.items?.length || 0} items
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Total: ₹{(order.totalAmount ?? order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0))?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't placed any orders yet.
          </p>
          <div className="mt-6">
            <Link
              to="/user-dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}




