import { useState, useRef } from 'react';
import { listings, type Listing } from '../data/listings';
import { colleges, type College } from '../data/colleges';
import { type StudentProfile, matchScore } from '../data/profile';
import Map3DView from '../components/Map3DView';

// colleges imported from ../data/colleges

// ─── Map areas / neighborhoods ────────────────────────────────────────────────
interface Area {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  mapImg: string;          // background image for this area
  mapFilter: string;       // CSS filter applied to the image
  overlay: string;         // inline rgba color overlay for atmosphere
  mapTranslate: string;
  landmarks: { label: string; x: number; y: number }[];
  listings: number[];
}

const areas: Area[] = [
  {
    id: 'all',
    label: 'All areas',
    emoji: '🗺️',
    desc: 'All of Champaign-Urbana',
    mapImg: '',
    mapFilter: 'brightness(0.95) saturate(1.1)',
    overlay: 'rgba(30,40,80,0.12)',
    mapTranslate: 'translate(0%, 0%) scale(1.25)',
    landmarks: [
      { label: '🎓 Quad',     x: 38, y: 28 },
      { label: '⚙️ ECE',      x: 45, y: 42 },
      { label: '📖 Library',  x: 52, y: 35 },
    ],
    listings: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    id: 'green',
    label: 'Green St',
    emoji: '🏙️',
    desc: 'Green Street corridor',
    mapImg: '',
    mapFilter: 'brightness(1.0) saturate(1.1)',
    overlay: 'rgba(0,0,0,0.05)',
    mapTranslate: 'translate(-18%, -12%) scale(2.0)',
    landmarks: [
      { label: '🏙️ Green St',    x: 42, y: 44 },
      { label: '⚙️ ECE',         x: 28, y: 32 },
      { label: '🍕 Restaurants', x: 60, y: 55 },
    ],
    listings: [1, 2, 3, 5],
  },
  {
    id: 'first',
    label: 'First St',
    emoji: '🏠',
    desc: 'South First Street area',
    mapImg: '',
    mapFilter: 'brightness(0.97) saturate(1.05)',
    overlay: 'rgba(0,0,0,0.06)',
    mapTranslate: 'translate(14%, -18%) scale(2.1)',
    landmarks: [
      { label: '🏠 First St',   x: 52, y: 48 },
      { label: '📊 Gies (BIF)', x: 36, y: 30 },
      { label: '🏪 Walmart',    x: 68, y: 62 },
    ],
    listings: [1, 3, 6, 7],
  },
  {
    id: 'south',
    label: 'South Campus',
    emoji: '🌿',
    desc: 'Quad / Illini Union area',
    mapImg: '',
    mapFilter: 'brightness(0.98) saturate(1.08)',
    overlay: 'rgba(0,0,0,0.05)',
    mapTranslate: 'translate(-8%, 16%) scale(1.9)',
    landmarks: [
      { label: '🎓 Quad',  x: 40, y: 28 },
      { label: '🌿 ACES',  x: 26, y: 56 },
      { label: '🏛️ Union', x: 54, y: 40 },
    ],
    listings: [2, 3, 4, 8],
  },
  {
    id: 'downtown',
    label: 'Downtown',
    emoji: '☕',
    desc: 'Downtown Champaign',
    mapImg: '',
    mapFilter: 'brightness(0.95) saturate(0.95)',
    overlay: 'rgba(0,0,0,0.08)',
    mapTranslate: 'translate(22%, 10%) scale(2.2)',
    landmarks: [
      { label: '☕ Downtown',     x: 58, y: 36 },
      { label: '🎭 Virginia Th.', x: 44, y: 26 },
      { label: '🚌 MTD Hub',      x: 52, y: 52 },
    ],
    listings: [2, 7],
  },
];

type View = 'list' | 'map';
type Sort = 'Recommended' | 'Price ↑' | 'Price ↓' | 'Nearest';

// StudentProfile + matchScore imported from ../data/profile

interface Props {
  onViewListing: (id: number, collegeId?: string | null) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ExploreScreen({ onViewListing }: Props) {
  const [view, setView]           = useState<View>('map'); // 'map' = 3D map
  const [activeFilter, setFilter] = useState('All');
  const [sort, setSort]           = useState<Sort>('Recommended');
  const [showSort, setShowSort]   = useState(false);
  const [saved, setSaved]         = useState<Set<number>>(new Set([1]));
  const [compared, setCompared]   = useState<Set<number>>(new Set());

  // Student profile + onboarding
  const [profile, setProfile]           = useState<StudentProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardStep, setOnboardStep]   = useState(0);
  const [draft, setDraft]               = useState<StudentProfile>({ college: null, budgetMax: 900, beds: 'any' });
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [selectedId, setSelectedId]       = useState<number | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  // Major / college selection
  const [showMajorPicker, setShowMajorPicker] = useState(false);
  const [selectedCollege, setSelectedCollege]   = useState<College | null>(null);
  const [selectedMajor, setSelectedMajor]       = useState<string | null>(null);

  // Map area
  const [activeArea, setActiveArea] = useState<Area>(areas[0]);

  const cardRowRef = useRef<HTMLDivElement>(null);

  const area = activeArea;

  // visible listings for this area
  const areaListings = listings.filter(l => area.listings.includes(l.id));

  // sort listings (by walk time from selected college if applicable)
  const sortedListings = [...areaListings].sort((a, b) => {
    if (selectedCollege && sort === 'Nearest') {
      return (a.walkFrom[selectedCollege.id] ?? 99) - (b.walkFrom[selectedCollege.id] ?? 99);
    }
    if (sort === 'Price ↑') return a.price - b.price;
    if (sort === 'Price ↓') return b.price - a.price;
    if (sort === 'Nearest') return (a.walkFrom.eng ?? 99) - (b.walkFrom.eng ?? 99);
    return 0;
  });

  const selectedListing = listings.find(l => l.id === selectedId) ?? null;

  const toggle = (set: Set<number>, id: number, setter: (s: Set<number>) => void) => {
    const next = new Set(set); next.has(id) ? next.delete(id) : next.add(id); setter(next);
  };

  const handlePinClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(prev => prev === id ? null : id);
    setSheetExpanded(false);
    setTimeout(() => {
      cardRowRef.current?.querySelector(`[data-id="${id}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, 50);
  };

  const filters = ['All', 'Verified', 'Studio', 'Quiet', '< 10 min'];

  const walkLabel = (l: Listing) =>
    selectedCollege
      ? `${l.walkFrom[selectedCollege.id]} min from ${selectedCollege.short}`
      : `${Math.min(...Object.values(l.walkFrom))}–${Math.max(...Object.values(l.walkFrom))} min`;

  return (
    <div className="flex flex-col h-full bg-[#f7f6f2]">

      {/* ── Header ── */}
      <div className={`bg-white px-4 border-b border-black/5 flex-shrink-0 ${view === 'list' ? 'pt-4 pb-3' : 'pt-3 pb-2'}`}>

        {/* Search + view toggle */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-11 bg-[#f0efe9] rounded-2xl px-4 flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6c6a66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span className="text-[#6c6a66] text-[14px]">Apartment, street, area…</span>
          </div>
          <div className="flex bg-[#f0efe9] rounded-xl p-0.5 flex-shrink-0">
            {([
              { v: 'map' as View, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>, label: 'Map' },
              { v: 'list' as View, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>, label: 'List' },
            ]).map(({ v, icon, label }) => (
              <button key={v} onClick={() => { setView(v); setSelectedId(null); }}
                className={`h-9 rounded-[10px] transition-all flex items-center justify-center gap-1.5 ${
                  v === view ? 'bg-white shadow-sm text-[#1c1c1e] px-3.5' : 'text-[#6c6a66] px-3'
                }`}>
                {icon}
                <span className="text-[12px] font-semibold">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Profile chip row */}
        {profile ? (
          <div className="mb-2">
            {/* Top row: label + actions */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-[#6c6a66]">Showing matches for</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setDraft(profile); setOnboardStep(0); setShowProfileEdit(true); }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
                <button
                  onClick={() => { setProfile(null); setSelectedCollege(null); }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#6c6a66]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Clear
                </button>
              </div>
            </div>
            {/* Bottom row: filter chips */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {profile.college && (
                <span className={`flex-shrink-0 text-[12px] font-bold px-3 py-1 rounded-full ${profile.college.color} ${profile.college.textColor}`}>
                  {profile.college.emoji} {profile.college.short}
                </span>
              )}
              <span className="flex-shrink-0 text-[12px] font-semibold px-3 py-1 rounded-full bg-[#f0efe9] text-[#1c1c1e]">
                ≤ ${profile.budgetMax}/mo
              </span>
              {profile.beds !== 'any' && (
                <span className="flex-shrink-0 text-[12px] font-semibold px-3 py-1 rounded-full bg-[#f0efe9] text-[#1c1c1e]">
                  {profile.beds}
                </span>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => { setOnboardStep(0); setShowOnboarding(true); }}
            className="w-full flex items-center gap-2 mb-2">
            <span className="text-sm">✨</span>
            <span className="text-[13px] font-semibold text-indigo-600">Personalize results</span>
            <span className="text-[12px] text-[#6c6a66]">— college, budget & rooms</span>
            <svg className="ml-auto flex-shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6c6a66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}

        {/* Sort + filters — only shown in list view */}
        <div className={`flex items-center gap-2 overflow-x-auto scrollbar-hide transition-all ${view === 'list' ? '' : 'hidden'}`}>
          <div className="relative flex-shrink-0">
            <button onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-[#1c1c1e] text-white text-[13px] font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="11" y2="6"/><line x1="4" y1="12" x2="13" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
                <polyline points="15 9 18 6 21 9"/>
              </svg>
              {sort === 'Recommended' ? 'Sort' : sort}
            </button>
            {showSort && (
              <div className="absolute top-11 left-0 bg-white rounded-2xl shadow-xl border border-black/8 overflow-hidden z-20 w-44">
                {(['Recommended','Price ↑','Price ↓','Nearest'] as Sort[]).map(s => (
                  <button key={s} onClick={() => { setSort(s); setShowSort(false); }}
                    className={`w-full px-4 py-3 text-[14px] text-left transition-colors ${sort === s ? 'font-semibold text-[#1c1c1e] bg-[#f0efe9]' : 'text-[#6c6a66]'}`}>
                    {s}{s === 'Nearest' && selectedCollege ? ` from ${selectedCollege.short}` : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 h-9 px-3 rounded-full text-[13px] font-medium border transition-all ${
                activeFilter === f ? 'bg-[#1c1c1e] text-white border-[#1c1c1e]' : 'bg-white text-[#6c6a66] border-black/10'
              }`}>{f}</button>
          ))}
        </div>
      </div>

      {/* ══════════ MAP (3D) VIEW ══════════ */}
      {view === 'map' && (
        <Map3DView
          selectedCollege={selectedCollege}
          profile={profile}
          onViewListing={onViewListing}
          onReset={() => { setProfile(null); setSelectedCollege(null); }}
        />
      )}

      {/* ══════════ LIST VIEW ══════════ */}
      {view === 'list' && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pt-4 flex flex-col gap-3 pb-24">
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-[#6c6a66]">{sortedListings.length} listings · {sort}</p>
              {selectedCollege && (
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${selectedCollege.color} ${selectedCollege.textColor}`}>
                  {selectedCollege.emoji} from {selectedCollege.short}
                </span>
              )}
            </div>
            {sortedListings.map(listing => {
              const walkMin = selectedCollege ? listing.walkFrom[selectedCollege.id] : null;
              return (
                <div key={listing.id} className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm">
                  <div className="h-48 overflow-hidden relative">
                    <img src={listing.img} alt={listing.name} className="w-full h-full object-cover" />
                    <button onClick={() => toggle(saved, listing.id, setSaved)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={saved.has(listing.id) ? '#1c1c1e' : 'none'} stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    <span className={`absolute top-3 left-3 text-[12px] font-semibold px-2.5 py-1 rounded-full ${listing.badgeColor}`}>{listing.badge}</span>
                    {walkMin !== null && (
                      <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm ${selectedCollege!.color}`}>
                        <span>{selectedCollege!.emoji}</span>
                        <span className={`text-[12px] font-semibold ${selectedCollege!.textColor}`}>{walkMin} min from {selectedCollege!.short}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[#1c1c1e] text-[20px] font-bold">${listing.price}/mo</p>
                        <p className="text-[#1c1c1e] text-[15px] font-medium mt-0.5">{listing.name}</p>
                      </div>
                      <span className="text-[13px] font-medium text-[#1c1c1e] bg-[#f0efe9] px-2 py-1 rounded-lg">{listing.beds}</span>
                    </div>
                    {/* Walk times per college */}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {colleges.slice(0, 3).map(c => (
                        <span key={c.id} className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          selectedCollege?.id === c.id ? `${c.color} ${c.textColor} font-semibold` : 'bg-[#f0efe9] text-[#6c6a66]'
                        }`}>
                          {c.emoji} {listing.walkFrom[c.id]}m
                        </span>
                      ))}
                      <span className="text-[11px] text-[#6c6a66] px-1 py-0.5">+ more</span>
                    </div>
                    <p className="text-[#6c6a66] text-[13px] leading-relaxed mt-2">{listing.desc}</p>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => onViewListing(listing.id, selectedCollege?.id)} className="flex-1 h-11 bg-[#1c1c1e] rounded-xl text-white text-[14px] font-semibold">View listing</button>
                      <button onClick={() => toggle(compared, listing.id, setCompared)}
                        className={`h-11 px-4 rounded-xl text-[14px] font-semibold border transition-colors ${
                          compared.has(listing.id) ? 'bg-[#f0efe9] text-[#1c1c1e] border-[#1c1c1e]' : 'bg-white text-[#6c6a66] border-black/15'
                        }`}>
                        {compared.has(listing.id) ? '✓ Compared' : 'Compare'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Compare bar */}
      {compared.size > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[428px] px-4 z-30 pointer-events-none">
          <button className="w-full h-12 bg-[#1c1c1e] rounded-2xl flex items-center justify-center gap-2 text-white text-[15px] font-semibold shadow-xl pointer-events-auto">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Compare {compared.size} listing{compared.size > 1 ? 's' : ''}
          </button>
        </div>
      )}

      {/* ══════════ PERSONALIZATION ONBOARDING ══════════ */}
      {(showOnboarding || showProfileEdit) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => { setShowOnboarding(false); setShowProfileEdit(false); }}>
          <div className="bg-white w-full max-w-[428px] mx-auto rounded-t-3xl pb-10 overflow-hidden"
            onClick={e => e.stopPropagation()}>

            {/* Step indicator */}
            <div className="pt-4 pb-5 px-6">
              <div className="w-10 h-1 bg-black/10 rounded-full mx-auto mb-5" />
              <div className="flex justify-between items-center mb-1">
                <p className="text-[#1c1c1e] text-[20px] font-bold">
                  {onboardStep === 0 ? '🎓 Your college' : onboardStep === 1 ? '💰 Your budget' : '🛏️ Room type'}
                </p>
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className={`rounded-full transition-all ${i === onboardStep ? 'w-5 h-1.5 bg-[#1c1c1e]' : 'w-1.5 h-1.5 bg-black/15'}`} />
                  ))}
                </div>
              </div>
              <p className="text-[#6c6a66] text-[13px]">
                {onboardStep === 0 ? 'We\'ll rank listings by walk time from your building' :
                 onboardStep === 1 ? 'Pins outside your budget will be dimmed on the map' :
                 'We\'ll highlight listings that match your preference'}
              </p>
            </div>

            {/* Step 0 — College */}
            {onboardStep === 0 && (
              <div className="px-5">
                <div className="grid grid-cols-2 gap-2.5">
                  {colleges.map(c => (
                    <button key={c.id}
                      onClick={() => setDraft(d => ({ ...d, college: c }))}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                        draft.college?.id === c.id
                          ? `${c.color} border-current ${c.textColor}`
                          : 'bg-[#f7f6f2] border-transparent'
                      }`}>
                      <span className="text-2xl">{c.emoji}</span>
                      <div className="min-w-0">
                        <p className={`text-[13px] font-bold leading-tight ${draft.college?.id === c.id ? c.textColor : 'text-[#1c1c1e]'}`}>{c.short}</p>
                        <p className="text-[11px] text-[#6c6a66] mt-0.5 leading-tight truncate">{c.building}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 — Budget */}
            {onboardStep === 1 && (
              <div className="px-6">
                <div className="text-center mb-6">
                  <p className="text-[42px] font-black text-[#1c1c1e] leading-none">${draft.budgetMax}</p>
                  <p className="text-[14px] text-[#6c6a66] mt-1">max per month</p>
                </div>
                <input type="range" min={600} max={1400} step={25}
                  value={draft.budgetMax}
                  onChange={e => setDraft(d => ({ ...d, budgetMax: Number(e.target.value) }))}
                  className="w-full h-2 rounded-full accent-[#1c1c1e] cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-[11px] text-[#6c6a66]">
                  <span>$600</span><span>$1,400</span>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[700, 850, 1000, 1100, 1200, 1400].map(v => (
                    <button key={v}
                      onClick={() => setDraft(d => ({ ...d, budgetMax: v }))}
                      className={`py-2 rounded-xl text-[13px] font-semibold transition-all ${
                        draft.budgetMax === v ? 'bg-[#1c1c1e] text-white' : 'bg-[#f0efe9] text-[#1c1c1e]'
                      }`}>
                      ${v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Beds */}
            {onboardStep === 2 && (
              <div className="px-6">
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { v: 'any',    label: 'No preference', icon: '🏠', desc: 'Show me everything' },
                    { v: 'Studio', label: 'Studio',        icon: '🪑', desc: 'One open room' },
                    { v: '1B',     label: '1 Bedroom',     icon: '🛏️', desc: 'Separate bedroom' },
                    { v: '2B+',    label: '2+ Bedrooms',   icon: '🏡', desc: 'Share with roommates' },
                  ] as { v: StudentProfile['beds']; label: string; icon: string; desc: string }[]).map(({ v, label, icon, desc }) => (
                    <button key={v}
                      onClick={() => setDraft(d => ({ ...d, beds: v }))}
                      className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                        draft.beds === v ? 'bg-[#1c1c1e] border-[#1c1c1e]' : 'bg-[#f7f6f2] border-transparent'
                      }`}>
                      <span className="text-3xl mb-2">{icon}</span>
                      <p className={`text-[14px] font-bold ${draft.beds === v ? 'text-white' : 'text-[#1c1c1e]'}`}>{label}</p>
                      <p className={`text-[11px] mt-0.5 ${draft.beds === v ? 'text-white/70' : 'text-[#6c6a66]'}`}>{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="px-6 mt-6 flex gap-2.5">
              {onboardStep > 0 && (
                <button onClick={() => setOnboardStep(s => s - 1)}
                  className="h-13 py-3.5 px-5 rounded-2xl bg-[#f0efe9] text-[#1c1c1e] text-[15px] font-semibold">
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (onboardStep < 2) {
                    setOnboardStep(s => s + 1);
                  } else {
                    setProfile(draft);
                    setSelectedCollege(draft.college);
                    setShowOnboarding(false);
                    setShowProfileEdit(false);
                  }
                }}
                className="flex-1 h-13 py-3.5 bg-[#1c1c1e] rounded-2xl text-white text-[15px] font-semibold">
                {onboardStep < 2 ? 'Continue →' : '✨ Find my home'}
              </button>
            </div>
            <button onClick={() => { setShowOnboarding(false); setShowProfileEdit(false); }}
              className="w-full mt-3 py-2 text-[13px] text-[#6c6a66] text-center">
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* ══════════ MAJOR PICKER MODAL ══════════ */}
      {showMajorPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowMajorPicker(false)}>
          <div className="bg-white w-full max-w-[428px] mx-auto rounded-t-3xl pt-4 pb-10 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-black/10 rounded-full mx-auto mb-5" />
            <div className="px-5">
              <p className="text-[#1c1c1e] text-[18px] font-bold mb-1">Find near my college</p>
              <p className="text-[#6c6a66] text-[14px] mb-5">Listings are re-ranked by walk time from your building</p>

              <div className="flex flex-col gap-3">
                {colleges.map(college => (
                  <div key={college.id}>
                    <button
                      onClick={() => {
                        setSelectedCollege(college);
                        setSelectedMajor(null);
                        setSort('Nearest');
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedCollege?.id === college.id
                          ? `${college.color} border-current ${college.textColor}`
                          : 'bg-[#f7f6f2] border-transparent'
                      }`}>
                      <span className="text-2xl flex-shrink-0">{college.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[15px] font-semibold ${selectedCollege?.id === college.id ? college.textColor : 'text-[#1c1c1e]'}`}>
                          {college.name}
                        </p>
                        <p className="text-[#6c6a66] text-[12px] mt-0.5">📍 {college.building}</p>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {college.majors.map(m => (
                            <button key={m}
                              onClick={e => { e.stopPropagation(); setSelectedCollege(college); setSelectedMajor(m); setSort('Nearest'); }}
                              className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition-all ${
                                selectedMajor === m && selectedCollege?.id === college.id
                                  ? `${college.color.replace('-100','-200')} ${college.textColor} font-semibold`
                                  : 'bg-white text-[#6c6a66] border border-black/10'
                              }`}>
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                      {selectedCollege?.id === college.id && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowMajorPicker(false)}
                className="w-full mt-6 h-13 py-3.5 bg-[#1c1c1e] rounded-2xl text-white text-[15px] font-semibold">
                {selectedCollege ? `Show listings near ${selectedCollege.short}` : 'Close'}
              </button>
              {selectedCollege && (
                <button onClick={() => { setSelectedCollege(null); setSelectedMajor(null); setSort('Recommended'); setShowMajorPicker(false); }}
                  className="w-full mt-2 text-[#6c6a66] text-[14px] py-2">
                  Clear college filter
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
