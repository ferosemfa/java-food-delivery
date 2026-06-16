import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiShoppingBag, FiUserCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
    otp: '',
  });
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.phone.trim()) errs.phone = 'Phone is required';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleNextStep = () => {
    if (validateStep1()) setStep(2);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });
      setStep(3);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ email: formData.email, otp: formData.otp });
      toast.success('Account created successfully!');
      navigate('/customer', { replace: true });
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-8xl">🍕</div>
          <div className="absolute bottom-20 left-20 text-9xl">🍔</div>
          <div className="absolute top-1/3 left-10 text-7xl">🌮</div>
          <div className="absolute bottom-1/3 right-20 text-6xl">🥤</div>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-4xl font-bold mb-4">Join Azlaan Today!</h1>
          <p className="text-lg text-brand-100 max-w-md leading-relaxed">
            Create your account and start ordering from the best restaurants in your area.
          </p>
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center text-xl">🎉</div>
              <div>
                <p className="font-medium">Welcome Offers</p>
                <p className="text-sm text-brand-200">Get discounts on your first 3 orders</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center text-xl">⭐</div>
              <div>
                <p className="font-medium">Loyalty Program</p>
                <p className="text-sm text-brand-200">Earn points with every order</p>
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
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-1">Join us and start ordering</p>
          </div>

          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'CUSTOMER' }))}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                    formData.role === 'CUSTOMER'
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <FiUserCheck size={18} />
                  <span className="text-sm font-medium">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'VENDOR' }))}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                    formData.role === 'VENDOR'
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <FiShoppingBag size={18} />
                  <span className="text-sm font-medium">Vendor</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`} />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`} />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={`input-field pl-10 ${errors.phone ? 'border-red-400' : ''}`} />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat your password" className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-red-400' : ''}`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button onClick={handleNextStep} className="btn-primary w-full py-3 mt-6">
                Continue
              </button>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
              </p>
            </>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-brand-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-2xl">📧</div>
                <div>
                  <p className="font-medium text-brand-800 text-sm">Verify your email</p>
                  <p className="text-xs text-brand-600">We sent a verification code to {formData.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="6-digit code"
                  maxLength={6}
                  className="input-field text-center text-lg tracking-[0.5em]"
                />
              </div>

              <button onClick={handleVerifyOtp} disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Verify & Create Account
              </button>

              <button onClick={handleRegister} className="w-full text-sm text-gray-500 hover:text-gray-700 text-center">
                Didn't receive the code? Resend
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h3>
              <p className="text-gray-500 mb-6">Please check your email for the verification code.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
                <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="6-digit code" maxLength={6} className="input-field text-center text-lg tracking-[0.5em] mb-4" />
              </div>
              <button onClick={handleVerifyOtp} disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Verify OTP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
