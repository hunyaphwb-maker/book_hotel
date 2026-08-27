import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Experience {
    id: string;
    title: string;
    location: string;
    category: 'Culinary' | 'Wellness' | 'Adventure' | 'Cultural';
    duration: string;
    priceFrom: number;
    image: string;
    tagline: string;
    description: string;
    highlights: string[];
}

const EXPERIENCES: Experience[] = [
    {
        id: 'island-hopping-el-nido',
        title: 'Private Island-Hopping in Bacuit Bay',
        location: 'El Nido, Palawan',
        category: 'Adventure',
        duration: 'Full day · 8 hrs',
        priceFrom: 8500,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
        tagline: 'A private banca. Four lagoons. One unforgettable day.',
        description:
            'Chartered banca departs at dawn from your hotel jetty. Snorkel over pristine coral gardens in Small Lagoon, picnic under the limestone karsts of Secret Beach, and finish with sunset drinks anchored off Shimizu Island.',
        highlights: ['Private outrigger & captain', 'Chef-prepared beach lunch', 'Snorkel gear included'],
    },
    {
        id: 'chocolate-hills-heritage-bohol',
        title: 'Bohol Heritage & Chocolate Hills',
        location: 'Carmen, Bohol',
        category: 'Cultural',
        duration: 'Full day · 10 hrs',
        priceFrom: 6200,
        image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1600&q=80',
        tagline: 'Tarsiers, centuries-old churches, and 1,268 emerald hills.',
        description:
            'Travel with a licensed cultural historian through Bohol\'s countryside — visit the Baclayon Church of 1596, spot Philippine tarsiers in their sanctuary, and lunch on a floating restaurant along the Loboc River.',
        highlights: ['Private historian guide', 'Tarsier sanctuary access', 'Loboc river lunch cruise'],
    },
    {
        id: 'siargao-surf-lesson',
        title: 'Cloud 9 Surf Sessions with a Local Pro',
        location: 'General Luna, Siargao',
        category: 'Adventure',
        duration: '3 hrs · morning',
        priceFrom: 3800,
        image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=80',
        tagline: 'Learn to read the reef break with a champion surfer.',
        description:
            'Two-on-one instruction with a Siargao Cup medalist. Board rentals, water photography and a post-surf coconut coffee at Kermit Café included.',
        highlights: ['Board & rashguard rental', 'GoPro footage of your session', 'Skill-appropriate break'],
    },
    {
        id: 'batad-rice-terraces-trek',
        title: 'Sunrise Trek Through the Batad Rice Terraces',
        location: 'Banaue, Ifugao',
        category: 'Adventure',
        duration: '2 days · 1 night',
        priceFrom: 14500,
        image: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=1600&q=80',
        tagline: 'A UNESCO wonder, walked slowly and at first light.',
        description:
            'Overnight in a family-run guesthouse in the amphitheatre village of Batad. Trek to Tappiya Falls, share coffee with local Ifugao farmers, and wake for a sunrise you\'ll remember for decades.',
        highlights: ['Certified Ifugao guide', 'Homestay with dinner', 'Tappiya Falls swim stop'],
    },
    {
        id: 'private-halo-halo-masterclass',
        title: 'Private Halo-Halo & Kakanin Masterclass',
        location: 'Vigan, Ilocos Sur',
        category: 'Culinary',
        duration: '3 hrs · afternoon',
        priceFrom: 4200,
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1600&q=80',
        tagline: 'A dessert lesson in a 200-year-old ancestral kitchen.',
        description:
            'Chef Rosa welcomes you into her family\'s Spanish-era casa to prepare regional kakanin, empanada Vigan and a proper layered halo-halo. Recipes and heirloom tsokolatera to take home.',
        highlights: ['Small groups (max 6)', 'Wine pairing available', 'Take-home recipe booklet'],
    },
    {
        id: 'coron-wreck-diving',
        title: 'Coron WWII Wreck-Diving Expedition',
        location: 'Coron, Palawan',
        category: 'Adventure',
        duration: '2 dives · half day',
        priceFrom: 7500,
        image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=1600&q=80',
        tagline: 'Descend on Japanese warships lost since 1944.',
        description:
            'PADI-certified divemasters lead you through the Irako and Okikawa Maru wrecks — some of the finest wreck dives in the world, now home to reef sharks, batfish and vibrant soft coral.',
        highlights: ['PADI Advanced required', 'Nitrox available', 'Underwater photography add-on'],
    },
    {
        id: 'baguio-forest-bathing',
        title: 'Forest Bathing in Camp John Hay',
        location: 'Baguio City',
        category: 'Wellness',
        duration: '2.5 hrs · early morning',
        priceFrom: 3200,
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
        tagline: 'The Japanese practice of shinrin-yoku, Cordillera-style.',
        description:
            'A certified forest therapy guide leads a slow, sensory walk through the pines of Camp John Hay. Ends with a warm ginger tea ceremony among the cedars.',
        highlights: ['Certified therapy guide', 'Herbal tea ceremony', 'Journal & pen provided'],
    },
    {
        id: 'chef-tasting-menu-siargao',
        title: 'Chef\'s Table at Kalinaw Resort',
        location: 'General Luna, Siargao',
        category: 'Culinary',
        duration: '3 hrs · evening',
        priceFrom: 9800,
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80',
        tagline: 'Seven courses. Ocean caught that morning.',
        description:
            'Sit at the pass with chef Sabrina Migadel for an intimate seven-course tasting menu built around the day\'s catch. Wine pairing from her personal cellar.',
        highlights: ['7 courses + amuse-bouche', 'Optional wine pairing', 'Reserved for 6 guests / night'],
    },
    {
        id: 'kalesa-vigan-heritage',
        title: 'Kalesa Ride Through Calle Crisologo',
        location: 'Vigan, Ilocos Sur',
        category: 'Cultural',
        duration: '90 minutes · dusk',
        priceFrom: 1800,
        image: 'https://images.unsplash.com/photo-1587058308569-fee8ba60c50c?auto=format&fit=crop&w=1600&q=80',
        tagline: 'Cobblestones, gas lamps, and 400 years of Ilocano history.',
        description:
            'A private horse-drawn kalesa collects you at dusk. Wind through the UNESCO-listed heritage village as your driver-guide shares stories of merchants, revolutionaries and the Ilocano diaspora.',
        highlights: ['Private carriage', 'Local historian narration', 'Photo stops included'],
    },
];

const CATEGORIES: Array<Experience['category'] | 'All'> = ['All', 'Culinary', 'Wellness', 'Adventure', 'Cultural'];

function ExperienceCard({ exp }: { exp: Experience }) {
    return (
        <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                    {exp.category}
                </div>
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded-full text-[11px]">
                    {exp.duration}
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{exp.location}</span>
                </div>
                <h3 className="font-display text-xl text-slate-900 mb-2 leading-tight">{exp.title}</h3>
                <p className="text-sm text-slate-600 italic mb-4">{exp.tagline}</p>
                <ul className="space-y-1.5 mb-5">
                    {exp.highlights.map(h => (
                        <li key={h} className="flex items-center gap-2 text-xs text-slate-600">
                            <svg className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            {h}
                        </li>
                    ))}
                </ul>
                <div className="mt-auto pt-5 border-t border-slate-100 flex items-end justify-between">
                    <div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-400">From</div>
                        <div className="font-display text-xl text-slate-900">₱{exp.priceFrom.toLocaleString()}<span className="text-xs text-slate-500 font-sans"> / guest</span></div>
                    </div>
                    <button className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                        Reserve
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function ExperiencesPage() {
    const [filter, setFilter] = useState<Experience['category'] | 'All'>('All');
    const visible = filter === 'All' ? EXPERIENCES : EXPERIENCES.filter(e => e.category === filter);

    return (
        <div>
            {/* Hero */}
            <section className="relative min-h-[62vh] flex items-end overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1518509562904-e7ef99cddc85?auto=format&fit=crop&w=2000&q=80"
                        alt="Palawan seascape"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/85" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-20 pt-40 w-full">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur text-white text-xs uppercase tracking-[0.25em] mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                        Curated Experiences
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.05] max-w-4xl">
                        Beyond the room.<br />
                        <span className="italic text-gold-400">Into the archipelago.</span>
                    </h1>
                    <p className="mt-6 text-lg text-white/80 max-w-2xl leading-relaxed">
                        Journeys designed by our concierges and local partners — from wreck-dives in Coron to
                        forest-bathing walks under Baguio pines. Each experience is private, small-group, and reservable only through Angelo.
                    </p>
                </div>
            </section>

            {/* Editorial strip */}
            <section className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid md:grid-cols-3 gap-10">
                    {[
                        { stat: '92', label: 'Curated experiences across 14 provinces' },
                        { stat: '38', label: 'Local partners, guides & artisans' },
                        { stat: '4.9', label: 'Average guest rating across all bookings' },
                    ].map(s => (
                        <div key={s.label} className="border-l-2 border-gold-500 pl-6">
                            <div className="font-display text-5xl text-slate-900 leading-none mb-2">{s.stat}</div>
                            <div className="text-sm text-slate-600 leading-snug">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Filter bar */}
            <section className="bg-slate-50 sticky top-0 z-20 border-b border-slate-200 backdrop-blur bg-slate-50/95">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center gap-2 overflow-x-auto scrollbar-thin">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${filter === cat ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-700 hover:bg-white'}`}
                        >
                            {cat}
                            {cat !== 'All' && (
                                <span className={`ml-1.5 ${filter === cat ? 'text-white/60' : 'text-slate-400'}`}>
                                    ({EXPERIENCES.filter(e => e.category === cat).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
                <div className="mb-10">
                    <div className="text-xs uppercase tracking-[0.25em] text-brand-600 mb-2">The Journal</div>
                    <h2 className="font-display text-4xl text-slate-900">
                        {filter === 'All' ? 'All experiences' : `${filter} experiences`}
                    </h2>
                    <p className="text-slate-600 mt-2">{visible.length} available for booking</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visible.map(e => <ExperienceCard key={e.id} exp={e} />)}
                </div>
            </section>

            {/* Editorial feature */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
                            alt="Concierge"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur p-5 rounded-2xl">
                            <div className="text-[11px] uppercase tracking-[0.2em] text-brand-600 mb-1">Meet your concierge</div>
                            <div className="font-display text-lg text-slate-900">Miguel Fernandez</div>
                            <div className="text-xs text-slate-500">Head of Experiences · 12 yrs local hospitality</div>
                        </div>
                    </div>
                    <div>
                        <div className="text-xs uppercase tracking-[0.25em] text-brand-600 mb-3">Bespoke journeys</div>
                        <h2 className="font-display text-4xl md:text-5xl text-slate-900 leading-tight mb-6">
                            Don't see what you're looking for? We'll design it.
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-8">
                            Our concierge team crafts private itineraries for guests seeking something entirely their own —
                            a proposal on a private sandbar, a helicopter transfer to Batanes, a multi-generational family
                            reunion across three islands. Tell us the story you want to write; we'll handle the details.
                        </p>
                        <div className="space-y-4 mb-8">
                            {[
                                'Dedicated concierge from booking to check-out',
                                'Private transfers, permits and dining reservations',
                                '24/7 in-country support in English, Tagalog and Ilocano',
                            ].map(item => (
                                <div key={item} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-sm text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>
                        <Link to="/contact" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-brand-800 text-white px-6 py-3.5 rounded-full text-sm font-semibold transition">
                            Speak with a concierge
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
