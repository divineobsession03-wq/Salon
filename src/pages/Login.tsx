import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-luxury-100">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-luxury-300">
        <div>
          <h2 className="text-center font-serif text-4xl text-luxury-900">Sign In</h2>
          <p className="mt-2 text-center text-sm text-luxury-800 tracking-widest uppercase">To your exclusive account</p>
        </div>
        
        {error && <div className="text-red-800 bg-red-50 p-3 text-sm text-center border border-red-200">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-luxury-800 mb-2">Email Address</label>
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-luxury-100 border-none px-4 py-3 text-luxury-900 focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-luxury-800 mb-2">Password</label>
              <input
                type="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-luxury-100 border-none px-4 py-3 text-luxury-900 focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full bg-luxury-800 text-[10px] tracking-[0.2em] font-bold uppercase text-white hover:bg-luxury-900 transition-colors">
              Sign In
            </button>
          </div>
          
          <div className="text-center text-sm text-luxury-800">
            Don't have an account? <Link to="/register" className="text-accent hover:text-accent-hover font-medium ml-1">Create one</Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
