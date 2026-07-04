import React from "react"
import HeroSection from "@components/home/hero-section"
import BrandsBar from "@components/home/brands-bar"
import FeaturedProducts from "@components/home/featured-products"
import PromoBanner from "@components/home/promo-banner"
import CategoryShowcase from "@components/home/category-showcase"
import CategoryProducts from "@components/home/category-products"
import HowItWorks from "@components/home/how-it-works"
import BestSellers from "@components/home/best-sellers"
import WhyChooseUs from "@components/home/why-choose-us"
import LabResults from "@components/home/lab-results"
import TestimonialsSection from "@components/home/testimonials-section"
import NewsletterSection from "@components/home/newsletter-section"

export default function Homepage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BrandsBar />
      <FeaturedProducts />
      <PromoBanner />
      <CategoryShowcase />
      <CategoryProducts />
      <HowItWorks />
      <BestSellers />
      <WhyChooseUs />
      <LabResults />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  )
}
