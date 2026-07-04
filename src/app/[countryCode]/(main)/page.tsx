"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Phone,
  Check,
  Activity,
  Search,
  Shield,
  ShoppingCart,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  Upload,
  Sparkles,
  Star,
  Heart,
  ArrowRight,
  Send,
  Moon,
  Sun,
  Trash2,
  GitCompare,
  Menu,
  Globe,
  CreditCard,
  FileText,
  Clock,
  X,
  Mic,
  MessageSquare,
  ShieldCheck,
  Truck
} from "lucide-react"

// Types
interface Product {
  id: string
  name: string
  genericName: string
  brand: string
  category: string
  description: string
  dosage: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  prescriptionRequired: boolean
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock"
  image: string
}

export default function PremiumPharmacyHomepage() {
  // --- States ---
  const isDark = false
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [voiceActive, setVoiceActive] = useState(false)
  const [prescriptionModal, setPrescriptionModal] = useState(false)
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false)
  const [prescriptionFile, setPrescriptionFile] = useState<string | null>(null)
  const [compareItems, setCompareItems] = useState<Product[]>([])
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"best" | "new" | "top" | "trend">("best")
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [assistantOpen, setAssistantOpen] = useState(false)
  
  // AI Chat Messages
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello! I am your AI Health Assistant. Ask me about symptoms, drug interactions, or general medical guidance." }
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 46, seconds: 12 })

  // --- Refs ---
  const megaMenuRef = useRef<HTMLDivElement>(null)

  // --- Effects ---
  // Live Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 8, minutes: 0, seconds: 0 } // Reset
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto Slider
  useEffect(() => {
    const slider = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(slider)
  }, [])

  // Force Light Mode
  useEffect(() => {
    document.documentElement.classList.remove("dark")
    document.documentElement.setAttribute("data-mode", "light")
  }, [])

  // --- Static Data ---
  const heroSlides = [
    {
      title: "Genuine Medicines, Delivered Safely & Fast",
      subtitle: "Get up to 25% OFF on your monthly prescription refills. Verified by licensed medical professionals.",
      badge: "Winter Refill Deals",
      cta1: "Shop Medicines",
      cta2: "Upload Prescription",
      bgColor: "from-teal-50/95 to-slate-50/80",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Consult Certified Doctors Online 24/7",
      subtitle: "Skip the waiting room. Instant video consultations and digitized prescriptions starting at $19.",
      badge: "Telehealth Care",
      cta1: "Book Consultation",
      cta2: "View Services",
      bgColor: "from-blue-50/95 to-slate-50/80",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Smart AI Health Assistant & Finder",
      subtitle: "Identify pill interactions, check symptoms, and track your wellness metrics dynamically.",
      badge: "AI Powered Diagnostics",
      cta1: "Chat with AI Doctor",
      cta2: "Learn More",
      bgColor: "from-emerald-50/95 to-slate-50/80",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200"
    }
  ]

  const megaCategories = [
    {
      name: "Prescription Medicines",
      slug: "prescription",
      items: ["Antibiotics", "Cardiac Drugs", "Antidiabetics", "Asthma Inhalers", "Pain Blockers"],
      tips: "Prescriptions are verified by our panels within 15 minutes.",
      brand: "Pfizer, Novartis"
    },
    {
      name: "OTC Medicines",
      slug: "otc",
      items: ["Cough & Cold", "Pain Relief", "Digestive Health", "Allergy Care", "First Aid Creams"],
      tips: "Always read labels for warnings and dosage intervals.",
      brand: "Bayer, GSK"
    },
    {
      name: "Diabetes Care",
      slug: "diabetes",
      items: ["Insulin Pens", "Glucose Strips", "Glucometers", "Sugar Substitutes", "Diabetic Socks"],
      tips: "Regular testing helps keep A1C targets under control.",
      brand: "Accu-Chek, Roche"
    },
    {
      name: "Heart Care",
      slug: "heart",
      items: ["BP Monitors", "Cholesterol Testers", "Omega Supplements", "Low-Sodium Foods"],
      tips: "Combine BP tracking with 30-mins of light activity daily.",
      brand: "Omron, Abbott"
    },
    {
      name: "Women's Care",
      slug: "womens",
      items: ["Feminine Hygiene", "Prenatal Vitamins", "Hormonal Support", "Maternity Wellness"],
      tips: "Folic Acid is essential during pregnancy stages.",
      brand: "Centrum, One A Day"
    },
    {
      name: "Men's Care",
      slug: "mens",
      items: ["Hair Loss Regrowth", "Multivitamins", "Testosterone Support", "Grooming & Hygiene"],
      tips: "Zinc and Vitamin D support natural male immune functions.",
      brand: "Rogaine, GNC"
    },
    {
      name: "Vitamins & Supplements",
      slug: "vitamins",
      items: ["Multivitamins", "Vitamin C & D", "Calcium & Bone Health", "Fish Oils", "Probiotics"],
      tips: "Taking supplements with food improves absorption rate.",
      brand: "Swisse, Nature's Own"
    },
    {
      name: "Health Devices",
      slug: "devices",
      items: ["Thermometers", "Pulse Oximeters", "Nebulizers", "Massage Relief", "CPAP Therapy"],
      tips: "Ensure devices are FDA approved before home testing.",
      brand: "Philips, Omron"
    }
  ]

  const categoriesGrid = [
    { name: "Prescription Drugs", count: "12,450 Products", bg: "from-emerald-500/25 to-teal-500/20", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=150" },
    { name: "Vitamins & Minerals", count: "3,890 Products", bg: "from-amber-500/25 to-orange-500/20", img: "https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?auto=format&fit=crop&q=80&w=150" },
    { name: "Medical Devices", count: "1,520 Products", bg: "from-blue-500/25 to-indigo-500/20", img: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=150" },
    { name: "Personal Care", count: "8,940 Products", bg: "from-indigo-500/25 to-violet-500/20", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=150" },
    { name: "Baby & Infant Care", count: "2,110 Products", bg: "from-sky-500/25 to-cyan-500/20", img: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=150" },
    { name: "Diabetes Management", count: "980 Products", bg: "from-cyan-500/25 to-teal-500/20", img: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=150" }
  ]

  function getProductImage(id: string): string {
    const photoMap: Record<string, string> = {
      f1: "photo-1584308666744-24d5c474f2ae",
      f2: "photo-1603398938378-e54eab446dde",
      f3: "photo-1507925921958-8a62f3d1a50d",
      f4: "photo-1616679911721-eff6eec18fcd",
      na1: "photo-1611926653458-09294b3142bf",
      na2: "photo-1550572017-edd951b55104",
      na3: "photo-1615485290382-441e4d049cb5",
      na4: "photo-1547489432-cf93fa6c71ee",
      na5: "photo-1512290923902-8a9f81dc236c",
      na6: "photo-1471864190281-a93a3070b6de",
      na7: "photo-1584017911766-d451b3d0e843",
      na8: "photo-1576091160550-2173dba999ef",
      na9: "photo-1606787366850-de6330128bfc",
      na10: "photo-1540555700478-4be289fbecef",
      ts1: "photo-1586015555751-63bb77f4322a",
      ts2: "photo-1608571423902-eed4a5ad8108",
      ts3: "photo-1628771065518-0d82f1938462",
      ts4: "photo-1584515979956-d9f6e5d09982",
      ts5: "photo-1576091352243-7f3c25983797",
      ts6: "photo-1556911220-e15b29be8c8f",
      ts7: "photo-1556228720-195a672e8a03",
      ts8: "photo-1515377905703-c4788e51af15",
      ts9: "photo-1505576399279-565b52d4ac71",
      ts10: "photo-1576602976047-174e57a47881",
      mn1: "photo-1576091160399-112ba8d25d1d",
      mn2: "photo-1526253038957-bce54e05968e",
      mn3: "photo-1576602975754-efdf313b9342",
      mn4: "photo-1490645935967-10de6ba17061",
      mn5: "photo-1571019613454-1cb2f99b2d8b",
      mn6: "photo-1512290923902-8a9f81dc236c",
      mn7: "photo-1506126613408-eca07ce68773",
      mn8: "photo-1526253038957-bce54e05968e",
      mn9: "photo-1584308666744-24d5c474f2ae",
      mn10: "photo-1556228720-195a672e8a03"
    };
    const photoId = photoMap[id] || "photo-1584308666744-24d5c474f2ae";
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=300`;
  }

  const flashSaleProducts: Product[] = [
    {
      id: "f1",
      name: "Atorvastatin Calcium 20mg",
      genericName: "Atorvastatin (Generic Lipitor)",
      brand: "Pfizer",
      category: "Cholesterol Control",
      description: "Lowers 'bad' cholesterol (LDL) and triglycerides in blood while raising 'good' cholesterol.",
      dosage: "20mg, Once Daily",
      price: 19.99,
      originalPrice: 34.99,
      rating: 4.8,
      reviews: 142,
      prescriptionRequired: true,
      stockStatus: "Low Stock",
      image: getProductImage("f1")
    },
    {
      id: "f2",
      name: "SmartBP Digital Blood Pressure Monitor",
      genericName: "Upper Arm Pulse & BP Gauge",
      brand: "Omron Health",
      category: "Medical Devices",
      description: "Accurate blood pressure reading with automatic upper-arm cuff calibration and bluetooth link.",
      dosage: "N/A",
      price: 49.99,
      originalPrice: 89.99,
      rating: 4.9,
      reviews: 864,
      prescriptionRequired: false,
      stockStatus: "In Stock",
      image: getProductImage("f2")
    },
    {
      id: "f3",
      name: "Glucocard Insulin Injection Pen",
      genericName: "Insulin Glargine 100 U/mL",
      brand: "Eli Lilly",
      category: "Diabetes Care",
      description: "Pre-filled disposable insulin delivery pen designed for comfortable blood glucose control.",
      dosage: "Custom Units, Subcutaneous",
      price: 24.50,
      originalPrice: 39.99,
      rating: 4.7,
      reviews: 98,
      prescriptionRequired: true,
      stockStatus: "In Stock",
      image: getProductImage("f3")
    },
    {
      id: "f4",
      name: "Premium Multivitamins for Men",
      genericName: "Daily Multi + Energy Support",
      brand: "Centrum",
      category: "Supplements",
      description: "Packed with essential vitamins D, B12, Zinc, and minerals to maintain muscle health and metabolism.",
      dosage: "1 Tablet Daily",
      price: 12.99,
      originalPrice: 19.99,
      rating: 4.6,
      reviews: 312,
      prescriptionRequired: false,
      stockStatus: "In Stock",
      image: getProductImage("f4")
    }
  ]

  const newArrivalsProducts: Product[] = [
    { id: "na1", name: "Vitamin C-1000 Booster", genericName: "Swisse Daily Immune C", brand: "Swisse", category: "Vitamins", description: "Supports immune health, antioxidant protection, and collagen production.", dosage: "1 Tablet Daily", price: 14.99, originalPrice: 19.99, rating: 4.8, reviews: 120, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("na1") },
    { id: "na2", name: "Deep Sleep Melatonin 5mg", genericName: "Natrol Sleep Aid", brand: "Natrol", category: "Sleep & Calm", description: "Drug-free sleep aid to help regulate natural circadian rhythms.", dosage: "1 Tablet 30m before bed", price: 12.50, originalPrice: 16.99, rating: 4.7, reviews: 310, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("na2") },
    { id: "na3", name: "Turmeric Curcumin 1500mg", genericName: "BioSchwartz Joint Comfort", brand: "BioSchwartz", category: "Joint Support", description: "Natural anti-inflammatory compound for joint flexibility and movement.", dosage: "2 Capsules Daily", price: 18.99, originalPrice: 24.99, rating: 4.6, reviews: 205, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("na3") },
    { id: "na4", name: "Omega-3 Fish Oil 1200mg", genericName: "Nature Made Fish Oil", brand: "Nature Made", category: "Heart Health", description: "Purified fish oil capsules containing EPA and DHA for cardiac wellness.", dosage: "1 Softgel Daily", price: 16.99, originalPrice: 22.99, rating: 4.9, reviews: 450, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("na4") },
    { id: "na5", name: "CoQ10 Heart Health 100mg", genericName: "Qunol Ultra CoQ10", brand: "Qunol", category: "Heart Health", description: "Supports cardiovascular system energy and cell regeneration.", dosage: "1 Capsule Daily", price: 22.50, originalPrice: 29.99, rating: 4.8, reviews: 89, prescriptionRequired: false, stockStatus: "Low Stock", image: getProductImage("na5") },
    { id: "na6", name: "Elderberry Defense Syrup", genericName: "Sambucol Black Elderberry", brand: "Sambucol", category: "Immunity", description: "Concentrated elderberry syrup packed with immune-supporting antioxidants.", dosage: "10ml Daily", price: 15.99, originalPrice: 20.99, rating: 4.7, reviews: 135, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("na6") },
    { id: "na7", name: "Zinc Defense Lozenges", genericName: "Zand Herbal HerbaClozenge", brand: "Zand", category: "Immunity", description: "Quick dissolving lozenges with zinc and menthol to soothe throat.", dosage: "1 Lozenge every 2 hrs", price: 8.99, originalPrice: 11.99, rating: 4.5, reviews: 75, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("na7") },
    { id: "na8", name: "Active Probiotics 50 Billion", genericName: "Renew Life Ultimate Flora", brand: "Renew Life", category: "Digestive Health", description: "Daily digestive supplement for gut microflora balance and bloating relief.", dosage: "1 Capsule Daily", price: 24.99, originalPrice: 32.99, rating: 4.8, reviews: 160, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("na8") },
    { id: "na9", name: "Vitamin D3 5000 IU", genericName: "SR Organic D3", brand: "Sports Research", category: "Bone Health", description: "Essential vitamin for calcium absorption, bone strength, and immunity.", dosage: "1 Softgel Daily", price: 13.50, originalPrice: 18.99, rating: 4.9, reviews: 520, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("na9") },
    { id: "na10", name: "Magnesium Glycinate 400mg", genericName: "Doctor's Best High Absorption", brand: "Doctor's Best", category: "Muscle Health", description: "Highly absorbable magnesium to support muscle relaxation and sleep.", dosage: "2 Tablets Daily", price: 17.99, originalPrice: 23.99, rating: 4.7, reviews: 290, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("na10") }
  ]

  const topSellingProducts: Product[] = [
    { id: "ts1", name: "Atorvastatin Calcium 20mg", genericName: "Atorvastatin (Generic Lipitor)", brand: "Pfizer", category: "Cholesterol Control", description: "Lowers 'bad' cholesterol (LDL) and triglycerides in blood while raising 'good' cholesterol.", dosage: "20mg, Once Daily", price: 19.99, originalPrice: 34.99, rating: 4.8, reviews: 142, prescriptionRequired: true, stockStatus: "Low Stock", image: getProductImage("ts1") },
    { id: "ts2", name: "Metformin ER 500mg", genericName: "Metformin Extended Release", brand: "Bristol-Myers", category: "Diabetes", description: "Oral diabetes medicine that helps control blood sugar levels for type 2 diabetes.", dosage: "500mg, Twice Daily", price: 15.50, originalPrice: 22.99, rating: 4.7, reviews: 98, prescriptionRequired: true, stockStatus: "In Stock", image: getProductImage("ts2") },
    { id: "ts3", name: "Lisinopril 10mg", genericName: "Lisinopril (Generic Prinivil)", brand: "Novartis", category: "Blood Pressure", description: "ACE inhibitor used to treat high blood pressure and prevent heart failure.", dosage: "10mg, Once Daily", price: 11.99, originalPrice: 19.99, rating: 4.8, reviews: 115, prescriptionRequired: true, stockStatus: "In Stock", image: getProductImage("ts3") },
    { id: "ts4", name: "Albuterol HFA Inhaler", genericName: "Albuterol Sulfate Inhalation", brand: "GSK", category: "Asthma Care", description: "Bronchodilator that relaxes muscles in the airways and increases air flow to the lungs.", dosage: "2 Puffs every 4-6 hrs", price: 29.99, originalPrice: 39.99, rating: 4.9, reviews: 310, prescriptionRequired: true, stockStatus: "In Stock", image: getProductImage("ts4") },
    { id: "ts5", name: "Amoxicillin 500mg Capsules", genericName: "Amoxicillin Trihydrate", brand: "Sandoz", category: "Antibiotics", description: "Penicillin antibiotic that fights bacteria in your body (ear, nose, throat infections).", dosage: "500mg, Three Times Daily", price: 14.50, originalPrice: 25.00, rating: 4.6, reviews: 88, prescriptionRequired: true, stockStatus: "In Stock", image: getProductImage("ts5") },
    { id: "ts6", name: "Levothyroxine 50mcg", genericName: "Levothyroxine Sodium", brand: "AbbVie", category: "Thyroid Care", description: "Thyroid medicine that replaces a hormone normally produced by your thyroid gland.", dosage: "50mcg, Once Daily in Morning", price: 18.00, originalPrice: 28.00, rating: 4.7, reviews: 104, prescriptionRequired: true, stockStatus: "In Stock", image: getProductImage("ts6") },
    { id: "ts7", name: "Gabapentin 300mg", genericName: "Gabapentin (Generic Neurontin)", brand: "Pfizer", category: "Nerve Pain", description: "Anti-epileptic drug, also used to treat neuropathic (nerve) pain.", dosage: "300mg, Three Times Daily", price: 21.99, originalPrice: 32.50, rating: 4.5, reviews: 92, prescriptionRequired: true, stockStatus: "In Stock", image: getProductImage("ts7") },
    { id: "ts8", name: "Omeprazole 20mg Tablets", genericName: "Omeprazole (Generic Prilosec)", brand: "AstraZeneca", category: "Acid Reflux", description: "Proton pump inhibitor that decreases the amount of acid produced in the stomach.", dosage: "20mg, Once Daily Before Meal", price: 13.99, originalPrice: 19.99, rating: 4.7, reviews: 254, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("ts8") },
    { id: "ts9", name: "Losartan Potassium 50mg", genericName: "Losartan (Generic Cozaar)", brand: "Merck", category: "Blood Pressure", description: "Angiotensin II receptor antagonist used to treat high blood pressure.", dosage: "50mg, Once Daily", price: 16.50, originalPrice: 24.99, rating: 4.8, reviews: 76, prescriptionRequired: true, stockStatus: "In Stock", image: getProductImage("ts9") },
    { id: "ts10", name: "Sertraline 50mg", genericName: "Sertraline (Generic Zoloft)", brand: "Pfizer", category: "Mental Care", description: "Selective serotonin reuptake inhibitor (SSRI) used to treat depression.", dosage: "50mg, Once Daily", price: 22.00, originalPrice: 35.00, rating: 4.8, reviews: 147, prescriptionRequired: true, stockStatus: "In Stock", image: getProductImage("ts10") }
  ]

  const mostNeededProducts: Product[] = [
    { id: "mn1", name: "SmartBP Arm BP Monitor", genericName: "Upper Arm Blood Pressure Monitor", brand: "Omron", category: "Devices", description: "Pre-calibrated digital blood pressure monitor with automatic inflate.", dosage: "N/A", price: 49.99, originalPrice: 79.99, rating: 4.9, reviews: 864, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("mn1") },
    { id: "mn2", name: "Accu-Chek Guide Me Kit", genericName: "Blood Glucose Meter Kit", brand: "Roche", category: "Diabetes", description: "Wireless blood sugar monitoring kit with test strips and lancing device.", dosage: "N/A", price: 29.99, originalPrice: 45.00, rating: 4.8, reviews: 412, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("mn2") },
    { id: "mn3", name: "Digital Fast Read Thermometer", genericName: "Express Oral/Underarm Thermometer", brand: "Philips", category: "Devices", description: "Underarm and oral fever thermometer with quick 10-second read and alert beep.", dosage: "N/A", price: 9.99, originalPrice: 15.99, rating: 4.6, reviews: 150, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("mn3") },
    { id: "mn4", name: "Low Dose Aspirin 81mg", genericName: "Aspirin Regimen 81mg Tablets", brand: "Bayer", category: "Heart Health", description: "Pain reliever and fever reducer, commonly used under doctor direction to protect heart.", dosage: "1 Tablet Daily", price: 7.99, originalPrice: 12.49, rating: 4.9, reviews: 310, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("mn4") },
    { id: "mn5", name: "Advil Ibuprofen 200mg", genericName: "Ibuprofen Pain Reliever / Fever Reducer", brand: "Advil", category: "Pain Relief", description: "Temporary relief of minor aches and pains due to headache, muscle ache, toothache.", dosage: "1-2 Tablets every 4-6 hrs", price: 9.50, originalPrice: 14.99, rating: 4.8, reviews: 680, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("mn5") },
    { id: "mn6", name: "Neosporin First Aid Ointment", genericName: "Triple Antibiotic Protection Cream", brand: "Neosporin", category: "First Aid", description: "Provides 24-hour infection protection for minor cuts, scrapes, and burns.", dosage: "Apply to affected area 1-3 times daily", price: 6.99, originalPrice: 9.99, rating: 4.8, reviews: 290, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("mn6") },
    { id: "mn7", name: "Zyrtec Allergy Relief 10mg", genericName: "Cetirizine Hydrochloride Tablets", brand: "Zyrtec", category: "Allergy Care", description: "Provides 24-hour relief of symptoms due to hay fever or upper respiratory allergies.", dosage: "1 Tablet Daily", price: 15.99, originalPrice: 22.99, rating: 4.7, reviews: 405, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("mn7") },
    { id: "mn8", name: "Fingertip Pulse Oximeter", genericName: "Oxygen Saturation SpO2 Monitor", brand: "Zacurate", category: "Devices", description: "Accurately measures blood oxygen saturation level and pulse rate in seconds.", dosage: "N/A", price: 24.99, originalPrice: 35.00, rating: 4.8, reviews: 712, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("mn8") },
    { id: "mn9", name: "Saline Nasal Mist Spray", genericName: "Natural Saline Nasal Spray", brand: "Ocean", category: "Cough & Cold", description: "Provides instant moisture to dry nasal passages, safe for daily use.", dosage: "2 Sprays in each nostril as needed", price: 5.99, originalPrice: 8.99, rating: 4.5, reviews: 104, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("mn9") },
    { id: "mn10", name: "Cortizone-10 Anti-Itch Cream", genericName: "1% Hydrocortisone Healing Cream", brand: "Cortizone", category: "First Aid", description: "Relieves itch associated with minor skin irritations, inflammation, and rashes.", dosage: "Apply to affected area 3-4 times daily", price: 8.50, originalPrice: 12.00, rating: 4.7, reviews: 185, prescriptionRequired: false, stockStatus: "In Stock", image: getProductImage("mn10") }
  ]

  const healthConcerns = [
    { title: "Diabetes Care", icon: "🩸", color: "from-red-500 to-red-650" },
    { title: "Blood Pressure", icon: "💓", color: "from-orange-500 to-red-550" },
    { title: "Heart Health", icon: "🫀", color: "from-blue-500 to-indigo-655" },
    { title: "Liver Cleanse", icon: "🩹", color: "from-amber-500 to-yellow-605" },
    { title: "Kidney Care", icon: "💧", color: "from-teal-500 to-emerald-605" },
    { title: "Fever & Cold", icon: "🌡️", color: "from-orange-500 to-red-500" },
    { title: "Pain Relief", icon: "💊", color: "from-purple-500 to-indigo-600" },
    { title: "Mental Health", icon: "🧠", color: "from-violet-500 to-purple-700" }
  ]

  const services = [
    { name: "Online Doctor Consult", desc: "Consult expert medical specialists online from home", icon: <Activity className="w-8 h-8 text-[#309391]" /> },
    { name: "Verified Lab Tests", desc: "Blood panels, cholesterol & metabolic checks with home pickup", icon: <FileText className="w-8 h-8 text-[#309391]" /> },
    { name: "Emergency Dispatch", desc: "Instantly summon emergency response and home ambulance units", icon: <Phone className="w-8 h-8 text-[#EC1F28] animate-pulse" /> },
    { name: "Prescription Analysis", desc: "Upload physical slips for automatic digital conversion", icon: <Upload className="w-8 h-8 text-[#309391]" /> },
    { name: "Medicine Reminders", desc: "Setup recurring app notifications to never miss daily dosages", icon: <Clock className="w-8 h-8 text-[#309391]" /> },
    { name: "Free Home Nursing", desc: "Schedule certified nursing aids for home post-op recovery", icon: <User className="w-8 h-8 text-[#309391]" /> }
  ]

  const brands = [
    {
      name: "Pfizer",
      logo: (
        <svg viewBox="0 0 100 32" className="h-6 w-auto">
          <ellipse cx="50" cy="16" rx="46" ry="14" fill="#00a3e0" />
          <text x="50" y="20" fontFamily="'Georgia', serif" fontWeight="bold" fontStyle="italic" fontSize="12" fill="#ffffff" textAnchor="middle">Pfizer</text>
        </svg>
      )
    },
    {
      name: "Abbott",
      logo: (
        <svg viewBox="0 0 100 32" className="h-6 w-auto">
          <circle cx="20" cy="16" r="10" fill="none" stroke="#008bb0" strokeWidth="3" />
          <path d="M15,16 L25,16 M20,11 L20,21" stroke="#008bb0" strokeWidth="2" />
          <text x="62" y="20" fontFamily="'Trebuchet MS', sans-serif" fontWeight="bold" fontSize="13" fill="#008bb0" textAnchor="middle">Abbott</text>
        </svg>
      )
    },
    {
      name: "Novartis",
      logo: (
        <svg viewBox="0 0 100 32" className="h-6 w-auto">
          <path d="M10,6 L22,6 L16,22 Z" fill="#d35400" />
          <circle cx="24" cy="14" r="5" fill="#f39c12" />
          <text x="64" y="20" fontFamily="'Arial', sans-serif" fontWeight="900" fontSize="11" fill="#34495e" textAnchor="middle">NOVARTIS</text>
        </svg>
      )
    },
    {
      name: "GSK",
      logo: (
        <svg viewBox="0 0 100 32" className="h-6 w-auto">
          <path d="M6,16 C6,8 14,4 26,4 C38,4 46,8 46,16 C46,24 38,28 26,28 C14,28 6,24 6,16 Z" fill="#f36c21" />
          <text x="26" y="21" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#ffffff" textAnchor="middle">gsk</text>
          <text x="72" y="20" fontFamily="sans-serif" fontWeight="800" fontSize="12" fill="#555555" textAnchor="middle">Glaxo</text>
        </svg>
      )
    },
    {
      name: "Roche",
      logo: (
        <svg viewBox="0 0 100 32" className="h-6 w-auto">
          <polygon points="12,6 36,6 48,16 36,26 12,26 0,16" fill="#0066cc" />
          <text x="24" y="20" fontFamily="sans-serif" fontWeight="bold" fontSize="9" fill="#ffffff" textAnchor="middle">Roche</text>
          <text x="70" y="20" fontFamily="sans-serif" fontWeight="900" fontSize="12" fill="#333333" textAnchor="middle">ROCHE</text>
        </svg>
      )
    },
    {
      name: "AstraZeneca",
      logo: (
        <svg viewBox="0 0 100 32" className="h-6 w-auto">
          <path d="M6,6 L18,22 L12,26 L6,6 Z" fill="#800080" />
          <path d="M18,22 L30,6 L24,6 L18,22 Z" fill="#c71585" />
          <text x="64" y="20" fontFamily="sans-serif" fontWeight="bold" fontSize="9" fill="#333333" textAnchor="middle">AstraZeneca</text>
        </svg>
      )
    }
  ]

  const testimonials = [
    { name: "Sarah Jenkins", role: "Cardiac Patient", text: "Ordering my heart medication has never been easier. The prescription scanner digitized my doctor's note in 15 seconds, and the dispatch arrived within 2 hours!", rating: 5, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" },
    { name: "David Miller", role: "Type-2 Diabetic", text: "The Smart AI assistant helped identify a serious interaction between my blood thinner and a new OTC cough syrup I was about to buy. Exceptional product!", rating: 5, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
    { name: "Emily Watson", role: "Parent of Toddler", text: "I rely on their 24/7 medicine delivery. Late night high-fever issues were resolved immediately by ordering a home-visit vaccination and liquid ibuprofen.", rating: 5, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" }
  ]

  const blogPosts = [
    { category: "Medicine Guide", title: "Top 5 Drug Interactions to Watch Out For This Winter", desc: "How simple cold medicines interact with high blood pressure prescriptions and cardiac tablets.", date: "Dec 18, 2026", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400" },
    { category: "Nutrition", title: "Key Vitamins & Supplements For Boosting Joint Elasticity", desc: "Understanding the efficacy differences between Glucosamine, Chondroitin, and Omega Marine Oils.", date: "Dec 10, 2026", img: "https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?auto=format&fit=crop&q=80&w=400" },
    { category: "Health Tips", title: "Managing Glucose Spikes After High-Carbohydrate Meals", desc: "Effective, doctor-verified strategies to smooth glycemic curves without extra emergency insulin doses.", date: "Nov 28, 2026", img: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=400" }
  ]

  // --- Interactive Handlers ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowSuggestions(e.target.value.length > 0)
  }

  const handleVoiceSearch = () => {
    setVoiceActive(true)
    setTimeout(() => {
      setSearchQuery("Atorvastatin Calcium 20mg")
      setShowSuggestions(true)
      setVoiceActive(false)
    }, 2000)
  }

  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionFile(e.target.files[0].name)
      setPrescriptionUploaded(true)
    }
  }

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { product, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId))
  }

  const handleToggleWishlist = (productId: string) => {
    setWishlistItems(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId])
  }

  const handleAddToCompare = (product: Product) => {
    if (compareItems.find(item => item.id === product.id)) {
      setCompareItems(prev => prev.filter(item => item.id !== product.id))
    } else {
      if (compareItems.length >= 3) {
        alert("You can compare up to 3 products at a time.")
        return
      }
      setCompareItems(prev => [...prev, product])
    }
  }

  // Symptom checker logic
  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }])
    setChatInput("")
    setIsTyping(true)

    setTimeout(() => {
      let reply = "I understand you are experiencing these symptoms. For accuracy, please verify if you have a fever. Our online doctors are ready to help."
      if (userMsg.toLowerCase().includes("fever") || userMsg.toLowerCase().includes("cough")) {
        reply = "Based on symptoms of cough/fever, we recommend checking your temperature. OTC Acetaminophen (Tylenol) can help, but if symptoms persist over 48 hours, book a virtual consultation."
      } else if (userMsg.toLowerCase().includes("heart") || userMsg.toLowerCase().includes("chest pain")) {
        reply = "⚠️ WARNING: Chest pain or severe shortness of breath can be a sign of a cardiac emergency. Please call local emergency services immediately or use our emergency SOS hotline."
      } else if (userMsg.toLowerCase().includes("interaction") || userMsg.toLowerCase().includes("atorvastatin")) {
        reply = "Atorvastatin (Lipitor) should not be combined with large quantities of grapefruit juice, or specific antibiotics like Erythromycin due to muscle injury risks."
      }

      setChatMessages(prev => [...prev, { sender: "bot", text: reply }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen font-sans bg-slate-50/20 text-slate-900 relative" style={{ overflowX: "clip" }}>
      {/* Ambient Visual Glow Accents */}
      <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-200/25 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[35%] right-[-15%] w-[700px] h-[700px] rounded-full bg-amber-200/20 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[70%] left-[-10%] w-[650px] h-[650px] rounded-full bg-cyan-100/20 blur-3xl pointer-events-none z-0" />
      <style dangerouslySetInnerHTML={{ __html: `
        div.sticky.top-0.inset-x-0.z-50, footer:not(.custom-footer).border-t {
          display: none !important;
        }
      ` }} />

      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 transition-all duration-205 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <a href="#" className="flex items-center gap-2.5">
              <div className="bg-[#309391] text-white p-2 rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                RL<span className="text-[#309391]"> Pharmacy</span>
              </span>
            </a>
            
            {/* Quick Actions (Mobile) */}
            <div className="flex md:hidden items-center gap-3">
              <button onClick={() => setCartOpen(true)} className="relative p-2 hover:bg-slate-100 rounded-lg">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#EC1F28] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                    {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* AI Search Bar */}
          <div className="relative flex-1 max-w-2xl w-full">
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-205 dark:border-slate-805 focus-within:border-[#309391] dark:focus-within:border-[#309391] transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-4" />
              <input
                type="text"
                placeholder="Search prescription medicines, health concerns, brands with AI finder..."
                className="w-full bg-transparent py-2.5 px-3 outline-none text-sm text-slate-800 dark:text-slate-200 placeholder-slate-450"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
              />
              <button 
                onClick={handleVoiceSearch}
                className={`p-2 rounded-full mr-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition ${voiceActive ? "bg-red-500/20 text-[#EC1F28]" : "text-slate-500"}`}
                title="Voice Search"
              >
                {voiceActive ? <Activity className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-slate-400">Search Suggestions</span>
                  <button onClick={() => setShowSuggestions(false)} className="text-xs text-slate-500 hover:text-slate-800">Close</button>
                </div>
                {searchQuery.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <div 
                      onClick={() => { setSearchQuery("Atorvastatin Calcium 20mg"); setShowSuggestions(false); }}
                      className="flex items-center justify-between p-2.5 hover:bg-slate-105 dark:hover:bg-slate-850 rounded-xl cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#309391]" />
                        <div>
                          <p className="text-sm font-semibold">Atorvastatin Calcium 20mg</p>
                          <p className="text-xs text-slate-400">Prescription Required • Pfizer</p>
                        </div>
                      </div>
                      <span className="text-xs text-[#309391] font-semibold">$19.99</span>
                    </div>
                    <div 
                      onClick={() => { setSearchQuery("SmartBP Digital Blood Pressure Monitor"); setShowSuggestions(false); }}
                      className="flex items-center justify-between p-2.5 hover:bg-slate-105 dark:hover:bg-slate-850 rounded-xl cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#309391]" />
                        <div>
                          <p className="text-sm font-semibold">SmartBP Digital Blood Pressure Monitor</p>
                          <p className="text-xs text-slate-400">Omron Health Device</p>
                        </div>
                      </div>
                      <span className="text-xs text-[#309391] font-semibold">$49.99</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-slate-450 mb-2 font-semibold">Trending Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {["Insulin", "Blood Pressure Monitor", "Vitamins", "Allergy Care", "Aspirin"].map(term => (
                        <button 
                          key={term}
                          onClick={() => { setSearchQuery(term); setShowSuggestions(true); }}
                          className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-xs hover:bg-[#309391] hover:text-white transition"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Right Navigation Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-full transition" title="Wishlist">
              <Heart className="w-5 h-5 text-slate-655" />
              {wishlistItems.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-[#EC1F28] rounded-full" />}
            </button>

            <button 
              onClick={() => setCartOpen(true)} 
              className="relative p-2.5 bg-slate-105 hover:bg-slate-200 rounded-full transition text-slate-700"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EC1F28] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                  {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 cursor-pointer pl-2">
              <div className="w-9 h-9 rounded-full bg-teal-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar with Menu items (Home, Shop, Medicines, Blog, About Us, Contact Us) */}
        <div className="border-t border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50 px-4 md:px-6 shadow-inner">
          <div className="max-w-[1440px] mx-auto flex items-center gap-6 overflow-x-auto no-scrollbar py-2.5 text-sm font-semibold">
            {/* Primary Menu Items */}
            <a href="#" className="text-slate-800 dark:text-slate-200 hover:text-[#309391] dark:hover:text-[#309391] whitespace-nowrap transition-colors duration-150">Home</a>
            <a href="#shop" className="text-slate-800 dark:text-slate-200 hover:text-[#309391] dark:hover:text-[#309391] whitespace-nowrap transition-colors duration-150">Shop</a>
            <a href="#medicines" className="text-slate-800 dark:text-slate-200 hover:text-[#309391] dark:hover:text-[#309391] whitespace-nowrap transition-colors duration-150">Medicines</a>
            <a href="#blog" className="text-slate-800 dark:text-slate-200 hover:text-[#309391] dark:hover:text-[#309391] whitespace-nowrap transition-colors duration-150">Blog</a>
            <a href="#about" className="text-slate-800 dark:text-slate-200 hover:text-[#309391] dark:hover:text-[#309391] whitespace-nowrap transition-colors duration-150">About Us</a>
            <a href="#contact" className="text-slate-800 dark:text-slate-200 hover:text-[#309391] dark:hover:text-[#309391] whitespace-nowrap transition-colors duration-150">Contact Us</a>
            
            <a href="#featured-categories" className="text-[#309391] hover:text-[#257270] whitespace-nowrap">Home Refills</a>
            <a href="#flash-sale" className="text-[#EC1F28] hover:text-red-700 flex items-center gap-1.5 whitespace-nowrap">
              <span>🔥</span> Flash Offers
            </a>
            <a href="#prescription-meds" className="hover:text-[#309391] whitespace-nowrap">Prescription Medicines</a>
            <a href="#concerns" className="hover:text-[#309391] whitespace-nowrap">Health Concerns</a>
          </div>
        </div>
      </header>

      {/* ==================================================
          SECTION 2 & 3 — HERO SECTION & SIDEBAR MEGA MENU
          ================================================== */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Mega Category Menu */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 hidden lg:block shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-100 dark:border-slate-850 flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-[#309391]" /> Categories Menu
          </h3>
          <div className="flex flex-col gap-1 relative" ref={megaMenuRef}>
            {megaCategories.map(cat => (
              <div 
                key={cat.slug}
                onMouseEnter={() => setActiveMegaMenu(cat.slug)}
                onMouseLeave={() => setActiveMegaMenu(null)}
                className="relative"
              >
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#309391]/10 hover:text-[#309391] cursor-pointer transition">
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>

                {/* Hover Mega Menu Panel */}
                {activeMegaMenu === cat.slug && (
                  <div className="absolute left-full top-0 ml-2 w-[420px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl z-50 flex flex-col gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#309391] mb-2">{cat.name} Products</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {cat.items.map(item => (
                          <div 
                            key={item} 
                            onClick={() => { setSearchQuery(item); setShowSuggestions(true); }}
                            className="text-xs text-slate-600 dark:text-slate-400 hover:text-[#309391] cursor-pointer py-1.5 transition flex items-center gap-1.5 font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#309391]" /> {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-850 pt-3">
                      <p className="text-xs font-semibold text-slate-400 mb-1">Health Tip</p>
                      <p className="text-xs text-slate-500 leading-relaxed italic">{cat.tips}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl flex items-center justify-between text-xs">
                      <span className="text-slate-400">Featured Brands</span>
                      <span className="font-bold text-[#309391]">{cat.brand}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center: Large Hero Slider */}
        <div className="lg:col-span-9 bg-slate-50 border border-slate-100 dark:border-slate-800 rounded-3xl relative overflow-hidden h-[340px] md:h-[420px] shadow-sm group">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat flex items-center p-8 md:p-12"
              style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
            >
              {/* Natural Full-Bleed Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-transparent md:from-white/90 md:via-white/50 md:to-transparent z-0 pointer-events-none" />

              {/* Text & Content directly on slide */}
              <div className="relative z-10 max-w-md md:max-w-xl flex flex-col items-start gap-3.5">
                <span className="bg-[#309391] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {heroSlides[currentSlide].badge}
                </span>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-extrabold max-w-sm md:max-w-md">
                  {heroSlides[currentSlide].subtitle}
                </p>
                <div className="flex gap-3 mt-1.5">
                  <button 
                    onClick={() => { setSearchQuery("medicine"); setShowSuggestions(true); }}
                    className="px-5 py-2.5 bg-[#309391] hover:bg-teal-700 text-white font-extrabold rounded-full text-xs transition shadow-md shadow-teal-500/25 hover:shadow-teal-500/45 scale-100 hover:scale-[1.02] duration-200"
                  >
                    {heroSlides[currentSlide].cta1}
                  </button>
                  <button 
                    onClick={() => setPrescriptionModal(true)}
                    className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-full text-xs transition border border-slate-200 hover:border-slate-300 scale-100 hover:scale-[1.02] duration-200 shadow-sm"
                  >
                    {heroSlides[currentSlide].cta2}
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[9px] md:text-[10px] text-slate-500 font-bold border-t border-slate-900/10 pt-4 mt-2 w-full">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> FDA APPROVED</span>
                  <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-teal-600" /> 15-MIN REFILLS</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9 CUSTOMER RATING</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <button 
            onClick={() => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white/90 text-slate-700 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 border border-slate-200/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white/90 text-slate-700 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 border border-slate-200/50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Progress Dots */}
          <div className="absolute bottom-6 left-12 flex gap-1.5">
            {heroSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? "w-6 bg-[#309391]" : "w-1.5 bg-slate-350"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 4 — FEATURED CATEGORIES
          ================================================== */}
      <section id="featured-categories" className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured Health Categories</h2>
            <p className="text-sm text-slate-500 mt-1">Shop authentic diagnostics, pills, baby items, and nutrition</p>
          </div>
          <button className="text-sm text-[#309391] font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesGrid.map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => { setSearchQuery(cat.name); setShowSuggestions(true); }}
              className="bg-white border border-slate-100 rounded-[32px] p-5 flex items-center justify-between gap-4 cursor-pointer shadow-md hover:shadow-xl hover:shadow-[#309391]/8 hover:-translate-y-1 hover:border-[#309391]/25 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-[22px] bg-gradient-to-br ${cat.bg} flex items-center justify-center p-1 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                  <img src={cat.img} alt={cat.name} className="object-cover w-full h-full rounded-[18px] animate-fadeIn" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 tracking-tight group-hover:text-[#309391] transition-colors">{cat.name}</h4>
                  <p className="text-[9px] font-extrabold text-[#309391] mt-1 uppercase tracking-wider">{cat.count}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#309391] group-hover:text-white transition duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          SECTION 5 — FLASH SALE
          ================================================== */}
      <section id="flash-sale" className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        <div className="bg-gradient-to-br from-cyan-50/70 via-slate-50/90 to-teal-50/40 border border-cyan-100/70 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
          {/* Section details */}
          <div className="max-w-sm flex flex-col items-start gap-4 text-slate-800 dark:text-white">
            <span className="bg-[#EC1F28] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Flash Deal Offers
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight text-slate-900 dark:text-white">Fast Refill Refresher Deals</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Order daily healthcare essentials and prescriptions with double discounts before the timer ends.
            </p>
            {/* Countdown timer */}
            <div className="flex gap-2 text-center mt-2">
              {[
                { label: "HRS", val: timeLeft.hours },
                { label: "MIN", val: timeLeft.minutes },
                { label: "SEC", val: timeLeft.seconds }
              ].map(block => (
                <div key={block.label} className="bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-2xl min-w-[64px] shadow-sm">
                  <span className="block text-xl font-bold text-[#EC1F28]">{String(block.val).padStart(2, "0")}</span>
                  <span className="text-[9px] font-semibold text-slate-550 dark:text-slate-400">{block.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Slider */}
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashSaleProducts.slice(0, 3).map(prod => (
              <div 
                key={prod.id} 
                className="bg-[#F8FAFC]/90 border border-slate-100 rounded-[36px] p-5 flex flex-col justify-between shadow-md hover:shadow-xl hover:shadow-[#309391]/8 hover:-translate-y-1.5 hover:border-[#309391]/25 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Discount Badge */}
                <span className="absolute top-3.5 left-3.5 bg-[#EC1F28] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full z-10 shadow-sm">
                  -25% OFF
                </span>
                
                {/* Wishlist Heart */}
                <button 
                  onClick={() => handleToggleWishlist(prod.id)}
                  className="absolute top-3.5 right-3.5 p-2 bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm hover:shadow transition duration-200 z-10 backdrop-blur-sm"
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlistItems.includes(prod.id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>

                <div 
                  onClick={() => setQuickViewProduct(prod)}
                  className="relative w-full h-44 overflow-hidden bg-white rounded-[26px] cursor-pointer group/img flex items-center justify-center p-3.5 shadow-sm border border-slate-100/50"
                >
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover rounded-[18px] group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300"; }}
                  />
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-[18px]">
                    <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-slate-800 rounded-full shadow-lg transform translate-y-2 group-hover/img:translate-y-0 transition-all duration-300">
                      Quick View
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">{prod.brand}</span>
                    <h3 onClick={() => setQuickViewProduct(prod)} className="text-xs font-black text-slate-800 mt-1 hover:text-[#309391] cursor-pointer line-clamp-1 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{prod.genericName}</p>
                    
                    {prod.prescriptionRequired ? (
                      <span className="mt-2 inline-block text-[9px] bg-indigo-50 border border-indigo-100/50 text-indigo-600 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                        Rx Required
                      </span>
                    ) : (
                      <span className="mt-2 inline-block text-[9px] bg-emerald-50 border border-emerald-100/50 text-emerald-600 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                        OTC Product
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-[#309391]">${prod.price}</span>
                      <span className="text-[10px] text-slate-400 line-through pl-1.5">${prod.originalPrice}</span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(prod)}
                      className="w-9 h-9 flex items-center justify-center bg-[#309391] hover:bg-teal-700 text-white rounded-full transition shadow-md shadow-teal-500/15 hover:shadow-teal-500/30"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 6 & 8 — PRODUCT CARD & BEST SELLING
          ========      {/* ==================================================
          SECTION 6.1 — NEW ARRIVALS (Minimalist Design)
          ================================================== */}
      <section id="new-arrivals" className="bg-gradient-to-br from-teal-50/60 to-emerald-50/40 border-y border-emerald-100/50 py-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-100/50">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800">New Arrivals</h2>
              <p className="text-sm text-slate-500 mt-1">Discover our latest additions to premium daily health vitamins and supplements</p>
            </div>
          </div>

          {/* 5-Column Grid, 2 Rows (10 Products) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {newArrivalsProducts.map(prod => (
              <div 
                key={prod.id}
                className="bg-[#F8FAFC]/90 border border-slate-100 rounded-[36px] p-5 flex flex-col justify-between shadow-md hover:shadow-xl hover:shadow-[#309391]/8 hover:-translate-y-1.5 hover:border-[#309391]/25 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Wishlist Heart */}
                <button 
                  onClick={() => handleToggleWishlist(prod.id)}
                  className="absolute top-3.5 right-3.5 p-2 bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm hover:shadow transition duration-200 z-10 backdrop-blur-sm"
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlistItems.includes(prod.id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>

                {/* Image Container */}
                <div 
                  onClick={() => setQuickViewProduct(prod)}
                  className="relative w-full h-44 overflow-hidden bg-white rounded-[26px] cursor-pointer group/img flex items-center justify-center p-3.5 shadow-sm border border-slate-100/50"
                >
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover rounded-[18px] group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300"; }}
                  />
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-[18px]">
                    <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-slate-800 rounded-full shadow-lg transform translate-y-2 group-hover/img:translate-y-0 transition-all duration-300">
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">{prod.brand}</span>
                    <h3 onClick={() => setQuickViewProduct(prod)} className="text-xs font-black text-slate-800 mt-1 hover:text-[#309391] cursor-pointer line-clamp-1 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{prod.description}</p>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-sm font-extrabold text-[#309391]">${prod.price}</span>
                      <span className="text-[10px] text-slate-400 line-through pl-1">${prod.originalPrice}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(prod)}
                      className="w-full py-2.5 bg-white hover:bg-[#309391] text-[#309391] hover:text-white border border-[#309391]/20 font-extrabold text-[11px] rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 6.2 — TOP SELLING (Best Seller Badge & Glow Design)
          ================================================== */}
      <section id="top-selling" className="bg-gradient-to-br from-blue-50/80 to-indigo-50/40 border-y border-blue-100/50 py-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-blue-100/40">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Top Selling Medicines</h2>
              <p className="text-sm text-slate-500 mt-1">Our most popular prescription and wellness medicines trusted by families</p>
            </div>
          </div>

          {/* 5-Column Grid, 2 Rows (10 Products) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {topSellingProducts.map(prod => (
              <div 
                key={prod.id}
                className="bg-[#F8FAFC]/90 border border-slate-100 rounded-[36px] p-5 flex flex-col justify-between shadow-md hover:shadow-xl hover:shadow-[#309391]/8 hover:-translate-y-1.5 hover:border-[#309391]/25 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Wishlist Button */}
                <button 
                  onClick={() => handleToggleWishlist(prod.id)}
                  className="absolute top-3.5 right-3.5 p-2 bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm hover:shadow transition duration-200 z-10 backdrop-blur-sm"
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlistItems.includes(prod.id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>

                {/* Product Image */}
                <div 
                  onClick={() => setQuickViewProduct(prod)}
                  className="relative w-full h-44 overflow-hidden bg-white rounded-[26px] cursor-pointer group/img flex items-center justify-center p-3.5 shadow-sm border border-slate-100/50"
                >
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover rounded-[18px] group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300"; }}
                  />
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-[18px]">
                    <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-slate-800 rounded-full shadow-lg transform translate-y-2 group-hover/img:translate-y-0 transition-all duration-300">
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Info & Buy Now */}
                <div className="mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">{prod.brand}</span>
                    <h3 onClick={() => setQuickViewProduct(prod)} className="text-xs font-black text-slate-800 mt-1 hover:text-[#309391] cursor-pointer line-clamp-1 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{prod.genericName}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-100/50 px-1.5 py-0.5 rounded-full">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-[9px] font-bold text-amber-700">{prod.rating}</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">({prod.reviews})</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-sm font-extrabold text-[#309391]">${prod.price}</span>
                      <span className="text-[10px] text-slate-405 line-through pl-1">${prod.originalPrice}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(prod)}
                      className="w-full py-2.5 bg-white hover:bg-[#309391] text-[#309391] hover:text-white border border-[#309391]/20 font-extrabold text-[11px] rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Buy Refill
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 6.3 — MOST NEEDED (Modern Clean Badge Card Design)
          ================================================== */}
      <section id="most-needed" className="bg-gradient-to-br from-teal-50/50 via-slate-50/80 to-emerald-50/40 border-y border-slate-200/60 py-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/40">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800">Most Needed Essentials</h2>
              <p className="text-sm text-slate-500 mt-1">Always keep these vital health monitors and first aid supplies in your home</p>
            </div>
          </div>

          {/* 5-Column Grid, 2 Rows (10 Products) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mostNeededProducts.map(prod => (
              <div 
                key={prod.id}
                className="bg-[#F8FAFC]/90 border border-slate-100 rounded-[36px] p-5 flex flex-col justify-between shadow-md hover:shadow-xl hover:shadow-[#309391]/8 hover:-translate-y-1.5 hover:border-[#309391]/25 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Wishlist Button */}
                <button 
                  onClick={() => handleToggleWishlist(prod.id)}
                  className="absolute top-3.5 right-3.5 p-2 bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm hover:shadow transition duration-200 z-10 backdrop-blur-sm"
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlistItems.includes(prod.id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>

                {/* Product Image */}
                <div 
                  onClick={() => setQuickViewProduct(prod)}
                  className="relative w-full h-44 overflow-hidden bg-white rounded-[26px] cursor-pointer group/img flex items-center justify-center p-3.5 shadow-sm border border-slate-100/50"
                >
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover rounded-[18px] group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300"; }}
                  />
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-[18px]">
                    <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-slate-800 rounded-full shadow-lg transform translate-y-2 group-hover/img:translate-y-0 transition-all duration-300">
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">{prod.brand}</span>
                    <h3 onClick={() => setQuickViewProduct(prod)} className="text-xs font-black text-slate-800 mt-1 hover:text-[#309391] cursor-pointer line-clamp-1 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{prod.description}</p>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-extrabold text-[#309391]">${prod.price}</span>
                      <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">Original</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAddToCart(prod)}
                        className="flex-1 py-2.5 border border-[#309391]/20 hover:border-[#309391] hover:bg-[#309391]/5 font-extrabold text-[11px] rounded-full transition flex items-center justify-center text-[#309391] shadow-sm"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => { handleAddToCart(prod); setCartOpen(true); }}
                        className="flex-[1.5] py-2.5 bg-[#309391] hover:bg-teal-700 text-white font-extrabold text-[11px] rounded-full transition-all duration-300 shadow-md shadow-teal-500/10"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 9 — SHOP BY HEALTH CONCERN
          ================================================== */}
      <section id="concerns" className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Shop by Health Concerns</h2>
          <p className="text-sm text-slate-500 mt-1">Get custom medicine packs recommended for your specific medical needs</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {healthConcerns.map((con, idx) => (
            <div 
              key={idx}
              onClick={() => { setSearchQuery(con.title); setShowSuggestions(true); }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition duration-200 group"
            >
              <span className="text-3xl p-3 bg-slate-55 dark:bg-slate-800 rounded-2xl mb-3 group-hover:scale-115 transition duration-250">{con.icon}</span>
              <h4 className="text-xs font-bold text-slate-805 dark:text-slate-250 leading-snug">{con.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          SECTION 10 & 11 — FEATURED BRANDS
          ================================================== */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-8">
        {/* Brands Carousel */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center mb-6">Partnering with Certified Global Manufacturers</h3>
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 py-6 px-4 rounded-3xl">
            {brands.map((brand, idx) => (
              <div 
                key={idx} 
                className="h-14 w-32 flex items-center justify-center grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 p-3 bg-white rounded-2xl shadow-sm border border-slate-100/80 hover:shadow-md cursor-pointer"
                title={brand.name}
              >
                {brand.logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 12 — HEALTHCARE SERVICES
          ================================================== */}
      <section id="services" className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">On-Demand Healthcare Services</h2>
          <p className="text-sm text-slate-500 mt-1">Direct access to online doctor consulting, nursing, and local lab panels</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((ser, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 p-6 rounded-3xl flex items-start gap-4 hover:shadow-xl hover:-translate-y-1 transition duration-200"
            >
              <div className="p-3 bg-slate-55 dark:bg-slate-800 rounded-2xl">{ser.icon}</div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-105">{ser.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-normal">{ser.desc}</p>
                <button 
                  onClick={() => { setSearchQuery(ser.name); setShowSuggestions(true); }}
                  className="mt-3 text-xs text-[#309391] font-bold hover:underline flex items-center gap-1"
                >
                  Book Service <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          SECTION 13 — CUSTOMER TESTIMONIALS
          ================================================== */}
      <section className="bg-slate-50 dark:bg-slate-950 py-12 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <span className="text-[#309391] text-xs font-bold uppercase tracking-wider">Patient Reviews</span>
            <h2 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">Why Patients Trust RL Pharmacy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-0.5 text-amber-400 mb-3">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-350 leading-relaxed italic mb-4">"{test.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-105">
                    <img src={test.img} alt={test.name} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-105 flex items-center gap-1.5">
                      {test.name} <span className="bg-teal-100 text-[#309391] text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Verified Patient</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 14 — BLOG SECTION
          ================================================== */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Medical Library & Guides</h2>
            <p className="text-sm text-slate-500 mt-1">Verified wellness advice edited and reviewed by medical professionals</p>
          </div>
          <button className="text-sm text-[#309391] font-bold flex items-center gap-1 hover:underline">
            Read Blog Library <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 group"
            >
              <div className="h-48 overflow-hidden relative">
                <span className="absolute top-4 left-4 bg-[#309391] text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
                  {post.category}
                </span>
                <img src={post.img} alt={post.title} className="object-cover w-full h-full group-hover:scale-105 transition duration-300" />
              </div>
              <div className="p-5 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-400">{post.date}</span>
                  <h3 className="text-sm font-bold text-slate-805 dark:text-slate-105 mt-1 group-hover:text-[#309391] transition cursor-pointer leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2 font-normal">{post.desc}</p>
                </div>
                <button className="text-xs text-[#309391] font-bold flex items-center gap-1 hover:underline">
                  Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* ==================================================
          SECTION 17 — TRUST FEATURES
          ================================================== */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100 dark:border-slate-900 mt-8">
        {[
          { title: "100% Genuine Medicines", desc: "Sourced directly from verified licensed manufacturers", icon: <Shield className="w-6 h-6 text-[#309391]" /> },
          { title: "Licensed Pharmacy", desc: "FDA approved operations and certified health panels", icon: <Check className="w-6 h-6 text-[#309391]" /> },
          { title: "Fast Refill Dispatch", desc: "Same day dispatch & local 2-hour clinical packaging", icon: <Clock className="w-6 h-6 text-[#309391]" /> },
          { title: "24/7 Helpline Support", desc: "Instant clinical consultation whenever you need it", icon: <Phone className="w-6 h-6 text-[#309391]" /> }
        ].map((feat, idx) => (
          <div key={idx} className="flex gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-2xl transition">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl h-max">{feat.icon}</div>
            <div>
              <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">{feat.title}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-normal">{feat.desc}</p>
            </div>
          </div>
        ))}
      </section>

       {/* ==================================================
          SECTION 18 — FOOTER
          ================================================== */}
      <footer className="custom-footer bg-slate-100 text-slate-600 text-xs border-t border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Col 1 */}
          <div className="col-span-2 md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#309391] text-white p-1.5 rounded-lg flex items-center justify-center font-bold text-sm">✙</div>
              <span className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">RL Pharmacy</span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-slate-500 dark:text-slate-400 font-normal">
              A premium, licensed pharmacy platform designed for quick pill refilling, verified doctor consulting, and smart AI symptom checks. FDA Approved license No. 4022-RL-9800.
            </p>
            <div className="flex gap-3 text-slate-700 dark:text-white font-semibold">
              <span className="hover:text-[#309391] cursor-pointer transition">Facebook</span>
              <span className="hover:text-[#309391] cursor-pointer transition">Twitter</span>
              <span className="hover:text-[#309391] cursor-pointer transition">LinkedIn</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Refill Categories</h4>
            <a href="#prescription-meds" className="hover:text-[#309391] transition">Prescription Pills</a>
            <a href="#featured-categories" className="hover:text-[#309391] transition">OTC Medicine</a>
            <a href="#featured-categories" className="hover:text-[#309391] transition">Cardiac Care</a>
            <a href="#featured-categories" className="hover:text-[#309391] transition">Vitamins & Multi</a>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Client Resources</h4>
            <a href="#services" className="hover:text-[#309391] transition">Consulting Panels</a>
            <a href="#tracking" className="hover:text-[#309391] transition">Refill Trackers</a>
            <a href="#services" className="hover:text-[#309391] transition">Lab Blood Panels</a>
            <a href="#services" className="hover:text-[#309391] transition">App Downloads</a>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Legal & Compliance</h4>
            <a href="#privacy" className="hover:text-[#309391] transition">Privacy Statement</a>
            <a href="#terms" className="hover:text-[#309391] transition">Terms of Refills</a>
            <a href="#licenses" className="hover:text-[#309391] transition">FDA Credentials</a>
            <a href="#returns" className="hover:text-[#309391] transition">Return Policies</a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-900 py-6 px-4 md:px-6">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
            <span>© 2026 RL Australia Pharmacy Store. Verified under Clinical Standards. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> SECURE SSL PAYMENTS</span>
              <span className="hover:text-[#309391] cursor-pointer font-bold transition" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                BACK TO TOP ▲
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ==================================================
          SECTION 19 — FLOATING COMPONENTS / MODALS
          ================================================== */}
      
      {/* Floating Buttons Bar */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2.5 z-40">
        {/* Upload Prescription Button */}
        <button 
          onClick={() => setPrescriptionModal(true)} 
          className="w-12 h-12 rounded-full bg-white hover:bg-slate-50 text-slate-800 flex items-center justify-center shadow-lg border border-slate-200 dark:border-slate-800 transition"
          title="Upload Prescription Slip"
        >
          <Upload className="w-5 h-5 text-[#309391]" />
        </button>

        {/* AI Chat Widget Toggle */}
        <button 
          onClick={() => setAssistantOpen(!assistantOpen)}
          className="w-12 h-12 rounded-full bg-[#309391] hover:bg-teal-700 text-white flex items-center justify-center shadow-xl shadow-teal-500/25 transition relative animate-bounce"
          title="AI Assistant Chat"
        >
          <MessageSquare className="w-5 h-5 text-white" />
          {chatMessages.length > 1 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#EC1F28] rounded-full" />
          )}
        </button>
      </div>

      {/* Upload Prescription Modal */}
      {prescriptionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 relative text-slate-850 dark:text-slate-100"
          >
            <button onClick={() => setPrescriptionModal(false)} className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-full transition text-slate-500">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col gap-4 text-center items-center">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-[#309391]">
                <FileText className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Doctor's Prescription</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-normal">
                Upload a JPEG, PNG, or PDF of your pharmacy script. Our panels will transcribe and dispatch in 15 minutes.
              </p>
              
              <label className="border-2 border-dashed border-[#309391]/30 hover:border-[#309391] py-8 px-4 rounded-2xl w-full cursor-pointer flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-950 transition">
                <Upload className="w-8 h-8 text-[#309391]" />
                <span className="text-xs font-bold text-[#309391]">Choose File or Drag Here</span>
                <span className="text-[10px] text-slate-400 font-semibold">PDF, JPG, PNG up to 10MB</span>
                <input type="file" className="hidden" accept=".pdf,image/*" onChange={handlePrescriptionUpload} />
              </label>

              {prescriptionUploaded && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 p-3 rounded-2xl text-xs w-full flex items-center gap-2 font-bold justify-center">
                  <Check className="w-4 h-4" /> Loaded: {prescriptionFile}
                </div>
              )}

              <button 
                onClick={() => {
                  if (!prescriptionUploaded) {
                    alert("Please select a file to upload first.")
                    return
                  }
                  alert("Prescription uploaded. Processing in backend...")
                  setPrescriptionModal(false)
                }}
                className="w-full py-3 bg-[#309391] hover:bg-[#257270] text-white font-bold text-sm rounded-full transition shadow-md shadow-teal-500/10"
              >
                Submit Prescription Refill
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Assistant Dialog Drawer */}
      {assistantOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between relative border-l border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#309391] flex items-center justify-center text-white">✙</div>
                <div>
                  <h3 className="text-xs font-bold text-slate-850 dark:text-white">AI Health Advisor</h3>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Online Now
                  </span>
                </div>
              </div>
              <button onClick={() => setAssistantOpen(false)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-full transition text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-3.5 bg-slate-50 dark:bg-slate-950 text-xs">
              <div className="bg-[#309391]/10 text-slate-700 dark:text-slate-350 p-3 rounded-2xl leading-relaxed">
                💡 **Disclaimer**: This assistant provides guidance for general concerns. If you have severe symptom patterns, consult a doctor immediately.
              </div>
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`max-w-[85%] p-3 rounded-2xl ${msg.sender === "user" ? "bg-[#309391] text-white self-end rounded-br-none" : "bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 self-start rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-800"}`}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="bg-white dark:bg-slate-850 p-3 rounded-2xl self-start flex gap-1 shadow-sm border border-slate-105">
                  <span className="w-1.5 h-1.5 bg-[#309391] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#309391] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#309391] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900">
              <input 
                type="text"
                placeholder="Type details (e.g. 'fever symptoms', 'check drug'...)"
                className="flex-1 bg-slate-105 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none px-4 py-2.5 rounded-full text-xs text-slate-800 dark:text-slate-200"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage} 
                className="p-2.5 bg-[#309391] hover:bg-teal-700 text-white rounded-full transition shadow-md shadow-teal-500/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Simulated Mini-Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#309391]" /> Shopping Refill Cart
              </h3>
              <button onClick={() => setCartOpen(false)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-full transition text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-3 text-xs bg-slate-50 dark:bg-slate-950">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-slate-405 gap-2">
                  <ShoppingCart className="w-10 h-10 text-slate-400" />
                  <p className="font-bold">Your cart is currently empty.</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.product.id} className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between gap-3 relative shadow-sm">
                    <div className="w-16 h-16 rounded-xl border border-slate-100 flex items-center justify-center p-1 bg-white shrink-0 overflow-hidden">
                      <img src={item.product.image} alt={item.product.name} className="object-contain max-h-full" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[10px] text-slate-400 italic line-clamp-1">{item.product.genericName}</p>
                      
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="font-extrabold text-[#309391]">${item.product.price}</span>
                        <div className="flex items-center border border-slate-200 rounded-full px-2 py-0.5 gap-2 font-bold text-slate-600 bg-slate-50 dark:bg-slate-950">
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="p-1 text-slate-400 hover:text-[#EC1F28] self-start"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Total Checkouts */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex flex-col gap-4">
              <div className="flex justify-between items-baseline font-bold">
                <span className="text-slate-500">Subtotal Price</span>
                <span className="text-lg text-[#309391]">
                  ${cartItems.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0).toFixed(2)}
                </span>
              </div>
              <button 
                onClick={() => {
                  if (cartItems.length === 0) return
                  alert("Order successfully Refilled! Processing order ref-0291.")
                  setCartItems([])
                  setCartOpen(false)
                }}
                disabled={cartItems.length === 0}
                className="w-full py-3 bg-[#EC1F28] hover:bg-red-750 disabled:bg-slate-350 disabled:cursor-not-allowed text-white font-bold text-sm rounded-full transition shadow-lg shadow-red-500/10"
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-802 rounded-3xl max-w-2xl w-full p-6 relative text-slate-850 dark:text-slate-100 shadow-2xl"
          >
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-full transition text-slate-500">
              <X className="w-5 h-5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Product Image */}
              <div className="w-full h-64 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-center p-4 bg-white overflow-hidden">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="object-contain h-full" />
              </div>

              {/* Product details */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] text-[#309391] font-bold uppercase">{quickViewProduct.brand} • {quickViewProduct.category}</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{quickViewProduct.name}</h2>
                <p className="text-xs text-slate-400 italic font-semibold">{quickViewProduct.genericName}</p>
                
                {quickViewProduct.prescriptionRequired && (
                  <span className="w-max bg-red-100 text-[#EC1F28] text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Prescription Required
                  </span>
                )}

                <div className="border-t border-b border-slate-150 dark:border-slate-850 py-3 mt-1 text-xs">
                  <p className="text-slate-500 leading-relaxed font-normal">{quickViewProduct.description}</p>
                  <p className="mt-2 text-slate-400 dark:text-slate-350">**Dosage Instructions**: {quickViewProduct.dosage}</p>
                </div>

                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-xl font-extrabold text-[#309391]">${quickViewProduct.price}</span>
                  <span className="text-xs text-slate-400 line-through">${quickViewProduct.originalPrice}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button 
                    onClick={() => { handleAddToCart(quickViewProduct); setQuickViewProduct(null); }}
                    className="py-3 bg-[#309391] hover:bg-[#257270] text-white font-bold text-xs rounded-full transition flex items-center justify-center gap-1 shadow-md shadow-teal-500/10"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Refill
                  </button>
                  <button 
                    onClick={() => handleToggleWishlist(quickViewProduct.id)}
                    className="py-3 border border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold text-xs rounded-full transition flex items-center justify-center gap-1 text-slate-700 dark:text-slate-202"
                  >
                    <Heart className="w-4 h-4 text-red-500" /> Wishlist
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Compare Draw Drawer */}
      {compareItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-2xl z-40">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[#309391] uppercase flex items-center gap-1.5">
                <GitCompare className="w-4 h-4" /> Compare Medicine List ({compareItems.length}/3)
              </span>
              <div className="flex gap-2">
                {compareItems.map(item => (
                  <div key={item.id} className="bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-[11px] font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-202">
                    <span>{item.name}</span>
                    <button onClick={() => handleAddToCompare(item)} className="text-red-500 hover:text-red-700 font-bold ml-1">×</button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 text-xs">
              <button 
                onClick={() => {
                  if (compareItems.length < 2) {
                    alert("Please select at least 2 medicines to compare.")
                    return
                  }
                  alert(`Comparing Pills: \n\n` + compareItems.map(item => `- ${item.name} (${item.dosage}): ${item.category}`).join("\n"))
                }}
                className="px-4 py-2 bg-[#309391] hover:bg-teal-700 text-white font-bold rounded-full transition"
              >
                Compare Now
              </button>
              <button onClick={() => setCompareItems([])} className="px-4 py-2 border border-slate-200 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition text-slate-700 dark:text-slate-202">
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
