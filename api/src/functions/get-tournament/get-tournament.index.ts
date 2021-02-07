import { default as handler } from '@foci2020/api/functions/get-tournament/get-tournament-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { getTournamentServiceFactory } from '@foci2020/api/functions/get-tournament/get-tournament-service';
import { default as pathParameters } from '@foci2020/shared/schemas/tournament-id';

const getTournamentService = getTournamentServiceFactory(databaseService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters, 
})(handler(getTournamentService)));
