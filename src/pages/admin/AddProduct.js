// "use client";

// import { useRef, useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { collection, addDoc, getDocs } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { db, storage } from "../../firebase/config";
// import { Package, ArrowLeft } from "lucide-react";
// import Footer from "../../components/common/Footer";

// const AddProduct = () => {
//   const nameRef = useRef();
//   const descriptionRef = useRef();
//   const priceRef = useRef();
//   const stockRef = useRef();
//   const categoryRef = useRef();
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const foodCategories = [];

//     const fetchCategories = async () => {
//       try {
//         const categoriesSnapshot = await getDocs(collection(db, "categories"));
//         const categoriesData = categoriesSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         const uniqueCategories = [
//           ...foodCategories,
//           ...categoriesData.filter(
//             (cat) => !foodCategories.some((fc) => fc.id === cat.id)
//           ),
//         ];
//         setCategories(uniqueCategories);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setError("Failed to load categories");
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onload = () => setImagePreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   function convertImageToBase64(file) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         const base64URL = reader.result;
//         resolve(base64URL);
//       };
//       reader.onerror = (error) => reject(error);
//     });
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setError("");
//       setLoading(true);
//       let imageUrl = null;
//       if (image) {
//         imageUrl = await convertImageToBase64(image);
//       }
//       const productData = {
//         name: nameRef.current.value,
//         description: descriptionRef.current.value,
//         price: Number.parseFloat(priceRef.current.value),
//         stock: Number.parseInt(stockRef.current.value),
//         categoryId: categoryRef.current.value,
//         imageUrl,
//         featured: false,
//         createdAt: new Date().toISOString(),
//       };
//       await addDoc(collection(db, "products"), productData);
//       navigate("/admin/manage-products");
//     } catch (error) {
//       setError("Failed to add product: " + error.message);
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-blue-300 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center">
//             <Link to="/admin/manage-products" className="mr-4">
//               <ArrowLeft className="h-5 w-5 text-black-600" />
//             </Link>
//             <h1 className="text-lg font-medium text-gray-900">Add New Product</h1>
//           </div>
//         </div>
//       </header>
//       <main className="max-w-7xl mx-auto py-6 px-4">
//         <div className="bg-gray-200 shadow rounded-lg p-6">
//           {error && <div className="mb-4 text-red-700">{error}</div>}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Two-column grid layout */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Left side */}
//               <div>
//                 <label className="block text-sm font-medium">Product Name</label>
//                 <input type="text" ref={nameRef} required className="w-full border rounded p-2" />

//                 <label className="block text-sm font-medium mt-4">Category</label>
//                 <select ref={categoryRef} required className="w-full border rounded p-2">
//                   <option value="">Select a category</option>
//                   {categories.map((category) => (
//                     <option key={category.id} value={category.id}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>

//                 <label className="block text-sm font-medium mt-4">Description</label>
//                 <textarea ref={descriptionRef} required className="w-full border rounded p-2"></textarea>
//               </div>

//               {/* Right side */}
//               <div>
//                 <label className="block text-sm font-medium">Price</label>
//                 <input type="number" ref={priceRef} required className="w-full border rounded p-2" />

//                 <label className="block text-sm font-medium mt-4">Stock</label>
//                 <input type="number" ref={stockRef} required className="w-full border rounded p-2" />

//                 <label className="block text-sm font-medium mt-4">Image</label>
//                 <input type="file" onChange={handleImageChange} className="w-full border rounded p-2" />
//                 {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-24" />}
//               </div>
//             </div>

//             {/* Buttons centered */}
//             <div className="flex justify-center mt-6">
//               {/* <Link to="/admin/manage-products" className="mr-2 px-4 py-2 border rounded"> */}
//               <Link to="/admin/manage-products" className="mr-2 px-4 py-2 bg-blue-600 text-white rounded">
//                 Cancel
//               </Link>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded"
//                 disabled={loading}
//               >
//                 {loading ? "Adding..." : "Add Product"}
//               </button>
//             </div>
//           </form>
       
//         </div>
//         <Footer />
//       </main>
//     </div>
//   );
// };

// export default AddProduct;






"use client";

import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import { Package, ArrowLeft } from "lucide-react";
import Footer from "../../components/common/Footer";

const AddProduct = () => {
  const nameRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const stockRef = useRef();
  const categoryRef = useRef();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const foodCategories = [];

    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const uniqueCategories = [
          ...foodCategories,
          ...categoriesData.filter(
            (cat) => !foodCategories.some((fc) => fc.id === cat.id)
          ),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      let imageUrl = null;
      if (image) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }
      const productData = {
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        price: Number.parseFloat(priceRef.current.value),
        stock: Number.parseInt(stockRef.current.value),
        categoryId: categoryRef.current.value,
        imageUrl,
        featured: false,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, "products"), productData);
      navigate("/admin/manage-products");
    } catch (error) {
      setError("Failed to add product: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 shadow-md text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin/manage-products" className="mr-4 text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold">Add New Product</h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-gray-200 shadow-lg rounded-lg p-6">
          {error && <div className="mb-4 text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium">Product Name</label>
                <input type="text" ref={nameRef} required className="w-full bg-gray-100 border rounded p-2" />

                <label className="block text-sm font-medium mt-4">Category</label>
                <select ref={categoryRef} required className="w-full bg-gray-100 border rounded p-2">
                  <option value=""></option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium mt-4">Description</label>
                <textarea ref={descriptionRef} required className="w-full bg-gray-100 border rounded p-2"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input type="number" ref={priceRef} required className="w-full bg-gray-100 border rounded p-2" />

                <label className="block text-sm font-medium mt-4">Stock</label>
                <input type="number" ref={stockRef} required className="w-full bg-gray-100 border rounded p-2" />

                <label className="block text-sm font-medium mt-4">Image</label>
                <input type="file" onChange={handleImageChange} className="w-full border rounded p-2" />
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-24 rounded" />}
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Link to="/admin/manage-products" className="mr-2 px-4 py-2 bg-red-500 text-white rounded shadow-md hover:bg-red-600">Cancel</Link>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded shadow-md hover:bg-green-700" disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default AddProduct;