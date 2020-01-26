import { default as handler } from '@/handlers/delete-matches-by-tournament-handler';
import { matchDocumentService } from '@/dependencies';
import { deleteMatchesByTournamentServiceFactory } from '@/business-services/delete-matches-by-tournament-service';

const deleteMatchesByTournamentService = deleteMatchesByTournamentServiceFactory(matchDocumentService);

export default handler(deleteMatchesByTournamentService);
