import { useState } from 'react';
import type { Listing } from '../data/listings';

const colleges = [
  { id: 'eng',  short: 'Grainger',  emoji: '⚙️', color: 'bg-blue-100',   textColor: 'text-blue-700' },
  { id: 'bus',  short: 'Gies',      emoji: '📊', color: 'bg-emerald-100', textColor: 'text-emerald-700' },
  { id: 'las',  short: 'LAS',       emoji: '📚', color: 'bg-purple-100',  textColor: 'text-purple-700' },
  { id: 'agr',  short: 'ACES',      emoji: '🌱', color: 'bg-lime-100',    textColor: 'text-lime-700' },
  { id: 'med',  short: 'Media',     emoji: '🎙️', color: 'bg-orange-100',  textColor: 'text-orange-700' },
  { id: 'art',  short: 'FAA',       emoji: '🎨', color: 'bg-pink-100',    textColor: 'text-pink-700' },
];

interface Review {
  author: string;
  college: string;
  semester: string;
  rating: number;
  text: string;
}

const listingReviews: Record<number, Review[]> = {
  1: [
    { author: 'Alex T.', college: 'Grainger', semester: 'Fall 2025', rating: 5, text: 'Rooftop lounge is amazing during finals week. Super quiet building, management replies same day. 10/10 would renew.' },
    { author: 'Priya S.', college: 'Gies', semester: 'Spring 2025', rating: 4, text: 'Great location and in-unit laundry is a game changer. A little pricey but worth it for the convenience.' },
  ],
  2: [
    { author: 'Jordan L.', college: 'LAS', semester: 'Fall 2025', rating: 5, text: 'Best deal on Green St. Literally walk out the door to everything. Exposed brick is so aesthetic.' },
    { author: 'Maya R.', college: 'Media', semester: 'Fall 2024', rating: 4, text: 'Super affordable and solid. Coin laundry is the only downside but honestly not a big deal.' },
  ],
  3: [
    { author: 'Chris M.', college: 'Gies', semester: 'Spring 2026', rating: 5, text: 'The pool and sky lounge genuinely feel like a resort. Management is responsive and the study pods are always available.' },
    { author: 'Sarah K.', college: 'Grainger', semester: 'Fall 2025', rating: 4, text: 'Premium price but you get what you pay for. Short walk to ECE and the furnished option saved me so much moving stress.' },
  ],
  4: [
    { author: 'David N.', college: 'LAS', semester: 'Fall 2025', rating: 5, text: 'Literally 4 min from Lincoln Hall. I\'ve never been late to class. Quiet floors are actually quiet, rare for student housing.' },
    { author: 'Emma W.', college: 'FAA', semester: 'Spring 2025', rating: 4, text: 'Great community vibe and close to Krannert. Common areas are always clean. Recommend for LAS/FAA students.' },
  ],
  5: [
    { author: 'Tyler B.', college: 'Grainger', semester: 'Fall 2025', rating: 5, text: 'Can\'t beat the price. Responsive landlord and fast internet. Perfect for a solo student who just needs a quiet place to study.' },
    { author: 'Lena H.', college: 'Media', semester: 'Spring 2025', rating: 4, text: 'Small but cozy. Goodwin Ave location is super convenient and the landlord fixed a heater issue within 24h.' },
  ],
  6: [
    { author: 'Omar F.', college: 'FAA', semester: 'Fall 2025', rating: 5, text: 'Me and my roommate split this 2B2B and it\'s been perfect. Balcony is great for summer. Parking included is huge.' },
    { author: 'Nina C.', college: 'LAS', semester: 'Spring 2026', rating: 4, text: 'Spacious and modern. Underground parking is so clutch in winter. Close to a lot of campus buildings.' },
  ],
  7: [
    { author: 'Sam P.', college: 'Gies', semester: 'Fall 2025', rating: 5, text: 'Super calm street, feels safe at night. Utilities included means no bill surprises. Would recommend to any Gies student.' },
    { author: 'Rachel T.', college: 'ACES', semester: 'Fall 2024', rating: 4, text: 'Renovated kitchen is really nice. Quiet neighborhood and short walk to Mumford. Decent deal for the area.' },
  ],
  8: [
    { author: 'Jake H.', college: 'ACES', semester: 'Spring 2025', rating: 5, text: 'Perfect for a grad student. Huge yard, parking included, and management is on-site. Very relaxed atmosphere.' },
    { author: 'Mia L.', college: 'Media', semester: 'Fall 2024', rating: 4, text: 'Spacious place near the research park. Pet-friendly and the yard is great for my dog. A bit far from main campus but MTD covers it.' },
  ],
};

const amenityIcons: Record<string, string> = {
  'In-unit laundry': '🫧', 'Rooftop deck': '🏙️', 'Gym': '💪', 'Study rooms': '📖',
  'Pet friendly': '🐾', 'Bike storage': '🚲', 'Package lockers': '📦', 'High-speed Wi-Fi': '📶',
  'Hardwood floors': '🪵', 'Exposed brick': '🧱', 'Updated kitchen': '🍳', 'Rooftop access': '🌇',
  'Coin laundry': '🪙', 'Near bus stop': '🚌', 'Resort pool': '🏊', 'Private study pods': '🎧',
  'Fully furnished option': '🛋️', 'Concierge': '🛎️', 'Rooftop sky lounge': '✨', 'EV charging': '⚡',
  'Dog wash station': '🐕', 'Yoga studio': '🧘', 'Quiet floors': '🔇', 'Study lounge': '📚',
  'Laundry in building': '🧺', 'Courtyard': '🌿', 'Near Quad': '🎓', 'MTD bus stop': '🚌',
};

interface Props {
  listing: Listing;
  onBack: () => void;
  selectedCollegeId?: string | null;
}

export default function ListingDetailScreen({ listing, onBack, selectedCollegeId }: Props) {
  const [saved, setSaved] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'walk' | 'amenities' | 'reviews'>('overview');
  const reviews = listingReviews[listing.id] ?? [];

  const highlightCollege = colleges.find(c => c.id === selectedCollegeId);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">

      {/* ── Hero image ── */}
      <div className="relative flex-shrink-0" style={{ height: '280px' }}>
        <img
          src={listing.img}
          alt={listing.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-12 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Save button */}
        <button
          onClick={() => setSaved(s => !s)}
          className="absolute top-12 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
            fill={saved ? '#1c1c1e' : 'none'}
            stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Badge + price overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${listing.badgeColor}`}>
              {listing.badge}
            </span>
            {highlightCollege && (
              <span className={`ml-2 text-[12px] font-bold px-2.5 py-1 rounded-full ${highlightCollege.color} ${highlightCollege.textColor}`}>
                {highlightCollege.emoji} {listing.walkFrom[highlightCollege.id]} min
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-white text-[28px] font-bold leading-tight">
              ${listing.price.toLocaleString()}
            </p>
            <p className="text-white/80 text-[13px] font-medium -mt-1">per month</p>
          </div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-28">

        {/* Name + address */}
        <div className="px-5 pt-5 pb-4 border-b border-black/6">
          <h1 className="text-[#1c1c1e] text-[22px] font-bold leading-tight">{listing.name}</h1>
          <div className="flex items-center gap-1.5 mt-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6c6a66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <p className="text-[#6c6a66] text-[14px]">{listing.address}, Champaign, IL</p>
          </div>

          {/* Key stats */}
          <div className="flex gap-2 mt-4">
            {[
              { icon: '🛏️', label: listing.beds },
              { icon: '📐', label: listing.sqft },
              { icon: '🏢', label: listing.floor },
              { icon: '📅', label: listing.available },
            ].map(({ icon, label }) => (
              <div key={label} className="flex-1 bg-[#f7f6f2] rounded-xl p-2.5 text-center">
                <p className="text-base leading-tight">{icon}</p>
                <p className="text-[#1c1c1e] text-[11px] font-semibold mt-1 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-black/6 px-5 gap-5 overflow-x-auto scrollbar-hide">
          {([
            { id: 'overview', label: 'Overview' },
            { id: 'walk',     label: 'Walk Times' },
            { id: 'amenities',label: 'Amenities' },
            { id: 'reviews',  label: `Reviews (${reviews.length})` },
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`py-3.5 text-[14px] font-semibold border-b-2 transition-all whitespace-nowrap flex-shrink-0 -mb-px ${
                activeTab === id
                  ? 'border-[#1c1c1e] text-[#1c1c1e]'
                  : 'border-transparent text-[#6c6a66]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {activeTab === 'overview' && (
          <div className="px-5 py-5">
            <p className="text-[#3c3c3e] text-[15px] leading-relaxed">{listing.desc}</p>

            {/* Landlord card */}
            <div className="mt-5 bg-[#f7f6f2] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#e0dfd9] flex items-center justify-center text-lg flex-shrink-0">🏢</div>
              <div className="flex-1 min-w-0">
                <p className="text-[#1c1c1e] text-[14px] font-semibold">{listing.landlord}</p>
                <p className="text-[#6c6a66] text-[12px] mt-0.5">Verified landlord · {listing.phone}</p>
              </div>
              <button
                onClick={() => setShowContact(true)}
                className="text-[#1c1c1e] text-[13px] font-semibold bg-white border border-black/12 px-3 py-1.5 rounded-xl"
              >
                Contact
              </button>
            </div>

            {/* Student reviews teaser */}
            {reviews.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#1c1c1e] text-[15px] font-semibold">Student Reviews</p>
                  <button onClick={() => setActiveTab('reviews')}
                    className="text-[12px] font-semibold text-indigo-600">See all →</button>
                </div>
                <div className="bg-[#f7f6f2] rounded-2xl p-4">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[13px] font-bold text-indigo-600 flex-shrink-0">
                      {reviews[0].author[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-semibold text-[#1c1c1e]">{reviews[0].author}</span>
                        <span className="text-[11px] text-[#6c6a66]">· {reviews[0].college} · {reviews[0].semester}</span>
                      </div>
                      <div className="flex gap-0.5 mb-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} width="11" height="11" viewBox="0 0 24 24"
                            fill={i < reviews[0].rating ? '#f59e0b' : 'none'}
                            stroke="#f59e0b" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-[13px] text-[#3c3c3e] leading-relaxed">{reviews[0].text}</p>
                    </div>
                  </div>
                  {reviews.length > 1 && (
                    <button onClick={() => setActiveTab('reviews')}
                      className="mt-3 w-full text-[12px] font-semibold text-[#6c6a66] text-center border-t border-black/6 pt-3">
                      +{reviews.length - 1} more student review{reviews.length > 2 ? 's' : ''} →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Top amenities preview */}
            <div className="mt-5">
              <p className="text-[#1c1c1e] text-[15px] font-semibold mb-3">Highlights</p>
              <div className="grid grid-cols-2 gap-2">
                {listing.amenities.slice(0, 4).map(a => (
                  <div key={a} className="flex items-center gap-2.5 bg-[#f7f6f2] rounded-xl p-3">
                    <span className="text-lg">{amenityIcons[a] ?? '✅'}</span>
                    <span className="text-[13px] font-medium text-[#1c1c1e] leading-tight">{a}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('amenities')}
                className="w-full mt-2 py-3 text-[13px] font-semibold text-[#6c6a66] text-center"
              >
                See all {listing.amenities.length} amenities →
              </button>
            </div>
          </div>
        )}

        {/* ── Walk Times tab ── */}
        {activeTab === 'walk' && (
          <div className="px-5 py-5">
            <p className="text-[#6c6a66] text-[13px] mb-4">Walk time from each college building to this listing.</p>
            <div className="flex flex-col gap-2.5">
              {colleges.map(c => {
                const mins = listing.walkFrom[c.id];
                const isHighlighted = selectedCollegeId === c.id;
                return (
                  <div key={c.id}
                    className={`flex items-center gap-3 rounded-2xl p-4 border transition-all ${
                      isHighlighted ? `${c.color} border-transparent` : 'bg-[#f7f6f2] border-transparent'
                    }`}>
                    <span className="text-xl">{c.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] font-semibold ${isHighlighted ? c.textColor : 'text-[#1c1c1e]'}`}>
                        {c.short}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              mins <= 7 ? 'bg-emerald-400' : mins <= 12 ? 'bg-amber-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${Math.max(8, 100 - (mins - 4) * 5)}%` }}
                          />
                        </div>
                        <span className={`text-[13px] font-semibold flex-shrink-0 ${isHighlighted ? c.textColor : 'text-[#1c1c1e]'}`}>
                          {mins} min
                        </span>
                      </div>
                    </div>
                    {mins <= 7 && (
                      <span className="text-[11px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex-shrink-0">Close</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <span className="text-xl flex-shrink-0">💡</span>
              <p className="text-blue-700 text-[13px] leading-relaxed">
                Select your college in the Explore filters to always see your walk time highlighted first.
              </p>
            </div>
          </div>
        )}

        {/* ── Amenities tab ── */}
        {activeTab === 'amenities' && (
          <div className="px-5 py-5">
            <div className="grid grid-cols-1 gap-2">
              {listing.amenities.map(a => (
                <div key={a} className="flex items-center gap-3 bg-[#f7f6f2] rounded-xl px-4 py-3.5">
                  <span className="text-xl">{amenityIcons[a] ?? '✅'}</span>
                  <span className="text-[14px] font-medium text-[#1c1c1e]">{a}</span>
                  <svg className="ml-auto flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

        {/* ── Reviews tab ── */}
        {activeTab === 'reviews' && (
          <div className="px-5 py-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#1c1c1e] text-[15px] font-semibold">What students say</p>
                <p className="text-[#6c6a66] text-[12px] mt-0.5">From the CampusNest community</p>
              </div>
              <div className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span className="text-[14px] font-bold text-[#1c1c1e]">
                  {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                </span>
                <span className="text-[12px] text-[#6c6a66]">({reviews.length})</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {reviews.map((r, i) => (
                <div key={i} className="bg-[#f7f6f2] rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-[14px] font-bold text-indigo-600 flex-shrink-0">
                      {r.author[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-semibold text-[#1c1c1e]">{r.author}</span>
                        <span className="text-[11px] text-[#6c6a66] flex-shrink-0">{r.semester}</span>
                      </div>
                      <span className="text-[11px] font-medium text-indigo-600">{r.college}</span>
                      <div className="flex gap-0.5 my-1.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <svg key={j} width="11" height="11" viewBox="0 0 24 24"
                            fill={j < r.rating ? '#f59e0b' : 'none'}
                            stroke="#f59e0b" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-[13px] text-[#3c3c3e] leading-relaxed">{r.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Community CTA */}
            <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl flex-shrink-0">💬</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-indigo-800">Have you lived here?</p>
                <p className="text-[12px] text-indigo-600 mt-0.5">Share your experience in the Community tab</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        )}

      {/* ── Fixed CTA bar ── */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-black/8 px-5 pt-3 pb-8">
        <div className="flex gap-3">
          <button
            onClick={() => setShowContact(true)}
            className="h-13 py-3.5 flex-1 bg-[#f7f6f2] border border-black/10 rounded-2xl text-[#1c1c1e] text-[15px] font-semibold"
          >
            Schedule Tour
          </button>
          <button className="h-13 py-3.5 flex-1 bg-[#1c1c1e] rounded-2xl text-white text-[15px] font-semibold shadow-sm">
            Apply Now
          </button>
        </div>
      </div>

      {/* ── Contact modal ── */}
      {showContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowContact(false)}>
          <div className="bg-white w-full max-w-[428px] mx-auto rounded-t-3xl pt-5 pb-10 px-6"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-black/10 rounded-full mx-auto mb-5" />
            <p className="text-[#1c1c1e] text-[18px] font-bold mb-1">Contact landlord</p>
            <p className="text-[#6c6a66] text-[14px] mb-5">{listing.landlord}</p>
            <div className="flex flex-col gap-2.5">
              <a href={`tel:${listing.phone}`} className="flex items-center gap-4 p-4 bg-[#f7f6f2] rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">📞</div>
                <div>
                  <p className="text-[#1c1c1e] text-[14px] font-semibold">Call</p>
                  <p className="text-[#6c6a66] text-[12px] mt-0.5">{listing.phone}</p>
                </div>
              </a>
              <button className="flex items-center gap-4 p-4 bg-[#f7f6f2] rounded-2xl text-left">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">✉️</div>
                <div>
                  <p className="text-[#1c1c1e] text-[14px] font-semibold">Message in app</p>
                  <p className="text-[#6c6a66] text-[12px] mt-0.5">Typically responds in 2 hours</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
