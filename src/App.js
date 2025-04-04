// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import AdminLogin from "./pages/admin/AdminLogin";
// import AdminSignUp from "./pages/admin/AdminSignUp";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import UserLogin from "./pages/user/UserLogin";
// import UserSignUp from "./pages/user/UserSignUp";
// import UserDashboard from "./pages/user/UserDashboard";
// import ProductListing from "./pages/user/ProductListing";
// import ProductDetails from "./pages/user/ProductDetails";
// import Cart from "./pages/user/Cart";
// import Checkout from "./pages/user/Checkout";
// import OrderHistory from "./pages/user/OrderHistory";
// import Layout from "./components/common/Layout";
// import OrderConfirmation from "./pages/OrderConfirmation";
// import UserProfile from "./pages/user/UserProfile";
// import AddProduct from "./pages/admin/AddProduct";
// import ManageProducts from "./pages/admin/ManageProducts";
// import EditProduct from "./pages/admin/EditProduct";
// import ManageCategories from "./pages/admin/ManageCategories";
// import ManageOrders from "./pages/admin/ManageOrders";
// import ForgotPassword from "./pages/ForgotPassword";
// import NotFound from "./pages/NotFound";
// import { AuthProvider, useAuth } from "./contexts/AuthContext";
// import { CartProvider } from "./contexts/CartContext";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminRoute from "./components/AdminRoute";
// import ManageUsers from "./pages/admin/ManageUsers";

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <CartProvider>
//           {/* Move useAuth inside */}
//           <AuthConsumer />
//         </CartProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// // ✅ Create a separate component inside AuthProvider to use useAuth()
// function AuthConsumer() {
//   const { isLoggedIn } = useAuth(); // Now it will not be undefined

//   return (
//     <Routes>
//       {/* Public Routes (Without Layout) */}
//       <Route path="/admin/login" element={<AdminLogin />} />
//       <Route path="/admin/signup" element={<AdminSignUp />} />
//       <Route path="/user/login" element={<UserLogin />} />
//       <Route path="/user/signup" element={<UserSignUp />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />

//       {/* Routes Wrapped in Layout Only If Logged In */}
//       {isLoggedIn ? (
//         <>
//           <Route path="/" element={<Layout><HomePage /></Layout>} />
//           <Route path="/order-confirmation" element={<Layout><OrderConfirmation /></Layout>} />
//           <Route path="/products/:id" element={<Layout><ProductDetails /></Layout>} />
          
//           {/* Admin Routes */}
//           <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
//           <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
//           <Route path="/admin/manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
//           <Route path="/admin/manage-products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
//           <Route path="/admin/manage-categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
//           <Route path="/admin/edit-product/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
//           <Route path="/admin/manage-orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />

//           {/* User Routes */}
//           <Route path="/user-dashboard" element={<ProtectedRoute><Layout><UserDashboard /></Layout></ProtectedRoute>} />
//           <Route path="/cart" element={<ProtectedRoute><Layout><Cart /></Layout></ProtectedRoute>} />
//           <Route path="/checkout" element={<ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>} />
//           <Route path="/orders" element={<ProtectedRoute><Layout><OrderHistory /></Layout></ProtectedRoute>} />
//           <Route path="/profile" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />

//           {/* 404 Route */}
//           <Route path="*" element={<Layout><NotFound /></Layout>} />
//         </>
//       ) : (
//         <Route path="*" element={<NotFound />} />
//       )}
//     </Routes>
//   );
// }

// export default App;




// ye phele ka code h working tha lakin signup se hearder hatana h 


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import AdminLogin from "./pages/admin/AdminLogin";
// import AdminSignUp from "./pages/admin/AdminSignUp";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import UserLogin from "./pages/user/UserLogin";
// import UserSignUp from "./pages/user/UserSignUp";
// import UserDashboard from "./pages/user/UserDashboard";
// import ProductListing from "./pages/user/ProductListing";
// import ProductDetails from "./pages/user/ProductDetails";
// import Cart from "./pages/user/Cart";
// import Checkout from "./pages/user/Checkout";
// import OrderHistory from "./pages/user/OrderHistory";
// import Layout from "./components/common/Layout"; // Ensure correct import
// import OrderConfirmation from "./pages/OrderConfirmation";
// import UserProfile from "./pages/user/UserProfile";
// import AddProduct from "./pages/admin/AddProduct";
// import ManageProducts from "./pages/admin/ManageProducts";
// // import EditProduct from "./pages/admin/EditProduct";
// import EditProduct from "./pages/admin/EditProduct";
// import ManageCategories from "./pages/admin/ManageCategories";
// import ManageOrders from "./pages/admin/ManageOrders";
// import ForgotPassword from "./pages/ForgotPassword";
// import NotFound from "./pages/NotFound";
// import { AuthProvider } from "./contexts/AuthContext";
// import { CartProvider } from "./contexts/CartContext";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminRoute from "./components/AdminRoute";
// import ManageUsers from "./pages/admin/ManageUsers";

// function App() {
//   // const { isLoggedIn } = useAuth();
//   return (
//     <Router>
//       <AuthProvider>
//         <CartProvider>
//           <Routes>
//             {/* Public Routes (Without Layout) */}
//             <Route path="/admin/login" element={<AdminLogin />} />
//             <Route path="/admin/signup" element={<AdminSignUp />} />
//             <Route path="/user/login" element={<UserLogin />} />
//             <Route path="/user/signup" element={<UserSignUp />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />

//             {/* Routes Wrapped in Layout */}
//             <Route
//               path="/"
//               element={
//                 <Layout>
//                   <HomePage />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/order-confirmation"
//               element={
//                 <Layout>
//                   <OrderConfirmation />
//                 </Layout>
//               }
//             />
//             {/* <Route
//               path="/products"
//               element={
//                 <Layout>
//                   <ProductListing />
//                 </Layout>
//               }
//             /> */}
//             <Route
//               path="/products/:id"
//               element={
//                 <Layout>
//                   <ProductDetails />
//                 </Layout>
//               }
//             />
            
//             {/* Admin Routes (Without Layout) */}
//             <Route
//               path="/admin-dashboard"
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

// <Route
//               path="/admin/manage-users"
//               element={
//                 <AdminRoute>     <ManageUsers /></AdminRoute>
             
                
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

// {/* <Route
//   path="/admin/edit-product/:id"
//   element={
//     <AdminRoute>
//       <EditProduct />
//     </AdminRoute>
//   }
// /> */}

// <Route>
// <Route path="/admin/add-product" element={ <AdminRoute><EditProduct /></AdminRoute>} />
// </Route>

// <Route path="/admin/edit-product/:id" element={<EditProduct />} />
//             <Route
//               path="/admin/manage-orders"
//               element={
//                 <AdminRoute>
//                   <ManageOrders />
//                 </AdminRoute>
//               }
//             />

//             {/* User Routes (With Layout) */}
//             <Route
//               path="/user-dashboard"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <UserDashboard />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/cart"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Cart />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/checkout"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Checkout />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/orders"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <OrderHistory />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <UserProfile />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />

//             {/* 404 Route */}
//             <Route
//               path="*"
//               element={
//                 <Layout>
//                   <NotFound />
//                 </Layout>
//               }
//             />
//           </Routes>
//         </CartProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;




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
// import EditProduct from "./pages/admin/EditProduct";
import EditProduct from "./pages/admin/EditProduct";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageOrders from "./pages/admin/ManageOrders";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ManageUsers from "./pages/admin/ManageUsers";
import CategoryDetailsProduct from "./pages/user/CategoryDetailsProduct";

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

            {/* Homepage without Layout (thus without header) */}
            <Route path="/" element={<HomePage />} />

            {/* Other Routes Wrapped in Layout */}
            <Route
              path="/order-confirmation"
              element={
                <Layout>
                  <OrderConfirmation />
                </Layout>
              }
            />
            {/* <Route
              path="/products"
              element={
                <Layout>
                  <ProductListing />
                </Layout>
              }
            /> */}
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
              path="/admin-dashboard"
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
              path="/admin/manage-users"
              element={
                <AdminRoute>
                  <ManageUsers />
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
              path="/admin/edit-product/:id"
              element={<EditProduct />}
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
              path="/user-dashboard"
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
              path="/category-details"
              element={
                <Layout>
                  <CategoryDetailsProduct />
                </Layout>
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
