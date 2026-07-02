import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { getOrder } from '../api/orders'

export default function OrderConfirmation() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isSuccess = searchParams.get('success') === 'true'
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrder(id)
      .then(res => setOrder(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center py-32 text-sm text-gray-400">
      Loading...
    </div>
  )

  if (!order) return null

  return (
    <div className="max-w-2xl mx-auto px-10 py-16">

      {/* Success header */}
      {isSuccess && (
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-full bg-[#8b5e6d]/8 border border-[#8b5e6d]/25 flex items-center justify-center mx-auto mb-5 text-xl text-[#8b5e6d]">
            ✓
          </div>
          <h1 className="text-2xl font-medium mb-2">Order confirmed</h1>
          <p className="text-sm text-gray-400">
            Thank you, {order.address?.full_name?.split(' ')[0]}. Your order has been placed successfully.
          </p>
        </div>
      )}

      {/* Order card */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden mb-6">

        {/* Meta */}
        <div className="flex justify-between items-center px-6 py-5 bg-gray-50 border-b border-gray-100">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-[.06em] mb-1">Order</p>
            <p className="text-sm font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-400 uppercase tracking-[.06em] mb-1">Status</p>
            <span className="bg-[#8b5e6d]/8 text-[#8b5e6d] border border-[#8b5e6d]/25 rounded px-3 py-1 text-xs font-medium capitalize">
              {order.status}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-[11px] text-gray-400 uppercase tracking-[.06em] mb-4">Items</p>
          <div className="flex flex-col gap-4">
            {order.items.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-14 h-[72px] rounded-lg overflow-hidden bg-gray-50 shrink-0">
                  {item.product?.images?.[0] && (
                    <img
                      src={`http://localhost:8000/storage/${item.product.images[0]}`}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{item.product_name}</p>
                  <p className="text-xs text-gray-400">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col gap-2.5">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Subtotal</span>
            <span className="text-sm">${Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Shipping</span>
            <span className="text-sm">${Number(order.shipping_cost).toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-100 mt-1">
            <span className="text-[15px] font-medium">Total</span>
            <span className="text-[15px] font-medium">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping address */}
        <div className="px-6 py-5">
          <p className="text-[11px] text-gray-400 uppercase tracking-[.06em] mb-3">Shipping to</p>
          <p className="text-sm font-medium mb-1">{order.address?.full_name}</p>
          <p className="text-sm text-gray-400 leading-relaxed">
            {order.address?.address_line1}
            {order.address?.address_line2 ? `, ${order.address.address_line2}` : ''}<br />
            {order.address?.city}{order.address?.state ? `, ${order.address.state}` : ''} {order.address?.postal_code}<br />
            {order.address?.country}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to="/orders" className="flex-1">
          <button className="w-full border border-gray-200 text-gray-700 text-sm py-3 rounded-md hover:border-gray-400 transition-colors bg-white cursor-pointer">
            View all orders
          </button>
        </Link>
        <Link to="/products" className="flex-1">
          <button className="w-full bg-[#8b5e6d] text-white text-sm font-medium py-3 rounded-md hover:opacity-90 transition-opacity border-none cursor-pointer">
            Continue shopping
          </button>
        </Link>
      </div>
    </div>
  )
}