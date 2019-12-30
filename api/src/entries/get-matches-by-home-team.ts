import { default as handler } from '@/handlers/get-matches-by-team-handler';
import { matchDocumentService, queueService } from '@/dependencies';
import { getMatchesByTeamServiceFactory } from '@/business-services/get-matches-by-team-service';

const getMatchesByTeamService = getMatchesByTeamServiceFactory(matchDocumentService, queueService);

export default handler(getMatchesByTeamService.home());
