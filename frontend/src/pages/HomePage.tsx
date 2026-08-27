import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../lib/api';

interface Hotel {
    id: number;
    address: string;
    name: string;
    description: string;
    image_url: string;
}

function HotelCard({ hotel }: { hotel: Hotel }) {
    return (
        <Link
            to={`/hotel/${hotel.id}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={hotel.image_url}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                    Boutique
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.169c.969 0 1.371 1.24.588 1.81l-3.374 2.454a1 1 0 00-.363 1.118l1.286 3.966c.3.922-.755 1.688-1.54 1.118L10 15.347l-3.374 2.454c-.784.57-1.838-.196-1.54-1.118l1.286-3.966a1 1 0 00-.363-1.118L2.635 9.145c-.783-.57-.38-1.81.588-1.81h4.169a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                    4.9
                </div>
            </div>
            <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display text-xl text-slate-900 group-hover:text-brand-700 transition">
                        {hotel.name}
                    </h3>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-1">{hotel.address}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{hotel.description}</p>
                <div className="mt-5 pt-5 border-t border-slate-100 flex items-end justify-between">
                    <div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-400">From</div>
                        <div className="font-display text-lg text-slate-900">₱6,500<span className="text-sm text-slate-500 font-sans"> / night</span></div>
                    </div>
                    <span className="text-sm font-medium text-brand-600 group-hover:text-brand-700 flex items-center gap-1">
                        Explore
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}

const DESTINATIONS = [
    { name: 'Palawan', count: 12, img: 'https://images.unsplash.com/photo-1518509562904-e7ef99cddc85?auto=format&fit=crop&w=600&q=80' },
    { name: 'Boracay', count: 9, img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80' },
    { name: 'Cebu', count: 8, img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80' },
    { name: 'Siargao', count: 7, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Batanes', count: 5, img: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Vigan', count: 6, img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80' },
];

const POPULAR_CITIES = ['Palawan', 'Boracay', 'Cebu', 'Siargao', 'Batanes', 'Vigan', 'Baguio', 'Manila', 'Bohol', 'Davao', 'Ilocos', 'Camiguin'];

interface HeroProps {
    hotels: Hotel[];
    query: string;
    setQuery: (q: string) => void;
    onSelectHotel: (hotelId: number) => void;
    onSelectCity: (city: string) => void;
    onSearch: () => void;
}

function Hero({ hotels, query, setQuery, onSelectHotel, onSelectCity, onSearch }: HeroProps) {
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const q = query.trim().toLowerCase();

    const matchingHotels = useMemo(() => {
        if (!q) return [];
        return hotels
            .filter(h => h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q))
            .slice(0, 5);
    }, [q, hotels]);

    const matchingCities = useMemo(() => {
        if (!q) return POPULAR_CITIES.slice(0, 6);
        return POPULAR_CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 6);
    }, [q]);

    const showDropdown = isFocused;

    return (
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80"
                    alt="Luxury hotel"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/85" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-32 w-full">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur text-white text-xs uppercase tracking-[0.25em] mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                        Proudly Filipino · 24 Destinations
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.05] mb-6">
                        Discover the Philippines,<br />
                        <span className="italic text-gold-400">one boutique stay at a time.</span>
                    </h1>
                    <p className="text-lg text-white/80 max-w-2xl mb-10 leading-relaxed">
                        A hand-picked collection of beach resorts, heritage inns, and city hideaways —
                        from Palawan's turquoise coves to Baguio's pine-scented highlands.
                    </p>
                </div>

                <div ref={containerRef} className="relative bg-white rounded-2xl shadow-2xl p-3 max-w-5xl">
                    <form
                        onSubmit={e => { e.preventDefault(); onSearch(); setIsFocused(false); }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-2"
                    >
                        <div className="md:col-span-4 px-4 py-3 border-r border-slate-100 relative">
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Destination</label>
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                placeholder="Where are you going?"
                                className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                            />
                        </div>
                        <div className="md:col-span-3 px-4 py-3 border-r border-slate-100">
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Check-In</label>
                            <input type="date" className="w-full text-sm font-medium text-slate-900 focus:outline-none" />
                        </div>
                        <div className="md:col-span-3 px-4 py-3 border-r border-slate-100">
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Check-Out</label>
                            <input type="date" className="w-full text-sm font-medium text-slate-900 focus:outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full h-full bg-brand-900 hover:bg-brand-800 text-white rounded-xl px-5 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Autocomplete Dropdown */}
                    {showDropdown && (
                        <div className="absolute left-3 right-3 md:left-3 md:right-auto md:w-[420px] top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-30 max-h-[420px] overflow-y-auto scrollbar-thin">
                            {matchingHotels.length > 0 && (
                                <div>
                                    <div className="px-5 pt-4 pb-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Properties</div>
                                    {matchingHotels.map(h => (
                                        <button
                                            key={h.id}
                                            type="button"
                                            onMouseDown={e => e.preventDefault()}
                                            onClick={() => { onSelectHotel(h.id); setIsFocused(false); }}
                                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-left transition"
                                        >
                                            <img src={h.image_url} alt="" className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-slate-900 truncate">{h.name}</div>
                                                <div className="text-xs text-slate-500 truncate">{h.address}</div>
                                            </div>
                                            <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {matchingCities.length > 0 && (
                                <div className={matchingHotels.length > 0 ? 'border-t border-slate-100' : ''}>
                                    <div className="px-5 pt-4 pb-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                                        {q ? 'Destinations' : 'Popular destinations'}
                                    </div>
                                    {matchingCities.map(city => (
                                        <button
                                            key={city}
                                            type="button"
                                            onMouseDown={e => e.preventDefault()}
                                            onClick={() => { onSelectCity(city); setIsFocused(false); }}
                                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-left transition"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-slate-900">{city}</div>
                                                <div className="text-xs text-slate-500">Philippines</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {q && matchingHotels.length === 0 && matchingCities.length === 0 && (
                                <div className="px-5 py-10 text-center text-sm text-slate-500">
                                    No results for "<span className="font-medium text-slate-700">{query}</span>".
                                    <div className="text-xs text-slate-400 mt-1">Try Palawan, Cebu, or Boracay.</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-12 flex flex-wrap items-center gap-8 text-white/70 text-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Best Price Guarantee
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.169c.969 0 1.371 1.24.588 1.81l-3.374 2.454a1 1 0 00-.363 1.118l1.286 3.966c.3.922-.755 1.688-1.54 1.118L10 15.347l-3.374 2.454c-.784.57-1.838-.196-1.54-1.118l1.286-3.966a1 1 0 00-.363-1.118L2.635 9.145c-.783-.57-.38-1.81.588-1.81h4.169a1 1 0 00.95-.69l1.286-3.966z" /></svg>
                        4.8 avg guest rating
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        24/7 concierge service
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function HomePage() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch(`${API_URL}/api/hotels`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setHotels(data);
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : 'Failed to load hotels');
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    const scrollToCollection = () => {
        setTimeout(() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }), 50);
    };

    const handleSelectHotel = (hotelId: number) => navigate(`/hotel/${hotelId}`);
    const handleSelectCity = (city: string) => {
        setQuery(city);
        setActiveFilter(city);
        scrollToCollection();
    };
    const handleSearch = () => {
        setActiveFilter(query);
        scrollToCollection();
    };
    const clearFilter = () => {
        setActiveFilter('');
        setQuery('');
    };

    const filteredHotels = useMemo(() => {
        const q = activeFilter.trim().toLowerCase();
        if (!q) return hotels;
        return hotels.filter(h =>
            h.name.toLowerCase().includes(q) ||
            h.address.toLowerCase().includes(q) ||
            h.description.toLowerCase().includes(q)
        );
    }, [hotels, activeFilter]);

    return (
        <div>
            <Hero
                hotels={hotels}
                query={query}
                setQuery={setQuery}
                onSelectHotel={handleSelectHotel}
                onSelectCity={handleSelectCity}
                onSearch={handleSearch}
            />

            {/* Destinations */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="text-xs uppercase tracking-[0.25em] text-brand-600 mb-2">Where to next</div>
                        <h2 className="font-display text-4xl text-slate-900">Trending destinations</h2>
                    </div>
                    <a href="#collection" className="text-sm font-medium text-slate-700 hover:text-brand-600 hidden md:block">View all destinations →</a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {DESTINATIONS.map(d => (
                        <button
                            type="button"
                            onClick={() => handleSelectCity(d.name)}
                            key={d.name}
                            className="group relative aspect-[3/4] rounded-2xl overflow-hidden text-left"
                        >
                            <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <div className="font-display text-lg">{d.name}</div>
                                <div className="text-xs text-white/80">{d.count} properties</div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Hotels Collection */}
            <section id="collection" className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                        <div>
                            <div className="text-xs uppercase tracking-[0.25em] text-brand-600 mb-2">The Collection</div>
                            <h2 className="font-display text-4xl text-slate-900">
                                {activeFilter ? `Results for "${activeFilter}"` : 'Featured properties'}
                            </h2>
                            <p className="text-slate-600 mt-3 max-w-xl">
                                {activeFilter
                                    ? `${filteredHotels.length} ${filteredHotels.length === 1 ? 'property' : 'properties'} matching your search.`
                                    : 'Hand-picked hotels loved by our editors and guests alike — each with a story worth telling.'}
                            </p>
                        </div>
                        {activeFilter ? (
                            <button
                                onClick={clearFilter}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-100 self-start md:self-auto"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                Clear filter
                            </button>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                <button className="px-4 py-2 rounded-full text-xs font-medium bg-slate-900 text-white">All</button>
                                <button onClick={() => handleSelectCity('Boracay')} className="px-4 py-2 rounded-full text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-100">Beachfront</button>
                                <button onClick={() => handleSelectCity('Cebu')} className="px-4 py-2 rounded-full text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-100">City</button>
                                <button onClick={() => handleSelectCity('Vigan')} className="px-4 py-2 rounded-full text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-100">Heritage</button>
                                <button onClick={() => handleSelectCity('Baguio')} className="px-4 py-2 rounded-full text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-100">Mountain</button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-6 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                                    <div className="aspect-[4/3] bg-slate-200" />
                                    <div className="p-6 space-y-3">
                                        <div className="h-5 bg-slate-200 rounded w-3/4" />
                                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                                        <div className="h-3 bg-slate-100 rounded w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredHotels.length === 0 ? (
                        <div className="p-16 text-center rounded-2xl border border-dashed border-slate-200">
                            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <div className="font-display text-xl text-slate-900 mb-1">No properties found</div>
                            <div className="text-sm text-slate-500 mb-5">We couldn't find any hotels matching "{activeFilter}".</div>
                            <button onClick={clearFilter} className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-brand-700 transition">
                                Show all properties
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredHotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* Experiences Section */}
            <section id="experiences" className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="text-xs uppercase tracking-[0.25em] text-brand-600 mb-2">The Angelo promise</div>
                    <h2 className="font-display text-4xl text-slate-900">Small details. Grand experiences.</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Curated by hand', desc: 'Every property is visited and vetted by our editorial team before being welcomed into the collection.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                        { title: 'Concierge access', desc: 'From private tables to hard-to-find reservations — our team is on call, day or night, wherever you stay.', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                        { title: 'Rewarding loyalty', desc: 'Complimentary upgrades, late checkouts and members-only rates — automatically applied.', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
                    ].map(item => (
                        <div key={item.title} className="p-8 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition">
                            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                            </div>
                            <h3 className="font-display text-xl text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-10">
                    <Link to="/experiences" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
                        Browse all experiences
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-12 md:p-16">
                    <div className="absolute inset-0 opacity-30">
                        <img src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1600&q=80" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative max-w-2xl">
                        <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Become an Angelo member</h2>
                        <p className="text-white/80 mb-8 leading-relaxed">
                            Enjoy up to 20% off your first stay, complimentary room upgrades, and exclusive access to properties before they open to the public.
                        </p>
                        <Link to="/register" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-6 py-3.5 rounded-full text-sm font-semibold transition">
                            Join the collection
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
