
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-800">Order Confirmed!</h2>
        <p className="text-gray-600 mt-2">
          Thank you for shopping with us. Your order has been successfully placed.
        </p>
        <div className="mt-6">
          <p className="text-lg font-semibold">Order ID: <span className="text-blue-600">{orderId}</span></p>
          <p className="text-lg text-gray-700">Total Amount: ₹1,299</p>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button 
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/orders")}
          >
            Order History
          </button>
          <button 
            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
