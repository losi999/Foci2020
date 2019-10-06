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
