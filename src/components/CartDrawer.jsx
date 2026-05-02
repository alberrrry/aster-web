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
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 100,
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: 380, height: '100vh',
        background: '#fff',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 101,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #eee' }}>
          <h2 style={{ margin: 0 }}>Cart ({itemCount})</h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', marginTop: 40 }}>Your cart is empty</p>
          ) : (
            items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 500 }}>{item.product.name}</p>
                  <p style={{ margin: 0, color: '#666', fontSize: 14 }}>${item.product.price}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => item.quantity > 1 ? update(item.id, item.quantity - 1) : remove(item.id)}
                    style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #ddd', background: 'none', cursor: 'pointer' }}>−</button>
                  <span style={{ width: 20, textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => update(item.id, item.quantity + 1)}
                    style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #ddd', background: 'none', cursor: 'pointer' }}>+</button>
                  <button onClick={() => remove(item.id)}
                    style={{ marginLeft: 8, background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: 18 }}>×</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 500 }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: 18 }}>${Number(total).toFixed(2)}</span>
            </div>
            <button
              onClick={() => { setIsOpen(false); navigate('/checkout') }}
              style={{ width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}