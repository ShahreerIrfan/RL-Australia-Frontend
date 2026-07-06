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
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string

  // Sync selectedVariantIndex if query parameter has v_id
  useEffect(() => {
    const vId = searchParams?.get("v_id")
    if (vId && product.variants) {
      const idx = product.variants.findIndex((v) => v.id === vId)
      if (idx !== -1 && idx !== selectedVariantIndex) {
        setSelectedVariantIndex(idx)
      }
    }
  }, [searchParams, product.variants])

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    // If it has medusa options, use options matching
    if (product.options && product.options.length > 0) {
      return product.variants.find((v) => {
        const variantOptions = optionsAsKeymap(v.options)
        return isEqual(variantOptions, options)
      })
    }

    // Otherwise fall back to selected index
    return product.variants[selectedVariantIndex] || product.variants[0]
  }, [product.variants, options, selectedVariantIndex, product.options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const selectVariant = (index: number) => {
    setSelectedVariantIndex(index)
    const variant = product.variants?.[index]
    if (variant?.id) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("v_id", variant.id)
      router.replace(pathname + "?" + params.toString())
    }
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    if (product.options && product.options.length > 0) {
      return product.variants?.some((v) => {
        const variantOptions = optionsAsKeymap(v.options)
        return isEqual(variantOptions, options)
      })
    }
    return !!selectedVariant
  }, [product.variants, options, product.options, selectedVariant])

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
          {product.options && product.options.length > 0 && (product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option, index) => {
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

          {/* Custom products direct variant selector pills */}
          {(!product.options || product.options.length === 0) && (product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-3 mb-6 text-left">
              <span className="text-xs sm:text-sm font-extrabold text-gray-700 uppercase tracking-wider block">
                Select Option / Gram:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {product.variants!.map((v, idx) => {
                  const isSelected = selectedVariant?.id === v.id
                  return (
                    <button
                      key={v.id || idx}
                      type="button"
                      onClick={() => selectVariant(idx)}
                      className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl border-2 transition-all uppercase tracking-wide cursor-pointer ${
                        isSelected
                          ? "bg-sky-50 border-sky-500 text-sky-700 shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-350"
                      }`}
                    >
                      {v.title}
                    </button>
                  )
                })}
              </div>
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

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
          product={product}
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
