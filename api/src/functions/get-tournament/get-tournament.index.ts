import { default as handler } from '@/functions/get-tournament/get-tournament-handler';
import { apiRequestValidator, tournamentDocumentConverter, tournamentDocumentService, authorizer } from '@/dependencies';
import { getTournamentServiceFactory } from '@/functions/get-tournament/get-tournament-service';
import { pathParameters } from '@/functions/get-tournament/get-tournament-schemas';

const getTournamentService = getTournamentServiceFactory(tournamentDocumentService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(getTournamentService)));
