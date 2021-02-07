import { default as handler } from '@foci2020/api/functions/list-bets-of-match/list-bets-of-match-handler';
import { listBetsOfMatchServiceFactory } from '@foci2020/api/functions/list-bets-of-match/list-bets-of-match-service';
import { default as pathParameters } from '@foci2020/shared/schemas/match-id';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { betDocumentConverter } from '@foci2020/shared/dependencies/converters/bet-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';

const listBetsOfMatchService = listBetsOfMatchServiceFactory(databaseService, betDocumentConverter);

export default authorizer('player')(apiRequestValidator({
  pathParameters, 
})(handler(listBetsOfMatchService)));
