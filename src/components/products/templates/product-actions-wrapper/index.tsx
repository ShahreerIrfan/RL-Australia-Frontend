import { retrieveProduct } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@components/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
}: {
  id: string
  region: HttpTypes.StoreRegion
}) {
  const product = await retrieveProduct(id, region.id)
    .then(({ product }) => product)
    .catch(() => null)

  if (!product) {
    return null
  }

  return <ProductActions product={product} region={region} />
}
