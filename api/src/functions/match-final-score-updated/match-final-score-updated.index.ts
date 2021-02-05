import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { betDocumentConverter } from '@foci2020/shared/dependencies/converters/bet-document-converter';
import { default as handler } from '@foci2020/api/functions/match-final-score-updated/match-final-score-updated-handler';
import { matchFinalScoreUpdatedServiceFactory } from '@foci2020/api/functions/match-final-score-updated/match-final-score-updated-service';

const matchFinalScoreUpdatedService = matchFinalScoreUpdatedServiceFactory(databaseService, betDocumentConverter);

export default handler(matchFinalScoreUpdatedService);
