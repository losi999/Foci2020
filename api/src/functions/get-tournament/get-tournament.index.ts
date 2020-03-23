import { default as handler } from '@/functions/get-tournament/get-tournament-handler';
import { apiRequestValidator, tournamentDocumentConverter, tournamentDocumentService, authorizer } from '@/dependencies';
import { getTournamentServiceFactory } from '@/functions/get-tournament/get-tournament-service';
import { default as pathParameters } from '@/schemas/tournament-id';

const getTournamentService = getTournamentServiceFactory(tournamentDocumentService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(getTournamentService)));
