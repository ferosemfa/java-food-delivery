import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart({ isOpen, onClose, items, updateQuantity, removeItem, onCheckout }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 30 ? 0 : 2.99;
  const total = subtotal + deliveryFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiShoppingBag size={20} className="text-brand-500" />
                <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiShoppingBag size={36} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Your cart is empty</h3>
                <p className="text-sm text-gray-500">Add items from a restaurant to get started</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                    >
                      {item.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm font-bold text-brand-600 mt-0.5">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 bg-brand-500 text-white rounded-lg flex items-center justify-center hover:bg-brand-600 transition-colors"
                        >
                          <FiPlus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors ml-1"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-gray-100 p-4 space-y-3">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    {subtotal < 30 && subtotal > 0 && (
                      <div className="text-xs text-brand-600 bg-brand-50 rounded-lg p-2 text-center">
                        Add ${(30 - subtotal).toFixed(2)} more for free delivery
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={onCheckout} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
