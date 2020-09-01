import { default as handler } from '@foci2020/api/functions/get-tournament/get-tournament-handler';
import { apiRequestValidator,   authorizer, databaseService, tournamentDocumentConverter } from '@foci2020/api/dependencies';
import { getTournamentServiceFactory } from '@foci2020/api/functions/get-tournament/get-tournament-service';
import { default as pathParameters } from '@foci2020/shared/schemas/tournament-id';

const getTournamentService = getTournamentServiceFactory(databaseService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(getTournamentService)));
