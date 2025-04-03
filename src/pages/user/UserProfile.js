"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { updateEmail, updatePassword } from "firebase/auth"
import { db } from "../../firebase/config"
import { useAuth } from "../../contexts/AuthContext"
import { FiUser, FiMapPin, FiLock, FiSave,FiArrowLeft } from "react-icons/fi"

export default function UserProfile() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [addresses, setAddresses] = useState([])
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return

      try {
        const userDoc = doc(db, "users", currentUser.uid)
        const userSnapshot = await getDoc(userDoc)

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data()
          setProfile({
            name: userData.name || "",
            email: currentUser.email || "",
            phone: userData.phone || "",
          })

          setAddresses(userData.addresses || [])
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setErrorMessage("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [currentUser])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value,
    })
  }

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewAddress({
      ...newAddress,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Update profile in Firestore
      const userDoc = doc(db, "users", currentUser.uid)
      await updateDoc(userDoc, {
        name: profile.name,
        phone: profile.phone,
      })

      // Update email if changed
      if (profile.email !== currentUser.email) {
        await updateEmail(currentUser, profile.email)
      }

      setSuccessMessage("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrorMessage("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const addAddress = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const userDoc = doc(db, "users", currentUser.uid)

      // If this is the default address, unset default on others
      let updatedAddresses = [...addresses]
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }))
      }

      // Add new address
      updatedAddresses.push({
        ...newAddress,
        id: Date.now().toString(),
      })

      // If this is the first address, make it default
      if (updatedAddresses.length === 1) {
        updatedAddresses[0].isDefault = true
      }

      await updateDoc(userDoc, {
        addresses: updatedAddresses,
      })

      setAddresses(updatedAddresses)
      setNewAddress({
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        isDefault: false,
      })

      setSuccessMessage("Address added successfully")
    } catch (error) {
      console.error("Error adding address:", error)
      setErrorMessage("Failed to add address")
    } finally {
      setSaving(false)
    }
  }

  const removeAddress = async (addressId) => {
    setSaving(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const userDoc = doc(db, "users", currentUser.uid)

      // Remove address
      const updatedAddresses = addresses.filter((addr) => addr.id !== addressId)

      // If we removed the default address and there are other addresses, make the first one default
      if (addresses.find((addr) => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true
      }

      await updateDoc(userDoc, {
        addresses: updatedAddresses,
      })

      setAddresses(updatedAddresses)
      setSuccessMessage("Address removed successfully")
    } catch (error) {
      console.error("Error removing address:", error)
      setErrorMessage("Failed to remove address")
    } finally {
      setSaving(false)
    }
  }

  const setDefaultAddress = async (addressId) => {
    setSaving(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const userDoc = doc(db, "users", currentUser.uid)

      // Update addresses
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))

      await updateDoc(userDoc, {
        addresses: updatedAddresses,
      })

      setAddresses(updatedAddresses)
      setSuccessMessage("Default address updated")
    } catch (error) {
      console.error("Error updating default address:", error)
      setErrorMessage("Failed to update default address")
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrorMessage("")
    setSuccessMessage("")

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords do not match")
      setSaving(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters")
      setSaving(false)
      return
    }

    try {
      await updatePassword(currentUser, passwordData.newPassword)

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setSuccessMessage("Password updated successfully")
    } catch (error) {
      console.error("Error updating password:", error)
      setErrorMessage("Failed to update password. You may need to re-authenticate.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
      <div className="flex items-center">
      <Link to="/user-dashboard" className="mr-2">
            <FiArrowLeft className="h-6 w-6 text-black cursor-pointer" />
          </Link>
        <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
        </div>
        <p className="mt-2 text-sm text-gray-500">Manage your account information and addresses</p>
      </div>
      

      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {errorMessage}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("profile")}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FiUser className="inline-block mr-2 h-5 w-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "addresses"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FiMapPin className="inline-block mr-2 h-5 w-5" />
              Addresses
            </button>
            {/* <button
              onClick={() => setActiveTab("security")}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "security"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FiLock className="inline-block mr-2 h-5 w-5" />
              { Security }
            </button> */}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <form onSubmit={saveProfile}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                    {!saving && <FiSave className="ml-2 -mr-1 h-4 w-4" />}
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === "addresses" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Addresses</h3>

              {addresses.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-md p-4 relative">
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Default
                        </span>
                      )}
                      <div className="font-medium">{address.name}</div>
                      <div className="text-sm text-gray-500">
                        {address.street}, {address.city}, {address.state} {address.zip}
                      </div>
                      <div className="mt-2 flex space-x-2">
                        {!address.isDefault && (
                          <button
                            type="button"
                            onClick={() => setDefaultAddress(address.id)}
                            className="text-sm text-blue-600 hover:text-blue-500"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeAddress(address.id)}
                          className="text-sm text-red-600 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 mb-6">
                  <p className="text-sm text-gray-500">You don't have any saved addresses yet.</p>
                </div>
              )}

              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
              <form onSubmit={addAddress}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="address-name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="address-name"
                      value={newAddress.name}
                      onChange={handleNewAddressChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      id="street"
                      value={newAddress.street}
                      onChange={handleNewAddressChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={newAddress.city}
                      onChange={handleNewAddressChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={newAddress.state}
                      onChange={handleNewAddressChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      id="zip"
                      value={newAddress.zip}
                      onChange={handleNewAddressChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex items-center">
                      <input
                        id="isDefault"
                        name="isDefault"
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={handleNewAddressChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                        Set as default address
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {saving ? "Adding..." : "Add Address"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <form onSubmit={changePassword}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {saving ? "Updating..." : "Update Password"}
                    {!saving && <FiLock className="ml-2 -mr-1 h-4 w-4" />}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

