import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      if (isEditMode) {
        try {
          const productDoc = await getDoc(doc(db, "products", id));
          if (productDoc.exists()) {
            const productData = productDoc.data();
            setFormData({
              name: productData.name || "",
              description: productData.description || "",
              price: productData.price?.toString() || "",
              stock: productData.stock?.toString() || "",
              imageUrl: productData.imageUrl || "",
              categoryId: productData.categoryId || "",
            });
            setSelectedCategory(productData.categoryId || "");
            setImagePreview(productData.imageUrl || null);
          } else {
            setError("Product not found");
            navigate("/admin/manage-products");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          setError("Failed to load product data");
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchProductData();
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        categoryId: selectedCategory,
        imageUrl: formData.imageUrl,
      };
      await updateDoc(doc(db, "products", id), updatedProduct);
      navigate("/admin/manage-products");
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || '';

  return (
    <div className="min-h-screen bg-gray-400 py-8">
    {/* // <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 py-8"> */}
      <div className="max-w-2xl mx-auto bg-black rounded-lg shadow-md p-6">
      {/* <div className="max-w-2xl mx-auto bg-gray rounded-lg shadow-md p-6"> */}
        <h2 className="text-2xl font-bold text-white mb-6">
          {isEditMode ? "Edit Product" : "Add Product"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {!initialLoading && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {selectedCategoryName && (
                <p className="mt-1 text-sm text-gray-500">
                  Current category: {selectedCategoryName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Product" 
                    className="w-full h-48 object-contain rounded-lg border border-gray-200" 
                  />
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className="w-48 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {isEditMode ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProduct;



// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { db } from "../../firebase/config";
// import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

// const EditProduct = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEditMode = Boolean(id);

//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [error, setError] = useState(null);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     stock: "",
//     featured: false,
//     imageUrl: "",
//     categoryId: "",
//   });

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const categoriesSnapshot = await getDocs(collection(db, "categories"));
//         const categoriesData = categoriesSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setCategories(categoriesData);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setError("Failed to load categories");
//       }
//     };

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const fetchProductData = async () => {
//       if (isEditMode) {
//         try {
//           const productDoc = await getDoc(doc(db, "products", id));
//           if (productDoc.exists()) {
//             const productData = productDoc.data();
//             setFormData({
//               name: productData.name || "",
//               description: productData.description || "",
//               price: productData.price?.toString() || "",
//               stock: productData.stock?.toString() || "",
//               featured: productData.featured || false,
//               imageUrl: productData.imageUrl || "",
//               categoryId: productData.categoryId || "",
//             });
//             setSelectedCategory(productData.categoryId || "");
//             setImagePreview(productData.imageUrl || null);
//           } else {
//             setError("Product not found");
//             navigate("/admin/manage-products");
//           }
//         } catch (error) {
//           console.error("Error fetching product:", error);
//           setError("Failed to load product data");
//         } finally {
//           setInitialLoading(false);
//         }
//       }
//     };

//     fetchProductData();
//   }, [id, isEditMode, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const updatedProduct = {
//         name: formData.name,
//         description: formData.description,
//         price: parseFloat(formData.price),
//         stock: parseInt(formData.stock, 10),
//         categoryId: selectedCategory,
//         featured: formData.featured,
//         imageUrl: formData.imageUrl,
//       };
//       await updateDoc(doc(db, "products", id), updatedProduct);
//       navigate("/admin/manage-products");
//     } catch (error) {
//       console.error("Error updating product:", error);
//       setError("Failed to update product");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || '';

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">
//             {isEditMode ? "Edit Product" : "Add Product"}
//           </h2>
//           {imagePreview && (
//             <div className="flex items-center">
//               <span className="text-sm text-gray-500 mr-2">Current Image:</span>
//               <img 
//                 src={imagePreview} 
//                 alt="Product" 
//                 className="w-16 h-16 object-cover rounded-lg border border-gray-200" 
//               />
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}

//         {!initialLoading && (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Product Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter product name"
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Enter product description"
//                 required
//                 rows={4}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Price (₹)
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleChange}
//                   placeholder="0.00"
//                   required
//                   min="0"
//                   step="0.01"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Stock
//                 </label>
//                 <input
//                   type="number"
//                   name="stock"
//                   value={formData.stock}
//                   onChange={handleChange}
//                   placeholder="0"
//                   required
//                   min="0"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category
//               </label>
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select a category</option>
//                 {categories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//               {selectedCategoryName && (
//                 <p className="mt-1 text-sm text-gray-500">
//                   Current category: {selectedCategoryName}
//                 </p>
//               )}
//             </div>

//             <div className="flex items-center mt-4">
//               <input
//                 type="checkbox"
//                 name="featured"
//                 checked={formData.featured}
//                 onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label className="ml-2 block text-sm text-gray-700">
//                 Featured Product
//               </label>
//             </div>

//             <div className="pt-4">
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//               >
//                 {isEditMode ? "Update Product" : "Add Product"}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditProduct;


