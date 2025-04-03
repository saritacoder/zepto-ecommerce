

//  below code correct , m trying to hide banner and categ.. when searched product found  jo lovera provide upper code







//  ye https://bolt.new/~/sb1-zy4ahwmr  
//  firebase me 2 se jada store karne ke liye but issue resolve nhi ho raha tried a lot


import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "sonner";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const cartRef = useRef(cart);
  const saveInProgress = useRef(false);

  // Keep cartRef in sync with cart state
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  // Load cart data
  useEffect(() => {
    async function loadCart() {
      if (currentUser) {
        try {
          const cartDoc = await getDoc(doc(db, "carts", currentUser.uid));
          if (cartDoc.exists()) {
            const cartData = cartDoc.data().items || [];
            console.log("Loaded cart from Firestore:", cartData);
            setCart(cartData);
          } else {
            setCart([]);
          }
        } catch (error) {
          console.error("Error loading cart:", error);
          toast.error("Failed to load your cart");
        }
      } else {
        try {
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            setCart(JSON.parse(savedCart));
          }
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
          setCart([]);
        }
      }
      setLoading(false);
    }

    loadCart();
  }, [currentUser]);

  // Save cart data
  useEffect(() => {
    if (loading) return;

    async function saveCart() {
      if (saveInProgress.current) return;
      
      saveInProgress.current = true;
      
      try {
        if (currentUser) {
          const cartItems = JSON.parse(JSON.stringify(cartRef.current));
          
          // Ensure we're not trying to save an undefined or invalid cart
          if (!Array.isArray(cartItems)) {
            console.error("Invalid cart data:", cartItems);
            return;
          }

          // Validate cart items before saving
          const validCartItems = cartItems.filter(item => 
            item && 
            item.id && 
            typeof item.quantity === 'number' && 
            item.quantity > 0
          );

          await setDoc(doc(db, "carts", currentUser.uid), {
            items: validCartItems,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          
          console.log("Cart saved to Firestore successfully:", validCartItems);
        } else {
          localStorage.setItem("cart", JSON.stringify(cartRef.current));
        }
      } catch (error) {
        console.error("Error saving cart:", error);
        toast.error("Failed to save your cart. Please try again.");
      } finally {
        saveInProgress.current = false;
      }
    }

    const timeoutId = setTimeout(saveCart, 500); // Increased debounce time

    return () => clearTimeout(timeoutId);
  }, [cart, currentUser, loading]);

  const addToCart = async (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error("Invalid product:", product);
      toast.error("Cannot add invalid product to cart");
      return;
    }

    try {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        
        return [...prevCart, { ...product, quantity }];
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const removeFromCart = (productId) => {
    if (!productId) {
      console.error("Invalid product ID for removal");
      return;
    }
    
    try {
      // setCart(prevCart => prevCart.filter(item => item.id !== productId));
      setCart(prevCart => {
        const updatedCart = prevCart.filter(item => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
        return updatedCart;
    });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (!productId) {
      console.error("Invalid product ID for quantity update");
      return;
    }
    
    try {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = () => {
    try {
      setCart([]); 
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}






