
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import Footer from "../../components/common/Footer";

export default function Categories() {
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const fileInputRef = useRef(); 

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

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!category.trim()) return;

    const isDuplicate = categories.some((cat) => cat.name.toLowerCase() === category.toLowerCase());
    if (isDuplicate && !editId) {
      alert("Category already exists!");
      setCategory(""); 
      setImage(null); 
      if (fileInputRef.current) fileInputRef.current.value = ""; 
      return;
    }

    let imageUrl = editId ? categories.find((c) => c.id === editId)?.imageUrl : null;
    if (image) imageUrl = await convertImageToBase64(image);

    if (editId) {
      await updateDoc(doc(db, "categories", editId), { name: category, imageUrl });
      setCategories(categories.map((cat) => (cat.id === editId ? { ...cat, name: category, imageUrl } : cat)));
      setEditId(null);
    } else {
      const docRef = await addDoc(collection(db, "categories"), { name: category, imageUrl });
      setCategories([{ id: docRef.id, name: category, imageUrl }, ...categories]);
      alert("Category added successfully!");
    }

    setCategory("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "categories", id));
    setCategories(categories.filter((cat) => cat.id !== id));
    alert("Category deleted successfully!");
  };

  const handleEdit = (cat) => {
    setCategory(cat.name);
    setEditId(cat.id);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="bg-gray-800 text-white py-3 px-6 flex items-center">
        <button onClick={() => navigate("/admin-dashboard")} className="flex items-center text-white hover:text-gray-300">
          <FaArrowLeft className="mr-2" /> Back to Admin Dashboard
        </button>
      </div>

      <div className="min-h-screen flex justify-center items-center bg-gray-400">
        <div className="w-[60rem] mx-auto p-4 bg-white shadow-lg rounded-lg">
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
            ref={fileInputRef} // 👈 added ref here
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

          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-gray-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-gray-600 block mx-auto"
          >
            Go Back to Home
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}







