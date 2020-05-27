import { default as handler } from '@foci2020/api/functions/list-standings-of-tournament/list-standings-of-tournament-handler';
import { apiRequestValidator,  authorizer, databaseService, standingDocumentConverter, } from '@foci2020/api/dependencies';
import { default as pathParameters } from '@foci2020/shared/schemas/tournament-id';
import { listStandingsOfTournamentFactory } from '@foci2020/api/functions/list-standings-of-tournament/list-standings-of-tournament-service';

const listStandingsOfTournamentService = listStandingsOfTournamentFactory(databaseService, standingDocumentConverter);

export default authorizer('player')(apiRequestValidator({
  pathParameters
})(handler(listStandingsOfTournamentService)));
