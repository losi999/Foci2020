import { default as handler } from '@/handlers/update-tournament-of-match-handler';
import { matchDocumentService } from '@/dependencies';
import { updateTournamentOfMatchServiceFactory } from '@/business-services/update-tournament-of-match-service';

const updateTournamentOfMatchService = updateTournamentOfMatchServiceFactory(matchDocumentService);

export default handler(updateTournamentOfMatchService);
