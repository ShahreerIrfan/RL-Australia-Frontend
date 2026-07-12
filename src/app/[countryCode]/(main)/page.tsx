import React from "react"
import HeroSection from "@components/home/hero-section"
import StackBuilderPreview from "@components/home/stack-builder-preview"
import CategoryShowcase from "@components/home/category-showcase"
import FeaturedProducts from "@components/home/featured-products"
import ShippingBanner from "@components/home/shipping-banner"
import TrustSection from "@components/home/trust-section"
import TestimonialsSection from "@components/home/testimonials-section"
import GuidesPreview from "@components/home/guides-preview"
import NewsletterSection from "@components/home/newsletter-section"

export default function Homepage() {
  return (
    <div className="min-h-screen">

      {/* Hero — Stack Builder as PRIMARY conversion CTA, with background image */}
      <HeroSection />

      {/* Popular products across all categories with filter tabs (Section 6) */}
      <FeaturedProducts />

      {/* Stack Builder preview — goal-based flow + manual build option (Section 5) */}
      <StackBuilderPreview />

      {/* Category navigation — Peptides, Nootropics, Supplements, Gummies, Add-ons (Section 4) */}
      <CategoryShowcase />

      {/* Free shipping threshold banner — $200 threshold, stack-building nudge (Section 7.3) */}
      <ShippingBanner />

      {/* Trust & credibility — COAs, reviews, secure checkout, shipping policy (Section 8) */}
      <TrustSection />

      {/* Customer testimonials & reviews (Section 8) */}
      <TestimonialsSection />

      {/* Free downloadable guides preview — educational content & lead gen (Section 11) */}
      <GuidesPreview />

      {/* Newsletter signup + email capture (Section 11.3) */}
      <NewsletterSection />
    </div>
  )
}
