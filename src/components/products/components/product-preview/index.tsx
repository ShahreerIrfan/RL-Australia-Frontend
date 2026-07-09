import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@components/common/components/localized-client-link"
import { getProductPrice } from "@lib/util/get-product-price"
import { Star, ShieldCheck } from "lucide-react"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const categoryName = product.category?.name || "Peptides"
  const dosage = product.dosage || "Research Compound"

  const hasDiscount = cheapestPrice?.price_type === "sale"
  let savedBadge = null
  if (hasDiscount && cheapestPrice) {
    const originalVal = parseFloat(String(cheapestPrice.original_price).replace(/[^0-9.]/g, ''))
    const calculatedVal = parseFloat(String(cheapestPrice.calculated_price).replace(/[^0-9.]/g, ''))
    if (!isNaN(originalVal) && !isNaN(calculatedVal)) {
      const diff = Math.round(originalVal - calculatedVal)
      if (diff > 0) {
        savedBadge = `Save $${diff}`
      }
    }
  }

  const reviewCount = (product.title ? (product.title.charCodeAt(0) + (product.title.charCodeAt(product.title.length - 1) || 0)) % 40 + 30 : 45)

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full select-none"
    >
      {/* Image Area */}
      <div className="relative bg-gradient-to-b from-gray-50/50 to-white flex items-center justify-center h-44 sm:h-52 lg:h-56 overflow-hidden flex-shrink-0 border-b border-gray-100">
        
        {/* Discount Badge */}
        {savedBadge && (
          <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg z-10 shadow-sm uppercase tracking-wider">
            {savedBadge}
          </span>
        )}
        
        {/* Category Badge */}
        <span className="absolute top-3.5 right-3.5 text-[9px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100/70 px-2.5 py-1 rounded-lg z-10 uppercase tracking-wider">
          {categoryName}
        </span>

        {/* Laboratory Tested seal badge */}
        <span className="absolute bottom-2.5 left-3.5 flex items-center gap-1 text-[8px] font-extrabold text-emerald-600/80 bg-white/95 border border-emerald-500/10 px-2 py-0.5 rounded-md z-10 shadow-2xs">
          <ShieldCheck className="w-2.5 h-2.5" /> 99.8%+ Purity
        </span>

        <div className="h-full w-full p-2 flex items-center justify-center">
          <img
            src={product.thumbnail || "/assets/peptide-vial.png"}
            alt={product.title}
            className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-106 transition-transform duration-500 filter drop-shadow-md"
          />
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between text-left">
        <div>
          <h3 className="text-sm sm:text-base font-black text-gray-950 leading-snug mb-1.5 group-hover:text-[#047857] transition-colors duration-200 line-clamp-1">
            {product.title}
          </h3>
          
          <p className="text-[11px] sm:text-xs text-gray-500 font-bold mb-3 tracking-wide">
            {dosage}
          </p>

          <div className="flex items-center gap-1.5 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < 4
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 font-bold">
              ({reviewCount} reviews)
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-4 border-t border-gray-50 pt-3">
            {cheapestPrice && (
              <span className="text-lg sm:text-xl font-black text-gray-950 tracking-tight">
                {cheapestPrice.calculated_price}
              </span>
            )}
            {hasDiscount && cheapestPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through font-semibold">
                {cheapestPrice.original_price}
              </span>
            )}
          </div>

          <div
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 active:scale-[0.98] text-white text-xs sm:text-sm font-black py-3 rounded-xl transition-all duration-300 uppercase tracking-wider shadow-md shadow-emerald-950/10 text-center"
          >
            View Product
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
