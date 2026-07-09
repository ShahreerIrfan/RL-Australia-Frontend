/**
 * Stack Builder Data
 * 
 * Goal → Products mapping for the Stack Builder quiz.
 * The owner defines which products to recommend for each goal.
 * This can be moved to a CMS/database in Phase 4 for admin management.
 */

export interface StackProduct {
  id: string
  name: string
  dosage: string
  price: number
  originalPrice?: number
  image: string
  role: string
  category: string
}

export interface GoalStack {
  id: string
  title: string
  description: string
  icon: string
  color: string
  products: StackProduct[]
}

export const goalStacks: GoalStack[] = [
  {
    id: "cardiovascular",
    title: "Cardiovascular Health",
    description: "Support heart function, circulation, and overall cardiovascular wellness.",
    icon: "Heart",
    color: "rose",
    products: [
      { id: "coq10-cardio", name: "CoQ10", dosage: "60 Softgels · 100mg", price: 18.99, originalPrice: 23.99, image: "/assets/products/asset 7.png", role: "Mitochondrial support — essential for heart muscle energy", category: "Supplement" },
      { id: "nmn-cardio", name: "NMN", dosage: "30 Capsules · 250mg", price: 22.99, originalPrice: 28.99, image: "/assets/products/asset 11.png", role: "NAD+ booster — supports vascular health and energy", category: "Supplement" },
      { id: "bpc157-cardio", name: "BPC-157", dosage: "5mg Vial", price: 49.95, originalPrice: 64.95, image: "/assets/products/asset 6.png", role: "Tissue protection — supports blood vessel repair", category: "Peptide" },
    ],
  },
  {
    id: "cognition",
    title: "Cognitive Performance",
    description: "Enhance focus, memory, mental clarity, and overall brain function.",
    icon: "Brain",
    color: "purple",
    products: [
      { id: "alphagpc", name: "Alpha-GPC", dosage: "60 Capsules · 300mg", price: 34.95, image: "/assets/products/asset 9.png", role: "Choline source — supports acetylcholine production for memory", category: "Nootropic" },
      { id: "ltheanine", name: "L-Theanine", dosage: "60 Capsules · 200mg", price: 24.95, image: "/assets/products/asset 12.png", role: "Calm focus — promotes relaxed alertness without drowsiness", category: "Nootropic" },
      { id: "semax", name: "Semax", dosage: "10mg Vial", price: 44.95, image: "/assets/products/asset 10.png", role: "Neuropeptide — supports BDNF and cognitive enhancement", category: "Peptide" },
    ],
  },
  {
    id: "energy",
    title: "Energy & Vitality",
    description: "Boost daily energy levels, reduce fatigue, and optimize cellular function.",
    icon: "Zap",
    color: "amber",
    products: [
      { id: "nmn-energy", name: "NMN", dosage: "30 Capsules · 250mg", price: 22.99, originalPrice: 28.99, image: "/assets/products/asset 11.png", role: "NAD+ booster — cellular energy at its core", category: "Supplement" },
      { id: "coq10-energy", name: "CoQ10", dosage: "60 Softgels · 100mg", price: 18.99, originalPrice: 23.99, image: "/assets/products/asset 7.png", role: "Mitochondrial fuel — energy that actually lasts", category: "Supplement" },
      { id: "creatine-energy", name: "Protein + Creatine Gummies", dosage: "30 Gummies", price: 16.99, originalPrice: 19.99, image: "/assets/products/asset 11.png", role: "Quick energy — creatine in convenient gummy form", category: "Gummies" },
    ],
  },
  {
    id: "fitness",
    title: "Fitness & Muscle Growth",
    description: "Support lean muscle development, strength gains, and workout recovery.",
    icon: "Dumbbell",
    color: "emerald",
    products: [
      { id: "cjc1295", name: "CJC-1295 (No DAC)", dosage: "2mg Vial", price: 44.95, originalPrice: 59.95, image: "/assets/products/asset 8.png", role: "Growth hormone releasing — stimulates natural GH secretion", category: "Peptide" },
      { id: "ipamorelin", name: "Ipamorelin", dosage: "5mg Vial", price: 39.95, image: "/assets/products/asset 9.png", role: "Selective GH release — clean gains without side effects", category: "Peptide" },
      { id: "creatine-fit", name: "Protein + Creatine Gummies", dosage: "30 Gummies", price: 16.99, originalPrice: 19.99, image: "/assets/products/asset 11.png", role: "Convenient gains — creatine and protein in gummy form", category: "Gummies" },
      { id: "bpc157-fit", name: "BPC-157", dosage: "5mg Vial", price: 49.95, originalPrice: 64.95, image: "/assets/products/asset 6.png", role: "Recovery support — accelerates muscle and tendon healing", category: "Peptide" },
    ],
  },
  {
    id: "focus",
    title: "Focus & Concentration",
    description: "Sharpen attention, eliminate brain fog, and sustain deep work sessions.",
    icon: "Target",
    color: "sky",
    products: [
      { id: "alphagpc-focus", name: "Alpha-GPC", dosage: "60 Capsules · 300mg", price: 34.95, image: "/assets/products/asset 9.png", role: "Acetylcholine precursor — sharpens working memory", category: "Nootropic" },
      { id: "ltheanine-focus", name: "L-Theanine", dosage: "60 Capsules · 200mg", price: 24.95, image: "/assets/products/asset 12.png", role: "Smooth focus — calm alertness without jitters", category: "Nootropic" },
      { id: "semax-focus", name: "Semax", dosage: "10mg Vial", price: 44.95, image: "/assets/products/asset 10.png", role: "Neuropeptide — enhances attention and mental stamina", category: "Peptide" },
    ],
  },
  {
    id: "gut-health",
    title: "Gut Health",
    description: "Support digestive health, reduce gut inflammation, and optimize microbiome.",
    icon: "Shield",
    color: "teal",
    products: [
      { id: "bpc157-gut", name: "BPC-157", dosage: "5mg Vial", price: 49.95, originalPrice: 64.95, image: "/assets/products/asset 6.png", role: "Gut healing — repairs intestinal lining and reduces inflammation", category: "Peptide" },
      { id: "lreuteri-gut", name: "L. Reuteri (Probiotic)", dosage: "30 Capsules", price: 20.99, originalPrice: 25.99, image: "/assets/products/asset 9.png", role: "Probiotic — supports healthy gut bacteria and oxytocin", category: "Supplement" },
      { id: "glycine-gut", name: "Glycine", dosage: "120 Capsules · 1000mg", price: 17.99, originalPrice: 21.99, image: "/assets/products/asset 13.png", role: "Amino acid — supports gut lining and reduces inflammation", category: "Supplement" },
    ],
  },
  {
    id: "hormones",
    title: "Hormonal Balance",
    description: "Support natural hormone optimization and endocrine system function.",
    icon: "Sparkles",
    color: "pink",
    products: [
      { id: "cjc1295-horm", name: "CJC-1295 (No DAC)", dosage: "2mg Vial", price: 44.95, originalPrice: 59.95, image: "/assets/products/asset 8.png", role: "GH support — stimulates natural growth hormone release", category: "Peptide" },
      { id: "ipamorelin-horm", name: "Ipamorelin", dosage: "5mg Vial", price: 39.95, image: "/assets/products/asset 9.png", role: "GH secretagogue — clean hormonal support", category: "Peptide" },
      { id: "nmn-horm", name: "NMN", dosage: "30 Capsules · 250mg", price: 22.99, originalPrice: 28.99, image: "/assets/products/asset 11.png", role: "NAD+ support — essential cofactor for hormone production", category: "Supplement" },
    ],
  },
  {
    id: "immune",
    title: "Immune Support",
    description: "Strengthen immune defenses and support the body's natural protection.",
    icon: "Shield",
    color: "blue",
    products: [
      { id: "tb500-immune", name: "TB-500", dosage: "5mg Vial", price: 54.95, originalPrice: 69.95, image: "/assets/products/asset 7.png", role: "Thymosin Beta-4 — supports immune cell function and tissue repair", category: "Peptide" },
      { id: "bpc157-immune", name: "BPC-157", dosage: "5mg Vial", price: 49.95, originalPrice: 64.95, image: "/assets/products/asset 6.png", role: "Body protective compound — systemic healing and immune support", category: "Peptide" },
      { id: "lreuteri-immune", name: "L. Reuteri (Probiotic)", dosage: "30 Capsules", price: 20.99, originalPrice: 25.99, image: "/assets/products/asset 9.png", role: "Gut-immune axis — 70% of immunity starts in the gut", category: "Supplement" },
    ],
  },
  {
    id: "longevity",
    title: "Longevity & Anti-Aging",
    description: "Slow biological aging, protect cells, and promote healthy lifespan extension.",
    icon: "Hourglass",
    color: "amber",
    products: [
      { id: "nmn-long", name: "NMN", dosage: "30 Capsules · 250mg", price: 22.99, originalPrice: 28.99, image: "/assets/products/asset 11.png", role: "NAD+ booster — the longevity molecule everyone's stacking", category: "Supplement" },
      { id: "ghkcu-long", name: "GHK-Cu (Copper Peptide)", dosage: "50mg Vial", price: 69.95, originalPrice: 89.95, image: "/assets/products/asset 10.png", role: "Anti-aging peptide — promotes collagen and tissue remodeling", category: "Peptide" },
      { id: "coq10-long", name: "CoQ10", dosage: "60 Softgels · 100mg", price: 18.99, originalPrice: 23.99, image: "/assets/products/asset 7.png", role: "Mitochondrial protector — cellular longevity support", category: "Supplement" },
    ],
  },
  {
    id: "metabolism",
    title: "Metabolism & Fat Loss",
    description: "Support healthy metabolism, fat oxidation, and body composition goals.",
    icon: "Flame",
    color: "orange",
    products: [
      { id: "cjc1295-meta", name: "CJC-1295 (No DAC)", dosage: "2mg Vial", price: 44.95, originalPrice: 59.95, image: "/assets/products/asset 8.png", role: "GH release — promotes fat metabolism and lean mass", category: "Peptide" },
      { id: "ipamorelin-meta", name: "Ipamorelin", dosage: "5mg Vial", price: 39.95, image: "/assets/products/asset 9.png", role: "Fat burning — stimulates lipolysis through GH pathway", category: "Peptide" },
      { id: "ltheanine-meta", name: "L-Theanine", dosage: "60 Capsules · 200mg", price: 24.95, image: "/assets/products/asset 12.png", role: "Stress reduction — lowers cortisol which drives fat storage", category: "Nootropic" },
    ],
  },
  {
    id: "mood",
    title: "Mood & Wellbeing",
    description: "Support emotional balance, positive mood, and overall mental wellness.",
    icon: "Smile",
    color: "yellow",
    products: [
      { id: "lreuteri-mood", name: "L. Reuteri (Probiotic)", dosage: "30 Capsules", price: 20.99, originalPrice: 25.99, image: "/assets/products/asset 9.png", role: "Gut-brain axis — supports natural oxytocin production", category: "Supplement" },
      { id: "ltheanine-mood", name: "L-Theanine", dosage: "60 Capsules · 200mg", price: 24.95, image: "/assets/products/asset 12.png", role: "Calming — promotes alpha brain waves and relaxation", category: "Nootropic" },
      { id: "glycine-mood", name: "Glycine", dosage: "120 Capsules · 1000mg", price: 17.99, originalPrice: 21.99, image: "/assets/products/asset 13.png", role: "Neurotransmitter support — calming amino acid for mood", category: "Supplement" },
    ],
  },
  {
    id: "motivation",
    title: "Motivation & Drive",
    description: "Enhance motivation, mental energy, and sustained drive for your goals.",
    icon: "Award",
    color: "amber",
    products: [
      { id: "semax-motiv", name: "Semax", dosage: "10mg Vial", price: 44.95, image: "/assets/products/asset 10.png", role: "Neuropeptide — supports dopamine and BDNF for drive", category: "Peptide" },
      { id: "alphagpc-motiv", name: "Alpha-GPC", dosage: "60 Capsules · 300mg", price: 34.95, image: "/assets/products/asset 9.png", role: "Cholinergic support — mental energy and focus", category: "Nootropic" },
      { id: "nmn-motiv", name: "NMN", dosage: "30 Capsules · 250mg", price: 22.99, originalPrice: 28.99, image: "/assets/products/asset 11.png", role: "Cellular energy — fuel for sustained motivation", category: "Supplement" },
    ],
  },
  {
    id: "pain",
    title: "Pain & Recovery",
    description: "Reduce pain, accelerate healing, and support tissue repair.",
    icon: "Activity",
    color: "red",
    products: [
      { id: "bpc157-pain", name: "BPC-157", dosage: "5mg Vial", price: 49.95, originalPrice: 64.95, image: "/assets/products/asset 6.png", role: "Core healing peptide — promotes tissue repair and pain relief", category: "Peptide" },
      { id: "tb500-pain", name: "TB-500", dosage: "5mg Vial", price: 54.95, originalPrice: 69.95, image: "/assets/products/asset 7.png", role: "Synergistic repair — enhances cell migration to injury sites", category: "Peptide" },
      { id: "kpv-pain", name: "KPV Tripeptide", dosage: "10mg Vial", price: 52.95, image: "/assets/products/asset 8.png", role: "Anti-inflammatory — targets pain-causing inflammation directly", category: "Peptide" },
    ],
  },
  {
    id: "skin-health",
    title: "Skin Health & Beauty",
    description: "Support collagen production, skin elasticity, and a healthy glow.",
    icon: "Sparkles",
    color: "pink",
    products: [
      { id: "ghkcu-skin", name: "GHK-Cu (Copper Peptide)", dosage: "50mg Vial", price: 69.95, originalPrice: 89.95, image: "/assets/products/asset 10.png", role: "Skin peptide — visible firmness, collagen, and glow", category: "Peptide" },
      { id: "glycine-skin", name: "Glycine", dosage: "120 Capsules · 1000mg", price: 17.99, originalPrice: 21.99, image: "/assets/products/asset 13.png", role: "Collagen building block — essential for skin structure", category: "Supplement" },
      { id: "nmn-skin", name: "NMN", dosage: "30 Capsules · 250mg", price: 22.99, originalPrice: 28.99, image: "/assets/products/asset 11.png", role: "Cellular renewal — supports skin cell turnover and repair", category: "Supplement" },
    ],
  },
  {
    id: "sleep",
    title: "Sleep & Relaxation",
    description: "Improve sleep quality, reduce stress, and support natural recovery during rest.",
    icon: "Moon",
    color: "indigo",
    products: [
      { id: "glycine-sleep", name: "Glycine", dosage: "120 Capsules · 1000mg", price: 17.99, originalPrice: 21.99, image: "/assets/products/asset 13.png", role: "Sleep amino acid — improves sleep quality and onset", category: "Supplement" },
      { id: "ltheanine-sleep", name: "L-Theanine", dosage: "60 Capsules · 200mg", price: 24.95, image: "/assets/products/asset 12.png", role: "Relaxation — promotes calm without sedation", category: "Nootropic" },
      { id: "lreuteri-sleep", name: "L. Reuteri (Probiotic)", dosage: "30 Capsules", price: 20.99, originalPrice: 25.99, image: "/assets/products/asset 9.png", role: "Gut-brain axis — supports relaxation hormones", category: "Supplement" },
    ],
  },
  {
    id: "stress",
    title: "Stress Management",
    description: "Reduce cortisol, build resilience, and manage daily stress effectively.",
    icon: "AlertCircle",
    color: "violet",
    products: [
      { id: "ltheanine-stress", name: "L-Theanine", dosage: "60 Capsules · 200mg", price: 24.95, image: "/assets/products/asset 12.png", role: "Anti-stress — promotes alpha waves and calm alertness", category: "Nootropic" },
      { id: "glycine-stress", name: "Glycine", dosage: "120 Capsules · 1000mg", price: 17.99, originalPrice: 21.99, image: "/assets/products/asset 13.png", role: "Calming amino acid — lowers stress response naturally", category: "Supplement" },
      { id: "bpc157-stress", name: "BPC-157", dosage: "5mg Vial", price: 49.95, originalPrice: 64.95, image: "/assets/products/asset 6.png", role: "Gut-brain protection — stress damages the gut, BPC repairs it", category: "Peptide" },
    ],
  },
]

// All unique products available for manual build mode
export const allProducts: StackProduct[] = [
  { id: "bpc157", name: "BPC-157", dosage: "5mg Vial", price: 49.95, originalPrice: 64.95, image: "/assets/products/asset 6.png", role: "Body protective compound — gut healing and tissue repair", category: "Peptide" },
  { id: "tb500", name: "TB-500", dosage: "5mg Vial", price: 54.95, originalPrice: 69.95, image: "/assets/products/asset 7.png", role: "Thymosin Beta-4 — cell migration and tissue repair", category: "Peptide" },
  { id: "kpv", name: "KPV Tripeptide", dosage: "10mg Vial", price: 52.95, image: "/assets/products/asset 8.png", role: "Powerful anti-inflammatory peptide", category: "Peptide" },
  { id: "cjc1295", name: "CJC-1295 (No DAC)", dosage: "2mg Vial", price: 44.95, originalPrice: 59.95, image: "/assets/products/asset 8.png", role: "Growth hormone releasing hormone analog", category: "Peptide" },
  { id: "ipamorelin", name: "Ipamorelin", dosage: "5mg Vial", price: 39.95, image: "/assets/products/asset 9.png", role: "Selective growth hormone secretagogue", category: "Peptide" },
  { id: "ghkcu", name: "GHK-Cu (Copper Peptide)", dosage: "50mg Vial", price: 69.95, originalPrice: 89.95, image: "/assets/products/asset 10.png", role: "Anti-aging — collagen, elastin, and skin repair", category: "Peptide" },
  { id: "semax", name: "Semax", dosage: "10mg Vial", price: 44.95, image: "/assets/products/asset 10.png", role: "Neuropeptide — BDNF, focus, and cognitive enhancement", category: "Peptide" },
  { id: "alphagpc", name: "Alpha-GPC", dosage: "60 Capsules · 300mg", price: 34.95, image: "/assets/products/asset 9.png", role: "Choline source for memory and focus", category: "Nootropic" },
  { id: "ltheanine", name: "L-Theanine", dosage: "60 Capsules · 200mg", price: 24.95, image: "/assets/products/asset 12.png", role: "Calm focus and relaxation without sedation", category: "Nootropic" },
  { id: "nmn", name: "NMN", dosage: "30 Capsules · 250mg", price: 22.99, originalPrice: 28.99, image: "/assets/products/asset 11.png", role: "NAD+ booster for energy and longevity", category: "Supplement" },
  { id: "coq10", name: "CoQ10", dosage: "60 Softgels · 100mg", price: 18.99, originalPrice: 23.99, image: "/assets/products/asset 7.png", role: "Mitochondrial energy and heart health", category: "Supplement" },
  { id: "glycine", name: "Glycine", dosage: "120 Capsules · 1000mg", price: 17.99, originalPrice: 21.99, image: "/assets/products/asset 13.png", role: "Sleep, skin, and anti-inflammatory amino acid", category: "Supplement" },
  { id: "lreuteri", name: "L. Reuteri (Probiotic)", dosage: "30 Capsules", price: 20.99, originalPrice: 25.99, image: "/assets/products/asset 9.png", role: "Gut health and natural oxytocin production", category: "Supplement" },
  { id: "beef-liver", name: "Beef Liver Pills", dosage: "120 Capsules", price: 19.99, originalPrice: 24.99, image: "/assets/products/asset 8.png", role: "Nature's multivitamin — B12, iron, and folate", category: "Add-on" },
  { id: "creatine-gummies", name: "Protein + Creatine Gummies", dosage: "30 Gummies", price: 16.99, originalPrice: 19.99, image: "/assets/products/asset 11.png", role: "Gains in gummy form — no shaker needed", category: "Gummies" },
]
