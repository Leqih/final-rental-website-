import { useState, useEffect, useRef } from 'react';
import './index.css';
import { useIsMobile } from './hooks/useIsMobile';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import CommunityScreen from './screens/CommunityScreen';
import ListingDetailScreen from './screens/ListingDetailScreen';
import WebListingDetailScreen from './screens/web/WebListingDetailScreen';
import WebLayout from './components/web/WebLayout';
import WebHomeScreen from './screens/web/WebHomeScreen';
import WebExploreScreen from './screens/web/WebExploreScreen';
import WebCommunityScreen from './screens/web/WebCommunityScreen';
import WebMessagesScreen from './screens/web/WebMessagesScreen';
import WebListingsScreen from './screens/web/WebListingsScreen_v2';
import WebSavedScreen from './screens/web/WebSavedScreen';
import { listings } from './data/listings';

type Tab = 'home' | 'explore' | 'listings' | 'community' | 'messages' | 'saved';

function App() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [detailListingId, setDetailListingId] = useState<number | null>(null);
  const [detailCollegeId, setDetailCollegeId] = useState<string | null>(null);
  const [mapListingId, setMapListingId] = useState<number | null>(null);
  const [mapSubleaseId, setMapSubleaseId] = useState<number | null>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [visible, setVisible] = useState(true);
  const pendingTab = useRef<Tab | null>(null);

  const toggleSave = (id: number) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const navigate = (tab: string) => {
    if (tab === activeTab) return;
    setVisible(false);
    pendingTab.current = tab as Tab;
  };

  useEffect(() => {
    if (!visible && pendingTab.current) {
      const t = setTimeout(() => {
        setActiveTab(pendingTab.current!);
        pendingTab.current = null;
        setVisible(true);
      }, 120);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const openListing = (id: number, collegeId?: string | null) => {
    setDetailListingId(id);
    setDetailCollegeId(collegeId ?? null);
  };

  const closeListing = () => setDetailListingId(null);

  const detailListing = detailListingId != null ? listings.find(l => l.id === detailListingId) : null;

  // ── Web (desktop) layout ──────────────────────────────────────────────────
  if (!isMobile) {
    return (
      <>
        <style>{`
          @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
        <WebLayout active={activeTab} onNavigate={navigate} savedCount={savedIds.size}>
          <div className="flex-1 flex flex-col overflow-hidden" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.15s ease' }}>
            {detailListing && activeTab !== 'explore' ? (
              <div className="flex flex-1 overflow-hidden" style={{ animation: 'fadeIn 0.18s ease' }}>
                <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>
                <WebListingDetailScreen
                  listing={detailListing}
                  onBack={closeListing}
                  selectedCollegeId={detailCollegeId}
                  onNavigate={(tab) => { closeListing(); navigate(tab); }}
                  onViewOnMap={(id) => { setMapListingId(id); closeListing(); navigate('explore'); }}
                />
              </div>
            ) : (
              <>
                {activeTab === 'home' && <WebHomeScreen onNavigate={navigate} onViewListing={openListing} />}
                {activeTab === 'listings' && <WebListingsScreen onViewListing={openListing} savedIds={savedIds} onToggleSave={toggleSave} onViewOnMap={(id) => { setMapSubleaseId(id); setMapListingId(null); navigate('explore'); }} onNavigate={navigate} />}
                {activeTab === 'explore' && <WebExploreScreen onViewListing={openListing} onNavigate={navigate} initialListingId={mapListingId} initialSubleaseId={mapSubleaseId} savedIds={savedIds} onToggleSave={toggleSave} />}
                {activeTab === 'community' && <WebCommunityScreen />}
                {activeTab === 'messages' && <WebMessagesScreen />}
                {activeTab === 'saved' && <WebSavedScreen savedIds={savedIds} onToggleSave={toggleSave} onViewListing={openListing} onNavigate={navigate} />}
              </>
            )}
          </div>
        </WebLayout>
      </>
    );
  }

  // ── Mobile layout ─────────────────────────────────────────────────────────
  if (detailListing) {
    return (
      <div className="flex flex-col h-screen overflow-hidden"
        style={{ animation: 'slideUp 0.28s cubic-bezier(0.4,0,0.2,1)' }}>
        <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
        <ListingDetailScreen
          listing={detailListing}
          onBack={closeListing}
          selectedCollegeId={detailCollegeId}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div
        className="flex-1 overflow-y-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}
      >
        {activeTab === 'home' && <HomeScreen onNavigate={navigate} />}
        {activeTab === 'explore' && <ExploreScreen onViewListing={openListing} />}
        {activeTab === 'community' && <CommunityScreen />}
      </div>
      <BottomNav active={activeTab} onNavigate={navigate} />
    </div>
  );
}

export default App;
