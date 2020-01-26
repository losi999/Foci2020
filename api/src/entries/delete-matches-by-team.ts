import { default as handler } from '@/handlers/delete-matches-by-team-handler';
import { matchDocumentService } from '@/dependencies';
import { deleteMatchesByTeamServiceFactory } from '@/business-services/delete-matches-by-team-service';

const deleteMatchesByTeamService = deleteMatchesByTeamServiceFactory(matchDocumentService);

export default handler(deleteMatchesByTeamService);
