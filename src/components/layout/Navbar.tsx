import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-luxury-100/90 backdrop-blur-md border-b border-luxury-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-60 text-luxury-800">The Studio</span>
            <span className="text-xl font-serif italic tracking-wider text-luxury-900">Heenuvanshii Salon Studio</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors hover:text-accent",
                    location.pathname === link.path ? "text-accent" : "text-luxury-800"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.15em] font-semibold text-luxury-800 hover:text-accent transition-colors"
                  >
                    <User size={14} />
                    <span>Account</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-[11px] uppercase tracking-[0.15em] font-semibold text-red-800 hover:text-red-900 transition-colors flex items-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-[11px] uppercase tracking-[0.15em] font-semibold text-luxury-800 hover:text-accent transition-colors flex items-center"
                >
                  Sign In
                </Link>
              )}
            </div>
            
            <Link
              to="/services"
              className="px-8 py-3 bg-luxury-800 text-luxury-100 text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:bg-luxury-900 transition-all shadow-sm"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-luxury-900 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-luxury-100 border-b border-luxury-300"
        >
          <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-xs uppercase tracking-[0.15em] font-semibold text-luxury-800 py-2"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="block text-xs uppercase tracking-[0.15em] font-semibold text-luxury-800 py-2"
                >
                  Account
                </Link>
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="block w-full text-left text-xs uppercase tracking-[0.15em] font-semibold text-red-800 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-xs uppercase tracking-[0.15em] font-semibold text-luxury-800 py-2"
              >
                Sign In
              </Link>
            )}
             <Link
              to="/services"
              onClick={() => setIsOpen(false)}
              className="block text-center mt-4 px-8 py-3 bg-luxury-800 text-luxury-100 text-[10px] uppercase tracking-[0.2em] font-bold rounded-full"
            >
              Book Now
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
