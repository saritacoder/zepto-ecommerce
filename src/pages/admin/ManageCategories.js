"use client"

import { useState, useEffect, useRef } from "react"
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../../firebase/config"
import { Tag, Plus, Edit, Trash2, X } from "lucide-react"

const ManageCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCategory, setCurrentCategory] = useState(null)

  const nameRef = useRef()
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const categoriesSnapshot = await getDocs(collection(db, "categories"))
      const categoriesData = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setCategories(categoriesData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Failed to load categories")
      setLoading(false)
    }
  }

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

  const handleAddCategory = async (e) => {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)

      let imageUrl = null

      if (image) {
        const storageRef = ref(storage, `categories/${Date.now()}_${image.name}`)
        await uploadBytes(storageRef, image)
        imageUrl = await getDownloadURL(storageRef)
      }

      const categoryData = {
        name: nameRef.current.value,
        imageUrl,
        createdAt: new Date().toISOString(),
      }

      await addDoc(collection(db, "categories"), categoryData)

      // Reset form
      nameRef.current.value = ""
      setImage(null)
      setImagePreview(null)
      setIsAdding(false)

      // Refresh categories
      fetchCategories()
    } catch (error) {
      setError("Failed to add category: " + error.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditCategory = async (e) => {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)

      let imageUrl = currentCategory.imageUrl

      if (image) {
        const storageRef = ref(storage, `categories/${Date.now()}_${image.name}`)
        await uploadBytes(storageRef, image)
        imageUrl = await getDownloadURL(storageRef)
      }

      const categoryData = {
        name: nameRef.current.value,
        imageUrl,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(doc(db, "categories", currentCategory.id), categoryData)

      // Reset form
      setCurrentCategory(null)
      nameRef.current.value = ""
      setImage(null)
      setImagePreview(null)
      setIsEditing(false)

      // Refresh categories
      fetchCategories()
    } catch (error) {
      setError("Failed to update category: " + error.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this category? This will affect all products in this category.")
    ) {
      try {
        await deleteDoc(doc(db, "categories", id))
        setCategories(categories.filter((category) => category.id !== id))
      } catch (error) {
        console.error("Error deleting category:", error)
        setError("Failed to delete category")
      }
    }
  }

  const startEditing = (category) => {
    setCurrentCategory(category)
    setImagePreview(category.imageUrl)
    setIsEditing(true)
    setIsAdding(false)
  }

  const cancelForm = () => {
    setIsAdding(false)
    setIsEditing(false)
    setCurrentCategory(null)
    setImage(null)
    setImagePreview(null)
  }

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-900">Manage Categories</h1>
          {!isAdding && !isEditing && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {(isAdding || isEditing) && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">{isAdding ? "Add New Category" : "Edit Category"}</h2>
                <button onClick={cancelForm} className="text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={isAdding ? handleAddCategory : handleEditCategory} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      ref={nameRef}
                      required
                      defaultValue={currentCategory?.name || ""}
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Category Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <div className="flex-shrink-0">
                      {imagePreview ? (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-24 w-24 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-24 w-24 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center">
                          <Tag className="h-8 w-8 text-gray-400" />
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

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    {loading ? (isAdding ? "Adding..." : "Updating...") : isAdding ? "Add Category" : "Update Category"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            {categories.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={category.imageUrl || "/placeholder.svg?height=40&width=40"}
                                alt={category.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(category)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first category</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ManageCategories

