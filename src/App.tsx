import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }: { children: React.ReactNode, roleRequired?: 'admin' | 'customer' }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen w-full flex items-center justify-center font-serif text-2xl">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roleRequired="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

