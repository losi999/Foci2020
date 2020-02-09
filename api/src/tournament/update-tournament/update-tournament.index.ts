import { default as handler } from '@/tournament/update-tournament/update-tournament-handler';
import { apiRequestValidator, notificationService, tournamentDocumentService, tournamentDocumentConverter } from '@/shared/dependencies';
import { body, pathParameters } from '@/tournament/update-tournament/update-tournament-schemas';
import { updateTournamentServiceFactory } from '@/tournament/update-tournament/update-tournament-service';

const updateTournamentService = updateTournamentServiceFactory(tournamentDocumentService, tournamentDocumentConverter, notificationService);

export default apiRequestValidator({
  body,
  pathParameters
})(handler(updateTournamentService));
