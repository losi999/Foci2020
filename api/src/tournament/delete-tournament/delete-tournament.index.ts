import { default as handler } from '@/tournament/delete-tournament/delete-tournament-handler';
import { apiRequestValidator, tournamentDocumentService, authorizer } from '@/shared/dependencies';
import { deleteTournamentServiceFactory } from '@/tournament/delete-tournament/delete-tournament-service';
import { pathParameters } from '@/tournament/delete-tournament/delete-tournament-schemas';

const deleteTournamentService = deleteTournamentServiceFactory(tournamentDocumentService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(deleteTournamentService)));
