export interface IListStandingsService {
  (ctx: {
    tournamentId: string
  }): Promise<void>;
}

export const listStandingsServiceFactory = (): IListStandingsService =>
  async ({ tournamentId }) => {

  };
