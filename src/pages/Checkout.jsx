import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createPaymentIntent, confirmOrder } from '../api/orders'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

// Field component defined outside — receives value and onChange explicitly (your fix, kept)
const Field = ({ label, name, value, onChange, placeholder, required, half }) => (
  <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
    <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
      {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  </div>
)

// Payment form — separate component so Stripe hooks work correctly
function PaymentForm({ form, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const { total } = useCart()
  const [loading, setLoading] = useState(false)
  const shipping = 10.00

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)

    try {
      const { data } = await createPaymentIntent(form)

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: form.full_name },
        },
      })

      if (error) {
        onError(error.message)
        setLoading(false)
        return
      }

      const { data: order } = await confirmOrder(paymentIntent.id)
      onSuccess(order)

    } catch (err) {
      onError(err.response?.data?.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16, color: 'var(--text-muted)' }}>
        Payment details
      </p>
      <div style={{
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '14px',
        marginBottom: 20,
      }}>
        <CardElement options={{
          style: {
            base: {
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: '#1a1a1a',
              '::placeholder': { color: '#999' },
            }
          }
        }} />
      </div>
      <button
        type="submit"
        disabled={loading || !stripe}
        className="btn-primary"
        style={{ width: '100%', padding: '14px', fontSize: 14 }}
      >
        {loading ? 'Processing...' : `Pay $${(Number(total) + shipping).toFixed(2)}`}
      </button>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
        Secured by Stripe · Test mode
      </p>
    </form>
  )
}

// Main checkout page
export default function Checkout() {
  const { items, total } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [error, setError] = useState(null)
  const shipping = 10.00

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

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handleSuccess = (order) => {
    navigate(`/orders/${order.id}?success=true`)
  }

  const handleError = (msg) => {
    setError(msg)
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 12 }}>Checkout</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: step === 1 ? 'var(--accent)' : 'var(--text-muted)', fontWeight: step === 1 ? 500 : 400 }}>
            1. Shipping
          </span>
          <span style={{ color: 'var(--border)' }}>→</span>
          <span style={{ fontSize: 13, color: step === 2 ? 'var(--accent)' : 'var(--text-muted)', fontWeight: step === 2 ? 500 : 400 }}>
            2. Payment
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 64, alignItems: 'start' }}>

        {/* Left — form */}
        <div>
          {step === 1 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 24, color: 'var(--text-muted)' }}>
                Shipping information
              </p>
              <form onSubmit={handleShippingSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Full name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Your name" required half />
                  <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" half />
                  <Field label="Address" name="address_line1" value={form.address_line1} onChange={handleChange} placeholder="123 Main Street" required />
                  <Field label="Apartment, suite, etc." name="address_line2" value={form.address_line2} onChange={handleChange} placeholder="Optional" />
                  <Field label="City" name="city" value={form.city} onChange={handleChange} placeholder="New York" required half />
                  <Field label="State / Province" name="state" value={form.state} onChange={handleChange} placeholder="NY" half />
                  <Field label="Postal code" name="postal_code" value={form.postal_code} onChange={handleChange} placeholder="10001" required half />
                  <Field label="Country" name="country" value={form.country} onChange={handleChange} placeholder="United States" required half />
                </div>
                <div style={{ marginTop: 16, marginBottom: 24 }}>
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
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 14 }}>
                  Continue to payment
                </button>
              </form>
            </>
          )}

          {step === 2 && (
  <>
    {/* Shipping summary */}
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>Shipping to</p>
        <p style={{ fontSize: 13, fontWeight: 500 }}>{form.full_name}</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{form.address_line1}, {form.city}, {form.country}</p>
      </div>
      <button onClick={() => setStep(1)} style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
        Edit
      </button>
    </div>

    {error && (
      <div style={{ marginBottom: 20, padding: '10px 14px', background: 'var(--accent-subtle)', border: '0.5px solid var(--accent-border)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--accent)' }}>
        {error}
      </div>
    )}

    <Elements stripe={stripePromise}>
      <PaymentForm form={form} onSuccess={handleSuccess} onError={handleError} />
    </Elements>
  </>
)}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 52, height: 68, borderRadius: 6, overflow: 'hidden', background: '#e8e8e8', flexShrink: 0 }}>
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
                <p style={{ fontSize: 13, fontWeight: 500 }}>${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

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
        </div>
      </div>
    </div>
  )
}