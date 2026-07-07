"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@components/common/components/divider"
import OptionSelect from "@components/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

import { convertToLocale } from "@lib/util/money"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  if (!Array.isArray(variantOptions)) {
    return {}
  }
  return variantOptions.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const formattedPrice = (amount: number) => {
    return convertToLocale({
      amount,
      currency_code: region?.currency_code || "aud",
    })
  }

  const [liveProduct, setLiveProduct] = useState<HttpTypes.StoreProduct>(product)
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string

  // Keep liveProduct in sync when product prop changes (e.g., navigating to another page)
  useEffect(() => {
    setLiveProduct(product)
  }, [product])

  // Fetch fresh product variants dynamically on client load to bypass Next.js static ISR cache
  useEffect(() => {
    const fetchFreshProduct = async () => {
      try {
        const { listProducts } = await import("@lib/data/products")
        const fresh = await listProducts({
          countryCode: "us",
          queryParams: { handle: product.handle }
        }).then(({ response }) => response.products[0])

        if (fresh && fresh.variants) {
          setLiveProduct(fresh)
        }
      } catch (err) {
        console.error("Failed to load fresh product options:", err)
      }
    }

    if (product.handle) {
      fetchFreshProduct()
    }
  }, [product.handle])

  // Sync selectedVariantIndex if query parameter has v_id
  useEffect(() => {
    const vId = searchParams?.get("v_id")
    if (vId && liveProduct.variants) {
      const idx = liveProduct.variants.findIndex((v) => v.id === vId)
      if (idx !== -1 && idx !== selectedVariantIndex) {
        setSelectedVariantIndex(idx)
      }
    }
  }, [searchParams, liveProduct.variants])

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (liveProduct.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(liveProduct.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [liveProduct.variants])

  const selectedVariant = useMemo(() => {
    if (!liveProduct.variants || liveProduct.variants.length === 0) {
      return
    }

    // If it has medusa options, use options matching
    if (liveProduct.options && liveProduct.options.length > 0) {
      return liveProduct.variants.find((v) => {
        const variantOptions = optionsAsKeymap(v.options)
        return isEqual(variantOptions, options)
      })
    }

    // Otherwise fall back to selected index
    return liveProduct.variants[selectedVariantIndex] || liveProduct.variants[0]
  }, [liveProduct.variants, options, selectedVariantIndex, liveProduct.options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const selectVariant = (index: number) => {
    setSelectedVariantIndex(index)
    const variant = liveProduct.variants?.[index]
    if (variant?.id) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("v_id", variant.id)
      router.replace(pathname + "?" + params.toString())
    }
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    if (liveProduct.options && liveProduct.options.length > 0) {
      return liveProduct.variants?.some((v) => {
        const variantOptions = optionsAsKeymap(v.options)
        return isEqual(variantOptions, options)
      })
    }
    return !!selectedVariant
  }, [liveProduct.variants, options, liveProduct.options, selectedVariant])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {/* Medusa standard options selector */}
          {liveProduct.options && liveProduct.options.length > 0 && (liveProduct.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(liveProduct.options || []).map((option, index) => {
                return (
                  <div key={option.id || index}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}

          {/* Custom products direct variant list selector with radio buttons */}
          {(!liveProduct.options || liveProduct.options.length === 0) && (liveProduct.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-3.5 mb-6 text-left">
              <span className="text-xs sm:text-sm font-extrabold text-gray-700 uppercase tracking-wider block">
                Choose Packaging / Quantity:
              </span>
              <div className="flex flex-col gap-3">
                {liveProduct.variants!.map((v, idx) => {
                  const isSelected = selectedVariant?.id === v.id
                  const priceAmount = v.calculated_price?.calculated_amount || 0
                  const originalAmount = v.calculated_price?.original_amount || priceAmount
                  const hasDiscount = originalAmount > priceAmount
                  const discountPercent = hasDiscount 
                    ? Math.round(((originalAmount - priceAmount) / originalAmount) * 100)
                    : 0
                  const outOfStock = v.manage_inventory && (v.inventory_quantity || 0) <= 0

                  return (
                    <div
                      key={v.id || idx}
                      onClick={() => !outOfStock && selectVariant(idx)}
                      className={`group flex items-center justify-between py-3 px-4.5 sm:px-5 rounded-2xl border-2 transition-all cursor-pointer select-none relative overflow-hidden ${
                        outOfStock
                          ? "opacity-60 bg-gray-50 border-slate-200 cursor-not-allowed"
                          : isSelected
                          ? "bg-sky-50/50 border-sky-500 shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/20"
                      }`}
                    >
                      {/* Left: Custom Radio Circle + Details */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        {/* Custom Radio Button */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                          outOfStock
                            ? "border-slate-300 bg-slate-100"
                            : isSelected
                            ? "border-sky-500 bg-white"
                            : "border-slate-300 bg-white group-hover:border-slate-400"
                        }`}>
                          {isSelected && !outOfStock && (
                            <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-fade-in" />
                          )}
                        </div>

                        {/* Title and details */}
                        <div className="min-w-0">
                          <h4 className={`text-sm sm:text-base font-black uppercase tracking-wide truncate flex items-center flex-wrap gap-2 ${
                            isSelected ? "text-sky-700" : "text-gray-900"
                          }`}>
                            <span>{v.title}</span>
                            {v.weight && (
                              <span className={`px-2 py-0.5 text-[10px] font-black rounded-md border normal-case tracking-normal ${
                                isSelected
                                  ? "bg-sky-100/50 text-sky-700 border-sky-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}>
                                {/^\d+(\.\d+)?$/.test(v.weight.trim()) ? `${v.weight} Gram` : v.weight}
                              </span>
                            )}
                          </h4>
                          {/* Stock / Sku Sub-label */}
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {v.sku && (
                              <span className="text-[10px] text-gray-450 font-bold tracking-wider uppercase">
                                SKU: {v.sku}
                              </span>
                            )}
                            {outOfStock ? (
                              <span className="text-[10px] text-rose-600 font-extrabold bg-rose-50 px-1.5 py-0.5 rounded uppercase">
                                Out of Stock
                              </span>
                            ) : (v.inventory_quantity || 0) <= 10 && v.manage_inventory ? (
                              <span className="text-[10px] text-amber-600 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded uppercase">
                                Only {v.inventory_quantity} left
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* Right: Pricing display */}
                      <div className="text-right flex-shrink-0 ml-4 flex flex-col items-end">
                        <span className="text-base sm:text-lg font-black text-gray-950">
                          {formattedPrice(priceAmount)}
                        </span>
                        {hasDiscount && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-gray-450 line-through">
                              {formattedPrice(originalAmount)}
                            </span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-extrabold uppercase">
                              Save {discountPercent}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={liveProduct} variant={selectedVariant} />

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
        </Button>
        <MobileActions
          product={liveProduct}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
