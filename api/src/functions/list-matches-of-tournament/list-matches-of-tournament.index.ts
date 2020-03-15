import { default as handler } from '@/functions/list-matches-of-tournament/list-matches-of-tournament-handler';
import { apiRequestValidator, matchDocumentConverter, matchDocumentService, authorizer } from '@/dependencies';
import { pathParameters } from '@/functions/list-matches-of-tournament/list-matches-of-tournament-schemas';
import { listMatchesOfTournamentServiceFactory } from '@/functions/list-matches-of-tournament/list-matches-of-tournament-service';

const listMatchesOfTournamentService = listMatchesOfTournamentServiceFactory(matchDocumentService, matchDocumentConverter);

export default authorizer('player')(apiRequestValidator({
  pathParameters
})(handler(listMatchesOfTournamentService)));
