import { default as handler } from '@/match/delete-matches-by-team/delete-matches-by-team-handler';
import { matchDocumentService } from '@/shared/dependencies';
import { deleteMatchesByTeamServiceFactory } from '@/match/delete-matches-by-team/delete-matches-by-team-service';

const deleteMatchesByTeamService = deleteMatchesByTeamServiceFactory(matchDocumentService);

export default handler(deleteMatchesByTeamService);
