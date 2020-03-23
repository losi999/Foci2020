import { default as handler } from '@/functions/update-tournament/update-tournament-handler';
import { apiRequestValidator, tournamentDocumentService, tournamentDocumentConverter, authorizer } from '@/dependencies';
import { default as body } from '@/schemas/tournament';
import { default as pathParameters } from '@/schemas/tournament-id';
import { updateTournamentServiceFactory } from '@/functions/update-tournament/update-tournament-service';

const updateTournamentService = updateTournamentServiceFactory(tournamentDocumentService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters
})(handler(updateTournamentService)));
