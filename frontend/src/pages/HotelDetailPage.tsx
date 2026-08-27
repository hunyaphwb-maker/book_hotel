import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import { API_URL } from '../lib/api';

interface Hotel {
    id: number;
    name: string;
    address: string;
    description: string;
    image_url: string;
}

interface Room {
    id: number;
    hotel_id: number;
    room_type: string;
    price_per_night: number;
    description: string;
}

const AMENITIES = [
    { label: 'Rooftop pool', icon: 'M2 15c.83.5 1.71 1 3.5 1s2.67-.5 3.5-1 1.71-1 3.5-1 2.67.5 3.5 1 1.71 1 3.5 1 2.67-.5 3.5-1M2 19c.83.5 1.71 1 3.5 1s2.67-.5 3.5-1 1.71-1 3.5-1 2.67.5 3.5 1 1.71 1 3.5 1 2.67-.5 3.5-1' },
    { label: 'Signature spa', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { label: 'Farm-to-table dining', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Complimentary Wi-Fi', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' },
    { label: 'Airport transfer', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
    { label: 'Fitness centre', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Pet friendly', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { label: 'Butler service', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

function RoomCard({ room, onBookNow }: { room: Room; onBookNow: (roomId: number) => void }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="grid md:grid-cols-5">
                <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto">
                    <img
                        src={`https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80`}
                        alt={room.room_type}
                        className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 text-slate-700 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        Available
                    </span>
                </div>
                <div className="md:col-span-3 p-6 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                            <h3 className="font-display text-2xl text-slate-900 mb-1">{room.room_type}</h3>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    2 guests
                                </span>
                                <span>·</span>
                                <span>King bed</span>
                                <span>·</span>
                                <span>32 m²</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-2">
                        {room.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {['Ocean view', 'Marble bath', 'Nespresso', 'Rain shower'].map(tag => (
                            <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{tag}</span>
                        ))}
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between gap-4">
                        <div>
                            <div className="font-display text-2xl text-slate-900">
                                ₱{Number(room.price_per_night).toLocaleString()}
                                <span className="text-sm text-slate-500 font-sans font-normal"> / night</span>
                            </div>
                            <div className="text-[11px] text-slate-500">Includes taxes & fees</div>
                        </div>
                        <button
                            onClick={() => onBookNow(Number(room.id))}
                            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-brand-700 text-white text-sm font-semibold transition flex items-center gap-2"
                        >
                            Reserve
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HotelDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                setBookingSuccess(false);

                const [hotelRes, roomsRes] = await Promise.all([
                    fetch(`${API_URL}/api/hotels/${id}`),
                    fetch(`${API_URL}/api/hotels/${id}/rooms`),
                ]);
                if (!hotelRes.ok || !roomsRes.ok) throw new Error('Failed to fetch hotel data.');

                const hotelData: Hotel = await hotelRes.json();
                const roomsRaw = await roomsRes.json();
                const roomsData: Room[] = Array.isArray(roomsRaw) ? roomsRaw : (roomsRaw.data ?? []);

                setHotel(hotelData);
                setRooms(roomsData);
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : 'An error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleOpenBooking = (roomId: number) => setSelectedRoomId(roomId);
    const handleCloseBooking = () => setSelectedRoomId(null);
    const handleBookingSuccess = () => {
        setSelectedRoomId(null);
        setBookingSuccess(true);
        setTimeout(() => setBookingSuccess(false), 5000);
    };
    const selectedRoom = selectedRoomId !== null ? rooms.find(r => Number(r.id) === selectedRoomId) ?? null : null;
    const minPrice = rooms.length ? Math.min(...rooms.map(r => Number(r.price_per_night))) : 0;

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
                <div className="animate-pulse space-y-6">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-[400px] bg-slate-200 rounded-3xl" />
                    <div className="h-10 w-1/2 bg-slate-200 rounded" />
                    <div className="h-4 w-3/4 bg-slate-200 rounded" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                <div className="inline-block bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                    <div className="font-medium">Something went wrong</div>
                    <div className="text-sm mt-1">{error}</div>
                </div>
            </div>
        );
    }

    if (!hotel) {
        return <div className="max-w-3xl mx-auto px-6 py-20 text-center text-slate-600">Hotel not found.</div>;
    }

    return (
        <>
            {bookingSuccess && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="text-sm font-medium">Your reservation is confirmed. A confirmation email is on its way.</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-20">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                    <Link to="/" className="hover:text-brand-600">Home</Link>
                    <span>/</span>
                    <Link to="/" className="hover:text-brand-600">Collection</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">{hotel.name}</span>
                </nav>

                {/* Hotel header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-[10px] font-semibold uppercase tracking-wider">Boutique</span>
                            <span className="flex items-center gap-1 text-sm text-slate-700">
                                <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.169c.969 0 1.371 1.24.588 1.81l-3.374 2.454a1 1 0 00-.363 1.118l1.286 3.966c.3.922-.755 1.688-1.54 1.118L10 15.347l-3.374 2.454c-.784.57-1.838-.196-1.54-1.118l1.286-3.966a1 1 0 00-.363-1.118L2.635 9.145c-.783-.57-.38-1.81.588-1.81h4.169a1 1 0 00.95-.69l1.286-3.966z" /></svg>
                                <span className="font-semibold">4.9</span>
                                <span className="text-slate-500">· 384 reviews</span>
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl text-slate-900 mb-2">{hotel.name}</h1>
                        <div className="flex items-center gap-2 text-slate-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="text-sm">{hotel.address}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-100 transition" aria-label="Share">
                            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 3.026a3 3 0 100-2.684m0 0a3 3 0 10-.026-2.684m.026 2.684a3 3 0 010 2.684M6.316 10.658L15 6" /></svg>
                        </button>
                        <button className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-100 transition" aria-label="Save">
                            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </button>
                    </div>
                </div>

                {/* Gallery */}
                <div className="grid grid-cols-4 grid-rows-2 gap-3 rounded-3xl overflow-hidden h-[520px] mb-16">
                    <div className="col-span-2 row-span-2 relative">
                        <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80" alt="Suite" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80" alt="Bathroom" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80" alt="Pool" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80" alt="Dining" className="w-full h-full object-cover" />
                        <button className="absolute bottom-4 right-4 bg-white/95 text-slate-900 text-xs font-semibold px-4 py-2 rounded-full shadow hover:bg-white">
                            View all photos
                        </button>
                    </div>
                </div>

                {/* Content grid */}
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-14">
                        {/* About */}
                        <section>
                            <h2 className="font-display text-2xl text-slate-900 mb-4">About this stay</h2>
                            <p className="text-slate-600 leading-relaxed">{hotel.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-100">
                                {[
                                    { label: 'Guests', value: 'Up to 2' },
                                    { label: 'Rooms', value: `${rooms.length} suites` },
                                    { label: 'Check-in', value: 'From 3:00 PM' },
                                    { label: 'Check-out', value: 'Until 12:00 PM' },
                                ].map(item => (
                                    <div key={item.label}>
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">{item.label}</div>
                                        <div className="font-medium text-slate-900">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Amenities */}
                        <section>
                            <h2 className="font-display text-2xl text-slate-900 mb-6">Amenities & services</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {AMENITIES.map(a => (
                                    <div key={a.label} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition">
                                        <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={a.icon} /></svg>
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{a.label}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Rooms */}
                        <section>
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <h2 className="font-display text-2xl text-slate-900">Choose your room</h2>
                                    <p className="text-sm text-slate-500 mt-1">Best available rates. Free cancellation up to 48 hours before arrival.</p>
                                </div>
                                <div className="hidden md:block text-xs text-slate-500">
                                    {rooms.length} rooms available
                                </div>
                            </div>
                            <div className="space-y-4">
                                {rooms.length > 0 ? (
                                    rooms.map(room => (
                                        <RoomCard key={room.id} room={room} onBookNow={handleOpenBooking} />
                                    ))
                                ) : (
                                    <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 text-slate-500">
                                        No rooms available at this property.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sticky sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="lg:sticky lg:top-8 space-y-4">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                                <div className="flex items-end justify-between mb-1">
                                    <div>
                                        <div className="text-[11px] uppercase tracking-wider text-slate-500">From</div>
                                        <div className="font-display text-3xl text-slate-900">₱{minPrice.toLocaleString()}</div>
                                    </div>
                                    <div className="text-xs text-slate-500 mb-1">per night</div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-600 mb-6">
                                    <svg className="w-3.5 h-3.5 text-gold-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.169c.969 0 1.371 1.24.588 1.81l-3.374 2.454a1 1 0 00-.363 1.118l1.286 3.966c.3.922-.755 1.688-1.54 1.118L10 15.347l-3.374 2.454c-.784.57-1.838-.196-1.54-1.118l1.286-3.966a1 1 0 00-.363-1.118L2.635 9.145c-.783-.57-.38-1.81.588-1.81h4.169a1 1 0 00.95-.69l1.286-3.966z" /></svg>
                                    <span className="font-semibold">4.9</span>
                                    <span className="text-slate-400">· 384 reviews</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="border border-slate-200 rounded-xl p-3">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Check-in</div>
                                        <input type="date" className="w-full text-sm font-medium text-slate-900 focus:outline-none bg-transparent" />
                                    </div>
                                    <div className="border border-slate-200 rounded-xl p-3">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Check-out</div>
                                        <input type="date" className="w-full text-sm font-medium text-slate-900 focus:outline-none bg-transparent" />
                                    </div>
                                </div>
                                <div className="border border-slate-200 rounded-xl p-3 mb-5">
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Guests</div>
                                    <select className="w-full text-sm font-medium text-slate-900 focus:outline-none bg-transparent">
                                        <option>2 adults</option>
                                        <option>1 adult</option>
                                        <option>2 adults, 1 child</option>
                                    </select>
                                </div>
                                <button
                                    onClick={() => rooms[0] && handleOpenBooking(Number(rooms[0].id))}
                                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-xl transition"
                                >
                                    Reserve a room
                                </button>
                                <p className="text-[11px] text-slate-500 text-center mt-3">
                                    You won't be charged yet. Free cancellation.
                                </p>
                            </div>

                            <div className="bg-slate-900 text-white rounded-2xl p-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    </div>
                                    <div>
                                        <div className="font-display text-lg mb-1">Concierge desk</div>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            Speak to our travel advisors for tailored recommendations, exclusive rates and private touches.
                                        </p>
                                        <a href="#" className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-500 text-sm font-medium mt-3">
                                            Chat with concierge →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {selectedRoom && (
                <BookingModal
                    roomId={selectedRoom.id}
                    roomType={selectedRoom.room_type}
                    pricePerNight={Number(selectedRoom.price_per_night)}
                    onClose={handleCloseBooking}
                    onBookingSuccess={handleBookingSuccess}
                />
            )}
        </>
    );
}
