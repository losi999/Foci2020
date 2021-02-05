import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { standingDocumentConverter } from '@foci2020/shared/dependencies/converters/standing-document-converter';
import { default as handler } from '@foci2020/api/functions/bet-result-calculated/bet-result-calculated-handler';
import { betResultCalculatedServiceFactory } from '@foci2020/api/functions/bet-result-calculated/bet-result-calculated-service';

const betResultCalculatedService = betResultCalculatedServiceFactory(databaseService, standingDocumentConverter);

export default handler(betResultCalculatedService);
