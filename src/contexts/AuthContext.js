import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed. User:", user ? user.uid : 'logged out'); 

      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          if (adminDoc.exists()) {
            console.log("Admin found:", adminDoc.data()); 
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              ...adminDoc.data(),
            });
          } else {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              console.log("User found:", userDoc.data()); 
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                ...userDoc.data(),
              });
            } else {
              console.log("No user document found.");
              setCurrentUser({
                uid: user.uid,
                email: user.email,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Still set the user with basic info even if we can't fetch the document
          setCurrentUser({
            uid: user.uid,
            email: user.email,
          });
        }
      } else {
        console.log("No authenticated user.");
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

// UPER REPLITE Ka code h

// "use client"

// import { createContext, useContext, useState, useEffect } from "react";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../firebase/config";

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       console.log("Auth state changed. User:", user); // Debugging

//       if (user) {
//         try {
//           const adminDoc = await getDoc(doc(db, "admins", user.uid));
//           if (adminDoc.exists()) {
//             console.log("Admin found:", adminDoc.data()); // Debugging
//             setCurrentUser({
//               uid: user.uid,
//               email: user.email,
//               ...adminDoc.data(),
//             });
//           } else {
//             const userDoc = await getDoc(doc(db, "users", user.uid));
//             if (userDoc.exists()) {
//               console.log("User found:", userDoc.data()); // Debugging
//               setCurrentUser({
//                 uid: user.uid,
//                 email: user.email,
//                 ...userDoc.data(),
//               });
//             } else {
//               console.log("No user document found.");
//               setCurrentUser(null);
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           setCurrentUser(null);
//         }
//       } else {
//         console.log("No authenticated user.");
//         setCurrentUser(null);
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setCurrentUser(null);
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   const value = {
//     currentUser,
//     setCurrentUser,
//     loading,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
// }

