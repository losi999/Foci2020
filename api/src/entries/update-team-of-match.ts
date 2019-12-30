import { default as handler } from '@/handlers/update-team-of-match-handler';
import { matchDocumentService } from '@/dependencies';
import { updateTeamOfMatchServiceFactory } from '@/business-services/update-team-of-match-service';

const updateTeamOfMatchService = updateTeamOfMatchServiceFactory(matchDocumentService);

export default handler(updateTeamOfMatchService);
