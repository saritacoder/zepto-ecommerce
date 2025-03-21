// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;









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
// import OrderHistory from "./pages/user/OrderHistory"
// import UserProfile from "./pages/user/UserProfile"
import AddProduct from "./pages/admin/AddProduct"
import ManageProducts from "./pages/admin/ManageProducts"
import ManageCategories from "./pages/admin/ManageCategories"
import ManageOrders from "./pages/admin/ManageOrders"
import ForgotPassword from "./pages/ForgotPassword"
// import NotFound from "./pages/NotFound"
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
                  {/* <OrderHistory /> */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  {/* <UserProfile /> */}
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

