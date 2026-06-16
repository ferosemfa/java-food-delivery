import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiSmartphone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/customer';

  const [isOtpMode, setIsOtpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    otp: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!isOtpMode) {
      if (!formData.email.trim()) errs.email = 'Email is required';
      if (!formData.password) errs.password = 'Password is required';
    } else {
      if (!formData.phone.trim()) errs.phone = 'Phone number is required';
      if (formData.otp && formData.otp.length < 4) errs.otp = 'Invalid OTP';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isOtpMode) {
        if (formData.otp) {
          await verifyOtp({ phone: formData.phone, otp: formData.otp });
          navigate(from, { replace: true });
        } else {
          toast.success('OTP sent to your phone');
        }
      } else {
        await login({ email: formData.email, password: formData.password });
        navigate(from, { replace: true });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsOtpMode(!isOtpMode);
    setErrors({});
    setFormData({ email: '', password: '', phone: '', otp: '' });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🍕</div>
          <div className="absolute bottom-20 right-20 text-9xl">🍔</div>
          <div className="absolute top-1/3 right-10 text-7xl">🥗</div>
          <div className="absolute bottom-1/3 left-20 text-6xl">🍜</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] opacity-20">🍽️</div>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg text-brand-100 max-w-md leading-relaxed">
            Sign in to access your orders, favorites, and enjoy seamless food delivery from the best restaurants near you.
          </p>
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center text-xl">🚀</div>
              <div>
                <p className="font-medium">Fast Delivery</p>
                <p className="text-sm text-brand-200">Track your order in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center text-xl">🏆</div>
              <div>
                <p className="font-medium">Top Restaurants</p>
                <p className="text-sm text-brand-200">Curated selection of best eateries</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center text-xl">💳</div>
              <div>
                <p className="font-medium">Secure Payments</p>
                <p className="text-sm text-brand-200">Multiple payment options available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-3xl">🍕</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                Azlaan
              </span>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-500 mt-1">
              {isOtpMode ? 'Sign in with OTP' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isOtpMode ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={`input-field pl-10 ${errors.phone ? 'border-red-400 focus:ring-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">OTP</label>
                  <div className="relative">
                    <FiSmartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className={`input-field pl-10 ${errors.otp ? 'border-red-400 focus:ring-red-500' : ''}`}
                    />
                  </div>
                  {errors.otp && <p className="mt-1 text-xs text-red-500">{errors.otp}</p>}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-500' : ''}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isOtpMode ? (formData.otp ? 'Verify OTP' : 'Send OTP') : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button type="button" onClick={toggleMode} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              {isOtpMode ? 'Sign in with Email & Password' : 'Sign in with OTP'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
