"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  LogOut, Package, Users, DollarSign, ShoppingCart, BarChart3, 
  Store, ChevronDown, ChevronRight, Menu, X, Bell, Mail, Search, 
  Maximize2, Moon, Clock, Shield, Star, Award, TrendingUp, Landmark, 
  Percent, Settings, ClipboardList
} from "lucide-react"

interface UserData {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState("Dashboard")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Overview: true,
    Commerce: true,
    Inventory: false,
    Business: false,
    Insights: false
  })

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

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    // Also remove cookies
    document.cookie = "_medusa_jwt=; max-age=-1; path=/"
    router.push("/login")
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full" />
          <span className="text-xs text-gray-400 font-medium">Initializing Secure Dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex text-gray-800">
      
      {/* 1. Left Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-150 transform lg:transform-none lg:opacity-100 transition-all duration-300 ${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-0 -translate-x-full lg:translate-x-0"}`}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-150 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white font-black text-sm tracking-tighter">
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
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {/* Section: Overview */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 cursor-pointer" onClick={() => toggleSection("Overview")}>
              <span>Overview</span>
              {expandedSections.Overview ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
            {expandedSections.Overview && (
              <div className="space-y-1">
                <button 
                  onClick={() => setActiveMenu("Dashboard")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${activeMenu === "Dashboard" ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-250" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </button>
                <div className="group">
                  <button 
                    onClick={() => toggleSection("StoresSub")}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl"
                  >
                    <span className="flex items-center gap-3">
                      <Store className="w-4 h-4" />
                      Stores
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  {expandedSections.StoresSub && (
                    <div className="pl-9 pr-2 py-1 space-y-1 border-l border-gray-100 ml-5 mt-0.5">
                      <a href="#" className="block py-1.5 text-[11px] text-gray-550 hover:text-pink-600">Main Store</a>
                      <a href="#" className="block py-1.5 text-[11px] text-gray-550 hover:text-pink-600">Wholesale</a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section: Commerce */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 cursor-pointer" onClick={() => toggleSection("Commerce")}>
              <span>Commerce</span>
              {expandedSections.Commerce ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
            {expandedSections.Commerce && (
              <div className="space-y-1">
                <button 
                  onClick={() => toggleSection("ProductsSub")}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl"
                >
                  <span className="flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    Products
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
                {expandedSections.ProductsSub && (
                  <div className="pl-9 pr-2 py-1 space-y-1 border-l border-gray-100 ml-5 mt-0.5">
                    <a href="http://localhost:9000/app/products" target="_blank" rel="noopener noreferrer" className="block py-1.5 text-[11px] text-gray-550 hover:text-pink-600">All Products</a>
                    <a href="http://localhost:9000/app/categories" target="_blank" rel="noopener noreferrer" className="block py-1.5 text-[11px] text-gray-550 hover:text-pink-600">Categories</a>
                  </div>
                )}

                <button 
                  onClick={() => toggleSection("OrdersSub")}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl"
                >
                  <span className="flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4" />
                    Orders
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
                {expandedSections.OrdersSub && (
                  <div className="pl-9 pr-2 py-1 space-y-1 border-l border-gray-100 ml-5 mt-0.5">
                    <a href="http://localhost:9000/app/orders" target="_blank" rel="noopener noreferrer" className="block py-1.5 text-[11px] text-gray-550 hover:text-pink-600">Order History</a>
                    <a href="http://localhost:9000/app/returns" target="_blank" rel="noopener noreferrer" className="block py-1.5 text-[11px] text-gray-550 hover:text-pink-600">Returns</a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section: Inventory */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 cursor-pointer" onClick={() => toggleSection("Inventory")}>
              <span>Inventory</span>
              {expandedSections.Inventory ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
            {expandedSections.Inventory && (
              <div className="space-y-1">
                <button className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl">
                  <span className="flex items-center gap-3">
                    <Landmark className="w-4 h-4" />
                    Warehouse
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl">
                  <span className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    Suppliers
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            )}
          </div>

          {/* Section: Business */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 cursor-pointer" onClick={() => toggleSection("Business")}>
              <span>Business</span>
              {expandedSections.Business ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
            {expandedSections.Business && (
              <div className="space-y-1">
                <button className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl">
                  <span className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4" />
                    Accounting
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl">
                  <span className="flex items-center gap-3">
                    <Percent className="w-4 h-4" />
                    Marketing
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl">
                  <span className="flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    Shipping
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            )}
          </div>

          {/* Section: Insights */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 cursor-pointer" onClick={() => toggleSection("Insights")}>
              <span>Insights</span>
              {expandedSections.Insights ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
            {expandedSections.Insights && (
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                  Analytics
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl">
                  <Settings className="w-4 h-4" />
                  Consent & Sessions
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl">
                  <ClipboardList className="w-4 h-4" />
                  User Activity
                </button>
              </div>
            )}
          </div>
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
            {/* Maximize */}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-750 hidden sm:flex">
              <Maximize2 className="w-4 h-4" />
            </button>
            {/* Mail */}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-750 relative">
              <Mail className="w-4 h-4" />
              <span className="absolute top-1.5 right-2.5 w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
            </button>
            {/* Notifications */}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-750 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-2.5 w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping"></span>
            </button>
            {/* Dark mode */}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-755">
              <Moon className="w-4 h-4" />
            </button>

            {/* Profile Menu */}
            <div className="border-l border-gray-150 pl-3 ml-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer select-none">
                {user?.first_name ? user.first_name[0].toUpperCase() : "A"}
              </div>
              <button 
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1 font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Real-time overview of your marketplace performance</p>
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
                  <h3 className="text-2xl font-black text-gray-900 mt-1">৳164</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
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
                <div className="w-11 h-11 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">▲ 0%</span>
                <span className="text-[10px] text-gray-400 font-medium">vs last 30 days</span>
              </div>
            </div>

            {/* Total Customers */}
            <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Customers</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">31</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">▲ 400%</span>
                <span className="text-[10px] text-gray-400 font-medium">vs last 30 days</span>
              </div>
            </div>

            {/* Active Vendors */}
            <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Vendors</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">4</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
                  <Store className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">▲ 0%</span>
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
                <p className="text-xs font-extrabold text-blue-900">3.3K</p>
              </div>
            </div>
            
            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 flex items-center gap-3 text-left">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <Star className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Reviews</p>
                <p className="text-xs font-extrabold text-amber-900">0</p>
              </div>
            </div>

            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 flex items-center gap-3 text-left">
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Avg Rating</p>
                <p className="text-xs font-extrabold text-orange-900">0.0/5</p>
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3 text-left">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Profit</p>
                <p className="text-xs font-extrabold text-emerald-900">৳32</p>
              </div>
            </div>

            <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-3 flex items-center gap-3 col-span-2 md:col-span-1 text-left">
              <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                <Percent className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Commission</p>
                <p className="text-xs font-extrabold text-violet-900">৳4</p>
              </div>
            </div>
          </div>

          {/* Visual Analytics & Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Analytics (SVG Graphic) */}
            <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="text-left">
                  <h3 className="text-sm font-black text-gray-900">Revenue Analytics</h3>
                  <p className="text-[10px] text-gray-405 mt-0.5">Monthly revenue, commission & vendor earnings</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>Revenue</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Vendor</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Commission</span>
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
                  <circle cx="250" cy="110" r="4.5" fill="#6366f1" stroke="white" strokeWidth="1.5" />
                  <circle cx="250" cy="130" r="4.5" fill="#10b981" stroke="white" strokeWidth="1.5" />
                </svg>

                {/* Y Axis Labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] font-bold text-gray-400 z-10 py-1">
                  <span>৳140</span>
                  <span>৳105</span>
                  <span>৳70</span>
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
                  <circle cx="72" cy="72" r="54" stroke="#10b981" strokeWidth="16" fill="transparent" strokeDasharray="339.292" strokeDashoffset="0" />
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
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
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
        </main>
      </div>
    </div>
  )
}
