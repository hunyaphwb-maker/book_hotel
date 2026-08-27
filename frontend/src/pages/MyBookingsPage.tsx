import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Booking {
    id: number;
    reference: string | null;
    check_in_date: string;
    check_out_date: string;
    total_price: string | number;
    status: 'confirmed' | 'cancelled';
    created_at: string;
    room: {
        id: number;
        room_type: string;
        price_per_night: string | number;
        hotel: {
            id: number;
            name: string;
            address: string;
            image_url: string;
        };
    };
}

type Tab = 'upcoming' | 'past' | 'cancelled';

function nightsBetween(a: string, b: string): number {
    const start = new Date(a).getTime();
    const end = new Date(b).getTime();
    return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
}

function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

function BookingRow({ booking, onCancel, cancelling }: { booking: Booking; onCancel: (id: number) => void; cancelling: number | null }) {
    const nights = nightsBetween(booking.check_in_date, booking.check_out_date);
    const isCancelled = booking.status === 'cancelled';
    const isPast = new Date(booking.check_out_date) < new Date() && !isCancelled;
    const isUpcoming = !isCancelled && !isPast;

    return (
        <article className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid md:grid-cols-[240px_1fr] gap-0">
                <div className="relative aspect-[4/3] md:aspect-auto">
                    <img src={booking.room.hotel.image_url} alt={booking.room.hotel.name} className="w-full h-full object-cover" loading="lazy" />
                    {isCancelled && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="px-3 py-1 rounded-full bg-red-500 text-white text-[11px] font-semibold uppercase tracking-wider">Cancelled</span>
                        </div>
                    )}
                </div>

                <div className="p-6 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                                Ref · {booking.reference ?? `#${booking.id}`}
                            </div>
                            <h3 className="font-display text-2xl text-slate-900 leading-tight">
                                {booking.room.hotel.name}
                            </h3>
                            <div className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {booking.room.hotel.address}
                            </div>
                        </div>
                        {isUpcoming && (
                            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold uppercase tracking-wider whitespace-nowrap">Confirmed</span>
                        )}
                        {isPast && (
                            <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider whitespace-nowrap">Completed</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 my-2">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Check-in</div>
                            <div className="text-sm font-medium text-slate-900">{formatDate(booking.check_in_date)}</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Check-out</div>
                            <div className="text-sm font-medium text-slate-900">{formatDate(booking.check_out_date)}</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Room</div>
                            <div className="text-sm font-medium text-slate-900">{booking.room.room_type}</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Nights</div>
                            <div className="text-sm font-medium text-slate-900">{nights}</div>
                        </div>
                    </div>

                    <div className="flex items-end justify-between mt-auto pt-2">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Total paid</div>
                            <div className="font-display text-xl text-slate-900">
                                ₱{Number(booking.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                to={`/booking/confirmation/${booking.id}`}
                                className="px-4 py-2 text-xs font-medium rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100"
                            >
                                View details
                            </Link>
                            {isUpcoming && (
                                <button
                                    onClick={() => onCancel(booking.id)}
                                    disabled={cancelling === booking.id}
                                    className="px-4 py-2 text-xs font-medium rounded-full border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {cancelling === booking.id ? 'Cancelling…' : 'Cancel'}
                                </button>
                            )}
                            {isPast && (
                                <Link
                                    to={`/hotel/${booking.room.hotel.id}`}
                                    className="px-4 py-2 text-xs font-medium rounded-full bg-slate-900 text-white hover:bg-brand-700"
                                >
                                    Book again
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function MyBookingsPage() {
    const { isAuthenticated, token } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<Tab>('upcoming');
    const [cancelling, setCancelling] = useState<number | null>(null);
    const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (!token) return;
        const load = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/api/bookings/mine', {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                setBookings(await res.json());
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to load bookings.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [token]);

    const buckets = useMemo(() => {
        const now = new Date();
        const upcoming: Booking[] = [];
        const past: Booking[] = [];
        const cancelled: Booking[] = [];
        for (const b of bookings) {
            if (b.status === 'cancelled') cancelled.push(b);
            else if (new Date(b.check_out_date) < now) past.push(b);
            else upcoming.push(b);
        }
        upcoming.sort((a, b) => new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime());
        past.sort((a, b) => new Date(b.check_out_date).getTime() - new Date(a.check_out_date).getTime());
        return { upcoming, past, cancelled };
    }, [bookings]);

    const visible = buckets[tab];

    const handleCancel = async (id: number) => {
        setConfirmCancelId(null);
        setCancelling(id);
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/bookings/${id}/cancel`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to cancel booking.');
            }
            const updated = await res.json();
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: updated.status } : b));
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Failed to cancel booking.');
        } finally {
            setCancelling(null);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-28 pb-20">
            <div className="max-w-6xl mx-auto px-6 lg:px-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="text-xs uppercase tracking-[0.25em] text-brand-600 mb-2">Your journey</div>
                    <h1 className="font-display text-4xl md:text-5xl text-slate-900">My trips</h1>
                    <p className="text-slate-600 mt-2">Review, manage, and revisit your reservations.</p>
                </div>

                {/* Tabs */}
                <div className="inline-flex bg-white p-1 rounded-full border border-slate-200 mb-8 shadow-sm">
                    {(['upcoming', 'past', 'cancelled'] as Tab[]).map(t => {
                        const count = buckets[t].length;
                        return (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-5 py-2 text-sm font-medium rounded-full capitalize transition ${tab === t ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                {t}
                                <span className={`ml-2 text-xs ${tab === t ? 'text-white/70' : 'text-slate-400'}`}>({count})</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-pulse">
                                <div className="grid md:grid-cols-[240px_1fr]">
                                    <div className="aspect-[4/3] md:aspect-auto bg-slate-200" />
                                    <div className="p-6 space-y-3">
                                        <div className="h-6 bg-slate-200 rounded w-1/2" />
                                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                                        <div className="h-3 bg-slate-100 rounded w-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-6 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
                ) : visible.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
                        <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <div className="font-display text-2xl text-slate-900 mb-1">No {tab} trips</div>
                        <div className="text-sm text-slate-500 mb-5">
                            {tab === 'upcoming' && 'When you make a reservation, it will appear here.'}
                            {tab === 'past' && 'Bookings you\'ve completed will appear here.'}
                            {tab === 'cancelled' && 'Cancelled bookings appear here.'}
                        </div>
                        <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-brand-700">
                            Browse stays
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {visible.map(b => (
                            <BookingRow
                                key={b.id}
                                booking={b}
                                onCancel={id => setConfirmCancelId(id)}
                                cancelling={cancelling}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel confirmation modal */}
            {confirmCancelId !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setConfirmCancelId(null)}
                >
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="font-display text-2xl text-slate-900 mb-2">Cancel this reservation?</h3>
                        <p className="text-sm text-slate-600 mb-6">
                            This action can't be undone. Your booking will be released, and if applicable, refund processing takes 5-7 business days.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmCancelId(null)}
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100"
                            >
                                Keep booking
                            </button>
                            <button
                                onClick={() => handleCancel(confirmCancelId)}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
                            >
                                Yes, cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
