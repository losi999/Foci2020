import { TeamUpdateDocument, TournamentUpdateDocument } from '@/types/documents';

export type Converter<T, U> = (input: T) => U;

export type UpdateTeamNotification = {
  teamId: string;
  team: TeamUpdateDocument
};

export type UpdateTournamentNotification = {
  tournamentId: string;
  tournament: TournamentUpdateDocument
};
