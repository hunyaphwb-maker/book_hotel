import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed.');
            login(data.user, data.token);
            navigate('/');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] grid lg:grid-cols-2">
            {/* Left visual */}
            <div className="hidden lg:block relative">
                <img
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
                    alt="Hotel"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 via-slate-900/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-white text-brand-900 flex items-center justify-center font-display font-bold">A</div>
                        <span className="font-display text-xl">Angelo Boutique Stays</span>
                    </div>
                    <div>
                        <blockquote className="font-display text-3xl leading-snug mb-4">
                            "The kind of stay you dream about — quiet luxury, warm Filipino hospitality, and a bed that felt like a cloud."
                        </blockquote>
                        <div className="text-sm text-white/80">— Isabella Moreno, Travel + Leisure Southeast Asia</div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="flex items-center justify-center p-6 lg:p-12 bg-slate-50">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="font-display text-3xl text-slate-900 mb-2">Welcome back</h1>
                        <p className="text-slate-500">Sign in to manage your reservations and continue exploring.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-xs uppercase tracking-[0.15em] text-slate-500 mb-2">Email address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 text-slate-900 placeholder:text-slate-400 transition"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-xs uppercase tracking-[0.15em] text-slate-500">Password</label>
                                <a href="#" className="text-xs text-brand-600 hover:text-brand-700">Forgot?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full px-4 py-3.5 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 text-slate-900 placeholder:text-slate-400 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L3 3m6.88 6.88L15 15m0 0l3-3m-3 3l-3-3" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition"
                        >
                            {isLoading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                        <p className="text-sm text-slate-600">
                            New to Angelo? <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">Create an account</Link>
                        </p>
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-900">
                        <div className="font-semibold mb-1">Admin demo access</div>
                        <div>Email: <code className="bg-white/60 px-1 rounded">admin@hotel.com</code> · Password: <code className="bg-white/60 px-1 rounded">admin123</code></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
