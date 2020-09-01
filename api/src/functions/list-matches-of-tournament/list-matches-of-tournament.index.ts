import { default as handler } from '@foci2020/api/functions/list-matches-of-tournament/list-matches-of-tournament-handler';
import { apiRequestValidator,   authorizer, databaseService, matchDocumentConverter } from '@foci2020/api/dependencies';
import { default as pathParameters } from '@foci2020/shared/schemas/tournament-id';
import { listMatchesOfTournamentServiceFactory } from '@foci2020/api/functions/list-matches-of-tournament/list-matches-of-tournament-service';

const listMatchesOfTournamentService = listMatchesOfTournamentServiceFactory(databaseService, matchDocumentConverter);

export default authorizer('player')(apiRequestValidator({
  pathParameters
})(handler(listMatchesOfTournamentService)));
