//  fix kar rahi address , pin  ....... bina liye orde place kar raha
// https://bolt.new/~/sb1-zy4ahwmr


import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { ShoppingBag, User, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { cart, getCartTotal, getCartItemsCount, clearCart } = useCart();
  
  const formRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const pincodeRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const validateForm = () => {
    const name = nameRef.current?.value.trim();
    const phone = phoneRef.current?.value.trim();
    const address = addressRef.current?.value.trim();
    const city = cityRef.current?.value.trim();
    const state = stateRef.current?.value.trim();
    const pincode = pincodeRef.current?.value.trim();

    if (!name || !phone || !address || !city || !state || !pincode) {
      toast.error('Please fill in all required fields');
      return false;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    // Validate pincode (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!validateForm()) {
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      const orderData = {
        userId: currentUser.uid,
        userName: nameRef.current?.value.trim(),
        email: currentUser.email,
        phone: phoneRef.current?.value.trim(),
        shippingAddress: {
          address: addressRef.current?.value.trim(),
          city: cityRef.current?.value.trim(),
          state: stateRef.current?.value.trim(),
          pincode: pincodeRef.current?.value.trim()
        },
        items: cart,
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to success page
      navigate('/order-confirmation', { state: { orderId: orderRef.id } });
   
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* <Link to="/user" className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">QuickMart</h1>
            </Link> */}
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">You need to add products to your cart before checkout.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Products
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/user" className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">QuickMart</h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingBag className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartItemsCount()}
              </span>
            </Link>
            
            <div className="relative group">
              <button className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Orders
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header> */}

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link 
            to="/cart" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        ref={nameRef}
                        required
                        defaultValue={currentUser?.name || ''}
                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        ref={phoneRef}
                        required
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit phone number"
                        defaultValue={currentUser?.phone || ''}
                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      ref={addressRef}
                      required
                      rows={3}
                      className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        ref={cityRef}
                        required
                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="state"
                        ref={stateRef}
                        required
                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        ref={pincodeRef}
                        required
                        pattern="[0-9]{6}"
                        title="Please enter a valid 6-digit pincode"
                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="cod"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>
                  
                  <div className="flex items-center opacity-50">
                    <input
                      id="card"
                      name="payment-method"
                      type="radio"
                      disabled
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                      Credit/Debit Card (Coming Soon)
                    </label>
                  </div>
                  
                  <div className="flex items-center opacity-50">
                    <input
                      id="upi"
                      name="payment-method"
                      type="radio"
                      disabled
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="upi" className="ml-3 block text-sm font-medium text-gray-700">
                      UPI (Coming Soon)
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="mb-4 max-h-60 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex py-2 border-b border-gray-200">
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        src={item.imageUrl || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                      <div className="text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                type="submit"
                form={formRef.current?.id}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => formRef.current?.requestSubmit()}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>By placing your order, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;


