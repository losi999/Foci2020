import { default as handler } from '@/match/create-match/create-match-handler';
import { apiRequestValidator, matchDocumentService, teamDocumentService, tournamentDocumentService, matchDocumentConverter, authorizer } from '@/shared/dependencies';
import { body } from '@/match/create-match/create-match-schemas';
import { createMatchServiceFactory } from '@/match/create-match/create-match-service';

const createMatchService = createMatchServiceFactory(matchDocumentService, teamDocumentService, tournamentDocumentService, matchDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createMatchService)));
