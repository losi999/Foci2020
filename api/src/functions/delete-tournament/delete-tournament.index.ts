import { default as handler } from '@/functions/delete-tournament/delete-tournament-handler';
import { apiRequestValidator, tournamentDocumentService, authorizer } from '@/dependencies';
import { deleteTournamentServiceFactory } from '@/functions/delete-tournament/delete-tournament-service';
import { pathParameters } from '@/functions/delete-tournament/delete-tournament-schemas';

const deleteTournamentService = deleteTournamentServiceFactory(tournamentDocumentService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(deleteTournamentService)));
