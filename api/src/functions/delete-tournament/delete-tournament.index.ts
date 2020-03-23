import { default as handler } from '@/functions/delete-tournament/delete-tournament-handler';
import { apiRequestValidator, tournamentDocumentService, authorizer } from '@/dependencies';
import { deleteTournamentServiceFactory } from '@/functions/delete-tournament/delete-tournament-service';
import { default as pathParameters } from '@/schemas/tournament-id';

const deleteTournamentService = deleteTournamentServiceFactory(tournamentDocumentService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(deleteTournamentService)));
