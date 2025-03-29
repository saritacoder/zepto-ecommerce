

// //  below code se order place karne ke badh order history page open ho raha perfectly 

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import HomePage from "./pages/HomePage"
// import AdminLogin from "./pages/admin/AdminLogin"
// import AdminSignUp from "./pages/admin/AdminSignUp"
// import AdminDashboard from "./pages/admin/AdminDashboard"
// import UserLogin from "./pages/user/UserLogin"
// import UserSignUp from "./pages/user/UserSignUp"
// import UserDashboard from "./pages/user/UserDashboard"
// import ProductListing from "./pages/user/ProductListing"
// import ProductDetails from "./pages/user/ProductDetails"
// import Cart from "./pages/user/Cart"
// import Checkout from "./pages/user/Checkout"
// import OrderHistory from "./pages/user/OrderHistory"
// import Layout from "./components/common/Header"
// import OrderConfirmation from "./pages/OrderConfirmation"
// import UserProfile from "./pages/user/UserProfile"
// import AddProduct from "./pages/admin/AddProduct"
// import ManageProducts from "./pages/admin/ManageProducts"
// import ManageCategories from "./pages/admin/ManageCategories"
// import ManageOrders from "./pages/admin/ManageOrders"
// import ForgotPassword from "./pages/ForgotPassword"
// import NotFound from "./pages/NotFound"
// import { AuthProvider } from "./contexts/AuthContext"
// import { CartProvider } from "./contexts/CartContext"
// import ProtectedRoute from "./components/ProtectedRoute"
// import AdminRoute from "./components/AdminRoute"

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <CartProvider>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<HomePage />} />
//             <Route path="/admin/login" element={<AdminLogin />} />
//             <Route path="/admin/signup" element={<AdminSignUp />} />
//             <Route path="/user/login" element={<UserLogin />} />
//             <Route path="/user/signup" element={<UserSignUp />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/order-confirmation" element={<OrderConfirmation />} />
//             <Route path="/order-history" element={<OrderHistory />} />
//             {/* Admin Routes */}
//             <Route
//               path="/admin"
//               element={
//                 <AdminRoute>
//                   <AdminDashboard />
//                 </AdminRoute>
//               }
//             />
//             <Route
//               path="/admin/add-product"
//               element={
//                 <AdminRoute>
//                   <AddProduct />
//                 </AdminRoute>
//               }
//             />
//             <Route
//               path="/admin/manage-products"
//               element={
//                 <AdminRoute>
//                   <ManageProducts />
//                 </AdminRoute>
//               }
//             />
//             <Route
//               path="/admin/manage-categories"
//               element={
//                 <AdminRoute>
//                   <ManageCategories />
//                 </AdminRoute>
//               }
//             />
//             <Route
//               path="/admin/manage-orders"
//               element={
//                 <AdminRoute>
//                   <ManageOrders />
//                 </AdminRoute>
//               }
//             />

//             {/* User Routes */}
//             <Route
//               path="/user"
//               element={
//                 <ProtectedRoute>
//                   <UserDashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/products" element={<ProductListing />} />
//             <Route path="/products/:id" element={<ProductDetails />} />
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
//               path="/orders"
//               element={
//                 <ProtectedRoute>
//                   <OrderHistory />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>

//                  <Layout>
//                 </ProtectedRoute>
//               }
//             />
               
//                {/* <Route path="/order-confirmation/:orderId" element={<ProtectedRoute> <OrderConfirmation /></ProtectedRoute>} /> */}

//             {/* 404 Route */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </CartProvider>
//       </AuthProvider>
//     </Router>
//   )
// }

// export default App



// //  below code se order place karne ke badh order history pe click karne pe not found shwo karta h



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignUp from "./pages/admin/AdminSignUp";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserLogin from "./pages/user/UserLogin";
import UserSignUp from "./pages/user/UserSignUp";
import UserDashboard from "./pages/user/UserDashboard";
import ProductListing from "./pages/user/ProductListing";
import ProductDetails from "./pages/user/ProductDetails";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import OrderHistory from "./pages/user/OrderHistory";
import Layout from "./components/common/Layout"; // Ensure correct import
import OrderConfirmation from "./pages/OrderConfirmation";
import UserProfile from "./pages/user/UserProfile";
import AddProduct from "./pages/admin/AddProduct";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageOrders from "./pages/admin/ManageOrders";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes (Without Layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignUp />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/signup" element={<UserSignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Routes Wrapped in Layout */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                <Layout>
                  <OrderConfirmation />
                </Layout>
              }
            />
            <Route
              path="/products"
              element={
                <Layout>
                  <ProductListing />
                </Layout>
              }
            />
            <Route
              path="/products/:id"
              element={
                <Layout>
                  <ProductDetails />
                </Layout>
              }
            />
            
            {/* Admin Routes (Without Layout) */}
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

            {/* User Routes (With Layout) */}
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Cart />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Checkout />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Layout>
                    <OrderHistory />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFound />
                </Layout>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
