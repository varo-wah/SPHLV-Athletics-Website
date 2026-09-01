import { useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SportFollowsProvider } from './contexts/SportFollowsContext';
import { TeamFavoritesProvider } from './contexts/TeamFavoritesContext';
import { isLaunchTeamSelection } from './config/launchSports';
import { PAGE_TRANSITION } from './config/motion';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <ThemeProvider>
          <SportFollowsProvider>
            <TeamFavoritesProvider>
              <AthleticsApp />
            </TeamFavoritesProvider>
          </SportFollowsProvider>
        </ThemeProvider>
      </AuthProvider>
    </MotionConfig>
  );
}

function AthleticsApp() {
  const { openLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<AppTab>('Home');
  const [activeSport, setActiveSport] = useState<SportTab>('Soccer');
  const [activeGender, setActiveGender] = useState<GenderTab>('Boys');
  const [activeDivision, setActiveDivision] = useState<DivisionTab>('SMA');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newsArticleId, setNewsArticleId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const athleticsDataState = useAthleticsData();

  const handleTabChange = (tab: AppTab) => {
    if (tab === 'News') {
      setNewsArticleId(null);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const navigateToNews = (articleId?: string) => {
    setNewsArticleId(articleId || null);
    setActiveTab('News');
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const navigateToTeam = (sport: SportTab, division: DivisionTab, gender: GenderTab) => {
    if (!isLaunchTeamSelection(sport, division, gender)) {
      setActiveTab('Teams');
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }

    setActiveSport(sport);
    setActiveDivision(division);
    setActiveGender(gender);
    setActiveTab('TeamPage');
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const activeScreen = (() => {
    if (activeTab === 'Home') {
      return (
        <HomeScreen
          athleticsDataState={athleticsDataState}
          onNavigateToNews={navigateToNews}
          onNavigateToTeam={navigateToTeam}
          onBrowseTeams={() => handleTabChange('Teams')}
        />
      );
    }

    if (activeTab === 'Schedule') {
      return (
        <SportScheduleScreen
          sport={activeSport}
          gender={activeGender}
          division={activeDivision}
          onSportChange={setActiveSport}
          athleticsDataState={athleticsDataState}
        />
      );
    }

    if (activeTab === 'TeamPage') {
      return (
        <TeamPageScreen
          sport={activeSport}
          division={activeDivision}
          gender={activeGender}
          athleticsDataState={athleticsDataState}
        />
      );
    }

    if (activeTab === 'Teams') {
      return (
        <TeamsScreen
          onSelectTeam={navigateToTeam}
          athleticsDataState={athleticsDataState}
        />
      );
    }
    if (activeTab === 'Standings') return <StandingsScreen athleticsDataState={athleticsDataState} />;
    if (activeTab === 'News') return <NewsScreen initialArticleId={newsArticleId} />;
    return <LoginScreen />;
  })();

  return (
    <div className="min-h-screen bg-black font-sans">
      <main className="sph-app-shell relative mx-auto min-h-screen w-full border-x border-border/[0.02] bg-ucl-gradient pb-24">
        <TopBar
          isHome={activeTab === 'Home'}
          onOpenMenu={() => setIsSidebarOpen(true)}
          onOpenLogin={openLoginModal}
        />
        
        <AnimatePresence initial={false}>
          {athleticsDataState.loading && (
            <motion.div
              key="athletics-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ padding: 10, textAlign: 'center', color: '#BFD7EA', fontSize: 12 }}
            >
              Loading Google Sheets data...
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
            transition={PAGE_TRANSITION}
          >
            {activeScreen}
          </motion.div>
        </AnimatePresence>
        
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
