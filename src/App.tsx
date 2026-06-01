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

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('Home');
  const [activeSport, setActiveSport] = useState<SportTab>('Basketball');
  const [activeGender, setActiveGender] = useState<GenderTab>('Boys');
  const [activeDivision, setActiveDivision] = useState<DivisionTab>('Varsity');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [pendingSport, setPendingSport] = useState<SportTab | null>(null);

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
        
        {activeTab === 'Home' && <HomeScreen onNavigateToNews={() => handleTabChange('News')} />}
        {activeTab === 'Schedule' && (
          <SportScheduleScreen sport={activeSport} gender={activeGender} onSportChange={setActiveSport} />
        )}
        {activeTab === 'TeamPage' && (
          <TeamPageScreen sport={activeSport} division={activeDivision} gender={activeGender} onNavigateToACSC={() => handleTabChange('ACSC')} />
        )}
        {activeTab === 'Teams' && (
          <TeamsScreen onSelectTeam={navigateToTeam} />
        )}
        {activeTab === 'News' && <NewsScreen />}
        {activeTab === 'ACSC' && <AcscScreen sport={activeSport} gender={activeGender} />}
        
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
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
