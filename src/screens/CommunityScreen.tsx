import { useState } from 'react';

const imgRoom1 = "https://www.figma.com/api/mcp/asset/c7df3280-ea4a-4e59-a829-45c85ef7f8ca";
const imgRoom2 = "https://www.figma.com/api/mcp/asset/2e2fc307-91fd-43fa-a394-125fce0491aa";
const imgRoom3 = "https://www.figma.com/api/mcp/asset/f350f990-08fa-41fe-a0ec-b1f0880d13c3";
const imgRoom4 = "https://www.figma.com/api/mcp/asset/5f353437-15b9-452a-aee1-361fe7f01279";

type Tab = 'All' | 'Advice' | 'Building Talk' | 'Area Insight' | 'Scam Alert';

const tagStyle: Record<Tab, string> = {
  'All': 'bg-gray-100 text-gray-600',
  'Advice': 'bg-blue-100 text-blue-700',
  'Building Talk': 'bg-purple-100 text-purple-700',
  'Area Insight': 'bg-emerald-100 text-emerald-700',
  'Scam Alert': 'bg-red-100 text-red-600',
};

const threads = [
  { id: 1, img: imgRoom1, tag: 'Advice' as Tab, title: 'Best apartments near Engineering Quad?', body: 'Looking for something under $900 with a quieter night atmosphere.', replies: 24, time: '2h ago', author: 'Alex M.' },
  { id: 2, img: imgRoom2, tag: 'Building Talk' as Tab, title: 'How noisy is The Dean on weeknights?', body: 'Trying to judge if the amenity-heavy vibe turns into late-night noise during the semester.', replies: 16, time: '7h ago', author: 'Sam K.' },
  { id: 3, img: imgRoom3, tag: 'Area Insight' as Tab, title: 'Green Street Lofts for grad students?', body: 'Good price, but is John Street calm enough for someone who wants less nightlife?', replies: 11, time: '1d ago', author: 'Jamie L.' },
  { id: 4, img: imgRoom4, tag: 'Advice' as Tab, title: 'HERE Champaign: worth the premium?', body: 'Trying to decide if the shorter walk and amenities really justify the higher rent.', replies: 19, time: '10h ago', author: 'Ryan T.' },
  { id: 5, img: imgRoom4, tag: 'Scam Alert' as Tab, title: 'Listings asking deposit before a tour', body: 'Several students reported pressure to pay before seeing the lease.', replies: 8, time: '5h ago', author: 'Priya S.' },
];

const tabs: Tab[] = ['All', 'Advice', 'Building Talk', 'Area Insight', 'Scam Alert'];

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [showAskModal, setShowAskModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tab>('Advice');
  const [newPost, setNewPost] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = activeTab === 'All' ? threads : threads.filter(t => t.tag === activeTab);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="flex flex-col h-full bg-[#f7f6f2]">

      {/* ── Header ── */}
      <div className="bg-white px-5 pt-5 pb-3 border-b border-black/5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-[11px] font-semibold text-[#6c6a66] tracking-widest uppercase">Community</p>
            <p className="text-[22px] font-bold text-[#1c1c1e] leading-tight mt-1">Student voices</p>
          </div>
          <button onClick={() => setShowAskModal(true)}
            className="mt-1 flex items-center gap-1.5 bg-[#1c1c1e] text-white text-[13px] font-semibold px-4 py-2 rounded-full">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Ask
          </button>
        </div>

        {/* Search */}
        <div className="mt-3 h-11 bg-[#f0efe9] rounded-2xl px-4 flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6c6a66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span className="text-[#6c6a66] text-[14px]">Search building, topic, warning…</span>
        </div>

        {/* Tab filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 h-8 px-3 rounded-full text-[12px] font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-[#1c1c1e] text-white'
                  : `${tagStyle[tab]} border border-transparent`
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">

        {/* Featured hero post */}
        {featured && (
          <button
            onClick={() => setExpandedId(expandedId === featured.id ? null : featured.id)}
            className="w-full rounded-2xl overflow-hidden relative mb-4 h-56 block">
            <img src={featured.img} alt="" className="w-full h-full object-cover absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${tagStyle[featured.tag]}`}>
                {featured.tag}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <p className="text-white text-[18px] font-semibold leading-snug">{featured.title}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-white/70 text-[12px]">{featured.author} · {featured.replies} replies · {featured.time}</p>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[12px] font-medium">
                  Reply
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Quick action cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => setShowAskModal(true)}
            className="bg-white rounded-2xl p-4 text-left border border-black/5 active:scale-95 transition-transform">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <p className="text-[#1c1c1e] text-[14px] font-semibold">Ask before signing</p>
            <p className="text-[#6c6a66] text-[12px] mt-1">Post a question about any building or landlord</p>
          </button>
          <button
            onClick={() => setActiveTab('Scam Alert')}
            className="bg-white rounded-2xl p-4 text-left border border-black/5 active:scale-95 transition-transform">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <p className="text-[#1c1c1e] text-[14px] font-semibold">Scam alerts</p>
            <p className="text-[#6c6a66] text-[12px] mt-1">Check warnings before contacting anyone</p>
          </button>
        </div>

        {/* Thread count */}
        <p className="text-[13px] text-[#6c6a66] mb-3">
          {filtered.length} thread{filtered.length !== 1 ? 's' : ''}
          {activeTab !== 'All' && <> · <span className="font-medium text-[#1c1c1e]">{activeTab}</span></>}
        </p>

        {/* Thread list */}
        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-black/5 border border-black/5">
          {filtered.map((thread, idx) => (
            <button key={thread.id}
              onClick={() => setExpandedId(expandedId === thread.id ? null : thread.id)}
              className="w-full text-left active:bg-[#f7f6f2] transition-colors">
              <div className="flex items-start gap-3 p-4">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={thread.img} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tagStyle[thread.tag]}`}>
                      {thread.tag}
                    </span>
                    {thread.tag === 'Scam Alert' && (
                      <span className="text-[11px] text-red-500">⚠️</span>
                    )}
                  </div>
                  <p className="text-[#1c1c1e] text-[14px] font-semibold leading-snug line-clamp-2">{thread.title}</p>
                  {expandedId === thread.id && (
                    <p className="text-[#6c6a66] text-[13px] mt-1 leading-relaxed">{thread.body}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[12px] text-[#6c6a66]">{thread.author}</span>
                    <span className="text-[12px] text-[#6c6a66]">·</span>
                    <span className="text-[12px] text-[#6c6a66]">💬 {thread.replies}</span>
                    <span className="text-[12px] text-[#6c6a66]">·</span>
                    <span className="text-[12px] text-[#6c6a66]">{thread.time}</span>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6c6a66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`flex-shrink-0 mt-1 transition-transform ${expandedId === thread.id ? 'rotate-90' : ''}`}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
              {/* Expanded reply input */}
              {expandedId === thread.id && (
                <div className="px-4 pb-4 pt-0">
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-[#f0efe9] rounded-xl px-3 flex items-center">
                      <span className="text-[#6c6a66] text-[13px]">Write a reply…</span>
                    </div>
                    <button className="h-10 px-4 bg-[#1c1c1e] rounded-xl text-white text-[13px] font-semibold flex-shrink-0">
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Ask Modal ── */}
      {showAskModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowAskModal(false)}>
          <div className="bg-white w-full max-w-[428px] mx-auto rounded-t-3xl pt-4 pb-10 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            {/* Handle */}
            <div className="w-10 h-1 bg-black/10 rounded-full mx-auto mb-5" />
            <div className="px-5">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[#1c1c1e] text-[18px] font-bold">Ask the community</p>
                <button onClick={() => setShowAskModal(false)} className="text-[#6c6a66] text-[14px]">Cancel</button>
              </div>

              {/* Tag selector */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-[#6c6a66] uppercase tracking-wider mb-2">Category</p>
                <div className="flex gap-2 flex-wrap">
                  {(['Advice', 'Building Talk', 'Area Insight', 'Scam Alert'] as Tab[]).map(t => (
                    <button key={t} onClick={() => setSelectedTag(t)}
                      className={`h-8 px-3 rounded-full text-[12px] font-semibold transition-all ${
                        selectedTag === t ? 'bg-[#1c1c1e] text-white' : `${tagStyle[t]} border border-transparent`
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[11px] font-semibold text-[#6c6a66] uppercase tracking-wider mb-2">Your question</p>
                <textarea
                  className="w-full bg-[#f0efe9] rounded-2xl p-4 text-[#1c1c1e] text-[15px] resize-none outline-none placeholder:text-[#6c6a66]"
                  placeholder="e.g. Is The Dean too noisy for studying? Any scam activity at 302 E John?"
                  rows={4}
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                />
              </div>
              <p className="text-[12px] text-[#6c6a66] mb-5">
                Questions are reviewed before posting. Be specific — the more context, the better replies.
              </p>
              <button
                disabled={!newPost.trim()}
                onClick={() => { setNewPost(''); setShowAskModal(false); }}
                className="w-full h-13 py-3.5 bg-[#1c1c1e] rounded-2xl text-white text-[15px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
                Post question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
