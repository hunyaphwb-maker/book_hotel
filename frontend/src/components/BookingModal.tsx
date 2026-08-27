import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface BookingModalProps {
    roomId: number;
    roomType?: string;
    pricePerNight: number;
    onClose: () => void;
    onBookingSuccess: (bookingDetails: unknown) => void;
}

export default function BookingModal({ roomId, roomType, pricePerNight, onClose, onBookingSuccess }: BookingModalProps) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previousOverflow; };
    }, []);

    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn).getTime();
        const end = new Date(checkOut).getTime();
        const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    }, [checkIn, checkOut]);

    const roomTotal = nights * pricePerNight;
    const taxes = roomTotal * 0.12;
    const grandTotal = roomTotal + taxes;

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (nights < 1) {
            setError('Please choose a check-out date after your check-in.');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    room_id: Number(roomId),
                    check_in_date: checkIn,
                    check_out_date: checkOut,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 401) { navigate('/login'); return; }
                if (response.status === 409) {
                    throw new Error(data.message || 'This room is no longer available for the selected dates.');
                }
                if (response.status === 422) {
                    const messages = Object.values(data.errors ?? data).flat().join(' ');
                    throw new Error(messages as string);
                }
                throw new Error(data.message || 'Failed to create booking.');
            }
            onBookingSuccess(data);
            onClose();
            if (data.id) {
                navigate(`/booking/confirmation/${data.id}`);
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Booking failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto scrollbar-thin"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative">
                    <div className="h-40 relative overflow-hidden rounded-t-3xl">
                        <img
                            src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"
                            alt="Room"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-700 flex items-center justify-center transition"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="absolute bottom-4 left-6 text-white">
                            <div className="text-[10px] uppercase tracking-[0.25em] text-white/80">Reserve your stay</div>
                            <div className="font-display text-2xl">{roomType ?? 'Selected Room'}</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {!isAuthenticated && (
                        <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            Please <a href="/login" className="font-semibold underline">sign in</a> to complete your reservation.
                        </div>
                    )}

                    {isAuthenticated && user && (
                        <div className="mb-5 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900 truncate">{user.name}</div>
                                <div className="text-xs text-slate-500 truncate">{user.email}</div>
                            </div>
                            <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold uppercase tracking-wider">Verified</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">Check-in</label>
                                <input
                                    type="date"
                                    min={today}
                                    value={checkIn}
                                    onChange={e => setCheckIn(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">Check-out</label>
                                <input
                                    type="date"
                                    min={checkIn || today}
                                    value={checkOut}
                                    onChange={e => setCheckOut(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">Guests</label>
                            <div className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl">
                                <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600">−</button>
                                <div className="flex-1 text-center font-medium text-slate-900">{guests} {guests === 1 ? 'guest' : 'guests'}</div>
                                <button type="button" onClick={() => setGuests(Math.min(6, guests + 1))} className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600">+</button>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-5">
                            <div className="flex items-center justify-between text-sm mb-3">
                                <span className="text-slate-600">₱{pricePerNight.toLocaleString()} × {nights || 0} {nights === 1 ? 'night' : 'nights'}</span>
                                <span className="font-medium text-slate-900">₱{roomTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mb-3">
                                <span className="text-slate-600">Taxes & service fees</span>
                                <span className="font-medium text-slate-900">₱{taxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="pt-3 border-t border-slate-200 flex items-end justify-between">
                                <span className="text-sm font-semibold text-slate-900">Total</span>
                                <span className="font-display text-2xl text-slate-900">₱{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 px-5 py-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? 'Confirming…' : isAuthenticated ? `Confirm reservation${nights > 0 ? ` · ₱${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}` : 'Sign in to book'}
                            </button>
                        </div>

                        <p className="text-[11px] text-slate-500 text-center pt-2">
                            You won't be charged yet. Free cancellation up to 48 hours before check-in.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
