import { default as handler } from '@/functions/update-match/update-match-handler';
import { apiRequestValidator, matchDocumentService, teamDocumentService, tournamentDocumentService, matchDocumentConverter, authorizer } from '@/dependencies';
import { default as body } from '@/schemas/match';
import { default as pathParameters } from '@/schemas/match-id';
import { updateMatchServiceFactory } from '@/functions/update-match/update-match-service';

const updateMatchService = updateMatchServiceFactory(matchDocumentService, matchDocumentConverter, teamDocumentService, tournamentDocumentService);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters
})(handler(updateMatchService)));
