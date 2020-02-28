import { default as handler } from '@/tournament/get-tournament/get-tournament-handler';
import { apiRequestValidator, tournamentDocumentConverter, tournamentDocumentService, authorizer } from '@/shared/dependencies';
import { getTournamentServiceFactory } from '@/tournament/get-tournament/get-tournament-service';
import { pathParameters } from '@/tournament/get-tournament/get-tournament-schemas';

const getTournamentService = getTournamentServiceFactory(tournamentDocumentService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(getTournamentService)));
