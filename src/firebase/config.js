
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAlbRHHuYcbi1Q3d6Hd4sXaFm9S6gCI-24",
  authDomain: "zepto-ecommerce.firebaseapp.com",
  databaseURL: "https://zepto-ecommerce-default-rtdb.firebaseio.com",
  projectId: "zepto-ecommerce",
  storageBucket: "zepto-ecommerce.firebasestorage.app",
  messagingSenderId: "437400755758",
  appId: "1:437400755758:web:9f755a6e86a761a041c9bf",
  measurementId: "G-WJSK4VVPT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

