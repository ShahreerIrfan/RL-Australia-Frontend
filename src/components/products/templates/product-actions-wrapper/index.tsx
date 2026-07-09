import { listProducts } from "@lib/data/products"
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
  const queryParams: any = {}
  if (handle) {
    queryParams.handle = handle
  } else {
    queryParams.id = [id]
  }

  const product = await listProducts({
    countryCode: "us",
    queryParams,
  })
    .then(({ response }) => response.products[0])
    .catch(() => null)

  if (!product) {
    return null
  }

  return <ProductActions product={product} region={region} />
}
