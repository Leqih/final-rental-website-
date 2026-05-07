import { useState } from 'react'
import { listings } from '../../data/listings'

// ── Sublease data (inline) ────────────────────────────────────────────────────
const subleases = [
  { id: 1, name: 'Studio on Green St', price: 680, period: 'Summer', verified: true, beds: 'Studio', sqft: '420 sqft', img: listings[1].img, address: '302 E Green St', walkMins: 7, amenities: ['Furnished', 'Utilities incl.', 'Parking'], available: 'May 15 – Aug 15', postedBy: 'Emma W.', desc: 'Going home for the summer and subleasing my studio. Fully furnished, utilities included. Walk to campus in under 10 minutes. Everything you need is already there.' },
  { id: 2, name: '1BR near Grainger', price: 790, period: 'Spring', verified: true, beds: '1B1B', sqft: '560 sqft', img: listings[2].img, address: '512 E Green St', walkMins: 9, amenities: ['In-unit laundry', 'AC', 'Internet incl.'], available: 'Jan 1 – May 10', postedBy: 'Marcus T.', desc: 'Study abroad for spring semester. Clean 1BR with in-unit laundry and fast internet. Great natural light and quiet building near engineering campus.' },
  { id: 3, name: '2BR Chalmers', price: 950, period: 'Fall', verified: false, beds: '2B2B', sqft: '820 sqft', img: listings[5].img, address: '502 W Chalmers St', walkMins: 5, amenities: ['Furnished', 'Balcony', 'Gym access'], available: 'Aug 20 – Dec 20', postedBy: 'Jordan L.', desc: 'Graduating early and looking for someone to take over. Spacious 2BR with balcony and gym. Could split with a friend. Building has rooftop access.' },
  { id: 4, name: 'Cozy Studio near BIF', price: 720, period: 'Summer', verified: true, beds: 'Studio', sqft: '390 sqft', img: listings[3].img, address: '409 E Chalmers St', walkMins: 6, amenities: ['Furnished', 'Near bus stop'], available: 'May 10 – Aug 10', postedBy: 'Priya K.', desc: 'Internship in Chicago — subleasing my cozy furnished studio near BIF. MTD stop right outside. Super convenient for anyone on campus daily.' },
  { id: 5, name: '1BR Springfield Ave', price: 760, period: 'Spring', verified: false, beds: '1B1B', sqft: '610 sqft', img: listings[6].img, address: '114 W Springfield Ave', walkMins: 8, amenities: ['Updated kitchen', 'Parking', 'Courtyard'], available: 'Jan 5 – Apr 30', postedBy: 'Tyler B.', desc: 'Transferring for spring. Nice 1BR with updated kitchen and a courtyard. Parking spot included. Quiet street, great for grad students.' },
  { id: 6, name: '2BR Orchard Downs', price: 880, period: 'Fall', verified: true, beds: '2B1B', sqft: '750 sqft', img: listings[7].img, address: '2002 Orchard Downs Dr', walkMins: 12, amenities: ['Private yard', 'Parking', 'AC'], available: 'Aug 15 – Dec 15', postedBy: 'Sam P.', desc: 'Leaving for a semester abroad. Spacious 2BR near ACES, private yard and parking. Great for two roommates splitting rent.' },
]
const subleaseToMapId: Record<number, number> = { 1: 101, 2: 102, 3: 103, 4: 104, 5: 105, 6: 101 }

const bedFilters  = ['All', 'Studio', '1BR', '2BR+']
const sortOptions = ['Best Match', 'Price: Low', 'Price: High']
const periods     = ['All', 'Spring', 'Summer', 'Fall']

interface Props {
  onViewListing:  (id: number) => void
  savedIds?:      Set<number>
  onToggleSave?:  (id: number) => void
  onViewOnMap?:   (id: number) => void
  onNavigate?:    (tab: string) => void
}

export default function WebListingsScreen({ onViewListing, savedIds: savedIdsProp, onToggleSave, onViewOnMap, onNavigate }: Props) {
  // ── shared ──
  const [mode, setMode] = useState<'rent' | 'sublease'>('rent')

  // ── rent state ──
  const [activeBed,     setActiveBed]     = useState('All')
  const [sortBy,        setSortBy]        = useState('Best Match')
  const [localSavedIds, setLocalSavedIds] = useState<Set<number>>(new Set())
  const savedIds = savedIdsProp ?? localSavedIds
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [search,        setSearch]        = useState('')

  // ── sublease state ──
  const [activePeriod, setActivePeriod]     = useState('All')
  const [subSavedIds,  setSubSavedIds]      = useState<Set<number>>(new Set())
  const [selected,     setSelected]         = useState<typeof subleases[0] | null>(null)
  const [detailTab,    setDetailTab]        = useState<'overview' | 'amenities' | 'contact'>('overview')
  const [showMessage,  setShowMessage]      = useState(false)
  const [messageText,  setMessageText]      = useState('')
  const [messageSent,  setMessageSent]      = useState(false)
  const [interestSent, setInterestSent]     = useState(false)
  const [showPost,     setShowPost]         = useState(false)
  const [postSuccess,  setPostSuccess]      = useState(false)
  const [toast,        setToast]            = useState<string | null>(null)

  // ── helpers ──
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const toggleRentSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleSave) { onToggleSave(id); return }
    setLocalSavedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  const toggleSubSave = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSubSavedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  const sendMessage = () => {
    if (!messageText.trim()) return
    setMessageSent(true)
    setTimeout(() => { setShowMessage(false); setMessageSent(false); setMessageText(''); onNavigate?.('messages') }, 1200)
  }
  const expressInterest = () => {
    setInterestSent(true)
    showToast('Interest sent! ' + (selected?.postedBy.split(' ')[0] ?? 'Poster') + ' will be notified.')
    setTimeout(() => setInterestSent(false), 3000)
  }

  // ── rent filtering ──
  const filteredRent = listings.filter(l => {
    const matchesBed = activeBed === 'All' || (activeBed === 'Studio' && l.beds === 'Studio') || (activeBed === '1BR' && l.beds === '1B1B') || (activeBed === '2BR+' && (l.beds === '2B1B' || l.beds === '2B2B'))
    const matchesSearch = search.trim() === '' || l.name.toLowerCase().includes(search.toLowerCase()) || l.address.toLowerCase().includes(search.toLowerCase()) || l.amenities.some(a => a.toLowerCase().includes(search.toLowerCase()))
    const matchesSaved = !showSavedOnly || savedIds.has(l.id)
    return matchesBed && matchesSearch && matchesSaved
  })
  const sortedRent = [...filteredRent].sort((a, b) => sortBy === 'Price: Low' ? a.price - b.price : sortBy === 'Price: High' ? b.price - a.price : 0)

  // ── sublease filtering ──
  const filteredSub = subleases.filter(s => activePeriod === 'All' || s.period === activePeriod)

  // ── Sublease detail view ──────────────────────────────────────────────────
  if (selected) {
    return (
      <>
        <div className="flex flex-col flex-1 overflow-hidden bg-[#f7f6f2]" style={{ animation: 'fadeIn 0.18s ease' }}>
          <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>

          <div className="relative flex-shrink-0 flex flex-col" style={{ height: '42%' }}>
            <div className="flex-1 relative overflow-hidden">
              <img src={selected.img} alt={selected.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between">
                <button onClick={() => setSelected(null)} className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-[13px] font-semibold text-[#1c1c1e] shadow-sm hover:bg-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Back
                </button>
                <div className="flex items-center gap-2">
                  {selected.verified && (
                    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="text-[12px] font-semibold text-[#1c1c1e]">Verified</span>
                    </div>
                  )}
                  <button onClick={() => toggleSubSave(selected.id)} className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={subSavedIds.has(selected.id) ? '#1c1c1e' : 'none'} stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-[#1c1c1e] flex-shrink-0 flex items-center gap-3 px-5 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-[16px] font-bold text-white truncate">{selected.name}</h1>
                  <span className="text-[10px] font-semibold text-white/60 bg-white/15 px-2 py-0.5 rounded-full flex-shrink-0">{selected.period}</span>
                </div>
                <p className="text-[12px] text-white/50 truncate">{selected.address}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-[22px] font-black text-white leading-none">${selected.price.toLocaleString()}</p>
                <p className="text-[11px] text-white/40 mt-0.5">per month</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-white border-t border-[#e5e4e0]">
            <div className="px-6 pt-4 pb-0 flex-shrink-0">
              <div className="flex gap-2 mb-4 flex-wrap">
                {[['beds', selected.beds], ['sqft', selected.sqft], ['cal', selected.available], ['clock', `${selected.walkMins} min walk`]].map(([, val]) => (
                  <div key={val} className="flex items-center gap-1.5 bg-[#f7f6f2] rounded-xl px-3 py-2">
                    <span className="text-[12px] font-semibold text-[#1c1c1e]">{val}</span>
                  </div>
                ))}
                <div className="ml-auto flex items-center gap-2">
                  {onViewOnMap && (
                    <button onClick={() => onViewOnMap(subleaseToMapId[selected.id] ?? 101)} className="flex items-center gap-1.5 px-4 py-2 bg-[#f5f4f0] text-[#1c1c1e] text-[12px] font-semibold rounded-xl hover:bg-[#e5e4e0] transition-colors">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                      View on map
                    </button>
                  )}
                  <button onClick={() => setShowMessage(true)} className="px-4 py-2 bg-[#f5f4f0] text-[#1c1c1e] text-[12px] font-semibold rounded-xl hover:bg-[#e5e4e0] transition-colors">Message poster</button>
                  <button onClick={expressInterest} disabled={interestSent} className={`px-4 py-2 text-[12px] font-semibold rounded-xl transition-colors ${interestSent ? 'bg-[#f5f4f0] text-[#6c6a66] cursor-default' : 'bg-[#1c1c1e] text-white hover:bg-[#333]'}`}>{interestSent ? '✓ Interest sent' : 'Express interest →'}</button>
                </div>
              </div>
              <div className="flex border-b border-[#f0efeb] gap-5">
                {(['overview', 'amenities', 'contact'] as const).map(tab => (
                  <button key={tab} onClick={() => setDetailTab(tab)} className={`py-2.5 text-[13px] font-semibold whitespace-nowrap border-b-2 -mb-px transition-all capitalize ${detailTab === tab ? 'border-[#1c1c1e] text-[#1c1c1e]' : 'border-transparent text-[#9ca3af] hover:text-[#1c1c1e]'}`}>
                    {tab === 'overview' ? 'Overview' : tab === 'amenities' ? 'Amenities' : 'Contact'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {detailTab === 'overview' && (
                <div className="space-y-6">
                  <p className="text-[14px] text-[#3c3c3e] leading-relaxed">{selected.desc}</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-3">Quick facts</p>
                      <div className="space-y-2">
                        {[['Period', `${selected.period} semester`], ['Available', selected.available], ['Bedrooms', selected.beds], ['Size', selected.sqft], ['Walk to campus', `${selected.walkMins} min`], ['Furnished', selected.amenities.includes('Furnished') ? 'Yes' : 'No']].map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between bg-[#f9f8f6] rounded-xl px-3.5 py-2.5">
                            <span className="text-[12px] text-[#6c6a66]">{k}</span>
                            <span className="text-[12px] font-semibold text-[#1c1c1e]">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-3">Included</p>
                        <div className="flex flex-wrap gap-1.5">{selected.amenities.map(a => <span key={a} className="text-[12px] bg-[#f9f8f6] border border-[#eeecea] text-[#1c1c1e] px-3 py-1.5 rounded-xl font-medium">{a}</span>)}</div>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-3">Posted by</p>
                        <div className="bg-[#f9f8f6] rounded-2xl p-3.5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#1c1c1e] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{selected.postedBy[0]}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#1c1c1e]">{selected.postedBy}</p>
                            <p className="text-[11px] text-[#6c6a66] mt-0.5">UIUC Student · Verified poster</p>
                          </div>
                          <button onClick={() => setShowMessage(true)} className="px-3 py-1.5 bg-[#1c1c1e] text-white text-[11px] font-semibold rounded-xl hover:bg-[#333] transition-colors flex-shrink-0">Message →</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {detailTab === 'amenities' && (
                <div>
                  <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-4">All amenities</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selected.amenities.map(a => (
                      <div key={a} className="bg-[#f9f8f6] rounded-2xl p-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#f0efeb] flex items-center justify-center flex-shrink-0">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <span className="text-[12px] font-medium text-[#1c1c1e] leading-snug">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {detailTab === 'contact' && (
                <div className="space-y-5">
                  <div className="bg-[#f9f8f6] rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#1c1c1e] flex items-center justify-center text-white text-base font-bold flex-shrink-0">{selected.postedBy[0]}</div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#1c1c1e]">{selected.postedBy}</p>
                        <p className="text-[12px] text-[#6c6a66]">UIUC Student · Posted this sublease</p>
                      </div>
                    </div>
                    <button onClick={() => setShowMessage(true)} className="w-full py-3 bg-[#1c1c1e] text-white text-[13px] font-semibold rounded-xl hover:bg-[#333] transition-colors">Send message →</button>
                  </div>
                  <div className="bg-[#f9f8f6] rounded-2xl p-4">
                    <p className="text-[12px] font-bold text-[#9ca3af] uppercase tracking-widest mb-2">Availability</p>
                    <p className="text-[15px] font-semibold text-[#1c1c1e]">{selected.available}</p>
                    <p className="text-[12px] text-[#6c6a66] mt-1">{selected.period} semester sublease</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message modal */}
        {showMessage && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => !messageSent && setShowMessage(false)}>
            <div className="bg-white rounded-2xl w-full max-w-md mx-6 overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              {messageSent ? (
                <div className="p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#f5f4f0] flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-[15px] font-bold text-[#1c1c1e]">Message sent!</p>
                  <p className="text-[13px] text-[#6c6a66] mt-1">Redirecting to Messages…</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0efeb]">
                    <p className="text-[15px] font-bold text-[#1c1c1e]">Message {selected.postedBy.split(' ')[0]}</p>
                    <button onClick={() => setShowMessage(false)} className="w-7 h-7 rounded-lg bg-[#f5f4f0] flex items-center justify-center hover:bg-[#e5e4e0] transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6c6a66" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                  <div className="px-5 py-4">
                    <div className="bg-[#f9f8f6] rounded-xl px-4 py-3 mb-3">
                      <p className="text-[12px] text-[#6c6a66]">Re: <span className="font-semibold text-[#1c1c1e]">{selected.name}</span> · {selected.available}</p>
                    </div>
                    <textarea value={messageText} onChange={e => setMessageText(e.target.value)} placeholder={`Hi, I'm interested in your sublease at ${selected.address}…`} className="w-full h-28 text-[13px] text-[#1c1c1e] placeholder-[#aaa] bg-[#f9f8f6] rounded-xl px-4 py-3 outline-none resize-none border border-transparent focus:border-[#e5e4e0]" />
                    <button onClick={sendMessage} disabled={!messageText.trim()} className="mt-3 w-full py-3 bg-[#1c1c1e] text-white text-[13px] font-semibold rounded-xl hover:bg-[#333] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Send message →</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1c1c1e] text-white text-[13px] font-semibold px-5 py-2.5 rounded-2xl shadow-lg z-50 pointer-events-none" style={{ animation: 'fadeIn 0.15s ease' }}>
            {toast}
          </div>
        )}
      </>
    )
  }

  // ── Main list view ────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f4f0]">
      {/* Header */}
      <div className="bg-white border-b border-[#e5e4e0]">
        <div className="max-w-6xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1c1c1e] tracking-tight">Listings</h1>
              <p className="text-sm text-[#6c6a66] mt-0.5">
                {mode === 'rent'
                  ? `${sortedRent.length} apartments available near UIUC`
                  : `${filteredSub.length} subleases from UIUC students`}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Rent / Sublease toggle */}
              <div className="flex bg-[#f5f4f0] rounded-xl p-1 gap-1">
                {(['rent', 'sublease'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${mode === m ? 'bg-white text-[#1c1c1e] shadow-sm' : 'text-[#6c6a66] hover:text-[#1c1c1e]'}`}
                  >
                    {m === 'rent' ? 'Rent' : 'Sublease'}
                  </button>
                ))}
              </div>

              {/* Search (rent only) */}
              {mode === 'rent' && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#f5f4f0] rounded-xl border border-transparent hover:border-[#e0deda] w-48">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="flex-1 text-[13px] text-[#1c1c1e] placeholder-[#aaa] bg-transparent outline-none" />
                </div>
              )}

              {/* Sort (rent only) */}
              {mode === 'rent' && (
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-sm border border-[#e5e4e0] rounded-xl px-3 py-2.5 text-[#1c1c1e] bg-white outline-none">
                  {sortOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              )}

              {/* Post sublease (sublease only) */}
              {mode === 'sublease' && (
                <button onClick={() => setShowPost(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#1c1c1e] text-white text-[13px] font-semibold rounded-xl hover:bg-[#333] transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Post a sublease
                </button>
              )}
            </div>
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-2 mt-4">
            {mode === 'rent' ? (
              <>
                {bedFilters.map(f => (
                  <button key={f} onClick={() => setActiveBed(f)} className={`px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-all ${activeBed === f ? 'bg-[#1c1c1e] text-white' : 'bg-[#f5f4f0] text-[#6c6a66] hover:bg-[#e5e4e0] hover:text-[#1c1c1e]'}`}>{f}</button>
                ))}
                {savedIds.size > 0 && (
                  <button onClick={() => setShowSavedOnly(s => !s)} className={`ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-all ${showSavedOnly ? 'bg-[#1c1c1e] text-white' : 'bg-[#f5f4f0] text-[#6c6a66] hover:bg-[#e5e4e0]'}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={showSavedOnly ? 'white' : '#1c1c1e'} stroke={showSavedOnly ? 'white' : '#1c1c1e'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {showSavedOnly ? `Saved (${savedIds.size}) ×` : `Saved (${savedIds.size})`}
                  </button>
                )}
              </>
            ) : (
              <>
                {periods.map(p => (
                  <button key={p} onClick={() => setActivePeriod(p)} className={`px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-all ${activePeriod === p ? 'bg-[#1c1c1e] text-white' : 'bg-[#f5f4f0] text-[#6c6a66] hover:bg-[#e5e4e0] hover:text-[#1c1c1e]'}`}>{p}</button>
                ))}
                <span className="ml-auto flex items-center gap-1.5 text-[12px] text-[#9ca3af]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  All verified student-to-student
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-8 py-6">
        {mode === 'rent' ? (
          sortedRent.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-4 text-3xl shadow-sm">🏠</div>
              <p className="text-[15px] font-semibold text-[#1c1c1e]">No listings found</p>
              <p className="text-[13px] text-[#9ca3af] mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {sortedRent.map(l => (
                <div key={l.id} onClick={() => onViewListing(l.id)} className="bg-white rounded-2xl overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-200">
                  <div className="relative h-44 overflow-hidden flex-shrink-0">
                    <img src={l.img} alt={l.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-xl ${l.badge === 'Verified' ? 'bg-[#1c1c1e] text-white' : 'bg-white/90 text-[#1c1c1e]'}`}>{l.badge}</span>
                    </div>
                    <div role="button" onClick={e => toggleRentSave(l.id, e as unknown as React.MouseEvent)} className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors cursor-pointer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={savedIds.has(l.id) ? '#1c1c1e' : 'none'} stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="text-[16px] font-black text-white leading-none">${l.price}<span className="text-[11px] font-normal text-white/70">/mo</span></span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="text-[10px] font-medium text-white/70 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-lg">{l.available}</span>
                    </div>
                  </div>
                  <div className="p-3.5">
                    <p className="text-[14px] font-bold text-[#1c1c1e] leading-tight mb-0.5">{l.name}</p>
                    <p className="text-[11px] text-[#9ca3af] mb-3 truncate">{l.address}</p>
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="flex items-center gap-1 text-[11px] text-[#6c6a66] bg-[#f5f4f0] px-2 py-1 rounded-lg">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"/><path d="M2 9h20"/><path d="M2 9v10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9"/><line x1="12" y1="9" x2="12" y2="20"/></svg>
                        {l.beds}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#6c6a66] bg-[#f5f4f0] px-2 py-1 rounded-lg">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                        {l.sqft}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#6c6a66] bg-[#f5f4f0] px-2 py-1 rounded-lg">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {Math.min(...Object.values(l.walkFrom))} min
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {l.amenities.slice(0, 3).map(a => <span key={a} className="text-[10px] text-[#6c6a66] bg-[#f9f8f6] border border-[#eeecea] px-2 py-0.5 rounded-lg">{a}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // ── Sublease grid ──
          <div className="grid grid-cols-3 gap-5">
            {filteredSub.map(s => (
              <div key={s.id} onClick={() => { setSelected(s); setDetailTab('overview') }} className="bg-white rounded-2xl overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-200">
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-xl ${s.verified ? 'bg-[#1c1c1e] text-white' : 'bg-white/90 text-[#1c1c1e]'}`}>{s.verified ? 'Verified' : 'Student'}</span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-xl bg-white/90 text-[#1c1c1e]">{s.period}</span>
                  </div>
                  <div role="button" onClick={e => { e.stopPropagation(); toggleSubSave(s.id) }} className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={subSavedIds.has(s.id) ? '#1c1c1e' : 'none'} stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="text-[16px] font-black text-white leading-none">${s.price}<span className="text-[11px] font-normal text-white/70">/mo</span></span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="text-[10px] font-medium text-white/70 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-lg">{s.available}</span>
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="text-[14px] font-bold text-[#1c1c1e] leading-tight mb-0.5">{s.name}</p>
                  <p className="text-[11px] text-[#9ca3af] mb-3 truncate">{s.address}</p>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="flex items-center gap-1 text-[11px] text-[#6c6a66] bg-[#f5f4f0] px-2 py-1 rounded-lg">{s.beds}</span>
                    <span className="flex items-center gap-1 text-[11px] text-[#6c6a66] bg-[#f5f4f0] px-2 py-1 rounded-lg">{s.sqft}</span>
                    <span className="flex items-center gap-1 text-[11px] text-[#6c6a66] bg-[#f5f4f0] px-2 py-1 rounded-lg">{s.walkMins} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {s.amenities.slice(0, 2).map(a => <span key={a} className="text-[10px] text-[#6c6a66] bg-[#f9f8f6] border border-[#eeecea] px-2 py-0.5 rounded-lg">{a}</span>)}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-5 h-5 rounded-full bg-[#1c1c1e] flex items-center justify-center text-white text-[9px] font-bold">{s.postedBy[0]}</div>
                      <span className="text-[11px] text-[#6c6a66]">{s.postedBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post sublease modal */}
      {showPost && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => !postSuccess && setShowPost(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-6 overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {postSuccess ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#f5f4f0] flex items-center justify-center mx-auto mb-5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-[17px] font-bold text-[#1c1c1e] mb-1">Sublease posted!</p>
                <p className="text-[13px] text-[#6c6a66] mb-6">Your listing is now live and visible to UIUC students.</p>
                <button onClick={() => { setShowPost(false); setPostSuccess(false) }} className="px-6 py-2.5 bg-[#1c1c1e] text-white text-[13px] font-semibold rounded-xl hover:bg-[#333] transition-colors">Done</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0efeb]">
                  <p className="text-[16px] font-bold text-[#1c1c1e]">Post a sublease</p>
                  <button onClick={() => setShowPost(false)} className="w-7 h-7 rounded-lg bg-[#f5f4f0] flex items-center justify-center hover:bg-[#e5e4e0] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6c6a66" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  {[['Address', 'e.g. 302 E Green St, Apt 4B'], ['Price / month', 'e.g. $750'], ['Available dates', 'e.g. May 15 – Aug 15'], ['Description', 'Tell prospective renters about your place…']].map(([label, placeholder]) => (
                    <div key={label}>
                      <label className="block text-[12px] font-semibold text-[#1c1c1e] mb-1.5">{label}</label>
                      {label === 'Description'
                        ? <textarea placeholder={placeholder} className="w-full h-24 text-[13px] text-[#1c1c1e] placeholder-[#aaa] bg-[#f9f8f6] rounded-xl px-4 py-3 outline-none resize-none border border-transparent focus:border-[#e5e4e0]" />
                        : <input type="text" placeholder={placeholder} className="w-full text-[13px] text-[#1c1c1e] placeholder-[#aaa] bg-[#f9f8f6] rounded-xl px-4 py-2.5 outline-none border border-transparent focus:border-[#e5e4e0]" />
                      }
                    </div>
                  ))}
                  <button onClick={() => setPostSuccess(true)} className="w-full py-3 bg-[#1c1c1e] text-white text-[13px] font-semibold rounded-xl hover:bg-[#333] transition-colors">Post sublease →</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1c1c1e] text-white text-[13px] font-semibold px-5 py-2.5 rounded-2xl shadow-lg z-50 pointer-events-none" style={{ animation: 'fadeIn 0.15s ease' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
