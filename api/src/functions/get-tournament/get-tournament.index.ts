import { default as handler } from '@/functions/get-tournament/get-tournament-handler';
import { apiRequestValidator, tournamentDocumentConverter, databaseService, authorizer } from '@/dependencies';
import { getTournamentServiceFactory } from '@/functions/get-tournament/get-tournament-service';
import { default as pathParameters } from '@/schemas/tournament-id';

const getTournamentService = getTournamentServiceFactory(databaseService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(getTournamentService)));
