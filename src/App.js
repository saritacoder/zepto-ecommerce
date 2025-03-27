

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminSignUp from "./pages/admin/AdminSignUp"
import AdminDashboard from "./pages/admin/AdminDashboard"
import UserLogin from "./pages/user/UserLogin"
import UserSignUp from "./pages/user/UserSignUp"
import UserDashboard from "./pages/user/UserDashboard"
import ProductListing from "./pages/user/ProductListing"
import ProductDetails from "./pages/user/ProductDetails"
import Cart from "./pages/user/Cart"
import Checkout from "./pages/user/Checkout"
import OrderHistory from "./pages/user/OrderHistory"
// import UserProfile from "./pages/user/UserProfile"
import UserProfile from "./pages/user/UserProfile"
import AddProduct from "./pages/admin/AddProduct"
import ManageProducts from "./pages/admin/ManageProducts"
import ManageCategories from "./pages/admin/ManageCategories"
import ManageOrders from "./pages/admin/ManageOrders"
import ForgotPassword from "./pages/ForgotPassword"
import NotFound from "./pages/NotFound"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignUp />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/signup" element={<UserSignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/add-product"
              element={
                <AdminRoute>
                  <AddProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/manage-products"
              element={
                <AdminRoute>
                  <ManageProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/manage-categories"
              element={
                <AdminRoute>
                  <ManageCategories />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/manage-orders"
              element={
                <AdminRoute>
                  <ManageOrders />
                </AdminRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App




//  ye 21.3   ka code h upper sahi work kar raha tha 



// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import { AuthProvider } from "./contexts/AuthContext"
// import { CartProvider } from "./contexts/CartContext"
// import ProtectedRoute from "./components/ProtectedRoute"

// // Admin Pages
// import AdminSignUp from "./pages/admin/AdminSignUp"
// import AdminLogin from "./pages/admin/AdminLogin"
// import AdminDashboard from "./pages/admin/AdminDashboard"
// import AddProduct from "./pages/admin/AddProduct"
// import ManageProducts from "./pages/admin/ManageProducts"
// import ManageCategories from "./pages/admin/ManageCategories"
// import ManageOrders from "./pages/admin/ManageOrders"

// // User Pages
// import HomePage from "./pages/HomePage"
// import ProductListing from "./pages/ProductListing"
// import ProductDetails from "./pages/ProductDetails"
// import UserSignUp from "./pages/UserSignUp"
// import UserLogin from "./pages/UserLogin"
// import ForgotPassword from "./pages/ForgotPassword"
// import UserDashboard from "./pages/UserDashboard"
// import Cart from "./pages/user/Cart"
// import Checkout from "./pages/user/Checkout"
// import OrderHistory from "./pages/user/OrderHistory"
// import UserProfile from "./pages/user/UserProfile"
// import OrderSuccess from "./pages/OrderSuccess"
// import NotFound from "./pages/NotFound"

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <CartProvider>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<HomePage />} />
//             <Route path="/products" element={<ProductListing />} />
//             <Route path="/product/:id" element={<ProductDetails />} />
//             <Route path="/signup" element={<UserSignUp />} />
//             <Route path="/login" element={<UserLogin />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/order-success" element={<OrderSuccess />} />

//             {/* Protected User Routes */}
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <UserDashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/cart"
//               element={
//                 <ProtectedRoute>
//                   <Cart />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/checkout"
//               element={
//                 <ProtectedRoute>
//                   <Checkout />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/user/order-history"
//               element={
//                 <ProtectedRoute>
//                   <OrderHistory />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/user/profile"
//               element={
//                 <ProtectedRoute>
//                   <UserProfile />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Admin Routes */}
//             <Route path="/admin/signup" element={<AdminSignUp />} />
//             <Route path="/admin/login" element={<AdminLogin />} />
//             <Route
//               path="/admin/dashboard"
//               element={
//                 <ProtectedRoute requireAdmin={true}>
//                   <AdminDashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/add-product"
//               element={
//                 <ProtectedRoute requireAdmin={true}>
//                   <AddProduct />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/manage-products"
//               element={
//                 <ProtectedRoute requireAdmin={true}>
//                   <ManageProducts />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/manage-categories"
//               element={
//                 <ProtectedRoute requireAdmin={true}>
//                   <ManageCategories />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/manage-orders"
//               element={
//                 <ProtectedRoute requireAdmin={true}>
//                   <ManageOrders />
//                 </ProtectedRoute>
//               }
//             />

//             {/* 404 Route */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </CartProvider>
//       </AuthProvider>
//     </Router>
//   )
// }

// export default App

