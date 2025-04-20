
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
  const previousUserId = useRef(null);


  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);


  useEffect(() => {
    const currentUserId = currentUser?.uid || "guest";
    
    
    if (previousUserId.current !== null && previousUserId.current !== currentUserId) {
      console.log(`User changed from ${previousUserId.current} to ${currentUserId}, resetting cart state`);
      setCart([]);
      setLoading(true);
    }
    
    previousUserId.current = currentUserId;
  }, [currentUser?.uid]);


  useEffect(() => {
    async function loadCart() {
      try {
        if (currentUser) {
          
          const cartDoc = await getDoc(doc(db, "carts", currentUser.uid));
          if (cartDoc.exists()) {
            const cartData = cartDoc.data().items || [];
            console.log(currentUser.uid, cartData);
            setCart(cartData);
          } else {
         
            console.log(currentUser.uid);
            setCart([]);
            
   
            const guestCart = localStorage.getItem("guestCart");
            if (guestCart) {
              try {
                const parsedGuestCart = JSON.parse(guestCart);
                if (Array.isArray(parsedGuestCart) && parsedGuestCart.length > 0) {
                  console.log( currentUser.uid);
                  setCart(parsedGuestCart);
                 
                  localStorage.removeItem("guestCart");
                }
              } catch (e) {
                console.error( e); 
              }
            }
          }
        } else {
          
          try {
            const savedCart = localStorage.getItem("guestCart");
            if (savedCart) {
              const parsedCart = JSON.parse(savedCart);
              console.log( parsedCart);
              setCart(parsedCart);
            } else {
              setCart([]);
            }
          } catch (error) {
            console.error("Error loading cart from localStorage:", error);
            setCart([]);
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        toast.error("Failed to load your cart");
        setCart([]);
      } finally {
        setLoading(false);
      }
    }

    loadCart();    
  }, [currentUser]);

  
  useEffect(() => {
    if (loading) return;

    async function saveCart() {
      if (saveInProgress.current) return;
      
      saveInProgress.current = true;
      
      try {
        
        const cartItems = JSON.parse(JSON.stringify(cartRef.current));
        
       
        if (!Array.isArray(cartItems)) {
          console.error("Invalid cart data:", cartItems);
          saveInProgress.current = false;
          return;
        }

 
        const validCartItems = cartItems.filter(item => 
          item && 
          item.id && 
          typeof item.quantity === 'number' && 
          item.quantity > 0
        );

        if (currentUser) {
        
          await setDoc(doc(db, "carts", currentUser.uid), {
            items: validCartItems,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          
          console.log( currentUser.uid, validCartItems);
        } else {
         
          localStorage.setItem("guestCart", JSON.stringify(validCartItems));
          console.log("Cart saved");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to save your cart. Please try again.");
      } finally {
        saveInProgress.current = false;
      }
    }

    const timeoutId = setTimeout(saveCart, 500); 

    return () => clearTimeout(timeoutId);
  }, [cart, currentUser, loading]);

  const addToCart = async (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error( product);
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
      console.error(error);
      toast.error("Failed to add item to cart");
    }
  };

  const removeFromCart = (productId) => {
    if (!productId) {
      console.error("Invalid product ID ");
      return;
    }
    
    try {
      setCart(prevCart => {
        const updatedCart = prevCart.filter(item => item.id !== productId);
        return updatedCart;
      });
    } catch (error) {
      console.error(error);
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
      
      if (currentUser) {
      
      } else {
        localStorage.removeItem("guestCart");
      }
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
