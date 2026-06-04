import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="grid container-sm" style={{ gap: 14 }}>
      <section className="card">
        <div className="kicker d-flex items-center gap-8">
          <UserPlus size={16} /> Create Account
        </div>
        <h1 className="h1 mt-10">Get started</h1>
        <p className="p">Create an account to save reports and manage your analysis history.</p>

        <div className="card p-12 mt-16 notice-success">
          <div className="small text-green">
            Your account is stored locally on this device only. No data is sent to any server.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-24">
          {error && (
            <div className="card p-12 mb-14 notice-error">
              <div className="small text-red">{error}</div>
            </div>
          )}

          <div className="mb-14">
            <label htmlFor="fullName" className="small d-block mb-6">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="input"
              placeholder="John Doe"
            />
          </div>

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
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn primary w-full"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="small text-center mt-16">
          Already have an account? <Link to="/login" className="text-link font-medium">Sign in</Link>
        </div>
      </section>
    </div>
  );
}
