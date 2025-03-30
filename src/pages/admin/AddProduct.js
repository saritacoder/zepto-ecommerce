"use client"

import { useRef, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { collection, addDoc, getDocs } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../../firebase/config"
import { Package, ArrowLeft } from "lucide-react"

const AddProduct = () => {
  const nameRef = useRef()
  const descriptionRef = useRef()
  const priceRef = useRef()
  const stockRef = useRef()
  const categoryRef = useRef()
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"))
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load categories")
      }
    }

    fetchCategories()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setImage(file)

      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)

      let imageUrl = null

      if (image) {
        const storageRef = ref(storage, `products/${Date.now()}_${image.name}`)
        await uploadBytes(storageRef, image)
        imageUrl = await getDownloadURL(storageRef)
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
      }

      await addDoc(collection(db, "products"), productData)

      navigate("/admin/manage-products")
    } catch (error) {
      setError("Failed to add product: " + error.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin/manage-products" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </Link>
            <h1 className="text-lg font-medium text-gray-900">Add New Product</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            {error && (
              <div
                className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      ref={nameRef}
                      required
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <div className="mt-1">
                    <select
                      id="category"
                      ref={categoryRef}
                      required
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      rows={3}
                      ref={descriptionRef}
                      required
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (₹)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="price"
                      min="0"
                      step="0.01"
                      ref={priceRef}
                      required
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="stock"
                      min="0"
                      ref={stockRef}
                      required
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Product Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <div className="flex-shrink-0">
                      {imagePreview ? (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="relative bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm flex items-center cursor-pointer hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                        <label
                          htmlFor="image-upload"
                          className="relative text-sm font-medium text-gray-700 pointer-events-none"
                        >
                          <span>Upload a file</span>
                        </label>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/admin/manage-products"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {loading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddProduct






// "use client";

// import { useRef, useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { collection, addDoc, getDocs } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { db, storage } from "../../firebase/config";
// import { Package, ArrowLeft } from "lucide-react";

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
//     const foodCategories = [
//       { id: "fruits", name: "Fruits" },
//       { id: "vegetables", name: "Vegetables" },
//       { id: "dairy", name: "Dairy Products" },
//       { id: "beverages", name: "Beverages" },
//       { id: "snacks", name: "Snacks" },
//       { id: "meat", name: "Meat & Seafood" },
//       { id: "bakery", name: "Bakery" },
//       { id: "grains", name: "Grains & Cereals" },
//     ];

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
//           const base64URL = reader.result; // Already a valid Base64 URL
//           resolve(base64URL);
//       };
//       reader.onerror = error => reject(error);
//     });
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setError("");
//       setLoading(true);
//       let imageUrl = null;
//       if (image) {
//         console.log(image);
//         imageUrl = await convertImageToBase64(image);
//         // const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
//         // await uploadBytes(storageRef, image);
//         // imageUrl = await getDownloadURL(storageRef);
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
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center">
//             <Link to="/admin/manage-products" className="mr-4">
//               <ArrowLeft className="h-5 w-5 text-gray-500" />
//             </Link>
//             <h1 className="text-lg font-medium text-gray-900">Add New Product</h1>
//           </div>
//         </div>
//       </header>
//       <main className="max-w-7xl mx-auto py-6 px-4">
//         <div className="bg-white shadow rounded-lg p-6">
//           {error && <div className="mb-4 text-red-700">{error}</div>}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium">Product Name</label>
//               <input type="text" ref={nameRef} required className="w-full border rounded p-2" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Category</label>
//               <select ref={categoryRef} required className="w-full border rounded p-2">
//                 <option value="">Select a category</option>
//                 {categories.map((category) => (
//                   <option key={category.id} value={category.id}>{category.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Description</label>
//               <textarea ref={descriptionRef} required className="w-full border rounded p-2"></textarea>
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Price</label>
//               <input type="number" ref={priceRef} required className="w-full border rounded p-2" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Stock</label>
//               <input type="number" ref={stockRef} required className="w-full border rounded p-2" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Image</label>
//               <input type="file" onChange={handleImageChange} className="w-full border rounded p-2" />
//               {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-24" />}
//             </div>
//             <div className="flex justify-end">
//               <Link to="/admin/manage-products" className="mr-2 px-4 py-2 border rounded">Cancel</Link>
//               <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded" disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
//             </div>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AddProduct;
