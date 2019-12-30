import { default as handler } from '@/handlers/get-matches-by-tournament-handler';
import { matchDocumentService, queueService } from '@/dependencies';
import { getMatchesByTournamentServiceFactory } from '@/business-services/get-matches-by-tournament-service';

const getMatchesByTournamentService = getMatchesByTournamentServiceFactory(matchDocumentService, queueService);

export default handler(getMatchesByTournamentService);
