import { TeamDetailsUpdateDocument, TournamentDetailsUpdateDocument } from '@/types/documents';

export type Converter<T, U> = (input: T) => U;

export type UpdateTeamNotification = {
  teamId: string;
  team: TeamDetailsUpdateDocument
};

export type UpdateTournamentNotification = {
  tournamentId: string;
  tournament: TournamentDetailsUpdateDocument
};
