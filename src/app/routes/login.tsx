import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="grid container-sm" style={{ gap: 14 }}>
      <section className="card">
        <div className="kicker d-flex items-center gap-8">
          <LogIn size={16} /> Sign In
        </div>
        <h1 className="h1 mt-10" style={{ fontSize: 28 }}>Your Account</h1>
        <p className="p">Sign in to access your saved reports and documents, or create a new account.</p>

        <div className="card p-12 mt-16 notice-success">
          <div className="small text-green">
            Your account is stored locally on this device. No data is sent to any server.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-24">
          {error && (
            <div className="card p-12 mb-14 notice-error">
              <div className="small text-red">{error}</div>
            </div>
          )}

          <div className="mb-14">
            <label htmlFor="email" className="small d-block mb-6">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-20">
            <label htmlFor="password" className="small d-block mb-6">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn primary w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-20 pt-20 border-top">
          <div className="small mb-10 opacity-8">Don't have an account?</div>
          <Link to="/signup" className="btn w-full">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
