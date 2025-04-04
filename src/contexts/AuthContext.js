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
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Added login state

//   useEffect(() => {
//     const user = localStorage.getItem("user"); // Check login status from storage
//     setIsLoggedIn(!!user);

//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       console.log("Auth state changed. User:", user ? user.uid : "logged out");

//       if (user) {
//         try {
//           const adminDoc = await getDoc(doc(db, "admins", user.uid));
//           if (adminDoc.exists()) {
//             console.log("Admin found:", adminDoc.data());
//             const userData = {
//               uid: user.uid,
//               email: user.email,
//               ...adminDoc.data(),
//             };
//             setCurrentUser(userData);
//             localStorage.setItem("user", JSON.stringify(userData)); // Store user in local storage
//             setIsLoggedIn(true);
//           } else {
//             const userDoc = await getDoc(doc(db, "users", user.uid));
//             if (userDoc.exists()) {
//               console.log("User found:", userDoc.data());
//               const userData = {
//                 uid: user.uid,
//                 email: user.email,
//                 ...userDoc.data(),
//               };
//               setCurrentUser(userData);
//               localStorage.setItem("user", JSON.stringify(userData)); // Store user in local storage
//               setIsLoggedIn(true);
//             } else {
//               console.log("No user document found.");
//               const userData = {
//                 uid: user.uid,
//                 email: user.email,
//               };
//               setCurrentUser(userData);
//               localStorage.setItem("user", JSON.stringify(userData)); // Store user in local storage
//               setIsLoggedIn(true);
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           setCurrentUser({
//             uid: user.uid,
//             email: user.email,
//           });
//           localStorage.setItem("user", JSON.stringify({ uid: user.uid, email: user.email })); // Store basic info
//           setIsLoggedIn(true);
//         }
//       } else {
//         console.log("No authenticated user.");
//         setCurrentUser(null);
//         localStorage.removeItem("user"); // Remove user from local storage
//         setIsLoggedIn(false);
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const login = (userData) => {
//     localStorage.setItem("user", JSON.stringify(userData));
//     setIsLoggedIn(true);
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setCurrentUser(null);
//       localStorage.removeItem("user");
//       setIsLoggedIn(false);
//       console.log("User logged out successfully");
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   const value = {
//     currentUser,
//     setCurrentUser,
//     loading,
//     isLoggedIn,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
// }






// belwo code work karraha tha , header impl.....


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


