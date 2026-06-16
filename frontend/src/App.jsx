import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/vendor') || location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/customer" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/customer" replace /> : <Register />} />
          <Route
            path="/customer/*"
            element={
              <ProtectedRoute role="CUSTOMER">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/*"
            element={
              <ProtectedRoute role="VENDOR">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}
