"use client"

import { createContext, useContext, useState, useEffect, useRef } from "react"
import { useAuth } from "./AuthContext"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "../firebase/config"

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()
  const cartRef = useRef(cart)

  // Update ref when cart changes
  useEffect(() => {
    cartRef.current = cart
  }, [cart])

  // Load cart from Firestore when user changes
  useEffect(() => {
    async function loadCart() {
      if (currentUser) {
        try {
          const cartDoc = await getDoc(doc(db, "carts", currentUser.uid))

          if (cartDoc.exists()) {
            setCart(cartDoc.data().items || [])
          } else {
            setCart([])
          }
        } catch (error) {
          console.error("Error loading cart:", error)
        }
      } else {
        // Load from localStorage if not logged in
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          setCart(JSON.parse(savedCart))
        } else {
          setCart([])
        }
      }

      setLoading(false)
    }

    loadCart()
  }, [currentUser])

  // Save cart to Firestore or localStorage when it changes
  useEffect(() => {
    if (loading) return

    async function saveCart() {
      if (currentUser) {
        try {
          await setDoc(doc(db, "carts", currentUser.uid), {
            items: cartRef.current,
            updatedAt: new Date().toISOString(),
          })
        } catch (error) {
          console.error("Error saving cart:", error)
        }
      } else {
        localStorage.setItem("cart", JSON.stringify(cartRef.current))
      }
    }

    saveCart()
  }, [cart, currentUser, loading])

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
      } else {
        return [...prevCart, { ...product, quantity }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}




//     ye avi ka code  21.3 - 17.18 ka code  
//  upper code sahi work kar raha tha


// "use client"

// import { createContext, useContext, useState, useEffect } from "react"
// import { useAuth } from "./AuthContext"
// import { doc, getDoc, updateDoc } from "firebase/firestore"
// import { db } from "../firebase/config"

// const CartContext = createContext()

// export function useCart() {
//   return useContext(CartContext)
// }

// export function CartProvider({ children }) {
//   const { currentUser } = useAuth()
//   const [cart, setCart] = useState([])
//   const [loading, setLoading] = useState(true)

//   // Load cart from localStorage or Firestore when user changes
//   useEffect(() => {
//     const fetchCart = async () => {
//       setLoading(true)

//       try {
//         if (currentUser) {
//           // User is logged in, fetch cart from Firestore
//           const userDoc = doc(db, "users", currentUser.uid)
//           const userSnapshot = await getDoc(userDoc)

//           if (userSnapshot.exists() && userSnapshot.data().cart) {
//             setCart(userSnapshot.data().cart)
//           } else {
//             // If no cart in Firestore, check localStorage
//             const localCart = localStorage.getItem("cart")
//             if (localCart) {
//               const parsedCart = JSON.parse(localCart)
//               setCart(parsedCart)

//               // Save localStorage cart to Firestore
//               await updateDoc(userDoc, { cart: parsedCart })
//             } else {
//               setCart([])
//             }
//           }
//         } else {
//           // User is not logged in, use localStorage
//           const localCart = localStorage.getItem("cart")
//           if (localCart) {
//             setCart(JSON.parse(localCart))
//           } else {
//             setCart([])
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching cart:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchCart()
//   }, [currentUser])

//   // Save cart to localStorage and Firestore when it changes
//   useEffect(() => {
//     if (!loading) {
//       // Save to localStorage
//       localStorage.setItem("cart", JSON.stringify(cart))

//       // Save to Firestore if user is logged in
//       if (currentUser) {
//         const saveToFirestore = async () => {
//           try {
//             const userDoc = doc(db, "users", currentUser.uid)
//             await updateDoc(userDoc, { cart })
//           } catch (error) {
//             console.error("Error saving cart to Firestore:", error)
//           }
//         }

//         saveToFirestore()
//       }
//     }
//   }, [cart, loading, currentUser])

//   const addToCart = (product, quantity = 1) => {
//     setCart((prevCart) => {
//       const existingItemIndex = prevCart.findIndex((item) => item.id === product.id)

//       if (existingItemIndex >= 0) {
//         // Product already in cart, update quantity
//         const updatedCart = [...prevCart]
//         updatedCart[existingItemIndex] = {
//           ...updatedCart[existingItemIndex],
//           quantity: updatedCart[existingItemIndex].quantity + quantity,
//         }
//         return updatedCart
//       } else {
//         // Product not in cart, add it
//         return [...prevCart, { ...product, quantity }]
//       }
//     })
//   }

//   const updateQuantity = (productId, quantity) => {
//     if (quantity <= 0) {
//       removeFromCart(productId)
//       return
//     }

//     setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
//   }

//   const removeFromCart = (productId) => {
//     setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
//   }

//   const clearCart = () => {
//     setCart([])
//   }

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0)
//   }

//   const getCartItemsCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0)
//   }

//   const value = {
//     cart,
//     loading,
//     addToCart,
//     updateQuantity,
//     removeFromCart,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//   }

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>
// }

