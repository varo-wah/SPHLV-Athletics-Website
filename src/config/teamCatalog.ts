import { DivisionTab, GenderTab, SportTab } from '../types';

export interface TeamCatalogEntry {
  id: string;
  sport: SportTab;
  division: DivisionTab;
  gender: GenderTab;
  displayName: string;
  shortName: string;
  note: string;
  rosterTab: string;
  production: boolean;
}

export interface SportCatalogEntry {
  id: SportTab;
  label: string;
  prototypeSeason: string;
  status: string;
  accent: string;
  featured?: boolean;
}

export const SPORT_CATALOG: readonly SportCatalogEntry[] = [
  {
    id: 'Soccer',
    label: 'Soccer',
    prototypeSeason: 'Season 1 / 3',
    status: 'Live standings',
    accent: '#D85A57',
    featured: true,
  },
  {
    id: 'Volleyball',
    label: 'Volleyball',
    prototypeSeason: 'Season 1 / 2',
    status: 'Setup',
    accent: '#5FA8D3',
  },
  {
    id: 'Basketball',
    label: 'Basketball',
    prototypeSeason: 'Season 1 / 2',
    status: 'Setup',
    accent: '#F59E0B',
  },
  {
    id: 'Badminton',
    label: 'Badminton',
    prototypeSeason: 'Season 3',
    status: 'Setup',
    accent: '#22C55E',
  },
  {
    id: 'TrackAndField',
    label: 'Track & Field',
    prototypeSeason: 'Season 3',
    status: 'Setup',
    accent: '#A78BFA',
  },
] as const;

export const TEAM_CATALOG: readonly TeamCatalogEntry[] = [
  { id: 'soccer-smp-boys', sport: 'Soccer', division: 'SMP', gender: 'Boys', displayName: 'SMP Boys Soccer', shortName: 'SMP Boys', note: 'Middle School', rosterTab: 'Soccer_SMP_Boys', production: false },
  { id: 'soccer-smp-girls', sport: 'Soccer', division: 'SMP', gender: 'Girls', displayName: 'SMP Girls Soccer', shortName: 'SMP Girls', note: 'Middle School', rosterTab: 'Soccer_SMP_Girls', production: false },
  { id: 'soccer-sma-boys', sport: 'Soccer', division: 'SMA', gender: 'Boys', displayName: 'Varsity Boys Soccer', shortName: 'Varsity Boys', note: 'SMA', rosterTab: 'Soccer_SMA_Boys', production: true },
  { id: 'soccer-sma-girls', sport: 'Soccer', division: 'SMA', gender: 'Girls', displayName: 'Varsity Girls Soccer', shortName: 'Varsity Girls', note: 'SMA', rosterTab: 'Soccer_SMA_Girls', production: true },
  { id: 'volleyball-smp-boys', sport: 'Volleyball', division: 'SMP', gender: 'Boys', displayName: 'SMP Boys Volleyball', shortName: 'SMP Boys', note: 'Middle School', rosterTab: 'Volleyball_SMP_Boys', production: false },
  { id: 'volleyball-smp-girls', sport: 'Volleyball', division: 'SMP', gender: 'Girls', displayName: 'SMP Girls Volleyball', shortName: 'SMP Girls', note: 'Middle School', rosterTab: 'Volleyball_SMP_Girls', production: false },
  { id: 'volleyball-sma-boys', sport: 'Volleyball', division: 'SMA', gender: 'Boys', displayName: 'Varsity Boys Volleyball', shortName: 'Varsity Boys', note: 'SMA', rosterTab: 'Volleyball_SMA_Boys', production: true },
  { id: 'volleyball-sma-girls', sport: 'Volleyball', division: 'SMA', gender: 'Girls', displayName: 'Varsity Girls Volleyball', shortName: 'Varsity Girls', note: 'SMA', rosterTab: 'Volleyball_SMA_Girls', production: true },
  { id: 'basketball-smp-boys', sport: 'Basketball', division: 'SMP', gender: 'Boys', displayName: 'SMP Boys Basketball', shortName: 'SMP Boys', note: 'Middle School', rosterTab: 'Basketball_SMP_Boys', production: true },
  { id: 'basketball-smp-girls', sport: 'Basketball', division: 'SMP', gender: 'Girls', displayName: 'SMP Girls Basketball', shortName: 'SMP Girls', note: 'Middle School', rosterTab: 'Basketball_SMP_Girls', production: true },
  { id: 'basketball-sma-boys', sport: 'Basketball', division: 'SMA', gender: 'Boys', displayName: 'Varsity Boys Basketball', shortName: 'Varsity Boys', note: 'SMA', rosterTab: 'Basketball_SMA_Boys', production: false },
  { id: 'basketball-sma-girls', sport: 'Basketball', division: 'SMA', gender: 'Girls', displayName: 'Varsity Girls Basketball', shortName: 'Varsity Girls', note: 'SMA', rosterTab: 'Basketball_SMA_Girls', production: false },
  { id: 'badminton-smp-combined', sport: 'Badminton', division: 'SMP', gender: 'Combined', displayName: 'SMP Badminton', shortName: 'SMP Combined', note: 'Middle School', rosterTab: 'Badminton_SMP_Combined', production: false },
  { id: 'badminton-sma-combined', sport: 'Badminton', division: 'SMA', gender: 'Combined', displayName: 'Varsity Badminton', shortName: 'Varsity Combined', note: 'SMA', rosterTab: 'Badminton_SMA_Combined', production: false },
  { id: 'track-field-sma-combined', sport: 'TrackAndField', division: 'SMA', gender: 'Combined', displayName: 'Varsity Track & Field', shortName: 'Varsity Combined', note: 'SMA', rosterTab: 'TrackField_SMA_Combined', production: false },
] as const;

export function findTeam(
  sport: SportTab,
  division: DivisionTab,
  gender: GenderTab,
): TeamCatalogEntry | undefined {
  return TEAM_CATALOG.find((team) => (
    team.sport === sport
    && team.division === division
    && team.gender === gender
  ));
}

export function teamsForSport(sport: SportTab): readonly TeamCatalogEntry[] {
  return TEAM_CATALOG.filter((team) => team.sport === sport);
}

export function sportDetails(sport: SportTab): SportCatalogEntry {
  return SPORT_CATALOG.find((entry) => entry.id === sport) ?? SPORT_CATALOG[0];
}
