import { Suspense } from "react"
import SkeletonProductGrid from "@components/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@components/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import { listCategories } from "@lib/data/categories"
import SortDropdown from "../components/sort-dropdown"
import StoreClientPage from "./StoreClientPage"

const StoreTemplate = async ({
  sortBy,
  page,
  category,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  category?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Fetch categories dynamically from backend database
  const categories = await listCategories().catch(() => [])

  // Find the selected active category based on URL query slug
  const activeCategory = categories.find(
    (c) => c.handle?.toLowerCase() === category?.toLowerCase()
  )

  const activeCategoryTitle = activeCategory?.name || "All Products"

  return (
    <StoreClientPage
      categories={categories}
      activeCategoryTitle={activeCategoryTitle}
      activeCategoryHandle={category}
      countryCode={countryCode}
      sortBy={sort}
    >
      {/* List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight" data-testid="store-page-title">
            Available Compounds
          </h2>
        </div>
        <div className="flex-shrink-0">
          <SortDropdown sortBy={sort} />
        </div>
      </div>

      {/* Products Grid */}
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          categoryId={activeCategory?.id}
          countryCode={countryCode}
        />
      </Suspense>
    </StoreClientPage>
  )
}

export default StoreTemplate
