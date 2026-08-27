import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import HotelDetailPage from './pages/HotelDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ExperiencesPage from './pages/ExperiencesPage';
import ContactPage from './pages/ContactPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const onDark = location.pathname === '/';

    const linkClass = (active: boolean) => {
        if (onDark) return `text-sm font-medium transition ${active ? 'text-white' : 'text-white/80 hover:text-white'}`;
        return `text-sm font-medium transition ${active ? 'text-brand-700' : 'text-slate-600 hover:text-slate-900'}`;
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className={`absolute top-0 left-0 right-0 z-30 ${onDark ? '' : 'bg-white border-b border-slate-200 relative shadow-sm'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-display text-lg font-bold ${onDark ? 'bg-white text-brand-900' : 'bg-brand-900 text-white'}`}>
                        A
                    </div>
                    <div className="leading-tight">
                        <div className={`font-display text-xl font-semibold tracking-tight ${onDark ? 'text-white' : 'text-slate-900'}`}>
                            Angelo
                        </div>
                        <div className={`text-[10px] uppercase tracking-[0.2em] ${onDark ? 'text-white/70' : 'text-slate-500'}`}>
                            Boutique Stays
                        </div>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className={linkClass(location.pathname === '/')}>Discover</Link>
                    <a href="/#collection" className={linkClass(false)}>Collection</a>
                    <Link to="/experiences" className={linkClass(location.pathname === '/experiences')}>Experiences</Link>
                    {isAuthenticated && (
                        <Link to="/my-bookings" className={linkClass(location.pathname === '/my-bookings')}>My Trips</Link>
                    )}
                    <Link to="/contact" className={linkClass(location.pathname === '/contact')}>Contact</Link>
                </nav>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            {user?.is_admin && (
                                <Link
                                    to="/admin"
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider transition"
                                >
                                    Admin
                                </Link>
                            )}
                            <div className={`hidden sm:flex items-center gap-2 text-sm ${onDark ? 'text-white/90' : 'text-slate-700'}`}>
                                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium">{user?.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${onDark ? 'text-white hover:bg-white/10 border border-white/30' : 'text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${onDark ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${onDark ? 'bg-white text-brand-900 hover:bg-brand-50' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                            >
                                Reserve Now
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer id="contact" className="bg-slate-900 text-slate-300 mt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-10">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-white text-brand-900 flex items-center justify-center font-display text-lg font-bold">A</div>
                        <div className="font-display text-xl text-white">Angelo Boutique Stays</div>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400">
                        Hand-picked boutique hotels and beach resorts across the Philippines' most captivating destinations.
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-display text-base mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/experiences" className="hover:text-white">Experiences</Link></li>
                        <li><Link to="/contact" className="hover:text-white">Contact us</Link></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                        <li><a href="#" className="hover:text-white">Sustainability</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-display text-base mb-4">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white">Reservations</a></li>
                        <li><a href="#" className="hover:text-white">Concierge</a></li>
                        <li><a href="#" className="hover:text-white">Cancellation Policy</a></li>
                        <li><a href="#" className="hover:text-white">FAQs</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-display text-base mb-4">Stay in touch</h4>
                    <p className="text-sm text-slate-400 mb-3">Journal, offers and travel inspiration.</p>
                    <form className="flex gap-2">
                        <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand-400" />
                        <button type="button" className="px-4 py-2 rounded-md bg-gold-500 hover:bg-gold-600 text-white text-sm font-medium">Join</button>
                    </form>
                </div>
            </div>
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} Angelo Boutique Stays. All rights reserved.</p>
                    <div className="flex gap-6 mt-3 md:mt-0">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            <Navbar />
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/hotel/:id" element={<HotelDetailPage />} />
                    <Route path="/experiences" element={<ExperiencesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/my-bookings" element={<MyBookingsPage />} />
                    <Route path="/booking/confirmation/:id" element={<BookingConfirmationPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
