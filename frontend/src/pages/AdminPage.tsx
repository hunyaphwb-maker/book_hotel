import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Stats {
    total_bookings: number;
    total_revenue: number;
    total_users: number;
    total_hotels: number;
    total_rooms: number;
    active_bookings: number;
}

interface Booking {
    id: number;
    reference?: string | null;
    status?: 'confirmed' | 'cancelled';
    check_in_date: string;
    check_out_date: string;
    total_price: number;
    created_at: string;
    user: { id: number; name: string; email: string };
    room: {
        id: number;
        room_number: string;
        room_type: string;
        hotel: { id: number; name: string };
    };
}

interface Room {
    id: number;
    room_number: string;
    room_type: string;
    price_per_night: number;
    status: 'Booked' | 'Available';
    active_bookings_count: number;
    total_bookings_count: number;
    hotel: { id: number; name: string };
}

type Tab = 'overview' | 'bookings' | 'rooms';

const NAV: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'bookings', label: 'Bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'rooms', label: 'Rooms', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
];

export default function AdminPage() {
    const { user, token, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>('overview');
    const [stats, setStats] = useState<Stats | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        if (user && !user.is_admin) { navigate('/'); return; }

        const fetchAll = async () => {
            try {
                setLoading(true);
                const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
                const [statsRes, bookingsRes, roomsRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/admin/stats', { headers }),
                    fetch('http://127.0.0.1:8000/api/admin/bookings', { headers }),
                    fetch('http://127.0.0.1:8000/api/admin/rooms', { headers }),
                ]);
                if (!statsRes.ok || !bookingsRes.ok || !roomsRes.ok) throw new Error('Failed to load admin data');
                setStats(await statsRes.json());
                setBookings(await bookingsRes.json());
                setRooms(await roomsRes.json());
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [isAuthenticated, user, token, navigate]);

    const filteredBookings = bookings.filter(b =>
        b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        b.room?.hotel?.name?.toLowerCase().includes(search.toLowerCase())
    );
    const filteredRooms = rooms.filter(r =>
        r.hotel?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.room_number?.toString().toLowerCase().includes(search.toLowerCase()) ||
        r.room_type?.toLowerCase().includes(search.toLowerCase())
    );

    const handleLogout = async () => { await logout(); navigate('/'); };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-slate-500 text-sm">Loading admin dashboard…</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col min-h-screen sticky top-0">
                <div className="p-6 border-b border-slate-800">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-white text-brand-900 flex items-center justify-center font-display text-lg font-bold">A</div>
                        <div>
                            <div className="font-display text-white text-lg">Angelo</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Admin Console</div>
                        </div>
                    </Link>
                </div>

                <nav className="p-4 flex-1 space-y-1">
                    {NAV.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${tab === item.id ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-9 h-9 rounded-full bg-gold-500 text-white flex items-center justify-center font-semibold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{user?.name}</div>
                            <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-2 w-full text-left px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    >
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 min-w-0">
                {/* Top bar */}
                <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h1 className="font-display text-2xl text-slate-900">
                            {tab === 'overview' && 'Dashboard'}
                            {tab === 'bookings' && 'Reservations'}
                            {tab === 'rooms' && 'Rooms & Inventory'}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {tab === 'overview' && 'A live snapshot of your business performance.'}
                            {tab === 'bookings' && 'Every reservation, past and present.'}
                            {tab === 'rooms' && 'Current occupancy and room status across all properties.'}
                        </p>
                    </div>
                    {tab !== 'overview' && (
                        <div className="relative">
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search…"
                                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 w-64"
                            />
                        </div>
                    )}
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
                    )}

                    {tab === 'overview' && stats && (
                        <div className="space-y-8">
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <StatCard label="Total Revenue" value={`₱${Number(stats.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" tone="emerald" />
                                <StatCard label="Bookings" value={stats.total_bookings} icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" tone="brand" />
                                <StatCard label="Active Today" value={stats.active_bookings} icon="M13 10V3L4 14h7v7l9-11h-7z" tone="amber" />
                                <StatCard label="Guests" value={stats.total_users} icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                <StatCard label="Hotels" value={stats.total_hotels} icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                <StatCard label="Rooms" value={stats.total_rooms} icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </div>

                            {/* Recent + occupancy */}
                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                        <div>
                                            <h2 className="font-display text-lg text-slate-900">Recent reservations</h2>
                                            <p className="text-xs text-slate-500 mt-0.5">Latest 5 bookings across all properties.</p>
                                        </div>
                                        <button onClick={() => setTab('bookings')} className="text-xs text-brand-600 hover:text-brand-700 font-medium">View all →</button>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {bookings.slice(0, 5).map(b => (
                                            <div key={b.id} className="p-4 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
                                                    {b.user?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-slate-900 truncate">{b.user?.name}</div>
                                                    <div className="text-xs text-slate-500 truncate">{b.room?.hotel?.name} · Room {b.room?.room_number}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-semibold text-slate-900">₱{Number(b.total_price).toLocaleString()}</div>
                                                    <div className="text-[11px] text-slate-500">{b.check_in_date}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {bookings.length === 0 && (
                                            <div className="p-8 text-center text-sm text-slate-400">No reservations yet.</div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                    <h2 className="font-display text-lg text-slate-900 mb-1">Room occupancy</h2>
                                    <p className="text-xs text-slate-500 mb-6">Live availability across all properties.</p>
                                    {(() => {
                                        const total = rooms.length;
                                        const booked = rooms.filter(r => r.status === 'Booked').length;
                                        const percent = total > 0 ? Math.round((booked / total) * 100) : 0;
                                        return (
                                            <>
                                                <div className="relative w-40 h-40 mx-auto mb-4">
                                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                                                        <circle
                                                            cx="50" cy="50" r="42" fill="none"
                                                            stroke="url(#gradient)" strokeWidth="10" strokeLinecap="round"
                                                            strokeDasharray={`${(percent / 100) * 264} 264`}
                                                        />
                                                        <defs>
                                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#2f57e6" />
                                                                <stop offset="100%" stopColor="#d4a017" />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <div className="font-display text-3xl text-slate-900">{percent}%</div>
                                                        <div className="text-[11px] uppercase tracking-wider text-slate-500">Occupied</div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-around text-center text-xs">
                                                    <div>
                                                        <div className="font-semibold text-slate-900 text-lg">{booked}</div>
                                                        <div className="text-slate-500">Booked</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 text-lg">{total - booked}</div>
                                                        <div className="text-slate-500">Available</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 text-lg">{total}</div>
                                                        <div className="text-slate-500">Total</div>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'bookings' && (
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-left">
                                            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Guest</th>
                                            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Property</th>
                                            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Dates</th>
                                            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-right">Total</th>
                                            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-right">Booked</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredBookings.length === 0 ? (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No bookings found.</td></tr>
                                        ) : filteredBookings.map(b => (
                                            <tr key={b.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-xs">
                                                            {b.user?.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-900">{b.user?.name}</div>
                                                            <div className="text-xs text-slate-500">{b.user?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{b.room?.hotel?.name}</div>
                                                    <div className="text-xs text-slate-500">Room {b.room?.room_number} · {b.room?.room_type}</div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-700">
                                                    <div>{b.check_in_date}</div>
                                                    <div className="text-xs text-slate-500">to {b.check_out_date}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-semibold text-slate-900">
                                                    ₱{Number(b.total_price).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right text-xs text-slate-500">
                                                    {new Date(b.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {tab === 'rooms' && (
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-left">
                                            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Room</th>
                                            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Property</th>
                                            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Type</th>
                                            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-right">Rate</th>
                                            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-right">Bookings</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredRooms.map(r => (
                                            <tr key={r.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-semibold text-slate-900">#{r.room_number}</td>
                                                <td className="px-6 py-4 text-slate-700">{r.hotel?.name}</td>
                                                <td className="px-6 py-4 text-slate-700">{r.room_type}</td>
                                                <td className="px-6 py-4 text-right font-medium text-slate-900">₱{Number(r.price_per_night).toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${r.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'Available' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-slate-700">{r.total_bookings_count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, icon, tone }: { label: string; value: string | number; icon: string; tone?: 'brand' | 'emerald' | 'amber' }) {
    const toneClasses = {
        brand: 'bg-brand-50 text-brand-700',
        emerald: 'bg-emerald-50 text-emerald-700',
        amber: 'bg-amber-50 text-amber-700',
    };
    const iconClass = tone ? toneClasses[tone] : 'bg-slate-100 text-slate-600';

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${iconClass}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
            </div>
            <div className="font-display text-2xl text-slate-900">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
        </div>
    );
}
