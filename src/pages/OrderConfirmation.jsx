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
    <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
      Loading...
    </div>
  )

  if (!order) return null

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 40px' }}>

      {/* Success header */}
      {isSuccess && (
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: '50%',
            background: 'var(--accent-subtle)',
            border: '0.5px solid var(--accent-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 22,
          }}>
            ✓
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 8 }}>Order confirmed</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Thank you, {order.address?.full_name?.split(' ')[0]}. Your order has been placed successfully.
          </p>
        </div>
      )}

      {/* Order details card */}
      <div style={{ border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 24 }}>

        {/* Order meta */}
        <div style={{ padding: '20px 24px', borderBottom: '0.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>Order</p>
            <p style={{ fontSize: 13, fontWeight: 500 }}>#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>Status</p>
            <span style={{
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
              border: '0.5px solid var(--accent-border)',
              borderRadius: 4,
              padding: '3px 10px',
              fontSize: 12,
              fontWeight: 500,
              textTransform: 'capitalize',
            }}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Items */}
        <div style={{ padding: '20px 24px', borderBottom: '0.5px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 16 }}>Items</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {order.items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 52, height: 68, borderRadius: 8, overflow: 'hidden', background: 'var(--surface)', flexShrink: 0 }}>
                  {item.product?.images?.[0] && (
                    <img
                      src={`http://localhost:8000/storage/${item.product.images[0]}`}
                      alt={item.product_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{item.product_name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Qty {item.quantity}</p>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500 }}>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div style={{ padding: '20px 24px', borderBottom: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Subtotal</span>
            <span style={{ fontSize: 13 }}>${Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Shipping</span>
            <span style={{ fontSize: 13 }}>${Number(order.shipping_cost).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '0.5px solid var(--border)', marginTop: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>Total</span>
            <span style={{ fontSize: 15, fontWeight: 500 }}>${Number(order.total).toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping address */}
        <div style={{ padding: '20px 24px' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12 }}>Shipping to</p>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{order.address?.full_name}</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {order.address?.address_line1}{order.address?.address_line2 ? `, ${order.address.address_line2}` : ''}<br />
            {order.address?.city}{order.address?.state ? `, ${order.address.state}` : ''} {order.address?.postal_code}<br />
            {order.address?.country}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/orders" style={{ flex: 1 }}>
          <button className="btn-secondary" style={{ width: '100%', padding: '12px' }}>
            View all orders
          </button>
        </Link>
        <Link to="/products" style={{ flex: 1 }}>
          <button className="btn-primary" style={{ width: '100%', padding: '12px' }}>
            Continue shopping
          </button>
        </Link>
      </div>
    </div>
  )
}