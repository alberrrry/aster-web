import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../api/orders'

const statusColor = (status) => {
  switch (status) {
    case 'processing': return { bg: 'rgba(139,94,109,0.08)', color: '#8b5e6d', border: 'rgba(139,94,109,0.25)' }
    case 'shipped': return { bg: 'rgba(74,130,166,0.08)', color: '#4a82a6', border: 'rgba(74,130,166,0.25)' }
    case 'delivered': return { bg: 'rgba(138,171,138,0.1)', color: '#5a8a5a', border: 'rgba(138,171,138,0.3)' }
    case 'cancelled': return { bg: 'rgba(180,80,80,0.08)', color: '#b45050', border: 'rgba(180,80,80,0.25)' }
    default: return { bg: 'var(--surface)', color: 'var(--text-muted)', border: 'var(--border)' }
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
    <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
      Loading...
    </div>
  )

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 40px' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 4 }}>Your orders</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>You haven't placed any orders yet.</p>
          <Link to="/products">
            <button className="btn-primary" style={{ padding: '11px 28px' }}>Start shopping</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => {
            const s = statusColor(order.status)
            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    {/* Product images preview */}
                    <div style={{ display: 'flex' }}>
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={item.id} style={{
                          width: 48,
                          height: 60,
                          borderRadius: 6,
                          overflow: 'hidden',
                          background: 'var(--surface)',
                          marginLeft: i > 0 ? -12 : 0,
                          border: '1.5px solid #fff',
                        }}>
                          {item.product?.images?.[0] && (
                            <img
                              src={`http://localhost:8000/storage/${item.product.images[0]}`}
                              alt={item.product_name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>${Number(order.total).toFixed(2)}</p>
                    <span style={{
                      background: s.bg,
                      color: s.color,
                      border: `0.5px solid ${s.border}`,
                      borderRadius: 4,
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 500,
                      textTransform: 'capitalize',
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}