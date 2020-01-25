import { TeamDocument, TournamentDocument } from '@/types/documents';

export type Converter<T, U> = (input: T) => U;

export type TeamUpdatedNotification = {
  teamId: string;
  team: TeamDocument
};

export type TournamentUpdatedNotification = {
  tournamentId: string;
  tournament: TournamentDocument
};
