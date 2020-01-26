import { default as handler } from '@/handlers/update-tournament-of-matches-handler';
import { matchDocumentService } from '@/dependencies';
import { updateTournamentOfMatchesServiceFactory } from '@/business-services/update-tournament-of-matches-service';

const updateTournamentOfMatchesService = updateTournamentOfMatchesServiceFactory(matchDocumentService);

export default handler(updateTournamentOfMatchesService);
