import { useState } from 'react';

const imgStudio = "https://www.figma.com/api/mcp/asset/765a1ec7-8303-4a02-afda-f3b9bc837b0d";
const imgRoom = "https://www.figma.com/api/mcp/asset/481bab36-78dd-4cd9-8a90-26cf98634eb2";
const imgFeatured = "https://www.figma.com/api/mcp/asset/c8e3188c-7fb9-418a-a3e9-9148a677a791";

type Period = 'All' | 'Spring' | 'Summer' | 'Fall';

const subleases = [
  {
    id: 1, img: imgStudio, price: 790, type: 'Studio', period: 'Summer' as Period,
    title: 'Studio at Green Street',
    dates: 'May – Aug 2026',
    address: '302 E John St',
    dist: 7,
    verified: true,
    reviewed: true,
    poster: 'Min J.',
    posted: '2d ago',
  },
  {
    id: 2, img: imgRoom, price: 680, type: '1 room / 2B2B', period: 'Fall' as Period,
    title: '1 room in 2-bed at Clark St',
    dates: 'Aug – Dec 2026',
    address: '512 E Clark St',
    dist: 10,
    verified: false,
    reviewed: true,
    poster: 'Dana R.',
    posted: '5d ago',
  },
  {
    id: 3, img: imgFeatured, price: 840, type: '1B1B', period: 'Summer' as Period,
    title: '1BR at The Dean — summer only',
    dates: 'Jun – Aug 2026',
    address: '1011 S First St',
    dist: 8,
    verified: true,
    reviewed: false,
    poster: 'Chris W.',
    posted: '1d ago',
  },
];

const periods: Period[] = ['All', 'Spring', 'Summer', 'Fall'];

export default function SubleaseScreen() {
  const [period, setPeriod] = useState<Period>('All');
  const [showPostModal, setShowPostModal] = useState(false);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [form, setForm] = useState({ title: '', price: '', type: '', dates: '', address: '', notes: '' });
  const [step, setStep] = useState(1);

  const filtered = period === 'All' ? subleases : subleases.filter(s => s.period === period);

  const toggleSave = (id: number) => {
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="flex flex-col h-full bg-[#f7f6f2]">

      {/* ── Header ── */}
      <div className="bg-white px-5 pt-5 pb-3 border-b border-black/5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-[11px] font-semibold text-[#6c6a66] tracking-widest uppercase">Sublease</p>
            <p className="text-[22px] font-bold text-[#1c1c1e] leading-tight mt-1">Short-term stays</p>
          </div>
        </div>
        <p className="text-[#6c6a66] text-[14px] mt-1 mb-4">Verified sublease listings from fellow students</p>

        {/* Period tabs */}
        <div className="flex gap-2">
          {periods.map(p => (
            <button key={p}
              onClick={() => setPeriod(p)}
              className={`h-9 px-4 rounded-full text-[13px] font-semibold transition-all ${
                period === p
                  ? 'bg-[#1c1c1e] text-white'
                  : 'bg-[#f0efe9] text-[#6c6a66]'
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">

        {/* Trust banner */}
        <div className="bg-white rounded-2xl p-4 mb-4 border border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(111,207,151,0.2)] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[#1c1c1e] text-[14px] font-semibold">How we verify subleases</p>
              <p className="text-[#6c6a66] text-[12px] mt-0.5">Student contact · Lease confirmed · No upfront pressure</p>
            </div>
            <button className="text-[#1c1c1e] text-[12px] font-semibold flex-shrink-0">Learn →</button>
          </div>
        </div>

        {/* Result count */}
        <p className="text-[13px] text-[#6c6a66] mb-3">
          {filtered.length} listing{filtered.length !== 1 ? 's' : ''}
          {period !== 'All' && <> · <span className="font-medium text-[#1c1c1e]">{period} 2026</span></>}
        </p>

        {/* Listing cards */}
        <div className="flex flex-col gap-3">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm">
              {/* Image */}
              <div className="h-44 overflow-hidden relative">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {/* Top badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.verified && (
                    <span className="bg-[rgba(111,207,151,0.95)] text-[#1c1c1e] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  )}
                  {item.reviewed && !item.verified && (
                    <span className="bg-white/90 text-[#1c1c1e] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      Community reviewed
                    </span>
                  )}
                </div>
                {/* Save button */}
                <button
                  onClick={() => toggleSave(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={saved.has(item.id) ? '#1c1c1e' : 'none'} stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                {/* Price on image */}
                <div className="absolute bottom-3 left-3">
                  <p className="text-white text-[20px] font-bold">${item.price}/mo</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-[#1c1c1e] text-[15px] font-semibold">{item.title}</p>
                    <p className="text-[#6c6a66] text-[13px] mt-1">{item.address}</p>
                  </div>
                  <span className="bg-[#f0efe9] text-[#1c1c1e] text-[12px] font-medium px-2.5 py-1 rounded-lg flex-shrink-0">
                    {item.type}
                  </span>
                </div>

                {/* Key info grid */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { icon: '📅', label: item.dates },
                    { icon: '🚶', label: `${item.dist} min` },
                    { icon: '👤', label: item.poster },
                  ].map((info, i) => (
                    <div key={i} className="bg-[#f7f6f2] rounded-xl p-2 text-center">
                      <p className="text-base">{info.icon}</p>
                      <p className="text-[#1c1c1e] text-[11px] font-medium mt-0.5 leading-tight">{info.label}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 h-11 bg-[#1c1c1e] rounded-xl text-white text-[14px] font-semibold">
                    Contact poster
                  </button>
                  <button className="h-11 w-11 rounded-xl bg-[#f0efe9] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏠</p>
            <p className="text-[#1c1c1e] text-[16px] font-semibold">No {period} subleases yet</p>
            <p className="text-[#6c6a66] text-[14px] mt-1">Be the first to post one!</p>
            <button onClick={() => setShowPostModal(true)}
              className="mt-4 h-11 px-6 bg-[#1c1c1e] rounded-2xl text-white text-[14px] font-semibold">
              Post a sublease
            </button>
          </div>
        )}
      </div>

      {/* ── Floating Post Button ── */}
      <div className="fixed bottom-20 right-4 z-30 max-w-[428px]" style={{ right: 'max(16px, calc(50vw - 198px))' }}>
        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 bg-[#1c1c1e] text-white px-5 h-12 rounded-full shadow-xl text-[14px] font-semibold active:scale-95 transition-transform">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Post sublease
        </button>
      </div>

      {/* ── Post Modal ── */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => { setShowPostModal(false); setStep(1); }}>
          <div className="bg-white w-full max-w-[428px] mx-auto rounded-t-3xl pt-4 pb-10 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-black/10 rounded-full mx-auto mb-5" />
            <div className="px-5">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1.5">
                  {[1, 2].map(s => (
                    <div key={s} className={`h-1 rounded-full transition-all ${step >= s ? 'w-8 bg-[#1c1c1e]' : 'w-4 bg-black/15'}`} />
                  ))}
                </div>
                <p className="text-[12px] text-[#6c6a66] ml-1">Step {step} of 2</p>
                <button onClick={() => { setShowPostModal(false); setStep(1); }} className="ml-auto text-[#6c6a66] text-[14px]">Cancel</button>
              </div>

              {step === 1 ? (
                <>
                  <p className="text-[#1c1c1e] text-[18px] font-bold mb-5">Listing details</p>
                  <div className="flex flex-col gap-4">
                    {[
                      { key: 'title', label: 'Listing title', placeholder: 'e.g. Studio at Green Street' },
                      { key: 'price', label: 'Monthly rent ($)', placeholder: 'e.g. 790' },
                      { key: 'type', label: 'Unit type', placeholder: 'e.g. Studio, 1B1B, room in 2B2B' },
                      { key: 'dates', label: 'Available dates', placeholder: 'e.g. May – Aug 2026' },
                      { key: 'address', label: 'Address', placeholder: 'e.g. 302 E John St, Champaign' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-[11px] font-semibold text-[#6c6a66] uppercase tracking-wider block mb-1.5">{field.label}</label>
                        <input
                          className="w-full bg-[#f0efe9] rounded-2xl px-4 py-3 text-[#1c1c1e] text-[15px] outline-none focus:bg-[#e8e7e1] transition-colors placeholder:text-[#6c6a66]"
                          placeholder={field.placeholder}
                          value={form[field.key as keyof typeof form]}
                          onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full mt-6 py-3.5 bg-[#1c1c1e] rounded-2xl text-white text-[15px] font-semibold">
                    Continue →
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[#1c1c1e] text-[18px] font-bold mb-5">Extra details</p>
                  <div>
                    <label className="text-[11px] font-semibold text-[#6c6a66] uppercase tracking-wider block mb-1.5">Additional notes</label>
                    <textarea
                      className="w-full bg-[#f0efe9] rounded-2xl px-4 py-3 text-[#1c1c1e] text-[15px] resize-none outline-none focus:bg-[#e8e7e1] transition-colors placeholder:text-[#6c6a66]"
                      placeholder="Pet policy, parking, utilities included, anything else students should know…"
                      rows={4}
                      value={form.notes}
                      onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                  <div className="mt-4 bg-[#f0efe9] rounded-2xl p-4">
                    <p className="text-[#1c1c1e] text-[14px] font-semibold">Before you submit</p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {['Your contact info will be verified', 'We review all listings within 24h', 'No scam signals = instant approval'].map(item => (
                        <li key={item} className="flex items-center gap-2 text-[#6c6a66] text-[13px]">
                          <span className="text-[rgba(111,207,151,0.95)] font-bold">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="h-13 py-3.5 px-5 bg-[#f0efe9] rounded-2xl text-[#1c1c1e] text-[15px] font-semibold">
                      ← Back
                    </button>
                    <button
                      onClick={() => { setForm({ title: '', price: '', type: '', dates: '', address: '', notes: '' }); setShowPostModal(false); setStep(1); }}
                      className="flex-1 py-3.5 bg-[#1c1c1e] rounded-2xl text-white text-[15px] font-semibold">
                      Submit for review
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
