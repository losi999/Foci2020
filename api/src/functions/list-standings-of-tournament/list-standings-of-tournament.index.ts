import { default as handler } from '@/functions/list-standings-of-tournament/list-standings-of-tournament-handler';
import { apiRequestValidator, databaseService, authorizer, standingDocumentConverter } from '@/dependencies';
import { default as pathParameters } from '@/schemas/tournament-id';
import { listStandingsOfTournamentFactory } from '@/functions/list-standings-of-tournament/list-standings-of-tournament-service';

const listStandingsOfTournamentService = listStandingsOfTournamentFactory(databaseService, standingDocumentConverter);

export default authorizer('player')(apiRequestValidator({
  pathParameters
})(handler(listStandingsOfTournamentService)));
