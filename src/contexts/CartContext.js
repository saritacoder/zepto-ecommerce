
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

  // Keep cartRef in sync with cart state
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  // Reset cart when user changes
  useEffect(() => {
    const currentUserId = currentUser?.uid || "guest";
    
    // Only reset if the user has actually changed
    if (previousUserId.current !== null && previousUserId.current !== currentUserId) {
      console.log(`User changed from ${previousUserId.current} to ${currentUserId}, resetting cart state`);
      setCart([]);
      setLoading(true);
    }
    
    previousUserId.current = currentUserId;
  }, [currentUser?.uid]);

  // Load cart data
  useEffect(() => {
    async function loadCart() {
      try {
        if (currentUser) {
          // For authenticated users, load from Firestore
          const cartDoc = await getDoc(doc(db, "carts", currentUser.uid));
          if (cartDoc.exists()) {
            const cartData = cartDoc.data().items || [];
            console.log("Loaded cart from Firestore for user:", currentUser.uid, cartData);
            setCart(cartData);
          } else {
            // No cart exists yet for this user
            console.log("No existing cart found for user:", currentUser.uid);
            setCart([]);
            
            // Check if there's a guest cart that needs to be migrated
            const guestCart = localStorage.getItem("guestCart");
            if (guestCart) {
              try {
                const parsedGuestCart = JSON.parse(guestCart);
                if (Array.isArray(parsedGuestCart) && parsedGuestCart.length > 0) {
                  console.log("Migrating guest cart to user account:", currentUser.uid);
                  setCart(parsedGuestCart);
                  // Guest cart will be saved to Firestore in the save effect
                  localStorage.removeItem("guestCart");
                }
              } catch (e) {
                console.error("Error parsing guest cart:", e);
              }
            }
          }
        } else {
          // For guest users, load from localStorage
          try {
            const savedCart = localStorage.getItem("guestCart");
            if (savedCart) {
              const parsedCart = JSON.parse(savedCart);
              console.log("Loaded cart from localStorage for guest user:", parsedCart);
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

  // Save cart data
  useEffect(() => {
    if (loading) return;

    async function saveCart() {
      if (saveInProgress.current) return;
      
      saveInProgress.current = true;
      
      try {
        // Get the current cart from ref to avoid closure issues
        const cartItems = JSON.parse(JSON.stringify(cartRef.current));
        
        // Ensure we're not trying to save an undefined or invalid cart
        if (!Array.isArray(cartItems)) {
          console.error("Invalid cart data:", cartItems);
          saveInProgress.current = false;
          return;
        }

        // Validate cart items before saving
        const validCartItems = cartItems.filter(item => 
          item && 
          item.id && 
          typeof item.quantity === 'number' && 
          item.quantity > 0
        );

        if (currentUser) {
          // For authenticated users, save to Firestore
          await setDoc(doc(db, "carts", currentUser.uid), {
            items: validCartItems,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          
          console.log("Cart saved to Firestore for user:", currentUser.uid, validCartItems);
        } else {
          // For guest users, save to localStorage
          localStorage.setItem("guestCart", JSON.stringify(validCartItems));
          console.log("Cart saved to localStorage for guest user");
        }
      } catch (error) {
        console.error("Error saving cart:", error);
        toast.error("Failed to save your cart. Please try again.");
      } finally {
        saveInProgress.current = false;
      }
    }

    const timeoutId = setTimeout(saveCart, 500); // Debounce time for saving

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
      setCart(prevCart => {
        const updatedCart = prevCart.filter(item => item.id !== productId);
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
      
      if (currentUser) {
        // For authenticated users, we'll let the useEffect handle saving empty cart to Firestore
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

//  upper replit ka code h

//  ye https://bolt.new/~/sb1-zy4ahwmr  
//  firebase me 2 se jada store karne ke liye but issue resolve nhi ho raha tried a lot


// import { createContext, useContext, useState, useEffect, useRef } from "react";
// import { useAuth } from "./AuthContext";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { toast } from "sonner";

// const CartContext = createContext();

// export function useCart() {
//   return useContext(CartContext);
// }

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { currentUser } = useAuth();
//   const cartRef = useRef(cart);
//   const saveInProgress = useRef(false);

//   // Keep cartRef in sync with cart state
//   useEffect(() => {
//     cartRef.current = cart;
//   }, [cart]);

//   // Load cart data
//   useEffect(() => {
//     async function loadCart() {
//       if (currentUser) {
//         try {
//           const cartDoc = await getDoc(doc(db, "carts", currentUser.uid));
//           if (cartDoc.exists()) {
//             const cartData = cartDoc.data().items || [];
//             console.log("Loaded cart from Firestore:", cartData);
//             setCart(cartData);
//           } else {
//             setCart([]);
//           }
//         } catch (error) {
//           console.error("Error loading cart:", error);
//           toast.error("Failed to load your cart");
//         }
//       } else {
//         try {
//           const savedCart = localStorage.getItem("cart");
//           if (savedCart) {
//             setCart(JSON.parse(savedCart));
//           }
//         } catch (error) {
//           console.error("Error loading cart from localStorage:", error);
//           setCart([]);
//         }
//       }
//       setLoading(false);
//     }

//     loadCart();
//   }, [currentUser]);

//   // Save cart data
//   useEffect(() => {
//     if (loading) return;

//     async function saveCart() {
//       if (saveInProgress.current) return;
      
//       saveInProgress.current = true;
      
//       try {
//         if (currentUser) {
//           const cartItems = JSON.parse(JSON.stringify(cartRef.current));
          
//           // Ensure we're not trying to save an undefined or invalid cart
//           if (!Array.isArray(cartItems)) {
//             console.error("Invalid cart data:", cartItems);
//             return;
//           }

//           // Validate cart items before saving
//           const validCartItems = cartItems.filter(item => 
//             item && 
//             item.id && 
//             typeof item.quantity === 'number' && 
//             item.quantity > 0
//           );

//           await setDoc(doc(db, "carts", currentUser.uid), {
//             items: validCartItems,
//             updatedAt: new Date().toISOString(),
//           }, { merge: true });
          
//           console.log("Cart saved to Firestore successfully:", validCartItems);
//         } else {
//           localStorage.setItem("cart", JSON.stringify(cartRef.current));
//         }
//       } catch (error) {
//         console.error("Error saving cart:", error);
//         toast.error("Failed to save your cart. Please try again.");
//       } finally {
//         saveInProgress.current = false;
//       }
//     }

//     const timeoutId = setTimeout(saveCart, 500); // Increased debounce time

//     return () => clearTimeout(timeoutId);
//   }, [cart, currentUser, loading]);

//   const addToCart = async (product, quantity = 1) => {
//     if (!product || !product.id) {
//       console.error("Invalid product:", product);
//       toast.error("Cannot add invalid product to cart");
//       return;
//     }

//     try {
//       setCart(prevCart => {
//         const existingItem = prevCart.find(item => item.id === product.id);
        
//         if (existingItem) {
//           return prevCart.map(item =>
//             item.id === product.id
//               ? { ...item, quantity: item.quantity + quantity }
//               : item
//           );
//         }
        
//         return [...prevCart, { ...product, quantity }];
//       });
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast.error("Failed to add item to cart");
//     }
//   };

//   const removeFromCart = (productId) => {
//     if (!productId) {
//       console.error("Invalid product ID for removal");
//       return;
//     }
    
//     try {
//       // setCart(prevCart => prevCart.filter(item => item.id !== productId));
//       setCart(prevCart => {
//         const updatedCart = prevCart.filter(item => item.id !== productId);
//         localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
//         return updatedCart;
//     });
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//       toast.error("Failed to remove item from cart");
//     }
//   };

//   const updateQuantity = (productId, quantity) => {
//     if (!productId) {
//       console.error("Invalid product ID for quantity update");
//       return;
//     }
    
//     try {
//       if (quantity <= 0) {
//         removeFromCart(productId);
//         return;
//       }

//       setCart(prevCart =>
//         prevCart.map(item =>
//           item.id === productId ? { ...item, quantity } : item
//         )
//       );
//     } catch (error) {
//       console.error("Error updating quantity:", error);
//       toast.error("Failed to update quantity");
//     }
//   };

//   const clearCart = () => {
//     try {
//       setCart([]); 
//       localStorage.removeItem("cart");
//     } catch (error) {
//       console.error("Error clearing cart:", error);
//       toast.error("Failed to clear cart");
//     }
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const getCartItemsCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   };

//   const value = {
//     cart,
//     loading,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// }






