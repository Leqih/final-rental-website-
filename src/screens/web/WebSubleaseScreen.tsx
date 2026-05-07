import { useState } from 'react'
import { listings } from '../../data/listings'

const periods = ['All', 'Spring', 'Summer', 'Fall']

const subleases = [
  { id: 1, name: 'Studio on Green St', price: 680, period: 'Summer', verified: true, beds: 'Studio', sqft: '420 sqft', img: listings[1].img, address: '302 E Green St', walkMins: 7, amenities: ['Furnished', 'Utilities incl.', 'Parking'], available: 'May 15 – Aug 15', postedBy: 'Emma W.', desc: 'Going home for the summer and subleasing my studio. Fully furnished, utilities included. Walk to campus in under 10 minutes. Everything you need is already there.' },
  { id: 2, name: '1BR near Grainger', price: 790, period: 'Spring', verified: true, beds: '1B1B', sqft: '560 sqft', img: listings[2].img, address: '512 E Green St', walkMins: 9, amenities: ['In-unit laundry', 'AC', 'Internet incl.'], available: 'Jan 1 – May 10', postedBy: 'Marcus T.', desc: 'Study abroad for spring semester. Clean 1BR with in-unit laundry and fast internet. Great natural light and quiet building near engineering campus.' },
  { id: 3, name: '2BR Chalmers', price: 950, period: 'Fall', verified: false, beds: '2B2B', sqft: '820 sqft', img: listings[5].img, address: '502 W Chalmers St', walkMins: 5, amenities: ['Furnished', 'Balcony', 'Gym access'], available: 'Aug 20 – Dec 20', postedBy: 'Jordan L.', desc: 'Graduating early and looking for someone to take over. Spacious 2BR with balcony and gym. Could split with a friend. Building has rooftop access.' },
  { id: 4, name: 'Cozy Studio near BIF', price: 720, period: 'Summer', verified: true, beds: 'Studio', sqft: '390 sqft', img: listings[3].img, address: '409 E Chalmers St', walkMins: 6, amenities: ['Furnished', 'Near bus stop'], available: 'May 10 – Aug 10', postedBy: 'Priya K.', desc: 'Internship in Chicago — subleasing my cozy furnished studio near BIF. MTD stop right outside. Super convenient for anyone on campus daily.' },
  { id: 5, name: '1BR Springfield Ave', price: 760, period: 'Spring', verified: false, beds: '1B1B', sqft: '610 sqft', img: listings[6].img, address: '114 W Springfield Ave', walkMins: 8, amenities: ['Updated kitchen', 'Parking', 'Courtyard'], available: 'Jan 5 – Apr 30', postedBy: 'Tyler B.', desc: 'Transferring for spring. Nice 1BR with updated kitchen and a courtyard. Parking spot included. Quiet street, great for grad students.' },
  { id: 6, name: '2BR Orchard Downs', price: 880, period: 'Fall', verified: true, beds: '2B1B', sqft: '750 sqft', img: listings[7].img, address: '2002 Orchard Downs Dr', walkMins: 12, amenities: ['Private yard', 'Parking', 'AC'], available: 'Aug 15 – Dec 15', postedBy: 'Sam P.', desc: 'Leaving for a semester abroad. Spacious 2BR near ACES, private yard and parking. Great for two roommates splitting rent.' },
]

interface Props {
  onViewOnMap?: (id: number) => void
  onNavigate?: (tab: string) => void
}

// Maps WebSubleaseScreen local IDs → WebExploreScreen sublease pin IDs
const subleaseToMapId: Record<number, number> = { 1: 101, 2: 102, 3: 103, 4: 104, 5: 105, 6: 101 }

export default function WebSubleaseScreen({ onViewOnMap, onNavigate }: Props = {}) {
  const [activePeriod, setActivePeriod] = useState('All')
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())
  const [showPost, setShowPost] = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)
  const [selected, setSelected] = useState<typeof subleases[0] | null>(null)
  const [detailTab, setDetailTab] = useState<'overview' | 'amenities' | 'contact'>('overview')
  const [showMessage, setShowMessage] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageSent, setMessageSent] = useState(false)
  const [interestSent, setInterestSent] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const sendMessage = () => {
    if (!messageText.trim()) return
    setMessageSent(true)
    setTimeout(() => {
      setShowMessage(false)
      setMessageSent(false)
      setMessageText('')
      onNavigate?.('messages')
    }, 1200)
  }

  const expressInterest = () => {
    setInterestSent(true)
    showToast('Interest sent! ' + (selected?.postedBy.split(' ')[0] ?? 'Poster') + ' will be notified.')
    setTimeout(() => setInterestSent(false), 3000)
  }

  const filtered = subleases.filter(s => activePeriod === 'All' || s.period === activePeriod)

  const toggleSave = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSavedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── Detail view (matches listing detail layout) ──
  if (selected) {
    return (
      <>
      <div className="flex flex-col flex-1 overflow-hidden bg-[#f7f6f2]" style={{ animation: 'fadeIn 0.18s ease' }}>
        <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>

        {/* ── Photo section (42%) ── */}
        <div className="relative flex-shrink-0 flex flex-col" style={{ height: '42%' }}>
          <div className="flex-1 relative overflow-hidden">
            <img src={selected.img} alt={selected.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Back + badges + save */}
            <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between">
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-[13px] font-semibold text-[#1c1c1e] shadow-sm hover:bg-white transition-colors"
              >
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
                <button
                  onClick={() => toggleSave(selected.id)}
                  className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={savedIds.has(selected.id) ? '#1c1c1e' : 'none'} stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Black info bar */}
          <div className="bg-[#1c1c1e] flex-shrink-0 flex items-center gap-3 px-5 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-[16px] font-bold text-white truncate">{selected.name}</h1>
                <span className="text-[10px] font-semibold text-white/60 bg-white/15 px-2 py-0.5 rounded-full flex-shrink-0">{selected.period}</span>
                {selected.verified && <span className="text-[10px] font-semibold text-[#1c1c1e] bg-white/90 px-2 py-0.5 rounded-full flex-shrink-0">✓ Verified</span>}
              </div>
              <p className="text-[12px] text-white/50 truncate">{selected.address}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-[22px] font-black text-white leading-none">${selected.price.toLocaleString()}</p>
              <p className="text-[11px] text-white/40 mt-0.5">per month</p>
            </div>
          </div>
        </div>

        {/* ── Bottom: Detail panel ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white border-t border-[#e5e4e0]">

          {/* Specs row + tab bar */}
          <div className="px-6 pt-4 pb-0 flex-shrink-0">
            <div className="flex gap-2 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 bg-[#f7f6f2] rounded-xl px-3 py-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6c6a66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"/><path d="M2 9h20"/><path d="M2 9v10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9"/><line x1="12" y1="9" x2="12" y2="20"/></svg>
                <span className="text-[12px] font-semibold text-[#1c1c1e]">{selected.beds}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f7f6f2] rounded-xl px-3 py-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6c6a66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                <span className="text-[12px] font-semibold text-[#1c1c1e]">{selected.sqft}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f7f6f2] rounded-xl px-3 py-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6c6a66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span className="text-[12px] font-semibold text-[#1c1c1e]">{selected.available}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f7f6f2] rounded-xl px-3 py-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6c6a66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className="text-[12px] font-semibold text-[#1c1c1e]">{selected.walkMins} min walk</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {onViewOnMap && (
                  <button
                    onClick={() => onViewOnMap(subleaseToMapId[selected.id] ?? 101)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#f5f4f0] text-[#1c1c1e] text-[12px] font-semibold rounded-xl hover:bg-[#e5e4e0] transition-colors"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                    View on map
                  </button>
                )}
                <button onClick={() => setShowMessage(true)} className="px-4 py-2 bg-[#f5f4f0] text-[#1c1c1e] text-[12px] font-semibold rounded-xl hover:bg-[#e5e4e0] transition-colors">Message poster</button>
                <button onClick={expressInterest} disabled={interestSent} className={`px-4 py-2 text-[12px] font-semibold rounded-xl transition-colors ${interestSent ? 'bg-[#f5f4f0] text-[#6c6a66] cursor-default' : 'bg-[#1c1c1e] text-white hover:bg-[#333]'}`}>{interestSent ? '✓ Interest sent' : 'Express interest →'}</button>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-[#f0efeb] gap-5">
              {(['overview', 'amenities', 'contact'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`py-2.5 text-[13px] font-semibold whitespace-nowrap border-b-2 -mb-px transition-all capitalize ${
                    detailTab === tab
                      ? 'border-[#1c1c1e] text-[#1c1c1e]'
                      : 'border-transparent text-[#9ca3af] hover:text-[#1c1c1e]'
                  }`}
                >
                  {tab === 'overview' ? 'Overview' : tab === 'amenities' ? 'Amenities' : 'Contact'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">

            {/* Overview */}
            {detailTab === 'overview' && (
              <div className="space-y-6">
                <p className="text-[14px] text-[#3c3c3e] leading-relaxed">{selected.desc}</p>

                <div className="grid grid-cols-2 gap-6">
                  {/* Quick facts */}
                  <div>
                    <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-3">Quick facts</p>
                    <div className="space-y-2">
                      {[
                        ['Period', `${selected.period} semester`],
                        ['Available', selected.available],
                        ['Bedrooms', selected.beds],
                        ['Size', selected.sqft],
                        ['Walk to campus', `${selected.walkMins} min`],
                        ['Furnished', selected.amenities.includes('Furnished') ? 'Yes' : 'No'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between bg-[#f9f8f6] rounded-xl px-3.5 py-2.5">
                          <span className="text-[12px] text-[#6c6a66]">{k}</span>
                          <span className="text-[12px] font-semibold text-[#1c1c1e]">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Poster + amenity highlights */}
                  <div className="space-y-5">
                    <div>
                      <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-3">Included</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.amenities.map(a => (
                          <span key={a} className="text-[12px] bg-[#f9f8f6] border border-[#eeecea] text-[#1c1c1e] px-3 py-1.5 rounded-xl font-medium">{a}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-3">Posted by</p>
                      <div className="bg-[#f9f8f6] rounded-2xl p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1c1c1e] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {selected.postedBy[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#1c1c1e]">{selected.postedBy}</p>
                          <p className="text-[11px] text-[#6c6a66] mt-0.5">UIUC Student · Verified poster</p>
                        </div>
                        <button onClick={() => setShowMessage(true)} className="px-3 py-1.5 bg-[#1c1c1e] text-white text-[11px] font-semibold rounded-xl hover:bg-[#333] transition-colors flex-shrink-0">
                          Message →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Amenities */}
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

            {/* Contact */}
            {detailTab === 'contact' && (
              <div className="space-y-4 max-w-lg">
                <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-4">About the poster</p>
                <div className="bg-[#f9f8f6] rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1c1c1e] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {selected.postedBy[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-bold text-[#1c1c1e]">{selected.postedBy}</p>
                    <p className="text-[13px] text-[#6c6a66] mt-0.5">UIUC Student · Posted this sublease</p>
                    {selected.verified && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span className="text-[11px] font-semibold text-[#1c1c1e]">Identity verified</span>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => setShowMessage(true)} className="w-full py-3 bg-[#1c1c1e] text-white text-[13px] font-semibold rounded-xl hover:bg-[#333] transition-colors">
                  Message {selected.postedBy.split(' ')[0]} →
                </button>
                <button onClick={expressInterest} disabled={interestSent} className={`w-full py-3 text-[13px] font-semibold rounded-xl transition-colors ${interestSent ? 'bg-[#f9f8f6] text-[#6c6a66] cursor-default' : 'bg-[#f5f4f0] text-[#1c1c1e] hover:bg-[#e5e4e0]'}`}>
                  {interestSent ? '✓ Interest sent!' : 'Express interest'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1c1c1e] text-white text-[13px] font-semibold px-5 py-3 rounded-2xl shadow-xl" style={{ animation: 'fadeIn 0.2s ease' }}>
          {toast}
        </div>
      )}

      {/* Message modal */}
      {showMessage && selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowMessage(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0efeb]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1c1c1e] flex items-center justify-center text-white text-sm font-bold">{selected.postedBy[0]}</div>
                <div>
                  <p className="text-[14px] font-bold text-[#1c1c1e]">{selected.postedBy}</p>
                  <p className="text-[11px] text-[#9ca3af]">Re: {selected.name}</p>
                </div>
              </div>
              <button onClick={() => setShowMessage(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9ca3af] hover:bg-[#f5f4f0] hover:text-[#1c1c1e] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {messageSent ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[#f5f4f0] flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-[15px] font-bold text-[#1c1c1e]">Message sent!</p>
                <p className="text-[13px] text-[#6c6a66] mt-1">Opening your messages…</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="bg-[#f9f8f6] rounded-xl px-4 py-3 text-[13px] text-[#6c6a66]">
                  Hi, I'm interested in your sublease at <span className="font-semibold text-[#1c1c1e]">{selected.address}</span> ({selected.available}). Is it still available?
                </div>
                <textarea
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Add a personal note (optional)..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[#e5e4e0] text-[13px] text-[#1c1c1e] placeholder-[#9ca3af] outline-none focus:border-[#1c1c1e] transition-colors resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowMessage(false)} className="flex-1 py-2.5 rounded-xl border border-[#e5e4e0] text-[13px] font-semibold text-[#6c6a66] hover:bg-[#f5f4f0] transition-colors">Cancel</button>
                  <button onClick={sendMessage} className="flex-1 py-2.5 bg-[#1c1c1e] text-white rounded-xl text-[13px] font-semibold hover:bg-[#333] transition-colors">Send message</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </>
    )
  }

  // ── Listing grid ──
  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f4f0]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#e5e4e0] px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#1c1c1e]">Sublease Marketplace</h1>
            <p className="text-sm text-[#6c6a66] mt-0.5">Short-term housing from fellow students</p>
          </div>
          <button
            onClick={() => setShowPost(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1c1c1e] text-white text-sm font-medium rounded-xl hover:bg-[#2c2c2e] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Post a sublease
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Trust banner */}
        <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#f5f4f0] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1c1c1e]">All verified subleases are student-reviewed</p>
            <p className="text-xs text-[#6c6a66] mt-0.5">We verify identity, lease documents, and building access before approving listings</p>
          </div>
        </div>

        {/* Period tabs */}
        <div className="flex gap-2 mb-6">
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                activePeriod === p
                  ? 'bg-[#1c1c1e] text-white'
                  : 'bg-white text-[#6c6a66] border border-[#e5e4e0] hover:border-[#1c1c1e] hover:text-[#1c1c1e]'
              }`}
            >
              {p}
            </button>
          ))}
          <span className="ml-auto text-sm text-[#6c6a66] self-center">{filtered.length} listings</span>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-3 gap-5">
          {filtered.map(s => (
            <div key={s.id} onClick={() => { setSelected(s); setDetailTab('overview'); }} className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 group">
              <div className="relative h-44 overflow-hidden">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white">{s.period}</span>
                  {s.verified && (
                    <span className="bg-white/90 text-[#1c1c1e] text-xs font-semibold px-2.5 py-1 rounded-full">Verified</span>
                  )}
                </div>
                <button
                  onClick={e => toggleSave(s.id, e)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={savedIds.has(s.id) ? '#1c1c1e' : 'none'} stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <div className="absolute bottom-3 left-3">
                  <p className="text-white font-bold text-lg">${s.price}<span className="text-white/70 text-xs font-normal">/mo</span></p>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-[#1c1c1e] text-sm leading-tight">{s.name}</p>
                <p className="text-xs text-[#6c6a66] mt-1">{s.address}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-[#6c6a66]">{s.beds}</span>
                  <span className="text-xs text-[#9ca3af]">{s.walkMins} min walk</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {s.amenities.slice(0, 3).map(a => (
                    <span key={a} className="text-xs bg-[#f5f4f0] text-[#6c6a66] px-2 py-0.5 rounded-lg">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post modal */}
      {showPost && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={() => setShowPost(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1c1c1e]">Post a sublease</h3>
              <button onClick={() => setShowPost(false)} className="text-[#6c6a66] hover:text-[#1c1c1e]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#6c6a66] uppercase tracking-wider block mb-1.5">Address</label>
                  <input placeholder="e.g. 302 E Green St" className="w-full px-3 py-2.5 rounded-xl border border-[#e5e4e0] text-sm text-[#1c1c1e] placeholder-[#bbb] outline-none focus:ring-2 focus:ring-[#1c1c1e]/10" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#6c6a66] uppercase tracking-wider block mb-1.5">Monthly rent</label>
                  <input type="number" placeholder="$750" className="w-full px-3 py-2.5 rounded-xl border border-[#e5e4e0] text-sm text-[#1c1c1e] placeholder-[#bbb] outline-none focus:ring-2 focus:ring-[#1c1c1e]/10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#6c6a66] uppercase tracking-wider block mb-1.5">Bed type</label>
                  <select className="w-full px-3 py-2.5 rounded-xl border border-[#e5e4e0] text-sm text-[#1c1c1e] bg-white outline-none">
                    <option>Studio</option><option>1B1B</option><option>2B1B</option><option>2B2B</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#6c6a66] uppercase tracking-wider block mb-1.5">Period</label>
                  <select className="w-full px-3 py-2.5 rounded-xl border border-[#e5e4e0] text-sm text-[#1c1c1e] bg-white outline-none">
                    <option>Spring</option><option>Summer</option><option>Fall</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#6c6a66] uppercase tracking-wider block mb-1.5">Description</label>
                <textarea rows={3} placeholder="Describe the unit, what's included, move-in/out dates..." className="w-full px-3 py-2.5 rounded-xl border border-[#e5e4e0] text-sm text-[#1c1c1e] placeholder-[#bbb] outline-none focus:ring-2 focus:ring-[#1c1c1e]/10 resize-none" />
              </div>
              {postSuccess ? (
                <div className="py-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#f5f4f0] flex items-center justify-center mx-auto">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-[15px] font-bold text-[#1c1c1e]">Listing submitted!</p>
                  <p className="text-[13px] text-[#6c6a66]">We'll review and post it within 24 hours.</p>
                </div>
              ) : (
                <button
                  onClick={() => { setPostSuccess(true); setTimeout(() => { setShowPost(false); setPostSuccess(false); }, 2000); }}
                  className="w-full py-3 bg-[#1c1c1e] text-white rounded-xl text-sm font-semibold hover:bg-[#2c2c2e] transition-colors"
                >
                  Submit listing
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast (grid view) */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1c1c1e] text-white text-[13px] font-semibold px-5 py-3 rounded-2xl shadow-xl" style={{ animation: 'fadeIn 0.2s ease' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
