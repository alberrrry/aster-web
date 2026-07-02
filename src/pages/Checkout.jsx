import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createPaymentIntent, confirmOrder } from '../api/orders'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const Field = ({ label, name, value, onChange, placeholder, required, half }) => (
  <div className={half ? 'col-span-1' : 'col-span-2'}>
    <label className="block text-[11px] text-gray-400 tracking-[.06em] uppercase mb-2">
      {label} {required && <span className="text-[#8b5e6d]">*</span>}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm outline-none focus:border-[#8b5e6d] transition-colors bg-white"
    />
  </div>
)

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
      <p className="text-[11px] font-medium tracking-[.1em] uppercase text-gray-400 mb-4">
        Payment details
      </p>
      <div className="border border-gray-200 rounded-md p-4 mb-5">
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
        className="w-full bg-[#8b5e6d] text-white text-sm font-medium py-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 border-none cursor-pointer"
      >
        {loading ? 'Processing...' : `Pay $${(Number(total) + shipping).toFixed(2)}`}
      </button>
      <p className="text-[11px] text-gray-400 text-center mt-3">
        Secured by Stripe · Test mode
      </p>
    </form>
  )
}

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

  const handleError = (msg) => setError(msg)

  return (
    <div className="max-w-5xl mx-auto px-10 py-12">

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-2xl font-medium mb-3">Checkout</h1>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${step === 1 ? 'text-[#8b5e6d] font-medium' : 'text-gray-400'}`}>
            1. Shipping
          </span>
          <span className="text-gray-200">→</span>
          <span className={`text-sm ${step === 2 ? 'text-[#8b5e6d] font-medium' : 'text-gray-400'}`}>
            2. Payment
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-16 items-start">

        {/* Left */}
        <div>
          {step === 1 && (
            <>
              <p className="text-[11px] font-medium tracking-[.1em] uppercase text-gray-400 mb-6">
                Shipping information
              </p>
              <form onSubmit={handleShippingSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Field label="Full name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Your name" required half />
                  <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" half />
                  <Field label="Address" name="address_line1" value={form.address_line1} onChange={handleChange} placeholder="123 Main Street" required />
                  <Field label="Apartment, suite, etc." name="address_line2" value={form.address_line2} onChange={handleChange} placeholder="Optional" />
                  <Field label="City" name="city" value={form.city} onChange={handleChange} placeholder="New York" required half />
                  <Field label="State / Province" name="state" value={form.state} onChange={handleChange} placeholder="NY" half />
                  <Field label="Postal code" name="postal_code" value={form.postal_code} onChange={handleChange} placeholder="10001" required half />
                  <Field label="Country" name="country" value={form.country} onChange={handleChange} placeholder="United States" required half />
                </div>
                <div className="mb-6">
                  <label className="block text-[11px] text-gray-400 tracking-[.06em] uppercase mb-2">
                    Order notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm outline-none focus:border-[#8b5e6d] transition-colors resize-y bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#8b5e6d] text-white text-sm font-medium py-4 rounded-md hover:opacity-90 transition-opacity border-none cursor-pointer"
                >
                  Continue to payment
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              {/* Shipping summary */}
              <div className="bg-gray-50 rounded-xl px-5 py-4 mb-7 flex justify-between items-center">
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-[.06em] mb-1">Shipping to</p>
                  <p className="text-sm font-medium">{form.full_name}</p>
                  <p className="text-sm text-gray-400">{form.address_line1}, {form.city}, {form.country}</p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[#8b5e6d] underline bg-transparent border-none cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 bg-[#8b5e6d]/8 border border-[#8b5e6d]/25 rounded-md text-sm text-[#8b5e6d]">
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
        <div className="bg-gray-50 rounded-2xl p-7 sticky top-24">
          <p className="text-[11px] font-medium tracking-[.1em] uppercase text-gray-400 mb-5">
            Order summary
          </p>

          <div className="flex flex-col gap-4 mb-6">
            {items.map(item => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="w-14 h-[72px] rounded-md overflow-hidden bg-gray-200 shrink-0">
                  {item.product.images?.[0] && (
                    <img
                      src={`http://localhost:8000/storage/${item.product.images[0]}`}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-0.5">{item.product.name}</p>
                  <p className="text-xs text-gray-400">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-5 flex flex-col gap-2.5">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Subtotal</span>
              <span className="text-sm">${Number(total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Shipping</span>
              <span className="text-sm">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 mt-1">
              <span className="text-[15px] font-medium">Total</span>
              <span className="text-[15px] font-medium">${(Number(total) + shipping).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}