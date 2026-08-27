import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
            });
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 422) {
                    const messages = Object.values(data).flat().join(' ');
                    throw new Error(messages);
                }
                throw new Error(data.message || 'Registration failed.');
            }
            login(data.user, data.token);
            navigate('/');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] grid lg:grid-cols-2">
            <div className="hidden lg:block relative">
                <img
                    src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80"
                    alt="Hotel lobby"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 via-slate-900/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-white text-brand-900 flex items-center justify-center font-display font-bold">A</div>
                        <span className="font-display text-xl">Angelo Boutique Stays</span>
                    </div>
                    <div>
                        <h2 className="font-display text-4xl mb-4 leading-tight">Discover the Philippines your way</h2>
                        <ul className="space-y-3 text-white/85">
                            {[
                                'Member-only rates and offers',
                                'Complimentary room upgrades',
                                'Early access to new properties',
                                'Personal concierge assistance',
                            ].map(perk => (
                                <li key={perk} className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    <span className="text-sm">{perk}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center p-6 lg:p-12 bg-slate-50">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="font-display text-3xl text-slate-900 mb-2">Create your account</h1>
                        <p className="text-slate-500">Sign up in seconds and start planning your next stay.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs uppercase tracking-[0.15em] text-slate-500 mb-2">Full name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Juan Dela Cruz"
                                required
                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-[0.15em] text-slate-500 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs uppercase tracking-[0.15em] text-slate-500 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    required
                                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-[0.15em] text-slate-500 mb-2">Confirm</label>
                                <input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={e => setPasswordConfirmation(e.target.value)}
                                    placeholder="Repeat password"
                                    required
                                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
                                />
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
                            {isLoading ? 'Creating your account…' : 'Create account'}
                        </button>

                        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                            By creating an account, you agree to our <a href="#" className="text-brand-600 hover:underline">Terms of Service</a> and <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>.
                        </p>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                        <p className="text-sm text-slate-600">
                            Already a member? <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
