import { default as handler } from '@/handlers/get-match-handler';
import { databaseService } from '@/dependencies';
import { getMatchServiceFactory } from '@/business-services/get-match-service';
import { default as converter } from '@/converters/match-documents-to-response-converter';

const getMatchService = getMatchServiceFactory(databaseService, converter);

export default handler(getMatchService);
