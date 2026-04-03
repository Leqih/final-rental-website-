interface BottomNavProps {
  active: string;
  onNavigate: (tab: string) => void;
}

const tabs = [
  {
    id: 'home',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#1c1c1e' : 'none'} stroke={active ? '#1c1c1e' : '#6c6a66'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={active ? 'rgba(28,28,30,0.1)' : 'none'}/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1c1c1e' : '#6c6a66'} strokeWidth={active ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    id: 'sublease',
    label: 'Sublease',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1c1c1e' : '#6c6a66'} strokeWidth={active ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <path d="M9 22V12h6v10"/>
        <path d="M12 7v2m0 0v2m0-2h2m-2 0H10" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'community',
    label: 'Community',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'rgba(28,28,30,0.08)' : 'none'} stroke={active ? '#1c1c1e' : '#6c6a66'} strokeWidth={active ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[428px] z-40">
      <div className="bg-white/95 backdrop-blur-xl border-t border-black/6 px-2 pt-2 pb-6">
        <div className="flex items-center justify-around">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center gap-1 min-w-[64px] py-1 relative active:scale-90 transition-transform">
              {tab.icon(active === tab.id)}
              <span className={`text-[10px] font-semibold transition-colors ${
                active === tab.id ? 'text-[#1c1c1e]' : 'text-[#6c6a66]'
              }`}>
                {tab.label}
              </span>
              {active === tab.id && (
                <div className="absolute -bottom-1 w-4 h-0.5 bg-[#1c1c1e] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
