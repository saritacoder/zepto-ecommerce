
// "use client"

import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { collection, addDoc, doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase/config"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"
import { ShoppingBag, ChevronLeft, MapPin, Plus } from "lucide-react"
import { toast } from "sonner"

const Checkout = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const { cart, getCartTotal, clearCart } = useCart()

  const formRef = useRef(null)
  const nameRef = useRef(null)
  const phoneRef = useRef(null)
  const addressRef = useRef(null)
  const cityRef = useRef(null)
  const stateRef = useRef(null)
  const pincodeRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(true)

  const subtotal = getCartTotal()
  const deliveryFee = subtotal > 500 ? 0 : 50
  const total = subtotal + deliveryFee

  // Fetch user's saved addresses
  // useEffect(() => {
  //   const fetchUserAddresses = async () => {
  //     if (!currentUser) return

  //     try {
  //       const userDoc = doc(db, "users", currentUser.uid)
  //       const userSnapshot = await getDoc(userDoc)

  //       if (userSnapshot.exists()) {
  //         const userData = userSnapshot.data()
  //         if (userData.addresses && userData.addresses.length > 0) {
  //           setSavedAddresses(userData.addresses)

  //           // Find default address
  //           const defaultAddress = userData.addresses.find((addr) => addr.isDefault)
  //           if (defaultAddress) {
  //             setSelectedAddressId(defaultAddress.id)
  //             fillAddressForm(defaultAddress)
  //             setShowAddressForm(false)
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user addresses:", error)
  //     }
  //   }

  //   fetchUserAddresses()
  // }, [currentUser])

  const fillAddressForm = (address) => {
    if (!address) return

    if (nameRef.current) nameRef.current.value = address.name || ""
    if (addressRef.current) addressRef.current.value = address.street || ""
    if (cityRef.current) cityRef.current.value = address.city || ""
    if (stateRef.current) stateRef.current.value = address.state || ""
    if (pincodeRef.current) pincodeRef.current.value = address.zip || address.pincode || ""

    if (phoneRef.current && address.phone) phoneRef.current.value = address.phone
  }

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId)

    const selectedAddress = savedAddresses.find((addr) => addr.id === addressId)
    if (selectedAddress) {
      fillAddressForm(selectedAddress)
      setShowAddressForm(false)
    }
  }

  const handleNewAddress = () => {
    setSelectedAddressId(null)
    setShowAddressForm(true)

    if (nameRef.current) nameRef.current.value = currentUser?.name || ""
    if (phoneRef.current) phoneRef.current.value = currentUser?.phone || ""
    if (addressRef.current) addressRef.current.value = ""
    if (cityRef.current) cityRef.current.value = ""
    if (stateRef.current) stateRef.current.value = ""
    if (pincodeRef.current) pincodeRef.current.value = ""
  }

  const validateForm = () => {
    const name = nameRef.current?.value.trim()
    const phone = phoneRef.current?.value.trim()
    const address = addressRef.current?.value.trim()
    const city = cityRef.current?.value.trim()
    const state = stateRef.current?.value.trim()
    const pincode = pincodeRef.current?.value.trim()

    if (!name || !phone || !address || !city || !state || !pincode) {
      toast.error("Please fill in all required fields")
      return false
    }

    if (!phone) {
      toast.error("Please enter a phone number")
      return false
    }

    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    if (cart.length === 0) {
      setError("Your cart is empty")
      return
    }

    if (!validateForm()) {
      return
    }

    try {
      setError("")
      setLoading(true)

      const orderData = {
        userId: currentUser.uid,
        userName: nameRef.current?.value.trim(),
        email: currentUser.email,
        phone: phoneRef.current?.value.trim(),
        shippingAddress: {
          address: addressRef.current?.value.trim(),
          city: cityRef.current?.value.trim(),
          state: stateRef.current?.value.trim(),
          pincode: pincodeRef.current?.value.trim(),
        },
        items: cart,
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      const orderRef = await addDoc(collection(db, "orders"), orderData)

      clearCart()

      navigate(`/order-confirmation?orderId=${orderRef.id}`)
    } catch (error) {
      console.error("Error placing order:", error)
      setError("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between"></div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">You need to add products to your cart before checkout.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Products
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to="/cart" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>

                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Your Saved Addresses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {savedAddresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => handleAddressSelect(address.id)}
                          className={`border rounded-md p-3 cursor-pointer transition-colors ${
                            selectedAddressId === address.id
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-300 hover:border-indigo-300"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="font-medium">{address.name}</div>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {address.street}, {address.city}, {address.state} {address.zip || address.pincode}
                          </div>
                        </div>
                      ))}
                      <div
                        onClick={handleNewAddress}
                        className={`border border-dashed rounded-md p-3 cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors ${
                          !selectedAddressId ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-300"
                        }`}
                      >
                        <Plus className="h-5 w-5 mb-1" />
                        <span className="text-sm font-medium">Add New Address</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`space-y-4 ${!showAddressForm && savedAddresses.length > 0 ? "hidden" : "block"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        ref={nameRef}
                        required
                        defaultValue={currentUser?.name || ""}
                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        ref={phoneRef}
                        required
                        defaultValue={currentUser?.phone || ""}
                        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      ref={addressRef}
                      required
                      rows={3}
                      className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        ref={cityRef}
                        required
                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="state"
                        ref={stateRef}
                        required
                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        ref={pincodeRef}
                        required
                        pattern="[0-9]{6}"
                        title="Please enter a valid 6-digit pincode"
                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {selectedAddressId && !showAddressForm && (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Edit Address Details
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="cod"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>

                  <div className="flex items-center opacity-50">
                    <input
                      id="card"
                      name="payment-method"
                      type="radio"
                      disabled
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                      Credit/Debit Card (Coming Soon)
                    </label>
                  </div>

                  <div className="flex items-center opacity-50">
                    <input
                      id="upi"
                      name="payment-method"
                      type="radio"
                      disabled
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="upi" className="ml-3 block text-sm font-medium text-gray-700">
                      UPI (Coming Soon)
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

              <div className="mb-4 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex py-2 border-b border-gray-200">
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        src={item.imageUrl || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                      <div className="text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : "Free"}</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>

              <div className="mt-4 text-sm text-gray-500">
                <p>By placing your order, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Checkout




