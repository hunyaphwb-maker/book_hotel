import { useState, type FormEvent } from 'react';

const OFFICES = [
    {
        city: 'Manila',
        role: 'Head Office',
        address: 'Level 24, One Ayala Tower · Ayala Avenue, Makati 1226',
        phone: '+63 2 8555 0100',
        email: 'manila@angeloboutique.ph',
        hours: 'Mon–Fri · 9:00 – 18:00 PHT',
        img: 'https://images.unsplash.com/photo-1518509562904-e7ef99cddc85?auto=format&fit=crop&w=800&q=80',
    },
    {
        city: 'Cebu',
        role: 'Visayas Concierge',
        address: 'Cebu IT Park Tower B · Lahug, Cebu City 6000',
        phone: '+63 32 231 4800',
        email: 'cebu@angeloboutique.ph',
        hours: 'Mon–Sat · 8:30 – 19:00 PHT',
        img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
    },
    {
        city: 'Palawan',
        role: 'Island Operations',
        address: 'Rizal Street · Corong-Corong, El Nido 5313',
        phone: '+63 48 723 0212',
        email: 'palawan@angeloboutique.ph',
        hours: 'Daily · 7:00 – 20:00 PHT',
        img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    },
];

const TOPICS = [
    { value: 'reservation', label: 'New reservation enquiry' },
    { value: 'existing', label: 'Existing booking' },
    { value: 'concierge', label: 'Concierge & experiences' },
    { value: 'partnerships', label: 'Partnerships & press' },
    { value: 'careers', label: 'Careers' },
];

export default function ContactPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        topic: 'reservation',
        checkIn: '',
        guests: 2,
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate submission — replace with API call when endpoint exists
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 900);
    };

    return (
        <div>
            {/* Hero */}
            <section className="relative min-h-[52vh] flex items-end overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=2000&q=80"
                        alt="Angelo concierge desk"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-900/85" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-20 pt-40 w-full">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur text-white text-xs uppercase tracking-[0.25em] mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                        We're here, always
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.05] max-w-4xl">
                        A conversation<br />
                        <span className="italic text-gold-400">to begin the journey.</span>
                    </h1>
                    <p className="mt-6 text-lg text-white/80 max-w-2xl leading-relaxed">
                        Our concierges reply personally within four hours — day, night, weekend. Choose the way that suits you.
                    </p>
                </div>
            </section>

            {/* Contact channels */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 -mt-20 relative z-20 mb-20">
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { label: 'Reservations', value: '+63 2 8555 0100', sub: '24 / 7 · toll-free within PH', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                        { label: 'Concierge desk', value: 'concierge@angeloboutique.ph', sub: 'Replies within 4 hours', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                        { label: 'WhatsApp & Viber', value: '+63 917 555 0100', sub: 'Chat with an agent live', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
                    ].map(c => (
                        <div key={c.label} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={c.icon} /></svg>
                            </div>
                            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-1">{c.label}</div>
                            <div className="font-display text-lg text-slate-900 mb-1">{c.value}</div>
                            <div className="text-xs text-slate-500">{c.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Form + Info split */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
                <div className="grid lg:grid-cols-5 gap-10">
                    {/* Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-8 md:p-10">
                            {submitted ? (
                                <div className="py-16 text-center">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="font-display text-3xl text-slate-900 mb-2">Message received</h3>
                                    <p className="text-slate-600 max-w-md mx-auto">
                                        Thank you, {form.name.split(' ')[0] || 'traveller'}. A concierge will personally reply to <span className="font-medium text-slate-900">{form.email}</span> within four hours.
                                    </p>
                                    <button
                                        onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', topic: 'reservation', checkIn: '', guests: 2, message: '' }); }}
                                        className="mt-6 text-sm font-medium text-brand-600 hover:text-brand-700"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="text-xs uppercase tracking-[0.25em] text-brand-600 mb-2">Get in touch</div>
                                    <h2 className="font-display text-3xl md:text-4xl text-slate-900 mb-2">Tell us how we can help</h2>
                                    <p className="text-sm text-slate-500 mb-8">All fields marked with <span className="text-brand-600">*</span> are required.</p>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2">Full name <span className="text-brand-600">*</span></label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={form.name}
                                                    onChange={e => update('name', e.target.value)}
                                                    placeholder="Juan Dela Cruz"
                                                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2">Email <span className="text-brand-600">*</span></label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={form.email}
                                                    onChange={e => update('email', e.target.value)}
                                                    placeholder="you@example.com"
                                                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2">Phone (optional)</label>
                                                <input
                                                    type="tel"
                                                    value={form.phone}
                                                    onChange={e => update('phone', e.target.value)}
                                                    placeholder="+63 917 000 0000"
                                                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2">I'm writing about</label>
                                                <select
                                                    value={form.topic}
                                                    onChange={e => update('topic', e.target.value)}
                                                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition bg-white"
                                                >
                                                    {TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        {(form.topic === 'reservation' || form.topic === 'concierge') && (
                                            <div className="grid md:grid-cols-2 gap-5 p-5 bg-brand-50/50 rounded-xl border border-brand-100">
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2">Intended check-in</label>
                                                    <input
                                                        type="date"
                                                        value={form.checkIn}
                                                        onChange={e => update('checkIn', e.target.value)}
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2">Guests</label>
                                                    <div className="flex items-center gap-3 h-full">
                                                        <button
                                                            type="button"
                                                            onClick={() => update('guests', Math.max(1, form.guests - 1))}
                                                            className="w-11 h-11 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold"
                                                        >
                                                            −
                                                        </button>
                                                        <div className="flex-1 text-center font-medium text-slate-900">{form.guests} {form.guests === 1 ? 'guest' : 'guests'}</div>
                                                        <button
                                                            type="button"
                                                            onClick={() => update('guests', Math.min(10, form.guests + 1))}
                                                            className="w-11 h-11 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2">Your message <span className="text-brand-600">*</span></label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={form.message}
                                                onChange={e => update('message', e.target.value)}
                                                placeholder="Tell us about the trip you're dreaming of, the occasion, or the property you have in mind…"
                                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition resize-none"
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                                            <p className="text-xs text-slate-500">
                                                By submitting, you agree to our <a href="#" className="text-brand-600 hover:underline">Privacy Notice</a>.
                                            </p>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full sm:w-auto bg-slate-900 hover:bg-brand-800 disabled:bg-slate-400 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition inline-flex items-center justify-center gap-2"
                                            >
                                                {submitting ? 'Sending…' : (
                                                    <>
                                                        Send message
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Info sidebar */}
                    <aside className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold-500/20 blur-3xl" />
                            <div className="relative">
                                <div className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-3">Priority line</div>
                                <div className="font-display text-3xl mb-2">Members-only</div>
                                <p className="text-sm text-white/70 mb-6 leading-relaxed">
                                    Angelo members reach a dedicated concierge without going through the queue.
                                </p>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-white/60">Member hotline</div>
                                        <div className="font-medium">+63 2 8555 0110</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-white/60">Priority email</div>
                                        <div className="font-medium">priority@angeloboutique.ph</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl p-8">
                            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2">Response times</div>
                            <div className="font-display text-2xl text-slate-900 mb-5">We reply, always.</div>
                            <div className="space-y-3">
                                {[
                                    { channel: 'Phone', time: 'Immediate' },
                                    { channel: 'WhatsApp / Viber', time: 'Within 30 min' },
                                    { channel: 'Email', time: 'Within 4 hrs' },
                                    { channel: 'Contact form', time: 'Within 4 hrs' },
                                ].map(r => (
                                    <div key={r.channel} className="flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                                        <span className="text-slate-600">{r.channel}</span>
                                        <span className="font-medium text-slate-900">{r.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Offices */}
            <section className="bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                        <div>
                            <div className="text-xs uppercase tracking-[0.25em] text-brand-600 mb-2">Our offices</div>
                            <h2 className="font-display text-4xl text-slate-900">Wherever you are, we're near.</h2>
                        </div>
                        <p className="text-sm text-slate-600 max-w-md">
                            Three offices, three time-zones of Philippine hospitality. Walk in for a face-to-face planning session, or call ahead.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {OFFICES.map(o => (
                            <div key={o.city} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img src={o.img} alt={o.city} className="w-full h-full object-cover" loading="lazy" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-baseline justify-between mb-3">
                                        <h3 className="font-display text-2xl text-slate-900">{o.city}</h3>
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-brand-600">{o.role}</span>
                                    </div>
                                    <div className="space-y-2.5 text-sm text-slate-600">
                                        <div className="flex items-start gap-2.5">
                                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <span>{o.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <svg className="w-4 h-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            <a href={`tel:${o.phone.replace(/\s/g, '')}`} className="hover:text-brand-600">{o.phone}</a>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <svg className="w-4 h-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            <a href={`mailto:${o.email}`} className="hover:text-brand-600">{o.email}</a>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <svg className="w-4 h-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span>{o.hours}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-4xl mx-auto px-6 lg:px-10 py-20">
                <div className="text-center mb-12">
                    <div className="text-xs uppercase tracking-[0.25em] text-brand-600 mb-2">Frequently asked</div>
                    <h2 className="font-display text-4xl text-slate-900">Before you reach out</h2>
                </div>
                <div className="space-y-3">
                    {[
                        {
                            q: 'How quickly do you respond to enquiries?',
                            a: 'Every message is read and acknowledged within four hours by a member of our concierge team. Complex itineraries may take up to 24 hours for a detailed proposal.',
                        },
                        {
                            q: 'Can I book by phone instead of online?',
                            a: 'Absolutely. Our Manila reservations line (+63 2 8555 0100) is staffed 24/7 by concierges who can process bookings, upgrades and special requests immediately.',
                        },
                        {
                            q: 'Do you handle corporate and group bookings?',
                            a: 'Yes — for groups of eight or more, our partnerships desk offers negotiated rates, private transfers and dedicated on-property coordinators. Email partnerships@angeloboutique.ph.',
                        },
                        {
                            q: 'What is your cancellation policy?',
                            a: 'Most properties allow free cancellation up to 48 hours before check-in. Peak-season and members-only rates may have stricter terms — always shown clearly at booking.',
                        },
                    ].map(item => (
                        <details key={item.q} className="group bg-white border border-slate-100 rounded-2xl px-6 py-5 shadow-sm">
                            <summary className="flex items-center justify-between cursor-pointer list-none">
                                <span className="font-display text-lg text-slate-900 pr-6">{item.q}</span>
                                <svg className="w-5 h-5 text-slate-400 group-open:rotate-45 transition flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            </summary>
                            <p className="mt-4 text-sm text-slate-600 leading-relaxed">{item.a}</p>
                        </details>
                    ))}
                </div>
            </section>
        </div>
    );
}
