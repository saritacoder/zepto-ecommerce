import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ShoppingBag } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const orderId = urlParams.get('orderId');

        if (!orderId) {
          setError('Order ID not found');
          setLoading(false);
          return;
        }

        const orderDoc = doc(db, 'orders', orderId);
        const orderSnapshot = await getDoc(orderDoc);

        if (orderSnapshot.exists()) {
          setOrder({ id: orderSnapshot.id, ...orderSnapshot.data() });
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location.search]);

  if (loading) {
    return <div className="text-center">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Link to="/" className="text-blue-500 underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center">Order Confirmed!</h1>
      <p className="text-center">Thank you for your purchase.</p>
      <div className="mt-4 border p-4 rounded-lg shadow-md">
        <p><strong>Order ID:</strong> {order?.id}</p>
        <p><strong>Date:</strong> {order?.createdAt && new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {order?.status || 'Processing'}</p>
        <h2 className="mt-4 text-lg font-semibold">Order Summary</h2>
        <ul>
          {order?.items?.map((item) => (
            <li key={item.id} className="flex justify-between py-2 border-b">
              <span>{item.name} (x{item.quantity})</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <h2 className="mt-4 text-lg font-semibold">Total: ₹{order?.total?.toFixed(2)}</h2>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <Link to="/orders" className="text-blue-500 underline">Order History</Link>
        <Link to="/user-dashboard" className="text-blue-500 underline">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
