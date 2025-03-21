import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { ShoppingBag, User, ChevronLeft, Plus, Minus, LogOut } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { addToCart, getCartItemsCount } = useCart();
  
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const productDoc = await getDoc(doc(db, 'products', id));
        
        if (!productDoc.exists()) {
          setError('Product not found');
          setLoading(false);
          return;
        }
        
        const productData = {
          id: productDoc.id,
          ...productDoc.data()
        };
        
        setProduct(productData);
        
        // Fetch category
        if (productData.categoryId) {
          const categoryDoc = await getDoc(doc(db, 'categories', productData.categoryId));
          
          if (categoryDoc.exists()) {
            setCategory({
              id: categoryDoc.id,
              ...categoryDoc.data()
            });
          }
          
          // Fetch related products
          const relatedQuery = query(
            collection(db, 'products'),
            where('categoryId', '==', productData.categoryId),
            where('__name__', '!=', id)
          );
          
          const relatedSnapshot = await getDocs(relatedQuery);
          const relatedData = relatedSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setRelatedProducts(relatedData.slice(0, 4));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link 
            to="/products" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-700 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/products" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
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
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link 
            to="/products" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="h-96 overflow-hidden">
                <img 
                  src={product.imageUrl || "/placeholder.svg?height=384&width=100%"} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="p-6 md:w-1/2">
              <div className="mb-4">
                {category && (
                  <Link 
                    to={`/products?category=${category.id}`}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    {category.name}
                  </Link>
                )}
                <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
              </div>
              
              <div className="mb-6">
                <p className="text-3xl font-bold text-indigo-600">₹{product.price}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {product.stock > 0 ? (
                    <span className="text-green-600">In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </p>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="p-2 w-16 text-center border-t border-b border-gray-300"
                  />
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <Link
                  to="/cart"
                  className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Link 
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={relatedProduct.imageUrl || "/placeholder.svg?height=192&width=100%"} 
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-1 truncate">{relatedProduct.name}</h3>
                    <p className="text-gray-500 text-sm mb-2 line-clamp-2">{relatedProduct.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-600">₹{relatedProduct.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;
