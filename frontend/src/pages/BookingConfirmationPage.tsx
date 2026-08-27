import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Booking {
    id: number;
    reference: string | null;
    check_in_date: string;
    check_out_date: string;
    total_price: string | number;
    status: 'confirmed' | 'cancelled';
    created_at: string;
    user?: { name: string; email: string };
    room: {
        id: number;
        room_type: string;
        price_per_night: string | number;
        description?: string;
        hotel: {
            id: number;
            name: string;
            address: string;
            image_url: string;
        };
    };
}

function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function nights(a: string, b: string): number {
    return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

export default function BookingConfirmationPage() {
    const { id } = useParams<{ id: string }>();
    const { token, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (!id || !token) return;
        const load = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/bookings/${id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error(res.status === 404 ? 'Booking not found.' : `HTTP ${res.status}`);
                setBooking(await res.json());
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to load booking.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, token]);

    if (loading) {
        return (
            <div className="pt-28 pb-20 max-w-4xl mx-auto px-6 lg:px-10">
                <div className="bg-white rounded-3xl p-12 animate-pulse space-y-4 border border-slate-100">
                    <div className="h-6 w-40 bg-slate-200 rounded" />
                    <div className="h-10 w-3/4 bg-slate-200 rounded" />
                    <div className="h-4 w-1/2 bg-slate-100 rounded" />
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="pt-28 pb-20 max-w-2xl mx-auto px-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="font-display text-3xl text-slate-900 mb-2">Booking unavailable</h2>
                <p className="text-slate-600 mb-6">{error ?? 'This booking could not be loaded.'}</p>
                <Link to="/my-bookings" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-brand-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold">
                    Back to my trips
                </Link>
            </div>
        );
    }

    const nightsCount = nights(booking.check_in_date, booking.check_out_date);
    const roomTotal = Number(booking.room.price_per_night) * nightsCount;
    const totalPaid = Number(booking.total_price);
    const taxes = totalPaid - roomTotal;
    const isCancelled = booking.status === 'cancelled';

    return (
        <div className="bg-slate-50 min-h-screen pt-28 pb-20">
            <div className="max-w-5xl mx-auto px-6 lg:px-10">
                {/* Success banner */}
                <div className={`rounded-3xl p-8 md:p-10 mb-8 text-white relative overflow-hidden ${isCancelled ? 'bg-slate-700' : 'bg-gradient-to-br from-emerald-600 to-emerald-700'}`}>
                    <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative flex items-start gap-5">
                        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            {isCancelled ? (
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="text-[11px] uppercase tracking-[0.25em] text-white/80 mb-2">
                                {isCancelled ? 'Reservation cancelled' : 'Reservation confirmed'}
                            </div>
                            <h1 className="font-display text-3xl md:text-4xl mb-2 leading-tight">
                                {isCancelled ? 'This booking has been cancelled.' : `Your stay is set, ${user?.name?.split(' ')[0] ?? 'traveller'}.`}
                            </h1>
                            <p className="text-white/85 leading-relaxed max-w-2xl">
                                {isCancelled
                                    ? 'We\'ve released the room. If you paid, refunds are processed within 5-7 business days.'
                                    : `A confirmation email is on its way to ${user?.email}. Save the booking reference below — you'll need it at check-in.`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Reference card */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
                                <div>
                                    <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-1">Booking reference</div>
                                    <div className="font-display text-3xl text-slate-900 tracking-wider">{booking.reference ?? `#${booking.id}`}</div>
                                </div>
                                <div className="text-right sm:text-left">
                                    <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-1">Booked on</div>
                                    <div className="text-sm font-medium text-slate-900">{formatDate(booking.created_at)}</div>
                                </div>
                            </div>

                            {/* Hotel */}
                            <div className="flex gap-4 py-6">
                                <img
                                    src={booking.room.hotel.image_url}
                                    alt={booking.room.hotel.name}
                                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="text-[11px] uppercase tracking-[0.2em] text-brand-600 mb-1">{booking.room.room_type}</div>
                                    <Link to={`/hotel/${booking.room.hotel.id}`} className="font-display text-xl text-slate-900 hover:text-brand-700 block">
                                        {booking.room.hotel.name}
                                    </Link>
                                    <div className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="truncate">{booking.room.hotel.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-3 gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-5">
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Check-in</div>
                                    <div className="font-display text-lg text-slate-900 leading-tight">{formatDate(booking.check_in_date)}</div>
                                    <div className="text-xs text-slate-500 mt-1">From 3:00 PM</div>
                                </div>
                                <div className="flex flex-col items-center justify-center border-x border-slate-200">
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Nights</div>
                                    <div className="font-display text-3xl text-slate-900">{nightsCount}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Check-out</div>
                                    <div className="font-display text-lg text-slate-900 leading-tight">{formatDate(booking.check_out_date)}</div>
                                    <div className="text-xs text-slate-500 mt-1">By 12:00 NN</div>
                                </div>
                            </div>
                        </div>

                        {/* Guest */}
                        {booking.user && (
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-4">Primary guest</div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-lg">
                                        {booking.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900">{booking.user.name}</div>
                                        <div className="text-sm text-slate-500">{booking.user.email}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* What's next */}
                        {!isCancelled && (
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-4">What's next</div>
                                <ol className="space-y-4">
                                    {[
                                        { t: 'Watch your inbox', d: 'A detailed confirmation with your invoice will arrive within a few minutes.' },
                                        { t: 'Prepare for check-in', d: 'Bring a valid ID matching the primary guest name. Check-in opens at 3:00 PM.' },
                                        { t: 'Need to change anything?', d: 'Free cancellation applies up to 48 hours before your check-in date.' },
                                    ].map((step, i) => (
                                        <li key={step.t} className="flex gap-4">
                                            <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{step.t}</div>
                                                <div className="text-sm text-slate-600 mt-0.5">{step.d}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>

                    {/* Price sidebar */}
                    <aside className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm sticky top-28">
                            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-4">Price summary</div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">
                                        ₱{Number(booking.room.price_per_night).toLocaleString()} × {nightsCount} {nightsCount === 1 ? 'night' : 'nights'}
                                    </span>
                                    <span className="font-medium text-slate-900">
                                        ₱{roomTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Taxes & service fees</span>
                                    <span className="font-medium text-slate-900">
                                        ₱{taxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                            <div className="pt-4 mt-4 border-t border-slate-100 flex items-end justify-between">
                                <span className="text-sm font-semibold text-slate-900">Total paid</span>
                                <span className="font-display text-2xl text-slate-900">
                                    ₱{totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="mt-6 space-y-2">
                                <button
                                    onClick={() => window.print()}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-900 hover:bg-brand-700 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                    Print / Save PDF
                                </button>
                                <Link to="/my-bookings" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-medium transition flex items-center justify-center">
                                    Back to my trips
                                </Link>
                            </div>
                            <p className="text-[11px] text-slate-500 text-center mt-4 leading-relaxed">
                                Questions? Contact our concierge at <a href="mailto:concierge@angeloboutique.ph" className="text-brand-600 hover:underline">concierge@angeloboutique.ph</a>
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
