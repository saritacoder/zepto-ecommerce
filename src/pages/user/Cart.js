
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingBag, User, ChevronLeft, Plus, Minus, Trash2, LogOut } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleApplyCoupon = () => {
    // In a real app, you would validate the coupon code with your backend
    if (couponCode.toLowerCase() === 'discount10') {
      setCouponApplied(true);
      setCouponDiscount(getCartTotal() * 0.1); // 10% discount
    } else {
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryFee - couponDiscount;

  return (
    <div className="min-h-screen bg-gray-50">
    
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link 
            to="/user-dashboard" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>
        
        {cart.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
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
                      {cart.map(item => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={item.imageUrl || "/placeholder.svg?height=40&width=40"}
                                  alt={item.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{item.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-1 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                className="p-1 w-12 text-center border-t border-b border-gray-300"
                              />
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-1 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => clearCart()}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Clear Cart
                </button>
                <Link
                  to="/user-dashboard"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="mb-4">
                  <div className="flex justify-between py-2 text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'Free'}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between py-2 text-green-600">
                      <span>Discount</span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="coupon"
                      className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-gray-100 text-gray-800 px-4 py-2 rounded-r-md hover:bg-gray-200"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-green-600 text-sm mt-1">Coupon applied successfully!</p>
                  )}
                </div>
                
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">Looks like you haven't added any products to your cart yet.</p>
            <Link
              to="/user-dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;


