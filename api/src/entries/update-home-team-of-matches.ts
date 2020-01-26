import { default as handler } from '@/handlers/update-team-of-matches-handler';
import { matchDocumentService } from '@/dependencies';
import { updateTeamOfMatchesServiceFactory } from '@/business-services/update-team-of-matches-service';

const getMatchesByTeamService = updateTeamOfMatchesServiceFactory(matchDocumentService);

export default handler(getMatchesByTeamService.home());
