import { useState, useEffect, useRef } from 'react';
import './index.css';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import CommunityScreen from './screens/CommunityScreen';
import SubleaseScreen from './screens/SubleaseScreen';
import ListingDetailScreen from './screens/ListingDetailScreen';
import { listings } from './data/listings';

type Tab = 'home' | 'explore' | 'sublease' | 'community';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [detailListingId, setDetailListingId] = useState<number | null>(null);
  const [detailCollegeId, setDetailCollegeId] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const pendingTab = useRef<Tab | null>(null);

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
        {activeTab === 'sublease' && <SubleaseScreen />}
        {activeTab === 'community' && <CommunityScreen />}
      </div>
      <BottomNav active={activeTab} onNavigate={navigate} />
    </div>
  );
}

export default App;
