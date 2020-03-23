import { default as handler } from '@/functions/list-matches-of-tournament/list-matches-of-tournament-handler';
import { apiRequestValidator, matchDocumentConverter, matchDocumentService, authorizer } from '@/dependencies';
import { default as pathParameters } from '@/schemas/tournament-id';
import { listMatchesOfTournamentServiceFactory } from '@/functions/list-matches-of-tournament/list-matches-of-tournament-service';

const listMatchesOfTournamentService = listMatchesOfTournamentServiceFactory(matchDocumentService, matchDocumentConverter);

export default authorizer('player')(apiRequestValidator({
  pathParameters
})(handler(listMatchesOfTournamentService)));
