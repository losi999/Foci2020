import { TeamDocument, TournamentDocument } from '@/types/documents';

export type Converter<T, U> = (input: T) => U;

export type UpdateTeamNotification = {
  teamId: string;
  team: TeamDocument
};

export type UpdateTournamentNotification = {
  tournamentId: string;
  tournament: TournamentDocument
};
