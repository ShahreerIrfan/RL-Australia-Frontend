import { retrieveProduct } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@components/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  handle,
  region,
}: {
  id: string
  handle?: string
  region: HttpTypes.StoreRegion
}) {
  const product = await retrieveProduct(id, region.id, handle)
    .then(({ product }) => product)
    .catch(() => null)

  if (!product) {
    return null
  }

  return <ProductActions product={product} region={region} />
}
