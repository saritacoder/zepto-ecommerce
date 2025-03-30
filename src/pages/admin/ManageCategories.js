
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Categories() {
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

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

      <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full mb-3" />

      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600">
        {editId ? "Update Category" : "Add Category"}
      </button>

      <h3 className="text-lg font-semibold mt-5">Categories</h3>
      <ul className="mt-3">
        {currentItems.map((cat) => (
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1 bg-gray-100 rounded">{currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => (indexOfLastItem < categories.length ? prev + 1 : prev))}
          disabled={indexOfLastItem >= categories.length}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Go Back to Home Button (Now Below Pagination) */}
      <button
        onClick={() => navigate("/admin-dashboard")}
        className="bg-gray-500 text-white px-4 py-2 rounded-md mt-4 w-full hover:bg-gray-600"
      >
        Go Back to Home
      </button>
    </div>
  );
}




// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import { db } from "../../firebase/config";
// import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
// import { FaEdit, FaTrash } from "react-icons/fa";

// export default function Categories() {
//   const [category, setCategory] = useState("");
//   const [image, setImage] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const navigate = useNavigate(); // Initialize navigate

//   // Fetch categories from Firestore
//   useEffect(() => {
//     const fetchCategories = async () => {
//       const querySnapshot = await getDocs(collection(db, "categories"));
//       const categoryList = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setCategories(categoryList);
//     };

//     fetchCategories();
//   }, []);

//   // Convert image to Base64
//   const convertImageToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   // Add or Update Category in Firestore
//   const handleSubmit = async () => {
//     if (!category.trim()) return;

//     let imageUrl = editId ? categories.find((c) => c.id === editId)?.imageUrl : null;
//     if (image) imageUrl = await convertImageToBase64(image);

//     if (editId) {
//       await updateDoc(doc(db, "categories", editId), { name: category, imageUrl });
//       setCategories(categories.map((cat) => (cat.id === editId ? { ...cat, name: category, imageUrl } : cat)));
//       setEditId(null);
//     } else {
//       const docRef = await addDoc(collection(db, "categories"), { name: category, imageUrl });
//       setCategories([...categories, { id: docRef.id, name: category, imageUrl }]);
//       alert("Category added successfully!");
//     }

//     setCategory("");
//     setImage(null);
//   };

//   // Delete category
//   const handleDelete = async (id) => {
//     await deleteDoc(doc(db, "categories", id));
//     setCategories(categories.filter((cat) => cat.id !== id));
//   };

//   // Edit category
//   const handleEdit = (cat) => {
//     setCategory(cat.name);
//     setEditId(cat.id);
//   };

//   // Pagination Logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

//   return (
//     <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
//       {/* Go Back to Home Button */}
//       <button
//         onClick={() => navigate("/admin-dashboard")}
//         className="bg-gray-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-gray-600"
//       >
//         Go Back to Home
//       </button>

//       <h2 className="text-xl font-bold mb-4">{editId ? "Edit Category" : "Add Category"}</h2>

//       <input
//         type="text"
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//         className="w-full p-2 border rounded-md mb-3"
//         placeholder="Enter category name"
//       />

//       <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full mb-3" />

//       <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600">
//         {editId ? "Update Category" : "Add Category"}
//       </button>

//       <h3 className="text-lg font-semibold mt-5">Categories</h3>
//       <ul className="mt-3">
//         {currentItems.map((cat) => (
//           <li key={cat.id} className="p-2 border-b flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               {cat.imageUrl && <img src={cat.imageUrl} alt={cat.name} className="w-10 h-10 rounded-full" />}
//               {cat.name}
//             </div>
//             <div className="flex gap-2">
//               <button onClick={() => handleEdit(cat)} className="text-blue-500">
//                 <FaEdit />
//               </button>
//               <button onClick={() => handleDelete(cat.id)} className="text-red-500">
//                 <FaTrash />
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {/* Pagination Controls */}
//       <div className="flex justify-center mt-4 gap-2">
//         <button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <span className="px-3 py-1 bg-gray-100 rounded">{currentPage}</span>
//         <button
//           onClick={() => setCurrentPage((prev) => (indexOfLastItem < categories.length ? prev + 1 : prev))}
//           disabled={indexOfLastItem >= categories.length}
//           className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }




