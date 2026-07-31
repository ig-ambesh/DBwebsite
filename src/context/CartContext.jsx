import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("ecostyle_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ecostyle_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const cartId = product.cartId || product.id;
      const existing = prev.find((item) => (item.cartId || item.id) === cartId);
      
      // Check total quantity of this product (across all sizes)
      const currentProductQty = prev.filter((item) => item.id === product.id).reduce((sum, item) => sum + item.quantity, 0);
      
      if (existing) {
        const newQty = existing.quantity + qty;
        const otherSizesQty = currentProductQty - existing.quantity;
        const maxStock = product.stock ?? Infinity;
        const maxAllowedForThisSize = maxStock - otherSizesQty;
        
        return prev.map((item) =>
          (item.cartId || item.id) === cartId
            ? { ...item, quantity: Math.min(newQty, Math.max(0, maxAllowedForThisSize)) }
            : item
        );
      }
      
      const maxStock = product.stock ?? Infinity;
      const maxAllowed = maxStock - currentProductQty;
      const actualQtyToAdd = Math.min(qty, Math.max(0, maxAllowed));
      
      if (actualQtyToAdd <= 0) return prev;
      
      return [...prev, { ...product, cartId, quantity: actualQtyToAdd }];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((item) => (item.cartId || item.id) !== cartId));
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCartItems((prev) => {
      const itemToUpdate = prev.find((item) => (item.cartId || item.id) === cartId);
      if (!itemToUpdate) return prev;
      
      const currentProductQty = prev.filter((item) => item.id === itemToUpdate.id).reduce((sum, item) => sum + item.quantity, 0);
      const otherSizesQty = currentProductQty - itemToUpdate.quantity;
      const maxStock = itemToUpdate.stock ?? Infinity;
      const maxAllowedForThisSize = maxStock - otherSizesQty;
      
      const actualQty = Math.min(quantity, Math.max(0, maxAllowedForThisSize));
      
      return prev.map((item) =>
        (item.cartId || item.id) === cartId ? { ...item, quantity: actualQty } : item
      );
    });
  };

  // Get quantity by cartId (specific size)
  const getItemQuantity = (cartId) => {
    const item = cartItems.find((item) => (item.cartId || item.id) === cartId);
    return item ? item.quantity : 0;
  };

  // Get quantity by productId (all sizes)
  const getProductQuantity = (productId) => {
    return cartItems.filter((item) => item.id === productId).reduce((sum, item) => sum + item.quantity, 0);
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        getProductQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
