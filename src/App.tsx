import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppTab, SportTab, GenderTab, DivisionTab } from './types';
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import TeamSelectionModal from './components/TeamSelectionModal';
import SportScheduleScreen from './screens/SportScheduleScreen';
import NewsScreen from './screens/NewsScreen';
import HomeScreen from './screens/HomeScreen';
import AcscScreen from './screens/AcscScreen';
import TeamPageScreen from './screens/TeamPageScreen';
import TeamsScreen from './screens/TeamsScreen';
import StandingsScreen from './screens/StandingsScreen';
import { useAthleticsData } from './hooks/useAthleticsData';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('Home');
  const [activeSport, setActiveSport] = useState<SportTab>('Soccer');
  const [activeGender, setActiveGender] = useState<GenderTab>('Boys');
  const [activeDivision, setActiveDivision] = useState<DivisionTab>('SMA');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [pendingSport, setPendingSport] = useState<SportTab | null>(null);

  const athleticsDataState = useAthleticsData();

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSportClick = (sport: SportTab) => {
    setPendingSport(sport);
  };

  const handleTeamSelect = (division: DivisionTab, gender: GenderTab) => {
    if (pendingSport) {
      setActiveSport(pendingSport);
      setActiveDivision(division);
      setActiveGender(gender);
      setActiveTab('TeamPage');
    }
    setPendingSport(null);
    setIsSidebarOpen(false);
  };

  const navigateToTeam = (sport: SportTab, division: DivisionTab, gender: GenderTab) => {
    setActiveSport(sport);
    setActiveDivision(division);
    setActiveGender(gender);
    setActiveTab('TeamPage');
  };

  return (
    <div className="min-h-screen bg-ucl-gradient pb-24 font-sans">
      <main className="max-w-xl mx-auto relative min-h-screen border-x border-border/[0.02] shadow-2xl bg-canvas/20">
        <TopBar onOpenMenu={() => setIsSidebarOpen(true)} />
        
        {athleticsDataState.loading && (
          <div style={{ padding: 10, textAlign: "center", color: "#BFD7EA", fontSize: 12 }}>
            Loading Google Sheets data...
          </div>
        )}

        {athleticsDataState.error && (
          <div style={{ padding: 10, textAlign: "center", color: "#D32642", fontSize: 12 }}>
            Google Sheets sync error: {athleticsDataState.error}
          </div>
        )}

        {activeTab === 'Home' && <HomeScreen onNavigateToNews={() => handleTabChange('News')} />}
        {activeTab === 'Schedule' && (
          <SportScheduleScreen
            sport={activeSport}
            gender={activeGender}
            division={activeDivision}
            onSportChange={setActiveSport}
            athleticsDataState={athleticsDataState}
          />
        )}
        {activeTab === 'TeamPage' && (
          <TeamPageScreen
            sport={activeSport}
            division={activeDivision}
            gender={activeGender}
            onNavigateToACSC={() => handleTabChange('ACSC')}
            athleticsDataState={athleticsDataState}
          />
        )}
        {activeTab === 'Teams' && (
          <TeamsScreen onSelectTeam={navigateToTeam} />
        )}
        {activeTab === 'News' && <NewsScreen />}
        {activeTab === 'ACSC' && <StandingsScreen athleticsDataState={athleticsDataState} />}
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          onSelectSport={handleSportClick} 
        />

        <AnimatePresence>
          {pendingSport && (
            <TeamSelectionModal 
              sport={pendingSport} 
              onSelect={handleTeamSelect} 
              onClose={() => setPendingSport(null)} 
            />
          )}
        </AnimatePresence>

        <div style={{
          position: "fixed",
          right: 8,
          bottom: 8,
          zIndex: 9999,
          background: "rgba(0,0,0,0.85)",
          border: "1px solid rgba(191,215,234,0.25)",
          borderRadius: 8,
          padding: 10,
          fontSize: 11,
          color: "#BFD7EA",
          maxWidth: 260
        }}>
          <div>Loading: {String(athleticsDataState.loading)}</div>
          <div>Refreshing: {String(athleticsDataState.refreshing)}</div>
          <div>Sync error: {athleticsDataState.error || "none"}</div>
          <div>Last updated: {athleticsDataState.lastUpdated || "never"}</div>
          <div>Raw standings rows: {athleticsDataState.data.rawStandingRows.length}</div>
          <div>Parsed standings rows: {athleticsDataState.data.soccerStandings.length}</div>
          <div>Raw match rows: {athleticsDataState.data.rawMatchRows.length}</div>
          <div>Parsed match rows: {athleticsDataState.data.soccerMatches.length}</div>
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
