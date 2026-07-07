import { Suspense } from "react"
import SkeletonProductGrid from "@components/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@components/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import { listCategories } from "@lib/data/categories"
import SortDropdown from "../components/sort-dropdown"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

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
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      data-testid="category-container"
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar: Categories Navigation */}
        <aside className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-5 shadow-xs select-none">
          <span className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-4">
            Categories
          </span>
          <div className="flex flex-col gap-2">
            {/* All Products link */}
            <Link
              href={`/${countryCode}/store${sortBy ? `?sortBy=${sortBy}` : ""}`}
              className={`flex items-center justify-between py-3 px-4 rounded-xl border transition-all text-xs sm:text-sm font-extrabold ${
                !category || category === "all"
                  ? "bg-sky-50 border-sky-200 text-sky-700 font-black shadow-xs"
                  : "bg-white border-transparent text-gray-600 hover:bg-slate-50 hover:text-gray-900"
              }`}
            >
              <span>All Products</span>
              {(!category || category === "all") && (
                <ChevronRight className="w-4 h-4 text-sky-500" />
              )}
            </Link>

            {/* List of categories */}
            {categories.map((c) => {
              const isActive = category?.toLowerCase() === c.handle?.toLowerCase()
              return (
                <Link
                  key={c.id}
                  href={`/${countryCode}/store?category=${c.handle}${
                    sortBy ? `&sortBy=${sortBy}` : ""
                  }`}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl border transition-all text-xs sm:text-sm font-extrabold ${
                    isActive
                      ? "bg-sky-50 border-sky-200 text-sky-700 font-black shadow-xs"
                      : "bg-white border-transparent text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                  }`}
                >
                  <span>{c.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-sky-500" />}
                </Link>
              )
            })}
          </div>
        </aside>

        {/* Right Content Column: Products Grid */}
        <main className="flex-1 w-full">
          {/* List Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight" data-testid="store-page-title">
                {activeCategoryTitle}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">
                Explore our selection of premium research compounds
              </p>
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
        </main>
      </div>
    </div>
  )
}

export default StoreTemplate
