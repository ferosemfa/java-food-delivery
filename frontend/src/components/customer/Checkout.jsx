import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiSmartphone, FiCheck, FiChevronLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import { FaDollarSign } from 'react-icons/fa';
import toast from 'react-hot-toast';

const savedAddresses = [
  { id: 1, label: 'Home', address: '123 Main Street, Apt 4B, New York, NY 10001', isDefault: true },
  { id: 2, label: 'Work', address: '456 Business Ave, Suite 200, New York, NY 10002', isDefault: false },
];

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: FiSmartphone, description: 'Pay via Google Pay, PhonePe, Paytm' },
  { id: 'card', name: 'Credit / Debit Card', icon: FiCreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'wallet', name: 'Wallet', icon: FaDollarSign, description: 'Azlaan Wallet Balance: $25.00' },
  { id: 'cod', name: 'Cash on Delivery', icon: FaDollarSign, description: 'Pay when your food arrives' },
];

export default function Checkout({ cartItems, clearCart }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0].id);
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '', street: '', city: '', state: '', zip: '',
  });
  const [addressErrors, setAddressErrors] = useState({});

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = subtotal > 30 ? 0 : 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/customer/orders');
    }, 2000);
  };

  const validateAddress = () => {
    const errs = {};
    if (!newAddress.label.trim()) errs.label = 'Label is required';
    if (!newAddress.street.trim()) errs.street = 'Street is required';
    if (!newAddress.city.trim()) errs.city = 'City is required';
    if (!newAddress.state.trim()) errs.state = 'State is required';
    if (!newAddress.zip.trim()) errs.zip = 'ZIP code is required';
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAddress = () => {
    if (validateAddress()) {
      toast.success('Address saved successfully');
      setShowNewAddress(false);
      setNewAddress({ label: '', street: '', city: '', state: '', zip: '' });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items to your cart before checking out.</p>
        <button onClick={() => navigate('/customer')} className="btn-primary">Browse Restaurants</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <FiChevronLeft size={20} />
        <span className="font-medium">Back</span>
      </button>

      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step >= s ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s ? <FiCheck size={16} /> : s}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step >= s ? 'text-brand-600' : 'text-gray-400'}`}>
              {s === 1 ? 'Delivery' : s === 2 ? 'Payment' : 'Review'}
            </span>
            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-brand-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Address</h2>
              <div className="space-y-3">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddress === addr.id
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="mt-1 accent-brand-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">{addr.label}</span>
                          {addr.isDefault && <span className="bg-brand-100 text-brand-600 text-[10px] font-bold px-2 py-0.5 rounded-full">DEFAULT</span>}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{addr.address}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={() => setShowNewAddress(!showNewAddress)}
                className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm mt-4"
              >
                <FiPlus size={16} />
                Add New Address
              </button>

              {showNewAddress && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                      <input
                        type="text"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))}
                        placeholder="Home, Work, etc."
                        className={`input-field text-sm ${addressErrors.label ? 'border-red-400' : ''}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))}
                        placeholder="123 Main St, Apt 4B"
                        className={`input-field text-sm ${addressErrors.street ? 'border-red-400' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                        placeholder="New York"
                        className={`input-field text-sm ${addressErrors.city ? 'border-red-400' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress((p) => ({ ...p, state: e.target.value }))}
                        placeholder="NY"
                        className={`input-field text-sm ${addressErrors.state ? 'border-red-400' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={newAddress.zip}
                        onChange={(e) => setNewAddress((p) => ({ ...p, zip: e.target.value }))}
                        placeholder="10001"
                        className={`input-field text-sm ${addressErrors.zip ? 'border-red-400' : ''}`}
                      />
                    </div>
                  </div>
                  <button onClick={handleSaveAddress} className="btn-primary text-sm py-2">Save Address</button>
                </div>
              )}

              <div className="mt-6 bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FiMapPin size={20} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Delivery Area</p>
                    <p className="text-xs text-gray-500 mt-0.5">We deliver within a 5km radius. Estimated delivery: 25-35 min.</p>
                  </div>
                </div>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full py-3 mt-6">
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <label
                      key={pm.id}
                      className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPayment === pm.id
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={selectedPayment === pm.id}
                          onChange={() => setSelectedPayment(pm.id)}
                          className="mt-1 accent-brand-500"
                        />
                        <Icon size={20} className="text-gray-600 mt-0.5" />
                        <div>
                          <span className="font-semibold text-gray-900 text-sm">{pm.name}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{pm.description}</p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 py-3">Review Order</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Review Your Order</h2>

              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiMapPin size={14} className="text-brand-500" />
                  Delivery To
                </h3>
                <p className="text-sm text-gray-600 pl-6">{savedAddresses.find((a) => a.id === selectedAddress)?.address}</p>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        <span className="text-gray-400 mr-1">{item.quantity}x</span> {item.name}
                      </span>
                      <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Details</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1 py-3">Back</button>
                <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                  {placing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {placing ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.image && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? <span className="text-green-600">Free</span> : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
