import React, { Suspense } from "react"
import ImageGallery from "@components/products/components/image-gallery"
import ProductActions from "@components/products/components/product-actions"
import ProductOnboardingCta from "@components/products/components/product-onboarding-cta"
import ProductTabs from "@components/products/components/product-tabs"
import RelatedProducts from "@components/products/components/related-products"
import ProductInfo from "@components/products/templates/product-info"
import SkeletonRelatedProducts from "@components/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductActionsWrapper from "./product-actions-wrapper"
import FrequentlyBoughtTogether from "@components/products/components/frequently-bought-together"
import { ShieldCheck, FileText, FlaskConical, Award, HelpCircle } from "lucide-react"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Determine if product is a peptide for reconstitution display
  const isPeptide = product.title?.toLowerCase().includes("bpc") ||
                    product.title?.toLowerCase().includes("tb-500") ||
                    product.title?.toLowerCase().includes("ghk") ||
                    product.title?.toLowerCase().includes("cjc") ||
                    product.title?.toLowerCase().includes("peptide")

  return (
    <>
      <div
        className="content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        data-testid="product-container"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Media & Science Guides */}
          <div className="lg:col-span-7 flex flex-col gap-y-6">
            <div className="block w-full relative bg-white rounded-2xl border border-gray-150/80 overflow-hidden shadow-xs p-2">
              <ImageGallery images={images} />
            </div>

            {/* Reconstitution & Dilution Guide (Only for Peptide Categories) */}
            {isPeptide && (
              <div className="bg-sky-50/40 border border-sky-100 rounded-2xl p-5 shadow-xs">
                <h4 className="text-sm font-bold text-sky-900 mb-2 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-sky-600" />
                  Peptide Reconstitution Guide
                </h4>
                <p className="text-xs text-sky-700 font-semibold leading-relaxed mb-3.5">
                  For laboratory research purposes, reconstitute with Sterile Bacteriostatic Water. Inject the water slowly along the inner wall of the vial to maintain peptide stability.
                </p>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white border border-sky-100 rounded-xl p-2.5 shadow-xs">
                    <span className="text-[10px] text-sky-700 font-bold block uppercase tracking-wider">Sterile Diluent</span>
                    <span className="text-xs font-extrabold text-sky-900 block mt-0.5">2.0 mL Recommended</span>
                  </div>
                  <div className="bg-white border border-sky-100 rounded-xl p-2.5 shadow-xs">
                    <span className="text-[10px] text-sky-700 font-bold block uppercase tracking-wider">Recommended Tool</span>
                    <span className="text-xs font-extrabold text-sky-900 block mt-0.5">1.0 mL Insulin Syringe</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quality & Lab Results verification */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Laboratory Quality Verified</h4>
                  <p className="text-xs text-gray-500 font-semibold">Third-party lab tested & HPLC verified</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="/lab-testing"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-250 hover:bg-gray-100 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all w-full"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  View Certificate of Analysis (COA)
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Info & Upsell accessories */}
          <div className="lg:col-span-5 flex flex-col gap-y-6 lg:sticky lg:top-24">
            <div className="bg-white border border-gray-200/85 rounded-2xl p-6 shadow-md">
              {/* Product Info */}
              <ProductInfo product={product} />

              {/* Peptide Paradise specifications block */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 my-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-bold block uppercase tracking-wider">Specifications</span>
                  <span className="text-sm font-extrabold text-gray-900 block mt-0.5">
                    {isPeptide ? "5mg Lyophilized Vial" : "Research Grade Compound"}
                  </span>
                </div>
                <div className="bg-white border border-emerald-200 px-3 py-1.5 rounded-xl text-center shadow-xs">
                  <span className="text-[10px] text-emerald-800 font-extrabold block">Purity</span>
                  <span className="text-[10px] sm:text-xs text-emerald-600 font-extrabold">99.8%+ Verified</span>
                </div>
              </div>

              {/* Variant actions */}
              <ProductOnboardingCta />
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} handle={product.handle} region={region} />
              </Suspense>

              {/* Secure payment signals */}
              <div className="flex items-center justify-center gap-x-5 gap-y-2 flex-wrap py-3.5 border-y border-gray-150/70 my-5 text-[11px] font-bold text-gray-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Secure Checkout
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-emerald-600" />
                  99% HPLC Certified
                </span>
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  Australia Shipping
                </span>
              </div>
            </div>

            {/* Frequently Bought Together (Low-cost Add-ons section 6.3/7.4) */}
            <FrequentlyBoughtTogether />

            {/* Product details tabs */}
            <div className="bg-white border border-gray-200/85 rounded-2xl p-5 shadow-md">
              <ProductTabs product={product} />
            </div>
          </div>
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
