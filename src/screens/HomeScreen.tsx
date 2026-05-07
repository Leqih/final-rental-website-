import { useState } from 'react';

const imgFeatured = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80";
const imgCard1    = "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80";
const imgCard2    = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80";
const imgRec      = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80";

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [activeFilter, setActiveFilter] = useState('');
  const filters = ['Budget', 'Near Campus', 'Studio', 'Sublease', '2B+'];

  return (
    <div className="flex flex-col pb-24 overflow-y-auto bg-[#f7f6f2]">

      {/* ── Header ── */}
      <div className="bg-white px-5 pt-6 pb-4 sticky top-0 z-10 border-b border-black/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[22px] font-bold text-[#1c1c1e] leading-tight">Good morning, LQ</p>
            <p className="text-[13px] text-[#6c6a66] mt-0.5">2 saved · 1 compared · 5 new posts</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1c1c1e] flex items-center justify-center">
            <span className="font-bold text-white text-[13px]">LQ</span>
          </div>
        </div>

        {/* Search bar */}
        <button
          onClick={() => onNavigate('explore')}
          className="w-full h-11 bg-[#f0efe9] rounded-2xl px-4 flex items-center gap-3 text-left"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6c6a66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span className="text-[#6c6a66] text-[14px]">Search apartments, streets…</span>
        </button>
      </div>

      {/* ── Filter chips ── */}
      <div className="px-5 pt-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map(f => (
            <button key={f}
              onClick={() => setActiveFilter(f === activeFilter ? '' : f)}
              className={`flex-shrink-0 h-8 px-3.5 rounded-full text-[13px] font-medium transition-all ${
                activeFilter === f
                  ? 'bg-[#1c1c1e] text-white'
                  : 'bg-white text-[#1c1c1e] border border-black/10'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Featured listing ── */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[15px] font-semibold text-[#1c1c1e]">Featured</p>
          <button onClick={() => onNavigate('explore')} className="text-[13px] text-[#6c6a66]">See all →</button>
        </div>
        <div className="rounded-2xl overflow-hidden relative h-56 bg-gray-200">
          <img src={imgFeatured} alt="The Dean Apartments" className="w-full h-full object-cover absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="bg-[rgba(111,207,151,0.95)] text-[#1c1c1e] text-[11px] font-semibold px-2.5 py-1 rounded-full">Verified</span>
            <span className="bg-white/90 text-[#1c1c1e] text-[11px] font-semibold px-2.5 py-1 rounded-full">8 min walk</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <div>
              <p className="text-white text-[20px] font-bold leading-tight">$850/mo</p>
              <p className="text-white/80 text-[13px] mt-0.5">The Dean · 2BR</p>
            </div>
            <button onClick={() => onNavigate('explore')}
              className="bg-white text-[#1c1c1e] text-[12px] font-semibold px-3.5 py-1.5 rounded-full">
              View
            </button>
          </div>
        </div>
      </div>

      {/* ── Continue deciding ── */}
      <div className="px-5 pt-3">
        <button onClick={() => onNavigate('explore')}
          className="w-full bg-[#1c1c1e] rounded-2xl p-4 flex items-center gap-3 text-left">
          <div className="flex -space-x-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-[#1c1c1e]">
              <img src={imgCard1} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-[#1c1c1e]">
              <img src={imgCard2} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-white text-[14px] font-semibold">Continue deciding</p>
            <p className="text-white/50 text-[12px] mt-0.5">2 saved listings</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* ── Recommended ── */}
      <div className="px-5 pt-5">
        <p className="text-[15px] font-semibold text-[#1c1c1e] mb-2.5">Recommended</p>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5">
          {[
            { img: imgRec,      price: '$850/mo', name: 'The Dean',         dist: '8 min',  badge: 'Verified', badgeColor: 'bg-[rgba(111,207,151,0.92)]' },
            { img: imgFeatured, price: '$720/mo', name: 'Green Street Lofts', dist: '12 min', badge: 'Budget',   badgeColor: 'bg-amber-100' },
          ].map((item, i) => (
            <button key={i} onClick={() => onNavigate('explore')}
              className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden text-left border border-black/5">
              <div className="h-28 overflow-hidden relative">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#1c1c1e] ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
              <div className="p-3">
                <p className="text-[#1c1c1e] text-[15px] font-bold">{item.price}</p>
                <p className="text-[#6c6a66] text-[12px] mt-0.5">{item.name}</p>
                <p className="text-[#6c6a66] text-[11px]">{item.dist} to campus</p>
              </div>
            </button>
          ))}
          <button onClick={() => onNavigate('explore')}
            className="flex-shrink-0 w-28 bg-[#f0efe9] rounded-2xl flex flex-col items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1c1c1e] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <p className="text-[#1c1c1e] text-[11px] font-semibold">More</p>
          </button>
        </div>
      </div>

      {/* ── Community ── */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[15px] font-semibold text-[#1c1c1e]">Community</p>
          <button onClick={() => onNavigate('community')} className="text-[13px] text-[#6c6a66]">View all →</button>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-black/5 border border-black/5">
          {[
            { tag: 'Advice',       color: 'bg-blue-100 text-blue-700',     title: 'Best apts near Engineering Quad?',   replies: 24, time: '2h' },
            { tag: 'Scam Alert',   color: 'bg-red-100 text-red-600',       title: 'Deposit before tour? Red flag.',     replies: 8,  time: '5h' },
            { tag: 'Building Talk',color: 'bg-purple-100 text-purple-700', title: 'How noisy is The Dean on weeknights?', replies: 16, time: '7h' },
          ].map((thread, i) => (
            <button key={i} onClick={() => onNavigate('community')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${thread.color}`}>{thread.tag}</span>
                  <span className="text-[11px] text-[#6c6a66]">{thread.time} ago · {thread.replies} replies</span>
                </div>
                <p className="text-[#1c1c1e] text-[13px] font-medium mt-1 truncate">{thread.title}</p>
              </div>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c0bdb8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* ── Sublease spotlight ── */}
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[15px] font-semibold text-[#1c1c1e]">Sublease</p>
          <button onClick={() => onNavigate('sublease')} className="text-[13px] text-[#6c6a66]">View all →</button>
        </div>
        <button onClick={() => onNavigate('sublease')}
          className="w-full bg-white rounded-2xl p-3.5 flex items-center gap-3 text-left border border-black/5">
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <img src={imgFeatured} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#1c1c1e] text-[15px] font-bold">$790/mo · Studio</p>
            <p className="text-[#6c6a66] text-[12px] mt-0.5">May – Aug 2026 · 302 E John St</p>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(111,207,151,0.92)] text-[#1c1c1e] mt-1.5 inline-block">Verified</span>
          </div>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c0bdb8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

    </div>
  );
}
