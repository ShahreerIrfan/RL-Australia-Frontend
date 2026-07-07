"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  LogOut, Package, Users, DollarSign, ShoppingCart, BarChart3, 
  ChevronDown, ChevronRight, Menu, X, Bell, Mail, Search, 
  ExternalLink, Moon, Clock, Star, Award, TrendingUp,
  Percent, Settings, ClipboardList, BookOpen, Target, Activity, FileText,
  LayoutGrid, Pencil, Trash2, Eye, Plus, Upload
} from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

const adminFetch = (url: string, init?: RequestInit) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  const headers = {
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    ...init?.headers,
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  }
  return fetch(url, { ...init, headers })
}

interface UserData {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "us"
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      return searchParams.get("tab") || "Dashboard"
    }
    return "Dashboard"
  })
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    let isCatalogOpen = true
    let isProductsOpen = true
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      const tab = searchParams.get("tab")
      if (tab && tab !== "All Products" && tab !== "Categories") {
        isCatalogOpen = false
        isProductsOpen = false
      }
    }
    return {
      Overview: true,
      CatalogContent: isCatalogOpen,
      ProductsSub: isProductsOpen,
      CartStack: true,
      MarketingReports: false
    }
  })

  // Product & Category CRUD states
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [productType, setProductType] = useState<"Simple" | "Variable">("Simple")
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [productForm, setProductForm] = useState<any>({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    original_price: "",
    discount_percent: "0",
    image_url: "",
    sku: "",
    stock_quantity: "0",
    category_id: "",
    dosage: "",
    purity: "",
    molecular_weight: "",
    molecular_formula: "",
    is_active: true,
    is_featured: false,
    image_gallery: [],
    variants: []
  })

  const fetchProducts = async () => {
    try {
      setProductsLoading(true)
      const res = await adminFetch(`${BACKEND_URL}/store/products`, { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setProductsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await adminFetch(`${BACKEND_URL}/admin/product-categories`, { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setCategories(data.product_categories || data.categories || [])
      }
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    if (activeMenu === "All Products") {
      fetchProducts()
    }
  }, [activeMenu])

  // Synchronize activeMenu with URL query parameter on change
  useEffect(() => {
    if (typeof window !== "undefined" && activeMenu) {
      const url = new URL(window.location.href)
      url.searchParams.set("tab", activeMenu)
      window.history.replaceState(null, "", url.toString())
    }
  }, [activeMenu])


  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(",")[1]
        const res = await adminFetch(`${BACKEND_URL}/admin/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64Data
          })
        })
        if (res.ok) {
          const data = await res.json()
          setProductForm((prev: any) => ({ ...prev, image_url: data.url }))
        } else {
          alert("Image upload failed")
        }
      }
    } catch (err) {
      console.error("Upload error:", err)
      alert("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const currentCount = productForm.image_gallery?.length || 0
    if (currentCount + files.length > 5) {
      alert("You can upload a maximum of 5 images in the gallery.")
      return
    }

    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        const fileUrl = await new Promise<string>((resolve, reject) => {
          reader.readAsDataURL(file)
          reader.onload = async () => {
            try {
              const base64Data = (reader.result as string).split(",")[1]
              const res = await adminFetch(`${BACKEND_URL}/admin/upload`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  fileName: file.name,
                  fileData: base64Data
                })
              })
              if (res.ok) {
                const data = await res.json()
                resolve(data.url)
              } else {
                reject(new Error("Failed to upload image"))
              }
            } catch (err) {
              reject(err)
            }
          }
          reader.onerror = () => reject(new Error("File reader error"))
        })

        setProductForm((prev: any) => ({
          ...prev,
          image_gallery: [...(prev.image_gallery || []), fileUrl]
        }))
      }
    } catch (err) {
      console.error("Gallery upload error:", err)
      alert("Some images failed to upload.")
    } finally {
      setUploading(false)
    }
  }

  const removeGalleryImage = (indexToRemove: number) => {
    setProductForm((prev: any) => ({
      ...prev,
      image_gallery: (prev.image_gallery || []).filter((_: any, idx: number) => idx !== indexToRemove)
    }))
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setProductType("Simple")
    setProductForm({
      name: "",
      slug: "",
      description: "",
      short_description: "",
      price: "",
      original_price: "",
      discount_percent: "0",
      image_url: "",
      sku: "",
      stock_quantity: "0",
      category_id: categories[0]?.id || "",
      dosage: "",
      purity: "",
      molecular_weight: "",
      molecular_formula: "",
      is_active: true,
      is_featured: false,
      image_gallery: [],
      variants: []
    })
    setActiveMenu("AddEditProduct")
  }

  const openEditModal = (product: any) => {
    setEditingProduct(product)
    const isVar = product.variants && (
      product.variants.length > 1 || 
      (product.variants.length === 1 && product.variants[0].title !== "Single Vial")
    )
    setProductType(isVar ? "Variable" : "Simple")
    setProductForm({
      name: product.title || "",
      slug: product.handle || "",
      description: product.description || "",
      short_description: product.short_description || "",
      price: product.variants?.[0]?.calculated_price?.calculated_amount?.toString() || "",
      original_price: product.variants?.[0]?.calculated_price?.original_amount?.toString() || "",
      discount_percent: product.discount_percent?.toString() || "0",
      image_url: product.thumbnail || "",
      sku: product.variants?.[0]?.sku || "",
      stock_quantity: product.variants?.[0]?.inventory_quantity?.toString() || "0",
      category_id: product.category?.id || "",
      dosage: product.dosage || "",
      purity: product.purity || "",
      molecular_weight: product.molecular_weight || "",
      molecular_formula: product.molecular_formula || "",
      is_active: product.status === "published",
      is_featured: product.is_featured === true,
      image_gallery: product.image_gallery || [],
      variants: product.variants?.map((v: any) => ({
        id: v.id,
        title: v.title,
        price: v.calculated_price?.calculated_amount?.toString() || "",
        original_price: v.calculated_price?.original_amount?.toString() || "",
        sku: v.sku || "",
        stock_quantity: v.inventory_quantity?.toString() || "0",
        weight: v.weight || ""
      })) || []
    })
    setActiveMenu("AddEditProduct")
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prepare payload based on Simple vs. Variable selection
    let payload = { ...productForm }
    if (productType === "Simple") {
      payload.variants = []
    } else {
      // For variable product, set parent fields to first variant for database schema compatibility
      const firstVar = productForm.variants?.[0]
      if (firstVar) {
        payload.price = firstVar.price
        payload.original_price = firstVar.original_price
        payload.sku = firstVar.sku
        payload.stock_quantity = firstVar.stock_quantity
      }
    }

    if (!payload.name || !payload.price) {
      alert("Name and Price are required.")
      return
    }

    try {
      const url = editingProduct 
        ? `${BACKEND_URL}/admin/products/${editingProduct.id}`
        : `${BACKEND_URL}/admin/products`
      const method = "POST"

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setActiveMenu("All Products")
        fetchProducts()
      } else {
        const errData = await res.json()
        alert(errData.message || "Failed to save product")
      }
    } catch (err) {
      console.error("Save error:", err)
      alert("Failed to save product")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const res = await adminFetch(`${BACKEND_URL}/admin/products/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        fetchProducts()
      } else {
        alert("Failed to delete product")
      }
    } catch (err) {
      console.error("Delete error:", err)
      alert("Failed to delete product")
    }
  }

  // Category CRUD states
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "" })
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false)

  const handleAddCategory = () => {
    setEditingCategory(null)
    setCategoryForm({ name: "", slug: "", description: "" })
    setIsCategoryFormOpen(true)
  }

  const handleEditCategory = (cat: any) => {
    setEditingCategory(cat)
    setCategoryForm({ name: cat.name || "", slug: cat.slug || cat.handle || "", description: cat.description || "" })
    setIsCategoryFormOpen(true)
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryForm.name) { alert("Category name is required."); return }
    try {
      const url = editingCategory
        ? `${BACKEND_URL}/admin/product-categories/${editingCategory.id}`
        : `${BACKEND_URL}/admin/product-categories`
      const method = "POST"
      const payload = {
        name: categoryForm.name,
        handle: categoryForm.slug || undefined,
        description: categoryForm.description || undefined,
        is_active: true
      }
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setIsCategoryFormOpen(false)
        fetchCategories()
      } else {
        const errData = await res.json()
        alert(errData.message || "Failed to save category")
      }
    } catch (err) {
      console.error("Category save error:", err)
      alert("Failed to save category")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    try {
      const res = await adminFetch(`${BACKEND_URL}/admin/product-categories/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchCategories()
      } else {
        alert("Failed to delete category")
      }
    } catch (err) {
      console.error("Category delete error:", err)
      alert("Failed to delete category")
    }
  }

  // Real-time Clock
  useEffect(() => {
    const updateClock = () => {
      const date = new Date()
      let hours = date.getHours()
      const minutes = date.getMinutes().toString().padStart(2, "0")
      const seconds = date.getSeconds().toString().padStart(2, "0")
      const ampm = hours >= 12 ? "PM" : "AM"
      hours = hours % 12
      hours = hours ? hours : 12 // the hour '0' should be '12'
      const hoursStr = hours.toString().padStart(2, "0")
      setCurrentTime(`${hoursStr}:${minutes}:${seconds} ${ampm}`)
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  // Session & Auth Verification
  useEffect(() => {
    const stored = localStorage.getItem("user")
    const token = localStorage.getItem("auth_token")

    if (!stored || !token) {
      router.push("/login")
      return
    }

    const parsed = JSON.parse(stored)
    if (parsed.role !== "admin") {
      router.push("/login")
      return
    }

    setUser(parsed)
    setLoading(false)
  }, [router])

  // Listen for storage changes from other tabs to enforce immediate logout
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" || e.key === "user") {
        const token = localStorage.getItem("auth_token")
        const stored = localStorage.getItem("user")
        if (!token || !stored) {
          window.location.href = "/" + countryCode + "/login"
        }
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    // Also remove cookies
    document.cookie = "_medusa_jwt=; max-age=-1; path=/"
    window.location.href = "/" + countryCode + "/login"
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev: any) => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full" />
          <span className="text-xs text-gray-400 font-medium">Initializing Secure Dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex text-gray-800 font-sans">
      
      {/* 1. Left Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-150 transform lg:transform-none lg:opacity-100 transition-all duration-300 ${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-0 -translate-x-full lg:translate-x-0"}`}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-150 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm tracking-tighter">
              RLA
            </div>
            <span className="font-extrabold text-[15px] tracking-tight uppercase bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              RL Australia
            </span>
          </div>
          <button 
            className="lg:hidden text-gray-400 hover:text-gray-650"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menus */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {/* Dashboard */}
          <button 
            onClick={() => setActiveMenu("Dashboard")}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all select-none cursor-pointer ${activeMenu === "Dashboard" ? "bg-[#047857] text-white shadow-md shadow-emerald-900/10" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <LayoutGrid className="w-4 h-4 flex-shrink-0" />
            Dashboard
          </button>

          {/* Products */}
          <div>
            <button 
              onClick={() => toggleSection("ProductsSub")}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl"
            >
              <span className="flex items-center gap-3.5">
                <Package className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Products
              </span>
              {expandedSections.ProductsSub ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {expandedSections.ProductsSub && (
              <div className="pl-11 pr-2 py-1 space-y-1.5 border-l border-gray-100 ml-6 mt-0.5 text-left">
                <button 
                  onClick={() => setActiveMenu("All Products")} 
                  className={`block w-full text-left py-1 text-[11px] font-semibold transition-colors ${activeMenu === "All Products" ? "text-[#047857] font-bold" : "text-gray-550 hover:text-emerald-700"}`}
                >
                  All Products
                </button>
                <button 
                  onClick={() => setActiveMenu("Categories")} 
                  className={`block w-full text-left py-1 text-[11px] font-semibold transition-colors ${activeMenu === "Categories" ? "text-[#047857] font-bold" : "text-gray-550 hover:text-emerald-700"}`}
                >
                  Categories
                </button>
              </div>
            )}
          </div>

          {/* Guides Library */}
          <div>
            <button 
              onClick={() => toggleSection("GuidesSub")}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl"
            >
              <span className="flex items-center gap-3.5">
                <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Guides Library
              </span>
              {expandedSections.GuidesSub ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {expandedSections.GuidesSub && (
              <div className="pl-11 pr-2 py-1 space-y-1.5 border-l border-gray-100 ml-6 mt-0.5 text-left font-semibold text-gray-555">
                <a href="#" className="block py-1 text-[11px] hover:text-emerald-700">Manage Guides</a>
                <a href="#" className="block py-1 text-[11px] hover:text-emerald-700">Email Capture Settings</a>
              </div>
            )}
          </div>

          {/* Orders */}
          <div>
            <button 
              onClick={() => toggleSection("OrdersSub")}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl"
            >
              <span className="flex items-center gap-3.5">
                <ShoppingCart className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Orders
              </span>
              {expandedSections.OrdersSub ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {expandedSections.OrdersSub && (
              <div className="pl-11 pr-2 py-1 space-y-1.5 border-l border-gray-100 ml-6 mt-0.5 text-left font-semibold text-gray-555">
                <a href={`${BACKEND_URL}/app/orders`} target="_blank" rel="noopener noreferrer" className="block py-1 text-[11px] hover:text-emerald-700">All Orders</a>
                <a href={`${BACKEND_URL}/app/returns`} target="_blank" rel="noopener noreferrer" className="block py-1 text-[11px] hover:text-emerald-700">Returns</a>
              </div>
            )}
          </div>

          {/* Stack Builder Config */}
          <button className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl">
            <span className="flex items-center gap-3.5">
              <Target className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              Stack Builder Config
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Campaign Analytics */}
          <button className="w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl">
            <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            Campaign Analytics
          </button>

          {/* Discount Upsells */}
          <button className="w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl">
            <Percent className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            Discount Upsells
          </button>
        </nav>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-155 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-gray-550 hover:text-gray-800"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-[11px] font-semibold text-gray-400">Welcome back,</span>
              <h2 className="text-xs font-bold text-gray-800 -mt-0.5">{user?.first_name || "Admin"}!</h2>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-750">
              <Search className="w-4 h-4" />
            </button>
            {/* Visit Site */}
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-750 hidden sm:flex"
              title="Visit Site"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            {/* Mail */}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-750 relative">
              <Mail className="w-4 h-4" />
              <span className="absolute top-1.5 right-2.5 w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
            </button>
            {/* Notifications */}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-750 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-2.5 w-1.5 h-1.5 bg-emerald-650 rounded-full animate-ping"></span>
            </button>
            {/* Dark mode */}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-755">
              <Moon className="w-4 h-4" />
            </button>

            {/* Profile Menu */}
            <div className="border-l border-gray-150 pl-3 ml-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer select-none">
                {user?.first_name ? user.first_name[0].toUpperCase() : "A"}
              </div>
              <button 
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-red-650 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {activeMenu === "Dashboard" && (
            <>
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-left">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">Admin Dashboard</h1>
                  <p className="text-xs text-gray-500">Real-time overview of your e-commerce performance</p>
                </div>
                
                {/* Stats Indicators */}
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1 text-xs font-bold shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-gray-150 rounded-xl px-4 py-1 text-xs font-bold text-gray-600 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{currentTime || "00:00:00 AM"}</span>
                  </div>
                </div>
              </div>

              {/* Primary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Revenue */}
                <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">$164</h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-650">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">▲ 0%</span>
                    <span className="text-[10px] text-gray-400 font-medium">vs last 30 days</span>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">2</h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-650">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">▲ 0%</span>
                    <span className="text-[10px] text-gray-400 font-medium">vs last 30 days</span>
                  </div>
                </div>

                {/* Leads Captured */}
                <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Leads Captured</span>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">148</h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-650">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">▲ 400%</span>
                    <span className="text-[10px] text-gray-400 font-medium">vs last 30 days</span>
                  </div>
                </div>

                {/* Active Guides */}
                <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Guides</span>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">8</h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-650">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">▲ 33%</span>
                    <span className="text-[10px] text-gray-400 font-medium">vs last 30 days</span>
                  </div>
                </div>
              </div>

              {/* Secondary Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-center gap-3 text-left">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Products</p>
                    <p className="text-xs font-extrabold text-blue-900">{products.length}</p>
                  </div>
                </div>
                
                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 flex items-center gap-3 text-left">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                    <Star className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Reviews</p>
                    <p className="text-xs font-extrabold text-amber-900">24</p>
                  </div>
                </div>

                <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 flex items-center gap-3 text-left">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Avg Rating</p>
                    <p className="text-xs font-extrabold text-orange-900">4.8/5</p>
                  </div>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3 text-left">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-650">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Ad Spend</p>
                    <p className="text-xs font-extrabold text-emerald-900">$45</p>
                  </div>
                </div>

                <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-3 flex items-center gap-3 col-span-2 md:col-span-1 text-left">
                  <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">ROAS</p>
                    <p className="text-xs font-extrabold text-violet-900">3.6x</p>
                  </div>
                </div>
              </div>

              {/* Visual Analytics & Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Analytics (SVG Graphic) */}
                <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <div className="text-left">
                      <h3 className="text-sm font-black text-gray-900">Campaign Analytics</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">Monthly revenue, ad spend & conversion metrics</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>Revenue</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>Ad Spend</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>Net Profit</span>
                    </div>
                  </div>
                  
                  {/* SVG Mock Chart matching the reference image layout */}
                  <div className="relative h-60 w-full flex items-end">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f3f5" strokeWidth="1" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f3f5" strokeWidth="1" />
                      <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f3f5" strokeWidth="1" />
                      <line x1="0" y1="199" x2="500" y2="199" stroke="#e9ecef" strokeWidth="1" />
                      
                      {/* Plot Dots representing the reference chart values */}
                      <circle cx="250" cy="110" r="4.5" fill="#047857" stroke="white" strokeWidth="1.5" />
                      <circle cx="250" cy="130" r="4.5" fill="#34d399" stroke="white" strokeWidth="1.5" />
                    </svg>

                    {/* Y Axis Labels */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] font-bold text-gray-400 z-10 py-1">
                      <span>$140</span>
                      <span>$105</span>
                      <span>$70</span>
                      <span>0</span>
                    </div>
                    
                    {/* Visual empty chart placeholder text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-semibold text-gray-400 bg-white/70 px-3.5 py-1.5 rounded-xl border border-gray-100">
                        Analytical projection starting soon
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Status Donut Chart */}
                <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm flex flex-col justify-between">
                  <div className="text-left">
                    <h3 className="text-sm font-black text-gray-900 mb-1">Order Status</h3>
                    <p className="text-[10px] text-gray-400">Current distribution</p>
                  </div>

                  {/* Donut graphic */}
                  <div className="relative flex items-center justify-center h-44 my-4">
                    <svg className="w-36 h-36 transform -rotate-90">
                      <circle cx="72" cy="72" r="54" stroke="#f1f3f5" strokeWidth="16" fill="transparent" />
                      <circle cx="72" cy="72" r="54" stroke="#047857" strokeWidth="16" fill="transparent" strokeDasharray="339.292" strokeDashoffset="0" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-gray-900">2</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total</span>
                    </div>
                  </div>

                  {/* Status List */}
                  <div className="border-t border-gray-100 pt-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-medium text-gray-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                        Delivered
                      </span>
                      <div className="flex items-center gap-4 text-right">
                        <span className="font-bold text-gray-400">100%</span>
                        <span className="font-bold text-gray-800">2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeMenu === "All Products" && (
            <div className="space-y-6 text-left">
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">Products</h1>
                  <p className="text-xs text-gray-500">Manage storefront products, prices, stock and details</p>
                </div>
                <button 
                  onClick={openAddModal}
                  className="flex items-center gap-1.5 bg-[#047857] hover:bg-[#035f43] text-white px-4 py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Product
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-gray-150 rounded-2xl p-4 shadow-sm">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:bg-white focus:border-[#047857] focus:outline-none transition-colors"
                  />
                </div>
                
                <div className="flex w-full md:w-auto items-center gap-3">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="flex-1 md:flex-none bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-medium text-gray-600 focus:border-[#047857] focus:outline-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 md:flex-none bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-medium text-gray-600 focus:border-[#047857] focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active (Published)</option>
                    <option value="inactive">Inactive (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Product Table Card */}
              <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-50/75 border-b border-gray-150 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="px-5 py-3.5 w-14">SL</th>
                        <th className="px-5 py-3.5">Product</th>
                        <th className="px-5 py-3.5">Category</th>
                        <th className="px-5 py-3.5">Price</th>
                        <th className="px-5 py-3.5 w-24 text-center">Stock</th>
                        <th className="px-5 py-3.5 w-28 text-center">Status</th>
                        <th className="px-5 py-3.5 w-28 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-xs">
                      {productsLoading ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-10 text-center text-gray-400 font-semibold">
                            Loading products from database...
                          </td>
                        </tr>
                      ) : products.filter((p: any) => {
                        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.variants?.[0]?.sku || "").toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesCategory = !categoryFilter || p.category?.id === categoryFilter;
                        const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && p.status === "published") || 
                          (statusFilter === "inactive" && p.status === "draft");
                        return matchesSearch && matchesCategory && matchesStatus;
                      }).length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-10 text-center text-gray-400 font-semibold">
                            No products found matching filters.
                          </td>
                        </tr>
                      ) : products.filter((p: any) => {
                        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.variants?.[0]?.sku || "").toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesCategory = !categoryFilter || p.category?.id === categoryFilter;
                        const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && p.status === "published") || 
                          (statusFilter === "inactive" && p.status === "draft");
                        return matchesSearch && matchesCategory && matchesStatus;
                      }).map((product: any, idx: number) => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4 font-bold text-gray-400">{idx + 1}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={product.thumbnail} 
                                alt={product.title} 
                                className="w-9 h-9 rounded-lg border border-gray-100 object-cover bg-gray-50 flex-shrink-0"
                              />
                              <div>
                                <h3 className="font-extrabold text-gray-900 leading-snug">{product.title}</h3>
                                <p className="text-[10px] font-bold text-gray-400 mt-0.5 tracking-wider uppercase">SKU: {product.variants?.[0]?.sku || "N/A"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-semibold text-gray-600">
                            {product.category?.name || <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-emerald-700">${product.variants?.[0]?.calculated_price?.calculated_amount}</span>
                              {product.variants?.[0]?.calculated_price?.original_amount !== product.variants?.[0]?.calculated_price?.calculated_amount && (
                                <span className="text-[10px] font-semibold text-gray-400 line-through">${product.variants?.[0]?.calculated_price?.original_amount}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-center font-bold text-gray-700">
                            {product.variants?.[0]?.inventory_quantity}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold leading-none ${product.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-gray-150 text-gray-600"}`}>
                              {product.status === "published" ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a 
                                href={`/${countryCode}/products/${product.handle}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-150 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                                title="View Product Page"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </a>
                              <button 
                                onClick={() => openEditModal(product)}
                                className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:text-emerald-700 transition-colors"
                                title="Edit Product"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-100 flex items-center justify-center text-rose-600 hover:text-rose-700 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "Categories" && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">Categories</h1>
                  <p className="text-xs text-gray-500">Manage product categories dynamically</p>
                </div>
                <button 
                  onClick={handleAddCategory}
                  className="flex items-center gap-1.5 bg-[#047857] hover:bg-[#035f43] text-white px-4 py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Category
                </button>
              </div>

              <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-50/75 border-b border-gray-150 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="px-5 py-3.5 w-14">SL</th>
                        <th className="px-5 py-3.5">Name</th>
                        <th className="px-5 py-3.5">Slug</th>
                        <th className="px-5 py-3.5">Description</th>
                        <th className="px-5 py-3.5 w-28 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr><td colSpan={5} className="text-center text-gray-400 py-10 font-semibold">No categories found.</td></tr>
                      ) : categories.map((cat: any, index: number) => (
                        <tr key={cat.id} className="border-b border-gray-100 hover:bg-emerald-50/30 transition-colors text-xs">
                          <td className="px-5 py-4 font-semibold text-gray-400">{index + 1}</td>
                          <td className="px-5 py-4 font-bold text-gray-800">{cat.name}</td>
                          <td className="px-5 py-4 text-gray-500 font-medium">{cat.handle || cat.slug}</td>
                          <td className="px-5 py-4 text-gray-500 font-medium truncate max-w-[200px]">{cat.description || "—"}</td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => handleEditCategory(cat)}
                                className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:text-emerald-700 transition-colors"
                                title="Edit Category"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-100 flex items-center justify-center text-rose-600 hover:text-rose-700 transition-colors"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category Form Dialog */}
              {isCategoryFormOpen && (
                <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 text-left">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
                      <h2 className="text-base font-black text-gray-900">{editingCategory ? "Edit Category" : "Add Category"}</h2>
                      <button onClick={() => setIsCategoryFormOpen(false)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Category Name *</label>
                        <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Peptides" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#047857] focus:outline-none transition-colors" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Slug (auto-generated)</label>
                        <input type="text" value={categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")} onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))} placeholder="peptides" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 focus:bg-white focus:border-[#047857] focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
                        <textarea value={categoryForm.description} onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Optional description..." rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#047857] focus:outline-none transition-colors resize-none" />
                      </div>
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setIsCategoryFormOpen(false)} className="px-4 py-2.5 border border-gray-200 text-xs font-bold text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 bg-[#047857] hover:bg-[#035f43] text-white text-xs font-bold rounded-xl transition-colors shadow-sm">{editingCategory ? "Update" : "Create"}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Inline Product Add/Edit View (replaces modal) */}
        {activeMenu === "AddEditProduct" && (
          <main className="flex-1 overflow-y-auto p-8 w-full text-left">
            {/* Back to Products breadcrumb */}
            <button 
              onClick={() => { setActiveMenu("All Products"); fetchProducts() }}
              className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-emerald-700 transition-colors mb-6 group"
            >
              <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
              Back to Products
            </button>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h1>
                <p className="text-xs text-gray-500">Configure basic parameters, specifications, pricing and galleries</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* 1. Basic Information Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Basic Information</h3>
                      <p className="text-[10px] text-gray-450 font-medium -mt-0.5">Product name and descriptions</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 border-b border-gray-100 pb-4">
                    <div>
                      <label className="text-[10px] font-extrabold text-gray-405 uppercase tracking-wider block mb-1">Product Type *</label>
                      <select 
                        value={productType}
                        onChange={(e) => {
                          const val = e.target.value as "Simple" | "Variable"
                          setProductType(val)
                          if (val === "Variable" && (!productForm.variants || productForm.variants.length === 0)) {
                            setProductForm((prev: any) => ({
                              ...prev,
                              variants: [
                                {
                                  title: "Single Vial",
                                  price: prev.price || "",
                                  original_price: prev.original_price || "",
                                  sku: prev.sku || "",
                                  stock_quantity: prev.stock_quantity || "100",
                                  weight: ""
                                }
                              ]
                            }))
                          }
                        }}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-650 focus:bg-white focus:border-[#047857] focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="Simple">Simple Product</option>
                        <option value="Variable">Variable Product</option>
                      </select>
                    </div>
                    <div></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Product Name *</label>
                      <input 
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm((prev: any) => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none transition-colors"
                        placeholder="Enter product name (e.g. BPC-157 5mg Vial)"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Custom URL Handle (Slug)</label>
                      <input 
                        type="text"
                        value={productForm.slug}
                        onChange={(e) => setProductForm((prev: any) => ({ ...prev, slug: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none transition-colors"
                        placeholder="e.g. bpc-157-5mg-vial (leave empty to auto-generate)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Short Description</label>
                    <input 
                      type="text"
                      value={productForm.short_description}
                      onChange={(e) => setProductForm((prev: any) => ({ ...prev, short_description: e.target.value }))}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none transition-colors"
                      placeholder="Write a brief one-line summary..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Description (Long Detail)</label>
                    <textarea 
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm((prev: any) => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none transition-colors resize-none"
                      placeholder="Write a detailed product description..."
                    />
                  </div>
                </div>

                {/* 2. Peptide Specifications Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-650">
                      <Activity className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Peptide Specifications</h3>
                      <p className="text-[10px] text-gray-450 font-medium -mt-0.5">Scientific attributes and parameters</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Dosage</label>
                      <input 
                        type="text"
                        value={productForm.dosage}
                        onChange={(e) => setProductForm((prev: any) => ({ ...prev, dosage: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none"
                        placeholder="e.g. 5mg"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Purity</label>
                      <input 
                        type="text"
                        value={productForm.purity}
                        onChange={(e) => setProductForm((prev: any) => ({ ...prev, purity: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none"
                        placeholder="e.g. 99.8%+"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Molecular Weight</label>
                      <input 
                        type="text"
                        value={productForm.molecular_weight}
                        onChange={(e) => setProductForm((prev: any) => ({ ...prev, molecular_weight: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none"
                        placeholder="e.g. 1419.5 g/mol"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Molecular Formula</label>
                      <input 
                        type="text"
                        value={productForm.molecular_formula}
                        onChange={(e) => setProductForm((prev: any) => ({ ...prev, molecular_formula: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none"
                        placeholder="e.g. C62H98N16O22"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Organization & Inventory Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650">
                      <Package className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Organization & Inventory</h3>
                      <p className="text-[10px] text-gray-450 font-medium -mt-0.5">Categorize and track stock levels</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Category</label>
                      <select
                        value={productForm.category_id}
                        onChange={(e) => setProductForm((prev: any) => ({ ...prev, category_id: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-650 focus:bg-white focus:border-[#047857] focus:outline-none transition-colors cursor-pointer"
                      >
                        {categories.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {productType === "Simple" && (
                      <>
                        <div>
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">SKU Code</label>
                          <input 
                            type="text"
                            value={productForm.sku}
                            onChange={(e) => setProductForm((prev: any) => ({ ...prev, sku: e.target.value }))}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none transition-colors"
                            placeholder="e.g. BPC157-5MG"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Stock Quantity</label>
                          <input 
                            type="number"
                            min="0"
                            value={productForm.stock_quantity}
                            onChange={(e) => setProductForm((prev: any) => ({ ...prev, stock_quantity: e.target.value }))}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none transition-colors"
                            placeholder="e.g. 100"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 4. Pricing & Visibility Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                      <DollarSign className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Pricing & Options</h3>
                      <p className="text-[10px] text-gray-450 font-medium -mt-0.5">Set pricing tiers and storefront visibility</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    {productType === "Simple" ? (
                      <>
                        <div>
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Price ($) *</label>
                          <input 
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm((prev: any) => ({ ...prev, price: e.target.value }))}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none transition-colors"
                            placeholder="e.g. 79.00"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Compare Price ($)</label>
                          <input 
                            type="number"
                            min="0"
                            step="0.01"
                            value={productForm.original_price}
                            onChange={(e) => setProductForm((prev: any) => ({ ...prev, original_price: e.target.value }))}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none transition-colors"
                            placeholder="e.g. 99.00"
                          />
                        </div>

                        <div className="flex items-center gap-6 col-span-2 pt-4 justify-end">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={productForm.is_active}
                              onChange={(e) => setProductForm((prev: any) => ({ ...prev, is_active: e.target.checked }))}
                              className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-gray-655">Active (Published)</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={productForm.is_featured}
                              onChange={(e) => setProductForm((prev: any) => ({ ...prev, is_featured: e.target.checked }))}
                              className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-gray-655">Featured</span>
                          </label>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-6 col-span-4 justify-end py-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            checked={productForm.is_active}
                            onChange={(e) => setProductForm((prev: any) => ({ ...prev, is_active: e.target.checked }))}
                            className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-gray-655">Active (Published)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            checked={productForm.is_featured}
                            onChange={(e) => setProductForm((prev: any) => ({ ...prev, is_featured: e.target.checked }))}
                            className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-gray-655">Featured</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Custom Quantity Options & Tiered Pricing Card */}
                {productType === "Variable" && (
                  <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                        <Package className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Quantity Tiers & Packaging Options</h3>
                        <p className="text-[10px] text-gray-450 font-medium -mt-0.5">Configure custom gram quantities and their respective prices</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newVariant = {
                          title: "",
                          price: "",
                          original_price: "",
                          sku: "",
                          stock_quantity: "100",
                          weight: ""
                        }
                        setProductForm((prev: any) => ({
                          ...prev,
                          variants: [...(prev.variants || []), newVariant]
                        }))
                      }}
                      className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Option
                    </button>
                  </div>

                  {(productForm.variants && productForm.variants.length > 0) ? (
                    <div className="space-y-4">
                      {productForm.variants.map((variant: any, index: number) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-150 relative">
                          <div>
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Option Name (e.g. Single Vial)</label>
                            <input
                              type="text"
                              required
                              value={variant.title}
                              onChange={(e) => {
                                const newVariants = [...productForm.variants]
                                newVariants[index].title = e.target.value
                                setProductForm((prev: any) => ({ ...prev, variants: newVariants }))
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-sky-500"
                              placeholder="e.g. Single Vial"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Weight / Unit (e.g. 5g)</label>
                            <input
                              type="text"
                              value={variant.weight || ""}
                              onChange={(e) => {
                                const newVariants = [...productForm.variants]
                                newVariants[index].weight = e.target.value
                                setProductForm((prev: any) => ({ ...prev, variants: newVariants }))
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-sky-500"
                              placeholder="e.g. 5g, 10g, 120 Capsules"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Price ($) *</label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="0.01"
                              value={variant.price}
                              onChange={(e) => {
                                const newVariants = [...productForm.variants]
                                newVariants[index].price = e.target.value
                                
                                // Auto update first variant details to main fields for compatibility
                                const updatedForm: any = { ...productForm, variants: newVariants }
                                if (index === 0) {
                                  updatedForm.price = e.target.value
                                }
                                setProductForm(updatedForm)
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-sky-500"
                              placeholder="e.g. 49.95"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Compare Price ($)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={variant.original_price}
                              onChange={(e) => {
                                const newVariants = [...productForm.variants]
                                newVariants[index].original_price = e.target.value
                                const updatedForm: any = { ...productForm, variants: newVariants }
                                if (index === 0) {
                                  updatedForm.original_price = e.target.value
                                }
                                setProductForm(updatedForm)
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-sky-500"
                              placeholder="e.g. 64.95"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">SKU</label>
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) => {
                                const newVariants = [...productForm.variants]
                                newVariants[index].sku = e.target.value
                                const updatedForm: any = { ...productForm, variants: newVariants }
                                if (index === 0) {
                                  updatedForm.sku = e.target.value
                                }
                                setProductForm(updatedForm)
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-sky-500"
                              placeholder="e.g. SKU-5G"
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Stock</label>
                              <input
                                type="number"
                                min="0"
                                value={variant.stock_quantity}
                                onChange={(e) => {
                                  const newVariants = [...productForm.variants]
                                  newVariants[index].stock_quantity = e.target.value
                                  const updatedForm: any = { ...productForm, variants: newVariants }
                                  if (index === 0) {
                                    updatedForm.stock_quantity = e.target.value
                                  }
                                  setProductForm(updatedForm)
                                }}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-sky-500"
                                placeholder="100"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newVariants = (productForm.variants || []).filter((_: any, idx: number) => idx !== index)
                                setProductForm((prev: any) => ({ ...prev, variants: newVariants }))
                              }}
                              className="bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 hover:text-rose-700 w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-xs font-semibold">
                      No custom quantity variants defined yet. Clicking "Add Option" lets you define custom packaging sizes (e.g. 5g, 10g). If none are defined, the system defaults to the top-level product price/sku above.
                    </div>
                  )}
                  </div>
                )}

                {/* 5. Primary Image Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Upload className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Primary Image</h3>
                      <p className="text-[10px] text-gray-450 font-medium -mt-0.5">Main image displayed on product lists and grids</p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-6 text-left">
                    <input 
                      type="file"
                      accept="image/*"
                      id="modal-primary-image-upload"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />
                    <label 
                      htmlFor="modal-primary-image-upload"
                      className="w-36 h-28 border-2 border-dashed border-gray-250 hover:border-[#047857] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50 group bg-white shadow-sm flex-shrink-0"
                    >
                      <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#047857] mb-1.5 transition-colors" />
                      <span className="text-[10px] font-bold text-gray-500 group-hover:text-[#047857] transition-colors">
                        {uploading ? "Uploading..." : "Upload Image"}
                      </span>
                    </label>

                    {productForm.image_url && (
                      <div className="relative w-28 h-28 border border-gray-150 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-white group">
                        <img 
                          src={productForm.image_url} 
                          alt="Primary Preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setProductForm((prev: any) => ({ ...prev, image_url: "" }))}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 hover:bg-black/85 flex items-center justify-center text-white transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 6. Image Gallery Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-650">
                      <LayoutGrid className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Image Gallery</h3>
                      <p className="text-[10px] text-gray-450 font-medium -mt-0.5">Additional product carousel views (maximum 5 images)</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 overflow-x-auto py-1">
                      <input 
                        type="file"
                        accept="image/*"
                        multiple
                        id="modal-gallery-images-upload"
                        className="hidden"
                        onChange={handleGalleryFileChange}
                        disabled={uploading || (productForm.image_gallery?.length || 0) >= 5}
                      />
                      <label 
                        htmlFor="modal-gallery-images-upload"
                        className={`w-28 h-28 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all bg-white shadow-sm flex-shrink-0 group ${
                          (productForm.image_gallery?.length || 0) >= 5 
                            ? "opacity-50 border-gray-200 cursor-not-allowed" 
                            : "border-gray-250 hover:border-[#047857] hover:bg-gray-50"
                        }`}
                      >
                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#047857] mb-1.5 transition-colors" />
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-[#047857] transition-colors">
                          Add Image
                        </span>
                      </label>

                      {/* Gallery Preview Items */}
                      {(productForm.image_gallery || []).map((url: string, index: number) => (
                        <div key={index} className="relative w-28 h-28 border border-gray-150 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-white group">
                          <img 
                            src={url} 
                            alt={`Gallery Preview ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 hover:bg-black/85 flex items-center justify-center text-white transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">Selected files will be uploaded automatically. Limit of 5 additional image slots.</p>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5 mt-6">
                  <button
                    type="button"
                    onClick={() => { setActiveMenu("All Products"); fetchProducts() }}
                    className="px-4 py-2.5 border border-gray-200 text-xs font-bold text-gray-500 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#047857] hover:bg-[#035f43] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    {editingProduct ? "Update Product" : "Create Product"}
                  </button>
                </div>
              </form>
          </main>
        )}
      </div>
    </div>
  )
}
// ..