import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../api/orders'

const statusStyles = (status) => {
  switch (status) {
    case 'processing': return 'bg-[#8b5e6d]/8 text-[#8b5e6d] border-[#8b5e6d]/25'
    case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'delivered': return 'bg-green-50 text-green-600 border-green-200'
    case 'cancelled': return 'bg-red-50 text-red-500 border-red-200'
    default: return 'bg-gray-50 text-gray-400 border-gray-200'
  }
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-32 text-sm text-gray-400">
      Loading...
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-10 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-medium mb-1">Your orders</h1>
        <p className="text-sm text-gray-400">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-gray-400 mb-5">You haven't placed any orders yet.</p>
          <Link to="/products">
            <button className="bg-[#8b5e6d] text-white text-sm font-medium px-8 py-3 rounded-md hover:opacity-90 transition-opacity border-none cursor-pointer">
              Start shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map(order => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="no-underline text-inherit"
            >
              <div
                className="border border-gray-100 rounded-xl px-6 py-5 flex justify-between items-center hover:border-[#8b5e6d] transition-colors"
              >
                <div className="flex gap-4 items-center">
                  {/* Product image stack */}
                  <div className="flex">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div
                        key={item.id}
                        className="w-12 h-16 rounded-md overflow-hidden bg-gray-50 border-2 border-white"
                        style={{ marginLeft: i > 0 ? -10 : 0 }}
                      >
                        {item.product?.images?.[0] && (
                          <img
                            src={`http://localhost:8000/storage/${item.product.images[0]}`}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium">${Number(order.total).toFixed(2)}</p>
                  <span className={`text-xs font-medium px-3 py-1 rounded border capitalize ${statusStyles(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}