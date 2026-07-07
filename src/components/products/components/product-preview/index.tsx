import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@components/common/components/localized-client-link"
import { getProductPrice } from "@lib/util/get-product-price"
import { Star } from "lucide-react"

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
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200/80 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Area */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white/40 border-b border-gray-100 flex items-center justify-center h-36 sm:h-48 lg:h-52 overflow-hidden flex-shrink-0">
        {savedBadge && (
          <span className="absolute top-2 left-2 bg-[#c5a059] text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded z-10 shadow-sm uppercase tracking-wide">
            {savedBadge}
          </span>
        )}
        <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] font-extrabold text-sky-700 bg-sky-50 border border-sky-100 px-1.5 py-0.5 rounded z-10 uppercase tracking-wide">
          {categoryName}
        </span>

        <div className="h-full w-full">
          <img
            src={product.thumbnail || "/assets/peptide-vial.png"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
          />
        </div>
      </div>

      {/* Info Area */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-gray-800 leading-tight mb-1 group-hover:text-sky-600 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mb-2">
            {dosage}
          </p>

          <div className="flex items-center gap-1 mb-2.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                    i < 4
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-400 font-bold">
              ({reviewCount})
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5 mb-3">
            {cheapestPrice && (
              <span className="text-base sm:text-lg font-black text-gray-900">
                {cheapestPrice.calculated_price}
              </span>
            )}
            {hasDiscount && cheapestPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {cheapestPrice.original_price}
              </span>
            )}
          </div>

          <div
            className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white text-xs sm:text-sm font-extrabold py-2.5 rounded transition-all duration-300 uppercase tracking-wider shadow-sm border-b-2 border-sky-800 text-center"
          >
            View Product
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
