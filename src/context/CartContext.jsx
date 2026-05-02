import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../api/cart'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) fetchCart()
    else { setItems([]); setTotal(0) }
  }, [user])

  const fetchCart = async () => {
    setLoading(true)
    try {
      const res = await getCart()
      setItems(res.data.items)
      setTotal(res.data.total)
    } finally {
      setLoading(false)
    }
  }

  const add = async (product_id, quantity = 1) => {
    await addToCart(product_id, quantity)
    await fetchCart()
    setIsOpen(true)
  }

  const update = async (id, quantity) => {
    await updateCartItem(id, quantity)
    await fetchCart()
  }

  const remove = async (id) => {
    await removeCartItem(id)
    await fetchCart()
  }

  const clear = async () => {
    await clearCart()
    setItems([])
    setTotal(0)
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, total, itemCount, isOpen, setIsOpen, loading, add, update, remove, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}