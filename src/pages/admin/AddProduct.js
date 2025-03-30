




"use client";

import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import { Package, ArrowLeft } from "lucide-react";

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
    const foodCategories = [
      // { id: "fruits", name: "Fruits" },
      // { id: "vegetables", name: "Vegetables" },
      // { id: "dairy", name: "Dairy Products" },
      // { id: "beverages", name: "Beverages" },
      // { id: "snacks", name: "Snacks" },
      // { id: "meat", name: "Meat & Seafood" },
      // { id: "bakery", name: "Bakery" },
      // { id: "grains", name: "Grains & Cereals" },
    ];

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

  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          const base64URL = reader.result; // Already a valid Base64 URL
          resolve(base64URL);
      };
      reader.onerror = error => reject(error);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      let imageUrl = null;
      if (image) {
        console.log(image);
        imageUrl = await convertImageToBase64(image);
        // const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
        // await uploadBytes(storageRef, image);
        // imageUrl = await getDownloadURL(storageRef);
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin/manage-products" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </Link>
            <h1 className="text-lg font-medium text-gray-900">Add New Product</h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white shadow rounded-lg p-6">
          {error && <div className="mb-4 text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input type="text" ref={nameRef} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select ref={categoryRef} required className="w-full border rounded p-2">
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea ref={descriptionRef} required className="w-full border rounded p-2"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input type="number" ref={priceRef} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Stock</label>
              <input type="number" ref={stockRef} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Image</label>
              <input type="file" onChange={handleImageChange} className="w-full border rounded p-2" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-24" />}
            </div>
            <div className="flex justify-end">
              <Link to="/admin/manage-products" className="mr-2 px-4 py-2 border rounded">Cancel</Link>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded" disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
