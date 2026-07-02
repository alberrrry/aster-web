import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer() {
  const { items, total, itemCount, isOpen, setIsOpen, update, remove } = useCart()
  const navigate = useNavigate()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 w-[420px] h-screen bg-white z-[101] flex flex-col shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex justify-between items-center px-7 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-base font-medium">Your cart</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {itemCount === 0 ? 'Empty' : `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 bg-white cursor-pointer text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7 py-2">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-gray-400 mb-5">Your cart is empty</p>
              <button
                onClick={() => setIsOpen(false)}
                className="border border-gray-200 text-gray-700 text-sm px-6 py-2.5 rounded-md hover:border-gray-400 transition-colors bg-white cursor-pointer"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            items.map((item, i) => (
              <div
                key={item.id}
                className={`flex gap-4 py-5 ${i < items.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                {/* Image */}
                <div className="w-20 h-[104px] rounded-lg overflow-hidden bg-gray-50 shrink-0">
                  {item.product.images?.[0] ? (
                    <img
                      src={`http://localhost:8000/storage/${item.product.images[0]}`}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1">{item.product.name}</p>
                    <p className="text-xs text-gray-400">{item.product.category?.name}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button
                        onClick={() => item.quantity > 1 ? update(item.id, item.quantity - 1) : remove(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer text-base"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => update(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer text-base"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-[11px] text-gray-400 underline bg-transparent border-none cursor-pointer mt-0.5 hover:text-gray-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-7 py-5 border-t border-gray-100">
            <div className="flex justify-between mb-1.5">
              <span className="text-sm text-gray-400">Subtotal</span>
              <span className="text-sm">${Number(total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-5">
              <span className="text-sm text-gray-400">Shipping</span>
              <span className="text-sm text-gray-400">Calculated at checkout</span>
            </div>

            <div className="flex justify-between mb-5 pt-4 border-t border-gray-100">
              <span className="text-[15px] font-medium">Total</span>
              <span className="text-[15px] font-medium">${Number(total).toFixed(2)}</span>
            </div>

            <button
              onClick={() => { setIsOpen(false); navigate('/checkout') }}
              className="w-full bg-[#8b5e6d] text-white text-sm font-medium py-3.5 rounded-md hover:opacity-90 transition-opacity border-none cursor-pointer mb-2"
            >
              Checkout
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-sm text-gray-400 py-3 bg-transparent border-none cursor-pointer hover:text-gray-600 transition-colors"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}