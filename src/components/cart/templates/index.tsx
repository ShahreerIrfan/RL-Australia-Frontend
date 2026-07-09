import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@components/common/components/divider"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@components/common/components/localized-client-link"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div className="py-10 bg-gray-50/50 min-h-[80vh]">
      <div className="content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="cart-container">
        {cart?.items?.length ? (
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-semibold select-none">
              <LocalizedClientLink href="/" className="hover:text-gray-900 transition-colors">Home</LocalizedClientLink>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-extrabold">Shopping Cart</span>
            </nav>

            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 select-none">
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
                <span className="text-sm font-semibold text-gray-400">({totalItems} {totalItems === 1 ? "item" : "items"})</span>
              </div>
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                ← Continue Shopping
              </LocalizedClientLink>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Items */}
              <div className="lg:col-span-8 flex flex-col gap-y-6">
                {!customer && (
                  <>
                    <SignInPrompt />
                    <Divider />
                  </>
                )}
                <ItemsTemplate cart={cart} />
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-4 lg:sticky lg:top-24">
                <Summary cart={cart as any} />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-150 rounded-2xl p-8 sm:p-12 shadow-xs">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-semibold select-none">
              <LocalizedClientLink href="/" className="hover:text-gray-900 transition-colors">Home</LocalizedClientLink>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-extrabold">Shopping Cart</span>
            </nav>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
