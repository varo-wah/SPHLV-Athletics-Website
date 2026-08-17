import { useState } from 'react';
import { AppTab, SportTab, GenderTab, DivisionTab } from './types';
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import SportScheduleScreen from './screens/SportScheduleScreen';
import NewsScreen from './screens/NewsScreen';
import HomeScreen from './screens/HomeScreen';
import TeamPageScreen from './screens/TeamPageScreen';
import TeamsScreen from './screens/TeamsScreen';
import StandingsScreen from './screens/StandingsScreen';
import LoginScreen from './screens/LoginScreen';
import { useAthleticsData } from './hooks/useAthleticsData';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SportFollowsProvider } from './contexts/SportFollowsContext';
import { TeamFavoritesProvider } from './contexts/TeamFavoritesContext';
import { isLaunchTeamSelection } from './config/launchSports';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SportFollowsProvider>
          <TeamFavoritesProvider>
            <AthleticsApp />
          </TeamFavoritesProvider>
        </SportFollowsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AthleticsApp() {
  const [activeTab, setActiveTab] = useState<AppTab>('Home');
  const [activeSport, setActiveSport] = useState<SportTab>('Soccer');
  const [activeGender, setActiveGender] = useState<GenderTab>('Boys');
  const [activeDivision, setActiveDivision] = useState<DivisionTab>('SMA');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const athleticsDataState = useAthleticsData();

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTeam = (sport: SportTab, division: DivisionTab, gender: GenderTab) => {
    if (!isLaunchTeamSelection(sport, division, gender)) {
      setActiveTab('Teams');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveSport(sport);
    setActiveDivision(division);
    setActiveGender(gender);
    setActiveTab('TeamPage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black pb-24 font-sans">
      <main className="sph-app-shell relative mx-auto min-h-screen w-full border-x border-border/[0.02] bg-ucl-gradient shadow-2xl">
        <TopBar
          onOpenMenu={() => setIsSidebarOpen(true)}
          onOpenLogin={() => handleTabChange('Login')}
        />
        
        {athleticsDataState.loading && (
          <div style={{ padding: 10, textAlign: "center", color: "#BFD7EA", fontSize: 12 }}>
            Loading Google Sheets data...
          </div>
        )}

        {activeTab === 'Home' && (
          <HomeScreen
            athleticsDataState={athleticsDataState}
            onNavigateToNews={() => handleTabChange('News')}
            onNavigateToSchedule={() => handleTabChange('Schedule')}
            onNavigateToTeam={navigateToTeam}
            onBrowseTeams={() => handleTabChange('Teams')}
          />
        )}
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
            athleticsDataState={athleticsDataState}
          />
        )}
        {activeTab === 'Teams' && (
          <TeamsScreen onSelectTeam={navigateToTeam} />
        )}
        {activeTab === 'Standings' && (
          <StandingsScreen athleticsDataState={athleticsDataState} />
        )}
        {activeTab === 'News' && <NewsScreen />}
        {activeTab === 'Login' && <LoginScreen />}
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          onNavigateHome={() => handleTabChange('Home')}
          onSelectTeam={navigateToTeam} 
        />
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
