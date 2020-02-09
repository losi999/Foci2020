import { default as handler } from '@/match/update-team-of-matches/update-team-of-matches-handler';
import { matchDocumentService } from '@/shared/dependencies';
import { updateTeamOfMatchesServiceFactory } from '@/match/update-team-of-matches/update-team-of-matches-service';

const getMatchesByTeamService = updateTeamOfMatchesServiceFactory(matchDocumentService);

export default handler(getMatchesByTeamService.home());
