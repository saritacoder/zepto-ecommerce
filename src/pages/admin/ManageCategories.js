import { useState, useEffect } from "react";
// import { db } from "./firebase";
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Categories() {
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoryList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryList);
    };

    fetchCategories();
  }, []);

  // Convert image to Base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Add or Update Category in Firestore
  const handleSubmit = async () => {
    if (!category.trim()) return;

    let imageUrl = editId ? categories.find((c) => c.id === editId)?.imageUrl : null;
    if (image) imageUrl = await convertImageToBase64(image);

    if (editId) {
      await updateDoc(doc(db, "categories", editId), { name: category, imageUrl });
      setCategories(categories.map((cat) => (cat.id === editId ? { ...cat, name: category, imageUrl } : cat)));
      setEditId(null);
    } else {
      const docRef = await addDoc(collection(db, "categories"), { name: category, imageUrl });
      setCategories([...categories, { id: docRef.id, name: category, imageUrl }]);
      alert("Category added successfully!");
    }

    setCategory("");
    setImage(null);
  };

  // Delete category
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "categories", id));
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  // Edit category
  const handleEdit = (cat) => {
    setCategory(cat.name);
    setEditId(cat.id);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">{editId ? "Edit Category" : "Add Category"}</h2>

      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded-md mb-3"
        placeholder="Enter category name"
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full mb-3"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600"
      >
        {editId ? "Update Category" : "Add Category"}
      </button>

      <h3 className="text-lg font-semibold mt-5">Categories</h3>
      <ul className="mt-3">
        {categories.map((cat) => (
          <li key={cat.id} className="p-2 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              {cat.imageUrl && <img src={cat.imageUrl} alt={cat.name} className="w-10 h-10 rounded-full" />}
              {cat.name}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(cat)} className="text-blue-500">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(cat.id)} className="text-red-500">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}





// import { useState, useEffect } from "react";
// // import { db } from "./firebase"; 
// import { db } from "../../firebase/config";
// import { collection, addDoc, getDocs } from "firebase/firestore";

// export default function Categories() {
//   const [category, setCategory] = useState("");
//   const [categories, setCategories] = useState([]);

//   // Fetch categories from Firestore
//   useEffect(() => {
//     const fetchCategories = async () => {
//       const querySnapshot = await getDocs(collection(db, "categories"));
//       const categoryList = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         name: doc.data().name,
//       }));
//       setCategories(categoryList);
//     };

//     fetchCategories();
//   }, []);

//   // Add category to Firestore
//   const addCategory = async () => {
//     if (!category.trim()) return;

//     const docRef = await addDoc(collection(db, "categories"), {
//       name: category,
//     });

//     setCategories([...categories, { id: docRef.id, name: category }]);
//     setCategory(""); // Reset input field
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-bold mb-4">Add Category</h2>
//       <input
//         type="text"
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//         className="w-full p-2 border rounded-md mb-3"
//         placeholder="Enter category name"
//       />
//       <button
//         onClick={addCategory}
//         className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600"
//       >
//         Add Category
//       </button>

//       <h3 className="text-lg font-semibold mt-5">Categories</h3>
//       <ul className="mt-3">
//         {categories.map((cat) => (
//           <li key={cat.id} className="p-2 border-b">
//             {cat.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }






// below code firestore me add nhi ho raah


// import { useState } from "react";

// const CategoryManager = () => {
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState("");
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = (index = null) => {
//     setEditingIndex(index);
//     setNewCategory(index !== null ? categories[index] : "");
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setNewCategory("");
//     setEditingIndex(null);
//   };

//   const handleSave = () => {
//     if (newCategory.trim() === "") return;
//     if (editingIndex !== null) {
//       const updatedCategories = [...categories];
//       updatedCategories[editingIndex] = newCategory;
//       setCategories(updatedCategories);
//     } else {
//       setCategories([...categories, newCategory]);
//     }
//     closeModal();
//   };

//   const handleDelete = (index) => {
//     setCategories(categories.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h2 className="text-2xl font-semibold mb-4">Category Manager</h2>
//       <button 
//         className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//         onClick={() => openModal()}
//       >
//         Add Category
//       </button>
//       <ul className="mt-4 space-y-2">
//         {categories.map((category, index) => (
//           <li 
//             key={index} 
//             className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
//           >
//             <span>{category}</span>
//             <div>
//               <button 
//                 className="text-blue-500 hover:underline mr-2" 
//                 onClick={() => openModal(index)}
//               >
//                 Edit
//               </button>
//               <button 
//                 className="text-red-500 hover:underline" 
//                 onClick={() => handleDelete(index)}
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-lg font-semibold mb-3">
//               {editingIndex !== null ? "Edit Category" : "Add Category"}
//             </h3>
//             <input 
//               type="text" 
//               className="border border-gray-300 p-2 rounded-md w-full"
//               value={newCategory} 
//               onChange={(e) => setNewCategory(e.target.value)} 
//             />
//             <div className="mt-4 flex justify-end space-x-2">
//               <button 
//                 className="bg-gray-300 px-4 py-2 rounded-md" 
//                 onClick={closeModal}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" 
//                 onClick={handleSave}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryManager;






// gpt below code ko cut off bol raha meand code complete nhi h 

// "use client"

// import { useState, useEffect, useRef } from "react"
// import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore"
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
// import { db, storage } from "../../firebase/config"
// import { Tag, Plus, Edit, Trash2, X } from "lucide-react"

// const ManageCategories = () => {
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [isAdding, setIsAdding] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [currentCategory, setCurrentCategory] = useState(null)

//   const nameRef = useRef()
//   const [image, setImage] = useState(null)
//   const [imagePreview, setImagePreview] = useState(null)

//   useEffect(() => {
//     fetchCategories()
//   }, [])

//   const fetchCategories = async () => {
//     try {
//       const categoriesSnapshot = await getDocs(collection(db, "categories"))
//       const categoriesData = categoriesSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }))

//       setCategories(categoriesData)
//       setLoading(false)
//     } catch (error) {
//       console.error("Error fetching categories:", error)
//       setError("Failed to load categories")
//       setLoading(false)
//     }
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]

//     if (file) {
//       setImage(file)

//       const reader = new FileReader()
//       reader.onload = () => {
//         setImagePreview(reader.result)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleAddCategory = async (e) => {
//     e.preventDefault()

//     try {
//       setError("")
//       setLoading(true)

//       let imageUrl = null

//       if (image) {
//         const storageRef = ref(storage, `categories/${Date.now()}_${image.name}`)
//         await uploadBytes(storageRef, image)
//         imageUrl = await getDownloadURL(storageRef)
//       }

//       const categoryData = {
//         name: nameRef.current.value,
//         imageUrl,
//         createdAt: new Date().toISOString(),
//       }

//       await addDoc(collection(db, "categories"), categoryData)

//       // Reset form
//       nameRef.current.value = ""
//       setImage(null)
//       setImagePreview(null)
//       setIsAdding(false)

//       // Refresh categories
//       fetchCategories()
//     } catch (error) {
//       setError("Failed to add category: " + error.message)
//       console.error(error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEditCategory = async (e) => {
//     e.preventDefault()

//     try {
//       setError("")
//       setLoading(true)

//       let imageUrl = currentCategory.imageUrl

//       if (image) {
//         const storageRef = ref(storage, `categories/${Date.now()}_${image.name}`)
//         await uploadBytes(storageRef, image)
//         imageUrl = await getDownloadURL(storageRef)
//       }

//       const categoryData = {
//         name: nameRef.current.value,
//         imageUrl,
//         updatedAt: new Date().toISOString(),
//       }

//       await updateDoc(doc(db, "categories", currentCategory.id), categoryData)

//       // Reset form
//       setCurrentCategory(null)
//       nameRef.current.value = ""
//       setImage(null)
//       setImagePreview(null)
//       setIsEditing(false)

//       // Refresh categories
//       fetchCategories()
//     } catch (error) {
//       setError("Failed to update category: " + error.message)
//       console.error(error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (
//       window.confirm("Are you sure you want to delete this category? This will affect all products in this category.")
//     ) {
//       try {
//         await deleteDoc(doc(db, "categories", id))
//         setCategories(categories.filter((category) => category.id !== id))
//       } catch (error) {
//         console.error("Error deleting category:", error)
//         setError("Failed to delete category")
//       }
//     }
//   }

//   const startEditing = (category) => {
//     setCurrentCategory(category)
//     setImagePreview(category.imageUrl)
//     setIsEditing(true)
//     setIsAdding(false)
//   }

//   const cancelForm = () => {
//     setIsAdding(false)
//     setIsEditing(false)
//     setCurrentCategory(null)
//     setImage(null)
//     setImagePreview(null)
//   }

//   if (loading && categories.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
//           <h1 className="text-lg font-medium text-gray-900">Manage Categories</h1>
//           {!isAdding && !isEditing && (
//             <button
//               onClick={() => setIsAdding(true)}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add Category
//             </button>
//           )}
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           {error && (
//             <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//               <span className="block sm:inline">{error}</span>
//             </div>
//           )}

//           {(isAdding || isEditing) && (
//             <div className="bg-white shadow rounded-lg p-6 mb-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-medium text-gray-900">{isAdding ? "Add New Category" : "Edit Category"}</h2>
//                 <button onClick={cancelForm} className="text-gray-400 hover:text-gray-500">
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>

//               <form onSubmit={isAdding ? handleAddCategory : handleEditCategory} className="space-y-6">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                     Category Name
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="name"
//                       ref={nameRef}
//                       required
//                       defaultValue={currentCategory?.name || ""}
//                       className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="image" className="block text-sm font-medium text-gray-700">
//                     Category Image
//                   </label>
//                   <div className="mt-1 flex items-center">
//                     <div className="flex-shrink-0">
//                       {imagePreview ? (
//                         <img
//                           src={imagePreview || "/placeholder.svg"}
//                           alt="Preview"
//                           className="h-24 w-24 object-cover rounded-md"
//                         />
//                       ) : (
//                         <div className="h-24 w-24 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center">
//                           <Tag className="h-8 w-8 text-gray-400" />
//                         </div>
//                       )}
//                     </div>
//                     <div className="ml-4">
//                       <div className="relative bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm flex items-center cursor-pointer hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
//                         <label
//                           htmlFor="image-upload"
//                           className="relative text-sm font-medium text-gray-700 pointer-events-none"
//                         >
//                           <span>Upload a file</span>
//                         </label>
//                         <input
//                           id="image-upload"
//                           name="image-upload"
//                           type="file"
//                           accept="image/*"
//                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                           onChange={handleImageChange}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end">
//                   <button
//                     type="button"
//                     onClick={cancelForm}
//                     className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//                   >
//                     {loading ? (isAdding ? "Adding..." : "Updating...") : isAdding ? "Add Category" : "Update Category"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             {categories.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Category
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Created At
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {categories.map((category) => (
//                       <tr key={category.id}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10">
//                               <img
//                                 className="h-10 w-10 rounded-full object-cover"
//                                 src={category.imageUrl || "/placeholder.svg?height=40&width=40"}
//                                 alt={category.name}
//                               />
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">{category.name}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">
//                             {new Date(category.createdAt).toLocaleDateString()}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => startEditing(category)}
//                               className="text-indigo-600 hover:text-indigo-900"
//                             >
//                               <Edit className="h-5 w-5" />
//                             </button>
//                             <button
//                               onClick={() => handleDelete(category.id)}
//                               className="text-red-600 hover:text-red-900"
//                             >
//                               <Trash2 className="h-5 w-5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="p-6 text-center">
//                 <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
//                 <p className="text-gray-500 mb-4">Get started by adding your first category</p>
//                 <button
//                   onClick={() => setIsAdding(true)}
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Category
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default ManageCategories

