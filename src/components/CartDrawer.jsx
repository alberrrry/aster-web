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
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.2)',
            zIndex: 100,
            backdropFilter: 'blur(2px)',
            transition: 'opacity 0.3s',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 420,
        height: '100vh',
        background: '#fff',
        boxShadow: '-2px 0 40px rgba(0,0,0,0.08)',
        zIndex: 101,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '0.5px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 2 }}>Your cart</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {itemCount === 0 ? 'Empty' : `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '0.5px solid var(--border)',
              background: 'none',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 28px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
                Your cart is empty
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-secondary"
                style={{ fontSize: 13, padding: '9px 24px' }}
              >
                Continue shopping
              </button>
            </div>
          ) : (
            items.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '20px 0',
                  borderBottom: i < items.length - 1 ? '0.5px solid var(--border)' : 'none',
                }}
              >
                {/* Image */}
                <div style={{
                  width: 80,
                  height: 104,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: 'var(--surface)',
                  flexShrink: 0,
                }}>
                  {item.product.images?.[0] ? (
                    <img
                      src={`http://localhost:8000/storage/${item.product.images[0]}`}
                      alt={item.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--surface)' }} />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{item.product.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.product.category?.name}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Quantity */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '0.5px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                    }}>
                      <button
                        onClick={() => item.quantity > 1 ? update(item.id, item.quantity - 1) : remove(item.id)}
                        style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)' }}
                      >
                        −
                      </button>
                      <span style={{ width: 28, textAlign: 'center', fontSize: 13 }}>{item.quantity}</span>
                      <button
                        onClick={() => update(item.id, item.quantity + 1)}
                        style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)' }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => remove(item.id)}
                        style={{ fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginTop: 2 }}
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
          <div style={{
            padding: '20px 28px',
            borderTop: '0.5px solid var(--border)',
          }}>
            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontSize: 13 }}>${Number(total).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Calculated at checkout</span>
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, paddingTop: 16, borderTop: '0.5px solid var(--border)' }}>
              <span style={{ fontSize: 15, fontWeight: 500 }}>Total</span>
              <span style={{ fontSize: 15, fontWeight: 500 }}>${Number(total).toFixed(2)}</span>
            </div>

            <button
              onClick={() => { setIsOpen(false); navigate('/checkout') }}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: 14 }}
            >
              Checkout
            </button>

            <button
              onClick={() => setIsOpen(false)}
              style={{ width: '100%', padding: '12px', fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8 }}
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}