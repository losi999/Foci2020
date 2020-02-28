import { default as handler } from '@/tournament/update-tournament/update-tournament-handler';
import { apiRequestValidator, tournamentDocumentService, tournamentDocumentConverter, authorizer } from '@/shared/dependencies';
import { body, pathParameters } from '@/tournament/update-tournament/update-tournament-schemas';
import { updateTournamentServiceFactory } from '@/tournament/update-tournament/update-tournament-service';

const updateTournamentService = updateTournamentServiceFactory(tournamentDocumentService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters
})(handler(updateTournamentService)));
