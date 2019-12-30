import { TeamDocument, TournamentDocument } from '@/types/documents';

export type Converter<T, U> = (input: T) => U;

export type TeamUpdatedNotification = {
  teamId: string;
  team: TeamDocument
};

export type UpdateTournamentNotification = {
  tournamentId: string;
  tournament: TournamentDocument
};

export type UpdateMatchWithTeamMessage = {
  matchId: string;
  team: TeamDocument;
  type: 'home' | 'away';
};
