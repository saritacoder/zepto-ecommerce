"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase/config"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin
        const adminDoc = await getDoc(doc(db, "admins", user.uid))

        if (adminDoc.exists()) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            ...adminDoc.data(),
          })
        } else {
          // Get user data
          const userDoc = await getDoc(doc(db, "users", user.uid))

          if (userDoc.exists()) {
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              ...userDoc.data(),
            })
          } else {
            setCurrentUser(null)
          }
        }
      } else {
        setCurrentUser(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      setCurrentUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}




//   ye 21.3 ka code h 
// upper wala code work kar raha tha 
//  ye src-hook-useAuth.js me create kiya h niche ka code jo ki m file bana li hu


// "use client"

// import { useState, useEffect, createContext, useContext } from "react"
// import { auth } from "../services/firebase"
// import { onAuthStateChanged } from "firebase/auth"

// const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user)
//       setLoading(false)
//     })

//     return () => unsubscribe()
//   }, [])

//   const value = { user }

//   return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
// }

// export const useAuth = () => {
//   return useContext(AuthContext)
// }

