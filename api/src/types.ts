export type TeamRequest = {
  teamName: string;
  image: string;
  shortName: string;
};

export type TeamDocument = {
  partitionKey: string;
  sortKey: 'details';
  documentType: 'team';
  teamId: string;
  teamName: string
  shortName: string;
  image: string;
};

export type TournamentRequest = {
  tournamentName: string;
};

export type TournamentDocument = {
  partitionKey: string;
  sortKey: 'details';
  documentType: 'tournament';
  tournamentId: string;
  tournamentName: string
};
