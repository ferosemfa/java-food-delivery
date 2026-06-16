import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheck, FiPackage, FiClock, FiTruck, FiHome, FiChevronLeft, FiPhone, FiMapPin } from 'react-icons/fi';
import TrackingMap from './TrackingMap';
import LoadingSpinner from '../common/LoadingSpinner';

const steps = [
  { id: 'received', label: 'Order Received', icon: FiPackage, time: '12:30 PM' },
  { id: 'preparing', label: 'Preparing', icon: FiClock, time: '12:45 PM' },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: FiTruck, time: '01:10 PM' },
  { id: 'delivered', label: 'Delivered', icon: FiHome, time: '01:35 PM' },
];

const sampleOrder = {
  id: 'ORD-2024-001',
  status: 'out_for_delivery',
  currentStep: 2,
  estimatedTime: '15-20 min',
  restaurantName: 'The Gourmet Kitchen',
  restaurantAddress: '123 Food Street, Gourmet City',
  deliveryAddress: '456 Home Ave, Apt 4B, New York, NY 10001',
  partnerName: 'Mike Johnson',
  partnerPhone: '+1 (555) 987-6543',
  items: [
    { name: 'Truffle Pasta', quantity: 2 },
    { name: 'Garlic Bread', quantity: 1 },
    { name: 'Tiramisu', quantity: 1 },
  ],
  total: 49.96,
};

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrder(sampleOrder);
      setCurrentStep(sampleOrder.currentStep);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (!order) return;
    if (currentStep >= 3) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [order, currentStep]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Tracking your order..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order not found</h2>
        <button onClick={() => navigate('/customer/orders')} className="btn-primary mt-4">View Orders</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <FiChevronLeft size={20} />
        <span className="font-medium">Back</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-gray-900">Track Order</h1>
          <span className="text-sm text-gray-500">{order.id}</span>
        </div>
        <p className="text-gray-500 text-sm">{order.restaurantName}</p>

        <div className="mt-4 bg-brand-50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Estimated Delivery</p>
            <p className="text-lg font-bold text-brand-600">{order.estimatedTime}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Status</p>
            <span className="badge-green text-sm capitalize">
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-6">Order Progress</h2>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const Icon = step.icon;
            return (
              <div key={step.id} className={`relative flex items-start gap-4 pb-8 last:pb-0 ${isCurrent ? 'animate-pulse-slow' : ''}`}>
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isCompleted ? 'bg-brand-500 text-white' : isCurrent ? 'bg-brand-100 text-brand-600 border-2 border-brand-500' : 'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? <FiCheck size={18} /> : <Icon size={18} />}
                </div>
                <div className="pt-1.5">
                  <p className={`font-semibold text-sm ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  {step.time && (
                    <p className={`text-xs mt-0.5 ${isCompleted || isCurrent ? 'text-gray-500' : 'text-gray-300'}`}>
                      {step.time}
                    </p>
                  )}
                  {isCurrent && (
                    <span className="inline-block mt-1.5 text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-medium">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TrackingMap />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Delivery Partner</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center text-2xl">
            👨‍🦱
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{order.partnerName}</p>
            <p className="text-sm text-gray-500">Your delivery partner</p>
          </div>
          <a href={`tel:${order.partnerPhone}`} className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors">
            <FiPhone size={20} />
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Delivery Details</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <FiMapPin size={18} className="text-brand-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">From</p>
              <p className="text-sm text-gray-500">{order.restaurantAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiHome size={18} className="text-brand-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">To</p>
              <p className="text-sm text-gray-500">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Order Items</h2>
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                <span className="text-gray-400 mr-1">{item.quantity}x</span> {item.name}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
