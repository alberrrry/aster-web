import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { placeOrder } from '../api/orders'

const Field = ({ label, name, value, onChange, placeholder, required, half }) => (
  <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
    <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
      {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
    </label>
    <input
      name={name}
      value={value} // Pass value explicitly
      onChange={onChange} // Pass handler explicitly
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default function Checkout() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    notes: '',
  })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await placeOrder(form)
      navigate(`/orders/${res.data.id}?success=true`)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const shipping = 10.00

  
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 8 }}>Checkout</h1>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 48 }}>
        Complete your order details below
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 64, alignItems: 'start' }}>

          {/* Left — Shipping form */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 24, color: 'var(--text-muted)' }}>
              Shipping information
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Full name" name="full_name" placeholder="Full Name" required half />
              <Field label="Phone" name="phone" placeholder="+1 234 567 8900" half />
              <Field label="Address" name="address_line1" placeholder="123 Main Street" required />
              <Field label="Apartment, suite, etc." name="address_line2" placeholder="Optional" />
              <Field label="City" name="city" placeholder="New York" required half />
              <Field label="State / Province" name="state" placeholder="NY" half />
              <Field label="Postal code" name="postal_code" placeholder="10001" required half />
              <Field label="Country" name="country" placeholder="United States" required half />
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Order notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any special instructions..."
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Right — Order summary */}
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 24px',
            position: 'sticky',
            top: 100,
          }}>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20, color: 'var(--text-muted)' }}>
              Order summary
            </p>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 52,
                    height: 68,
                    borderRadius: 6,
                    overflow: 'hidden',
                    background: '#e8e8e8',
                    flexShrink: 0,
                  }}>
                    {item.product.images?.[0] && (
                      <img
                        src={`http://localhost:8000/storage/${item.product.images[0]}`}
                        alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{item.product.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Qty {item.quantity}</p>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Subtotal</span>
                <span style={{ fontSize: 13 }}>${Number(total).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Shipping</span>
                <span style={{ fontSize: 13 }}>${shipping.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '0.5px solid var(--border)', marginTop: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 500 }}>Total</span>
                <span style={{ fontSize: 15, fontWeight: 500 }}>${(Number(total) + shipping).toFixed(2)}</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                marginTop: 16,
                padding: '10px 14px',
                background: 'var(--accent-subtle)',
                border: '0.5px solid var(--accent-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
                color: 'var(--accent)',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: 14, marginTop: 20 }}
            >
              {loading ? 'Placing order...' : 'Place order'}
            </button>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
              Payment via Stripe coming soon
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}