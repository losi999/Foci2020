import { default as handler } from '@/match/create-match/create-match-handler';
import { apiRequestValidator, matchDocumentService, teamDocumentService, tournamentDocumentService, matchDocumentConverter } from '@/shared/dependencies';
import { body } from '@/match/create-match/create-match-schemas';
import { createMatchServiceFactory } from '@/match/create-match/create-match-service';

const createMatchService = createMatchServiceFactory(matchDocumentService, teamDocumentService, tournamentDocumentService, matchDocumentConverter);

export default apiRequestValidator({
  body
})(handler(createMatchService));
