import { databaseService, standingDocumentConverter } from '@foci2020/api/dependencies';
import { default as handler } from '@foci2020/api/functions/bet-result-calculated/bet-result-calculated-handler';
import { betResultCalculatedServiceFactory } from '@foci2020/api/functions/bet-result-calculated/bet-result-calculated-service';

const betResultCalculatedService = betResultCalculatedServiceFactory(databaseService, standingDocumentConverter);

export default handler(betResultCalculatedService);
